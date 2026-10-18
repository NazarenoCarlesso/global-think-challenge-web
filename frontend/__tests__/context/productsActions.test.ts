import { createProductsActions, productsActions } from "@/context/productsActions";
import { Product } from "@/interfaces";

const mockProduct: Product = {
  id: 1,
  titulo: "Test Product",
  descripcion: "Test Description",
  precio: 99.99,
  imagen: "test.jpg",
  fav: false,
  rating: 4.5,
  categoria: "electronics",
};

describe("productsActions action creators", () => {
  it("creates SET_LOADING action", () => {
    expect(productsActions.setLoading(true)).toEqual({
      type: "SET_LOADING",
      payload: true,
    });
  });

  it("creates SET_PRODUCTS action with initializeFavorites flag", () => {
    expect(productsActions.setProducts([mockProduct], true)).toEqual({
      type: "SET_PRODUCTS",
      payload: [mockProduct],
      initializeFavorites: true,
    });
  });

  it("creates RESTORE_PERSISTED_STATE action", () => {
    const payload = { favorites: [1], cart: [{ ...mockProduct, quantity: 1 }] };
    expect(productsActions.restorePersistedState(payload)).toEqual({
      type: "RESTORE_PERSISTED_STATE",
      payload,
    });
  });

  it("creates SET_FAVORITE action", () => {
    expect(productsActions.setFavorite(1)).toEqual({
      type: "SET_FAVORITE",
      payload: 1,
    });
  });

  it("creates ADD_TO_CART action", () => {
    expect(productsActions.addToCart(mockProduct)).toEqual({
      type: "ADD_TO_CART",
      payload: mockProduct,
    });
  });

  it("creates INCREASE_FROM_CART action", () => {
    expect(productsActions.increaseFromCart(1)).toEqual({
      type: "INCREASE_FROM_CART",
      payload: 1,
    });
  });

  it("creates DECREASE_FROM_CART action", () => {
    expect(productsActions.decreaseFromCart(1)).toEqual({
      type: "DECREASE_FROM_CART",
      payload: 1,
    });
  });

  it("creates REMOVE_FROM_CART action", () => {
    expect(productsActions.removeFromCart(1)).toEqual({
      type: "REMOVE_FROM_CART",
      payload: 1,
    });
  });

  it("creates CLEAR_CART action", () => {
    expect(productsActions.clearCart()).toEqual({
      type: "CLEAR_CART",
      payload: undefined,
    });
  });
});

describe("createProductsActions bound dispatcher", () => {
  it("dispatches created actions correctly", () => {
    const dispatch = jest.fn();
    const actions = createProductsActions(dispatch);

    actions.setLoading(false);
    expect(dispatch).toHaveBeenCalledWith({ type: "SET_LOADING", payload: false });

    actions.setProducts([mockProduct]);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PRODUCTS",
      payload: [mockProduct],
      initializeFavorites: undefined,
    });

    actions.setFavorite(1);
    expect(dispatch).toHaveBeenCalledWith({ type: "SET_FAVORITE", payload: 1 });

    actions.addToCart(mockProduct);
    expect(dispatch).toHaveBeenCalledWith({ type: "ADD_TO_CART", payload: mockProduct });

    actions.increaseFromCart(2);
    expect(dispatch).toHaveBeenCalledWith({ type: "INCREASE_FROM_CART", payload: 2 });

    actions.decreaseFromCart(2);
    expect(dispatch).toHaveBeenCalledWith({ type: "DECREASE_FROM_CART", payload: 2 });

    actions.removeFromCart(2);
    expect(dispatch).toHaveBeenCalledWith({ type: "REMOVE_FROM_CART", payload: 2 });

    actions.clearCart();
    expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR_CART", payload: undefined });

    actions.restorePersistedState({ favorites: [], cart: [] });
    expect(dispatch).toHaveBeenCalledWith({
      type: "RESTORE_PERSISTED_STATE",
      payload: { favorites: [], cart: [] },
    });
  });
});

