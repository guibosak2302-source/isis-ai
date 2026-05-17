/**
 * Tests for candidatura (proposal) submission in the feed modal.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Mocks ─────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => ({ get: () => null }),
  useParams: () => ({}),
}));

const MOCK_POST = {
  id: "post-1",
  user_id: "owner-1",
  title: "Preciso de eletricista",
  description: "Instalar tomadas",
  category: "Elétrica",
  city: "Campinas",
  budget_min: 300,
  created_at: new Date().toISOString(),
  latitude: null,
  longitude: null,
  status: "aberto",
  profiles: { id: "owner-1", full_name: "Ana Lima", avatar_url: null, city: "Campinas", score: 200, seal: "prata", verified: false },
};

const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
const mockCandidaturaInsert = jest.fn().mockResolvedValue({ error: null });

jest.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "prestador-1" } }, error: null }),
    },
    from: jest.fn((table: string) => {
      if (table === "posts") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [MOCK_POST], error: null }),
        };
      }
      if (table === "candidaturas") {
        return {
          select: jest.fn().mockReturnThis(),
          insert: mockCandidaturaInsert,
          eq: jest.fn().mockReturnThis(),
          maybeSingle: mockMaybeSingle,
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        insert: jest.fn().mockResolvedValue({ error: null }),
      };
    }),
    channel: jest.fn(() => ({ on: jest.fn().mockReturnThis(), subscribe: jest.fn() })),
    removeChannel: jest.fn(),
  }),
}));

jest.mock("@/components/BuscaLocalizacao", () => ({
  __esModule: true,
  default: () => <input placeholder="Filtrar por cidade ou bairro…" />,
}));

// ── Tests ──────────────────────────────────────────────────────
describe("Candidatura submission", () => {
  beforeEach(() => jest.clearAllMocks());

  it("opens the proposal modal when clicking Enviar proposta", async () => {
    const FeedPage = (await import("@/app/feed/page")).default;
    render(<FeedPage />);

    await waitFor(() => {
      expect(screen.getByText("Preciso de eletricista")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar proposta/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/descreva sua proposta/i)).toBeInTheDocument();
    });
  });

  it("shows error when proposta description is empty", async () => {
    const FeedPage = (await import("@/app/feed/page")).default;
    render(<FeedPage />);

    await waitFor(() => {
      expect(screen.getByText("Preciso de eletricista")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar proposta/i }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/descreva sua proposta/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar proposta/i }));

    await waitFor(() => {
      expect(screen.getByText(/escreva sua proposta/i)).toBeInTheDocument();
    });
  });

  it("shows error when valor is empty", async () => {
    const FeedPage = (await import("@/app/feed/page")).default;
    render(<FeedPage />);

    await waitFor(() => {
      expect(screen.getByText("Preciso de eletricista")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar proposta/i }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/descreva sua proposta/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/descreva sua proposta/i), {
      target: { value: "Posso fazer o serviço amanhã" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar proposta/i }));

    await waitFor(() => {
      expect(screen.getByText(/informe seu preço/i)).toBeInTheDocument();
    });
  });
});
