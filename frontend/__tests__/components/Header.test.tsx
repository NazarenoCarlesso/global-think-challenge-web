import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Header } from "@/components/Header";

jest.mock("@/hooks/useProductsContext", () => ({
  useProductsContext: () => ({
    toggleCart: jest.fn(),
    cart: [],
  }),
}));

describe("Header theme preference", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("restores the saved dark theme when the header mounts", async () => {
    window.localStorage.setItem("global-think-theme", "dark");

    render(<Header />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
    expect(screen.getByRole("button", { name: "Tema oscuro" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Tema claro" })).toHaveAttribute("aria-pressed", "false");
  });

  it("applies and persists the selected theme", async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: "Tema oscuro" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("global-think-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Tema oscuro" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Tema claro" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("global-think-theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Tema claro" })).toHaveAttribute("aria-pressed", "true");
  });

  it("uses the light theme when localStorage has an invalid value", async () => {
    window.localStorage.setItem("global-think-theme", "sepia");

    render(<Header />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
    });
    expect(screen.getByRole("button", { name: "Tema claro" })).toHaveAttribute("aria-pressed", "true");
  });
});
