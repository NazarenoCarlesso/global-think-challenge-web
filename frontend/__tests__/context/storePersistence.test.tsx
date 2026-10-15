import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProductsProvider } from "@/context/ProductsContext";
import { useProductsContext } from "@/hooks/useProductsContext";
import { Product } from "@/interfaces";
import { getCategories, getProducts } from "@/services/products";
import {
  readPersistedStoreState,
  writePersistedStoreState,
} from "@/context/storePersistence";

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
  const {
    products,
    favorites,
    cart,
    isCartOpen,
    setFavorite,
    addToCart,
    decreaseFromCart,
    removeFromCart,
    clearCart,
    toggleCart,
  } = useProductsContext();

  return (
    <section>
      <output data-testid="favorites">{favorites.join(",")}</output>
      <output data-testid="cart-open">{String(isCartOpen)}</output>
      <output data-testid="cart">
        {cart.map((item) => `${item.id}:${item.quantity}`).join(",")}
      </output>
      <button type="button" onClick={() => setFavorite(1)}>Toggle favorite</button>
      <button type="button" onClick={() => addToCart(products[0])}>Add product</button>
      <button type="button" onClick={() => decreaseFromCart(1)}>Decrease product</button>
      <button type="button" onClick={() => decreaseFromCart(999)}>Decrease missing product</button>
      <button type="button" onClick={() => removeFromCart(1)}>Remove product</button>
      <button type="button" onClick={clearCart}>Clear cart</button>
      <button type="button" onClick={toggleCart}>Toggle cart</button>
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

  it("persists whether the cart is open and restores it after remounting", async () => {
    const { unmount } = renderStore();
    await screen.findByRole("button", { name: "Toggle cart" });
    await waitFor(() => expect(screen.getByTestId("cart-open")).toHaveTextContent("false"));

    fireEvent.click(screen.getByRole("button", { name: "Toggle cart" }));
    await waitFor(() => {
      expect(screen.getByTestId("cart-open")).toHaveTextContent("true");
      expect(JSON.parse(window.localStorage.getItem("global-think-store") ?? "{}").isCartOpen).toBe(true);
    });

    unmount();
    renderStore();
    await waitFor(() => expect(screen.getByTestId("cart-open")).toHaveTextContent("true"));

    fireEvent.click(screen.getByRole("button", { name: "Toggle cart" }));
    await waitFor(() => {
      expect(screen.getByTestId("cart-open")).toHaveTextContent("false");
      expect(JSON.parse(window.localStorage.getItem("global-think-store") ?? "{}").isCartOpen).toBe(false);
    });
  });

  it("decreases cart quantity, removes the last unit, and ignores absent products", async () => {
    window.localStorage.setItem("global-think-store", JSON.stringify({
      favorites: [],
      cart: [{ ...product, quantity: 2 }],
    }));
    renderStore();

    await waitFor(() => expect(screen.getByTestId("cart")).toHaveTextContent("1:2"));

    fireEvent.click(screen.getByRole("button", { name: "Decrease product" }));
    await waitFor(() => expect(screen.getByTestId("cart")).toHaveTextContent("1:1"));

    fireEvent.click(screen.getByRole("button", { name: "Decrease product" }));
    await waitFor(() => expect(screen.getByTestId("cart")).toHaveTextContent(""));

    fireEvent.click(screen.getByRole("button", { name: "Decrease missing product" }));
    expect(screen.getByTestId("cart")).toHaveTextContent("");
    expect(JSON.parse(window.localStorage.getItem("global-think-store") ?? "{}").cart).toEqual([]);
  });

  it("removes the selected cart item and preserves the others", async () => {
    window.localStorage.setItem("global-think-store", JSON.stringify({
      favorites: [],
      cart: [
        { ...product, quantity: 2 },
        { ...anotherProduct, quantity: 1 },
      ],
    }));
    renderStore();

    await waitFor(() => {
      expect(screen.getByTestId("cart")).toHaveTextContent("1:2,2:1");
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove product" }));

    await waitFor(() => {
      expect(screen.getByTestId("cart")).toHaveTextContent("2:1");
      expect(JSON.parse(window.localStorage.getItem("global-think-store") ?? "{}").cart)
        .toEqual([{ ...anotherProduct, quantity: 1 }]);
    });
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
      isCartOpen: false,
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("returns an empty state when there is no saved data", () => {
    expect(readPersistedStoreState(window.localStorage)).toEqual({
      favorites: [],
      cart: [],
      hasStoredFavorites: false,
      isCartOpen: false,
    });
  });

  it("ignores a parsed value that is not an object and reports it", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem("global-think-store", JSON.stringify(null));

    expect(readPersistedStoreState(window.localStorage)).toEqual({
      favorites: [],
      cart: [],
      hasStoredFavorites: false,
      isCartOpen: false,
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "La persistencia de favoritos y carrito tiene un formato inválido."
    );
    errorSpy.mockRestore();
  });

  it("rejects invalid favorites and cart data without discarding valid values", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem("global-think-store", JSON.stringify({
      favorites: [1, 0, "2"],
      cart: [{ ...product, quantity: 0 }],
      isCartOpen: true,
    }));

    expect(readPersistedStoreState(window.localStorage)).toEqual({
      favorites: [],
      cart: [],
      hasStoredFavorites: false,
      isCartOpen: true,
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "La persistencia de favoritos, carrito o estado de apertura tiene datos inválidos; se ignorará el dato afectado."
    );
    errorSpy.mockRestore();
  });

  it("rejects cart data that is not an array or contains malformed items", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const invalidProducts = [
      { ...product, id: "1" },
      { ...product, titulo: 1 },
      { ...product, descripcion: 1 },
      { ...product, precio: "100" },
      { ...product, imagen: null },
      { ...product, fav: "true" },
      { ...product, rating: "5" },
      { ...product, categoria: null },
    ];
    const invalidCartItems = [
      null,
      7,
      ...invalidProducts,
      { ...product, quantity: "1" },
      { ...product, quantity: 1.5 },
    ];

    for (const cart of [null, ...invalidCartItems.map((item) => [item])]) {
      window.localStorage.setItem("global-think-store", JSON.stringify({
        favorites: [1],
        cart,
      }));

      expect(readPersistedStoreState(window.localStorage)).toMatchObject({
        favorites: [1],
        cart: [],
        hasStoredFavorites: true,
      });
    }

    expect(errorSpy).toHaveBeenCalledTimes(invalidCartItems.length + 1);
    errorSpy.mockRestore();
  });

  it("writes favorites, cart, and cart-open state as JSON", () => {
    const setItem = jest.fn();
    const state = {
      favorites: [1, 3],
      cart: [{ ...product, quantity: 2 }],
      isCartOpen: true,
    };

    writePersistedStoreState({ setItem }, state);

    expect(setItem).toHaveBeenCalledWith("global-think-store", JSON.stringify(state));
  });

  it("defaults an invalid cart-open value and reports it", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    window.localStorage.setItem("global-think-store", JSON.stringify({
      favorites: [],
      cart: [],
      isCartOpen: "open",
    }));

    expect(readPersistedStoreState(window.localStorage)).toEqual({
      favorites: [],
      cart: [],
      hasStoredFavorites: true,
      isCartOpen: false,
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
