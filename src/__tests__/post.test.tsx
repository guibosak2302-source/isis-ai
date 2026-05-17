/**
 * Tests for the novo-pedido page — form validation and submission.
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

const mockInsert = jest.fn().mockResolvedValue({ error: null });
const mockUpdate = jest.fn().mockResolvedValue({ data: null, error: null });

jest.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: "user-123", email: "test@test.com" } },
        error: null,
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: mockInsert,
      update: mockUpdate,
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: "https://example.com/img.png" } }),
      })),
    },
  }),
}));

jest.mock("@/components/BuscaLocalizacao", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (p: { city: string; state: string; lat: number; lng: number; label: string }) => void }) => (
    <input
      placeholder="Buscar cidade ou bairro…"
      onChange={(e) => onSelect({ city: e.target.value, state: "SP", lat: -23, lng: -46, label: e.target.value })}
    />
  ),
}));

// ── Tests ──────────────────────────────────────────────────────
describe("Novo pedido page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all required form fields", async () => {
    const NovoPedidoPage = (await import("@/app/novo-pedido/page")).default;
    render(<NovoPedidoPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/pintor para sala/i)).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(/descreva o serviço/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar cidade/i)).toBeInTheDocument();
  });

  it("shows error when title is empty", async () => {
    const NovoPedidoPage = (await import("@/app/novo-pedido/page")).default;
    render(<NovoPedidoPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/pintor para sala/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /publicar pedido/i }));

    await waitFor(() => {
      expect(screen.getByText(/informe o título/i)).toBeInTheDocument();
    });
  });

  it("shows error when description is empty", async () => {
    const NovoPedidoPage = (await import("@/app/novo-pedido/page")).default;
    render(<NovoPedidoPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/pintor para sala/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/pintor para sala/i), { target: { value: "Preciso de pintor" } });
    fireEvent.click(screen.getByRole("button", { name: /publicar pedido/i }));

    await waitFor(() => {
      expect(screen.getByText(/informe a descrição/i)).toBeInTheDocument();
    });
  });

  it("shows error when city is empty", async () => {
    const NovoPedidoPage = (await import("@/app/novo-pedido/page")).default;
    render(<NovoPedidoPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/pintor para sala/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/pintor para sala/i), { target: { value: "Preciso de pintor" } });
    fireEvent.change(screen.getByPlaceholderText(/descreva o serviço/i), { target: { value: "Pintar a sala inteira" } });
    fireEvent.click(screen.getByRole("button", { name: /publicar pedido/i }));

    await waitFor(() => {
      expect(screen.getByText(/informe a cidade/i)).toBeInTheDocument();
    });
  });

  it("submits form and navigates to feed on success", async () => {
    mockInsert.mockResolvedValue({ error: null });
    const NovoPedidoPage = (await import("@/app/novo-pedido/page")).default;
    render(<NovoPedidoPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/pintor para sala/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/pintor para sala/i), { target: { value: "Preciso de pintor" } });
    fireEvent.change(screen.getByPlaceholderText(/descreva o serviço/i), { target: { value: "Pintar a sala toda" } });
    fireEvent.change(screen.getByPlaceholderText(/buscar cidade/i), { target: { value: "São Paulo" } });
    fireEvent.click(screen.getByRole("button", { name: /publicar pedido/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/feed");
    });
  });
});
