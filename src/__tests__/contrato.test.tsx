/**
 * Tests for the contrato detail page.
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
  useParams: () => ({ id: "contrato-1" }),
}));

const MOCK_CONTRATO = {
  id: "contrato-1",
  descricao: "Pintura da sala e quarto conforme acordado",
  valor_total: 1200,
  status: "rascunho",
  prazo: "7 dias",
  created_at: new Date().toISOString(),
  pdf_url: null,
  clicksign_key: null,
  contratante: { id: "user-a", full_name: "Maria Costa" },
  prestador: { id: "user-b", full_name: "Carlos Mendes" },
};

jest.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "user-a" } }, error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: MOCK_CONTRATO, error: null }),
      update: jest.fn().mockReturnThis(),
    })),
  }),
}));

// ── Tests ──────────────────────────────────────────────────────
describe("Contrato page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders contrato description after loading", async () => {
    const ContratoPage = (await import("@/app/contrato/[id]/page")).default;
    render(<ContratoPage />);

    await waitFor(() => {
      expect(screen.getByText(/pintura da sala e quarto/i)).toBeInTheDocument();
    });
  });

  it("renders the contract value", async () => {
    const ContratoPage = (await import("@/app/contrato/[id]/page")).default;
    render(<ContratoPage />);

    await waitFor(() => {
      expect(screen.getByText(/1\.200/)).toBeInTheDocument();
    });
  });

  it("renders both party names", async () => {
    const ContratoPage = (await import("@/app/contrato/[id]/page")).default;
    render(<ContratoPage />);

    await waitFor(() => {
      expect(screen.getByText("Maria Costa")).toBeInTheDocument();
      expect(screen.getByText("Carlos Mendes")).toBeInTheDocument();
    });
  });

  it("shows sign button for rascunho status", async () => {
    const ContratoPage = (await import("@/app/contrato/[id]/page")).default;
    render(<ContratoPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /assinar/i })).toBeInTheDocument();
    });
  });
});
