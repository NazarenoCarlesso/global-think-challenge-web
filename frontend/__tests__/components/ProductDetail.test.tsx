import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DEFAULT_CONTEXT_VALUE } from "@/constants";
import { ProductsContext } from "@/context/ProductsContext";
import { Product } from "@/interfaces";
import { getProductById } from "@/services/products";
import { ProductDetail } from "@/components/ProductDetail";

jest.mock("@/services/products", () => ({
  getProductById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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
});
