/**
 * Tests for authentication flows: login and cadastro pages.
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

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();

jest.mock("@/lib/supabase", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  }),
}));

// ── Tests ──────────────────────────────────────────────────────
describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue({ error: null });
  });

  it("renders email and password inputs", async () => {
    const LoginPage = (await import("@/app/page")).default;
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
  });

  it("shows error message for invalid credentials", async () => {
    mockSignIn.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    const LoginPage = (await import("@/app/page")).default;
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ou senha incorretos/i)).toBeInTheDocument();
    });
  });

  it("shows loading state while submitting", async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {})); // never resolves
    const LoginPage = (await import("@/app/page")).default;
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled();
    });
  });

  it("navigates to feed on successful login", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const LoginPage = (await import("@/app/page")).default;
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "correct" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/feed");
    });
  });
});
