import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProductsProvider } from "@/context/ProductsContext";
import { useProductsContext } from "@/hooks/useProductsContext";
import { Product } from "@/interfaces";
import { getCategories, getProducts } from "@/services/products";
import { readPersistedStoreState } from "@/context/storePersistence";

jest.mock("@/services/products", () => ({
  getCategories: jest.fn(),
  getProducts: jest.fn(),
}));

const product: Product = {
  id: 1,
  titulo: "Producto persistido",
  descripcion: "Descripción de prueba",
  precio: 100,
  imagen: "",
  fav: true,
  rating: 5,
  categoria: "Test",
};

const anotherProduct: Product = {
  ...product,
  id: 2,
  titulo: "Otro producto",
  fav: false,
};

const getProductsMock = jest.mocked(getProducts);
const getCategoriesMock = jest.mocked(getCategories);

const StoreProbe = () => {
  const { products, favorites, cart, setFavorite, addToCart, clearCart } = useProductsContext();

  return (
    <section>
      <output data-testid="favorites">{favorites.join(",")}</output>
      <output data-testid="cart">
        {cart.map((item) => `${item.id}:${item.quantity}`).join(",")}
      </output>
      <button type="button" onClick={() => setFavorite(1)}>Toggle favorite</button>
      <button type="button" onClick={() => addToCart(products[0])}>Add product</button>
      <button type="button" onClick={clearCart}>Clear cart</button>
    </section>
  );
};

const renderStore = () => render(
  <ProductsProvider>
    <StoreProbe />
  </ProductsProvider>
);

describe("favorite and cart persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
    getCategoriesMock.mockResolvedValue([]);
    getProductsMock.mockResolvedValue({
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: 2,
      data: [product, anotherProduct],
    });
  });

  it("restores saved favorites and cart before loading products", async () => {
    window.localStorage.setItem("global-think-store", JSON.stringify({
      favorites: [2],
      cart: [{ ...anotherProduct, quantity: 3 }],
    }));

    renderStore();

    await waitFor(() => expect(getProductsMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("cart")).toHaveTextContent("2:3"));
    expect(screen.getByTestId("favorites")).toHaveTextContent("2");
  });

  it("persists favorite and cart changes and restores them after remounting", async () => {
    const { unmount } = renderStore();
    await screen.findByRole("button", { name: "Toggle favorite" });
    await waitFor(() => expect(screen.getByTestId("favorites")).toHaveTextContent("1"));

    fireEvent.click(screen.getByRole("button", { name: "Toggle favorite" }));
    fireEvent.click(screen.getByRole("button", { name: "Add product" }));

    await waitFor(() => {
      expect(screen.getByTestId("favorites")).toHaveTextContent("");
      expect(screen.getByTestId("cart")).toHaveTextContent("1:1");
    });

    const savedState = JSON.parse(window.localStorage.getItem("global-think-store") ?? "{}");
    expect(savedState.favorites).toEqual([]);
    expect(savedState.cart).toEqual([{ ...product, quantity: 1 }]);

    unmount();
    renderStore();

    await waitFor(() => {
      expect(screen.getByTestId("favorites")).toHaveTextContent("");
      expect(screen.getByTestId("cart")).toHaveTextContent("1:1");
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear cart" }));
    await waitFor(() => expect(screen.getByTestId("cart")).toHaveTextContent(""));
    expect(JSON.parse(window.localStorage.getItem("global-think-store") ?? "{}").cart).toEqual([]);
  });

  it("keeps an intentionally empty saved favorites list instead of reseeding API favorites", async () => {
    window.localStorage.setItem("global-think-store", JSON.stringify({
      favorites: [],
      cart: [],
    }));

    renderStore();

    await waitFor(() => expect(getProductsMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("favorites")).toHaveTextContent(""));
  });

  it("ignores malformed stored JSON and reports the parse error", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem("global-think-store", "{invalid");

    expect(readPersistedStoreState(window.localStorage)).toEqual({
      favorites: [],
      cart: [],
      hasStoredFavorites: false,
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
