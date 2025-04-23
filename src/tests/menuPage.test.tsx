import MenuPage from "../pages/menuPage";
import { useNavigate } from "zmp-ui";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock useNavigate
vi.mock("zmp-ui", async () => {
  const actual = await vi.importActual<any>("zmp-ui");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("MenuPage", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and description", () => {
    render(<MenuPage />);
    expect(screen.getByText("Connect4Z")).toBeInTheDocument();
    expect(screen.getByText("Connect four discs to win!")).toBeInTheDocument();
  });

  it("renders all buttons", () => {
    render(<MenuPage />);
    expect(
      screen.getByRole("button", { name: /Single Player/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Two Player/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /How to Play/i })
    ).toBeInTheDocument();
  });

  it("navigates to /single-player when Single Player button is clicked", () => {
    render(<MenuPage />);
    fireEvent.click(screen.getByRole("button", { name: /Single Player/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/single-player");
  });

  it("navigates to /two-player when Two Player button is clicked", () => {
    render(<MenuPage />);
    fireEvent.click(screen.getByRole("button", { name: /Two Player/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/two-player");
  });

  it("navigates to /how-to-play when How to Play button is clicked", () => {
    render(<MenuPage />);
    fireEvent.click(screen.getByRole("button", { name: /How to Play/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/how-to-play");
  });

  it("renders the copyright text", () => {
    render(<MenuPage />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Connect4Z - All Rights Reserved`)
    ).toBeInTheDocument();
  });
});
