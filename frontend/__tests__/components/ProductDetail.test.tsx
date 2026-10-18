import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DEFAULT_CONTEXT_VALUE } from "@/constants";
import { ProductsContext } from "@/context/ProductsContext";
import { Product } from "@/interfaces";
import { getProductById } from "@/services/products";
import { ProductDetail } from "@/components/ProductDetail";

jest.mock("@/services/products", () => ({
  getProductById: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const product: Product = {
  id: 9,
  titulo: "Sony Cámara",
  descripcion: "Descripción de la cámara",
  precio: 90,
  imagen: "",
  fav: false,
  rating: 4,
  categoria: "Electrónica",
};

const getProductByIdMock = jest.mocked(getProductById);

describe("ProductDetail", () => {
  beforeEach(() => {
    getProductByIdMock.mockReset();
    mockPush.mockReset();
  });

  it("loads the product by URL ID even when the products context is empty", async () => {
    getProductByIdMock.mockResolvedValue(product);
    render(
      <ProductsContext.Provider value={{ ...DEFAULT_CONTEXT_VALUE, products: [] }}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    expect(screen.getByRole("status")).toHaveTextContent("Cargando producto...");
    expect(await screen.findByRole("heading", { name: "Sony Cámara" })).toBeInTheDocument();
    expect(getProductByIdMock).toHaveBeenCalledWith("9");
  });

  it("shows a not-found state when the ID does not match a product", async () => {
    getProductByIdMock.mockResolvedValue(null);
    render(
      <ProductsContext.Provider value={DEFAULT_CONTEXT_VALUE}>
        <ProductDetail id="999" />
      </ProductsContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("No se encontró el producto solicitado.");
    });

    fireEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows a load error and returns to the listing", async () => {
    getProductByIdMock.mockRejectedValue(new Error("Servicio no disponible"));
    render(
      <ProductsContext.Provider value={DEFAULT_CONTEXT_VALUE}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo cargar el producto: Servicio no disponible"
    );
    fireEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("uses a fallback message when loading rejects with a non-Error value", async () => {
    getProductByIdMock.mockRejectedValue("unexpected failure");
    render(
      <ProductsContext.Provider value={DEFAULT_CONTEXT_VALUE}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo cargar el producto: No se pudo cargar el producto."
    );
  });

  it("renders the product image when the product has an image URL", async () => {
    getProductByIdMock.mockResolvedValue({ ...product, imagen: "/camera.jpg" });
    render(
      <ProductsContext.Provider value={DEFAULT_CONTEXT_VALUE}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    expect(await screen.findByRole("img", { name: "Sony Cámara" })).toHaveAttribute(
      "src",
      "/camera.jpg"
    );
  });

  it("does not update state when the product request resolves after unmount", async () => {
    let resolveProduct: ((value: Product | null) => void) | undefined;
    getProductByIdMock.mockReturnValue(
      new Promise((resolve) => {
        resolveProduct = resolve;
      })
    );
    const { unmount } = render(
      <ProductsContext.Provider value={DEFAULT_CONTEXT_VALUE}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    unmount();
    await resolveProduct?.(product);
  });

  it("ignores a product request error that arrives after unmount", async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined;
    getProductByIdMock.mockReturnValue(
      new Promise((_, reject) => {
        rejectRequest = reject;
      })
    );
    const { unmount } = render(
      <ProductsContext.Provider value={DEFAULT_CONTEXT_VALUE}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    unmount();
    await act(async () => {
      rejectRequest?.(new Error("late failure"));
      await Promise.resolve();
    });
  });

  it("adds the loaded product to the cart when buying", async () => {
    const addToCart = jest.fn();
    getProductByIdMock.mockResolvedValue(product);
    render(
      <ProductsContext.Provider value={{ ...DEFAULT_CONTEXT_VALUE, addToCart }}>
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    fireEvent.click(await screen.findByRole("button", { name: "Comprar" }));

    expect(addToCart).toHaveBeenCalledWith(product);
  });

  it("returns to the listing without clearing its filters", async () => {
    getProductByIdMock.mockResolvedValue(product);
    const clearFilters = jest.fn();
    render(
      <ProductsContext.Provider
        value={{
          ...DEFAULT_CONTEXT_VALUE,
          filter: "Sony",
          categoryFilter: "Electrónica",
          currentPage: 2,
          clearFilters,
        }}
      >
        <ProductDetail id="9" />
      </ProductsContext.Provider>
    );

    fireEvent.click(await screen.findByRole("button", { name: "Volver" }));

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(clearFilters).not.toHaveBeenCalled();
  });
});
