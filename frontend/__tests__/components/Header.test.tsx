import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Header } from "@/components/Header";
import { useProductsContext } from "@/hooks/useProductsContext";

jest.mock("@/hooks/useProductsContext", () => ({
  useProductsContext: jest.fn(() => ({
    toggleCart: jest.fn(),
    cart: [],
    clearFilters: jest.fn(),
  })),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        props.onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
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

  it("clears search, category, and page when the logo is clicked", () => {
    render(<Header />);
    const context = jest.mocked(useProductsContext).mock.results.at(-1)?.value;

    fireEvent.click(screen.getByRole("link", { name: "Global Think Store" }));

    expect(context?.clearFilters).toHaveBeenCalledTimes(1);
  });

  it("shows a compact header with cart access after scrolling down", () => {
    render(<Header />);

    expect(screen.queryByRole("group", { name: "Navegación compacta" })).not.toBeInTheDocument();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 200 });
    fireEvent.scroll(window);

    expect(screen.getByRole("group", { name: "Navegación compacta" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Abrir carrito" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Tema claro" })).toHaveLength(1);
  });

  it("hides the compact header when returning to the top", async () => {
    render(<Header />);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 200 });
    fireEvent.scroll(window);
    expect(screen.getByRole("group", { name: "Navegación compacta" })).toBeInTheDocument();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.queryByRole("group", { name: "Navegación compacta" })).not.toBeInTheDocument();
    });
  });
});
