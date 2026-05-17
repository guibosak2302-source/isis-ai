/**
 * Tests for the pagamento page (Pix QR code and copy-paste).
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Mocks ─────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => ({ get: () => null }),
  useParams: () => ({ id: "pagamento-1" }),
}));

const MOCK_PAGAMENTO = {
  id: "pagamento-1",
  valor: 800,
  status: "pendente",
  pix_copia_cola: "00020126580014br.gov.bcb.pix0136fake-pix-key",
  pix_qrcode: "",
  asaas_id: "pay_fake123",
  created_at: new Date().toISOString(),
};

const MOCK_CONTRATO = {
  id: "contrato-1",
  contratante_id: "user-a",
  prestador_id: "user-b",
  valor_total: 800,
  descricao: "Serviço de pintura",
  status: "assinado",
};

jest.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "user-a" } }, error: null }),
    },
    from: jest.fn((table: string) => {
      const mockData = table === "pagamentos" ? MOCK_PAGAMENTO : MOCK_CONTRATO;
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      };
    }),
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
});

// ── Tests ──────────────────────────────────────────────────────
describe("Pagamento page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders payment value", async () => {
    const PagamentoPage = (await import("@/app/pagamento/[id]/page")).default;
    render(<PagamentoPage />);

    await waitFor(() => {
      expect(screen.getByText(/800/)).toBeInTheDocument();
    });
  });

  it("renders copy-paste Pix button", async () => {
    const PagamentoPage = (await import("@/app/pagamento/[id]/page")).default;
    render(<PagamentoPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copiar/i })).toBeInTheDocument();
    });
  });

  it("shows verify payment button", async () => {
    const PagamentoPage = (await import("@/app/pagamento/[id]/page")).default;
    render(<PagamentoPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /verificar/i })).toBeInTheDocument();
    });
  });
});
