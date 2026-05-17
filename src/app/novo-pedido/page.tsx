"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import BuscaLocalizacao from "@/components/BuscaLocalizacao";

const CATEGORIES = [
  "Limpeza", "Elétrica", "Hidráulica", "Pintura",
  "Montagem", "Mudança", "Jardinagem", "Informática", "Outros",
];

export default function NovoPedidoPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [budgetMin, setBudgetMin] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }
      setUserId(user.id);
    }
    checkAuth();
  }, [router]);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setError("");
    if (!title.trim()) { setError("Informe o título do pedido"); return; }
    if (!description.trim()) { setError("Informe a descrição"); return; }
    if (!city.trim()) { setError("Informe a cidade"); return; }
    if (!userId) return;

    setLoading(true);
    const supabase = createClient();

    let photoUrl: string | null = null;
    if (photo) {
      const ext = photo.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("posts-fotos")
        .upload(path, photo, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("posts-fotos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("posts").insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      category: category || null,
      city: city.trim(),
      budget_min: budgetMin ? parseFloat(budgetMin) : null,
      photos: photoUrl ? [photoUrl] : null,
      status: "aberto",
      ...(lat != null ? { latitude: lat, longitude: lng } : {}),
    });

    // Also persist location on the user's profile so prestador search works
    if (lat != null) {
      void supabase.from("profiles").update({ latitude: lat, longitude: lng }).eq("id", userId);
    }

    setLoading(false);
    if (insertError) {
      setError("Erro ao publicar pedido. Tente novamente.");
      return;
    }
    router.push("/feed");
  }

  if (!userId) return null;

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "56px",
          backgroundColor: "#0F0F0F",
          borderBottom: "1px solid #2E2E2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Link
          href="/feed"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}
        >
          <ArrowLeftIcon />
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Novo pedido</span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "72px 20px 0" }}>
        {/* Title */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Título do pedido *</label>
          <input
            type="text"
            placeholder="Ex: Preciso de pintor para sala"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", color: category ? "#F0F0F0" : "#555555" }}
          >
            <option value="" style={{ color: "#555555", backgroundColor: "#1A1A1A" }}>Selecione uma categoria</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ color: "#F0F0F0", backgroundColor: "#1A1A1A" }}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Descrição *</label>
          <textarea
            placeholder="Descreva o serviço que precisa, detalhes importantes, prazo desejado..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{
              ...inputStyle,
              height: "auto",
              padding: "14px 16px",
              resize: "vertical",
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* City */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Cidade *</label>
          <BuscaLocalizacao
            placeholder="Buscar cidade ou bairro…"
            defaultValue={city}
            onSelect={(place) => {
              setCity(place.city || place.label);
              setLat(place.lat);
              setLng(place.lng);
            }}
          />
        </div>

        {/* Budget */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Orçamento mínimo em R$ (opcional)</label>
          <input
            type="number"
            placeholder="Ex: 200"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            min={0}
            style={inputStyle}
          />
        </div>

        {/* Photo */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Foto (opcional)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ display: "none" }}
          />
          {photoPreview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Preview"
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "10px", border: "1px solid #2E2E2E" }}
              />
              <button
                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  border: "none",
                  color: "#F0F0F0",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                height: "100px",
                backgroundColor: "#1A1A1A",
                border: "1px dashed #3A3A3A",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <CameraIcon />
              <span style={{ fontSize: "13px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                Adicionar foto
              </span>
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "14px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: loading ? "#3A3A3A" : "#FFD11A",
            color: loading ? "#888888" : "#0F0F0F",
            border: "none",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Publicando…" : "Publicar pedido"}
        </button>
      </div>
    </div>
  );
}

/* ─── Shared styles ───────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#888888",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "52px",
  backgroundColor: "#1A1A1A",
  border: "1px solid #2E2E2E",
  borderRadius: "10px",
  padding: "0 16px",
  fontSize: "15px",
  color: "#F0F0F0",
  fontFamily: "var(--font-inter), Inter, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
