import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { ProductsProvider } from "@/context/ProductsContext";
import { useProductsContext } from "@/hooks/useProductsContext";
import { getCategories, getProducts } from "@/services/products";

jest.mock("@/services/products", () => ({
  getCategories: jest.fn(),
  getProducts: jest.fn(),
}));

const getCategoriesMock = jest.mocked(getCategories);
const getProductsMock = jest.mocked(getProducts);

const ContextConsumer = () => {
  const { currentPage, isCartOpen, toggleCart } = useProductsContext();

  return (
    <section>
      <output data-testid="current-page">{currentPage}</output>
      <output data-testid="cart-open">{String(isCartOpen)}</output>
      <button type="button" onClick={toggleCart}>Toggle cart</button>
    </section>
  );
};

describe("useProductsContext inside ProductsProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    getCategoriesMock.mockResolvedValue([]);
    getProductsMock.mockResolvedValue({
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: 0,
      data: [],
    });
  });

  describe("useProductsContext outside ProductsProvider", () => {
    it("throws the provider usage error", () => {
      expect(() => renderHook(() => useProductsContext())).toThrow(
        "useProductsContext debe usarse dentro de un ProductsProvider"
      );
    });
  });

  it("reads provider state and invokes context actions", async () => {
    render(
      <ProductsProvider>
        <ContextConsumer />
      </ProductsProvider>
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("cart-open")).toHaveTextContent("false");
    expect(await screen.findByRole("button", { name: "Toggle cart" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Toggle cart" }));

    expect(screen.getByTestId("cart-open")).toHaveTextContent("true");
    expect(getCategoriesMock).toHaveBeenCalledTimes(1);
    expect(getProductsMock).toHaveBeenCalledWith(1, 8, undefined, undefined);
  });
});
