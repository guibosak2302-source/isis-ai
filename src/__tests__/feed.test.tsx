/**
 * Tests for the feed page — post listing and location filter.
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
  useParams: () => ({}),
}));

const MOCK_POSTS = [
  {
    id: "post-1",
    user_id: "user-1",
    title: "Preciso de pintor",
    description: "Pintura da sala",
    category: "Pintura",
    city: "São Paulo",
    budget_min: 500,
    created_at: new Date().toISOString(),
    latitude: null,
    longitude: null,
    status: "aberto",
    profiles: { id: "user-1", full_name: "João Silva", avatar_url: null, city: "São Paulo", score: 100, seal: "prata", verified: true },
  },
];

jest.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "user-abc" } }, error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: MOCK_POSTS, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    channel: jest.fn(() => ({ on: jest.fn().mockReturnThis(), subscribe: jest.fn() })),
    removeChannel: jest.fn(),
  }),
}));

jest.mock("@/components/BuscaLocalizacao", () => ({
  __esModule: true,
  default: () => <input placeholder="Filtrar por cidade ou bairro…" />,
}));

// ── Tests ──────────────────────────────────────────────────────
describe("Feed page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the Bico AI brand name", async () => {
    const FeedPage = (await import("@/app/feed/page")).default;
    render(<FeedPage />);
    await waitFor(() => {
      expect(screen.getByText("Bico")).toBeInTheDocument();
    });
  });

  it("shows post title after loading", async () => {
    const FeedPage = (await import("@/app/feed/page")).default;
    render(<FeedPage />);
    await waitFor(() => {
      expect(screen.getByText("Preciso de pintor")).toBeInTheDocument();
    });
  });

  it("shows location filter input", async () => {
    const FeedPage = (await import("@/app/feed/page")).default;
    render(<FeedPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/filtrar por cidade/i)).toBeInTheDocument();
    });
  });
});
