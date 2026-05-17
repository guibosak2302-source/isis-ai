import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { jsPDF } from "jspdf";

const CLICKSIGN_BASE = "https://sandbox.clicksign.com/api/v1";
const token = process.env.CLICKSIGN_TOKEN ?? "";

function gerarPDFBase64(conteudo: string, id: string): string {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇO", 105, 20, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const linhas = doc.splitTextToSize(conteudo, 170);
  doc.text(linhas, 20, 35);

  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text("Gerado por Bico AI — bico.ai", 105, 285, { align: "center" });

  // suppress unused-var lint — id used in filename context only
  void id;
  return (doc.output("datauristring") as string).split(",")[1];
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contrato_id } = await request.json() as { contrato_id: string };

  // Fetch contrato with text and party profiles
  const { data: contrato } = await supabase
    .from("contratos")
    .select(`
      id, descricao,
      contratante:contratante_id ( id, full_name, phone ),
      prestador:prestador_id ( id, full_name, phone )
    `)
    .eq("id", contrato_id)
    .single();

  if (!contrato) {
    return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
  }

  const contratante = contrato.contratante as unknown as { id: string; full_name: string | null; phone: string | null } | null;
  const prestador   = contrato.prestador   as unknown as { id: string; full_name: string | null; phone: string | null } | null;

  const contratanteEmail = user.email ?? `${contratante?.id ?? "contratante"}@bico.ai`;
  const prestadorEmail   = `${prestador?.id ?? "prestador"}@bico.ai`;

  // Generate PDF server-side
  const pdfBase64 = gerarPDFBase64(contrato.descricao ?? "", contrato_id);

  try {
    // 1. Create document in Clicksign
    const docRes = await axios.post(
      `${CLICKSIGN_BASE}/documents?access_token=${token}`,
      {
        document: {
          path: `/contratos/contrato-${contrato_id}.pdf`,
          content_base64: `data:application/pdf;base64,${pdfBase64}`,
          deadline_at: null,
          auto_close: true,
          locale: "pt-BR",
          sequence_enabled: false,
        },
      }
    );
    const documentKey: string = docRes.data.document.key;

    // 2. Add contratante as signer
    const signer1Res = await axios.post(
      `${CLICKSIGN_BASE}/documents/${documentKey}/signers?access_token=${token}`,
      {
        signer: {
          email: contratanteEmail,
          phone_number: contratante?.phone ?? "",
          name: contratante?.full_name ?? "Contratante",
          documentation: "",
          birthday: "",
          has_documentation: false,
          selfie_enabled: false,
          handwritten_enabled: false,
          official_document_enabled: false,
          liveness_enabled: false,
          facial_biometrics_enabled: false,
        },
      }
    );
    const signer1Key: string = signer1Res.data.signer.key;

    // 3. Add prestador as signer
    const signer2Res = await axios.post(
      `${CLICKSIGN_BASE}/documents/${documentKey}/signers?access_token=${token}`,
      {
        signer: {
          email: prestadorEmail,
          phone_number: prestador?.phone ?? "",
          name: prestador?.full_name ?? "Prestador",
          documentation: "",
          birthday: "",
          has_documentation: false,
          selfie_enabled: false,
          handwritten_enabled: false,
          official_document_enabled: false,
          liveness_enabled: false,
          facial_biometrics_enabled: false,
        },
      }
    );
    const signer2Key: string = signer2Res.data.signer.key;

    // 4. Create signing requests to get signing URLs
    const [list1Res] = await Promise.all([
      axios.post(`${CLICKSIGN_BASE}/lists?access_token=${token}`, {
        list: { document_key: documentKey, signer_key: signer1Key, sign_as: "sign" },
      }),
      axios.post(`${CLICKSIGN_BASE}/lists?access_token=${token}`, {
        list: { document_key: documentKey, signer_key: signer2Key, sign_as: "sign" },
      }),
    ]);

    const requestSignatureKey: string = list1Res.data.list.request_signature_key;
    const signingLink = `https://sandbox.clicksign.com/sign/${requestSignatureKey}`;

    // 5. Persist Clicksign data
    await supabase
      .from("contratos")
      .update({
        clicksign_key: documentKey,
        pdf_url: signingLink,
        status: "aguardando_assinatura",
      })
      .eq("id", contrato_id);

    return NextResponse.json({ link: signingLink, document_key: documentKey });

  } catch (err) {
    const axiosErr = err as AxiosError;
    const detail = axiosErr.response?.data ?? axiosErr.message;
    return NextResponse.json(
      { error: "Erro ao criar documento no Clicksign", detail },
      { status: 502 }
    );
  }
}
