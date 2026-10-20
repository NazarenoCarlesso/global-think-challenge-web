import { CartItem, Product, ProductsAction } from "@/interfaces";
import type { Dispatch } from "react";

export const productsActions = {
  setLoading: (loading: boolean): ProductsAction => ({
    type: "SET_LOADING",
    payload: loading,
  }),
  setProducts: (products: Product[], initializeFavorites?: boolean): ProductsAction => ({
    type: "SET_PRODUCTS",
    payload: products,
    initializeFavorites,
  }),
  restorePersistedState: (payload: { favorites: number[]; cart: CartItem[] }): ProductsAction => ({
    type: "RESTORE_PERSISTED_STATE",
    payload,
  }),
  setFavorite: (id: number): ProductsAction => ({
    type: "SET_FAVORITE",
    payload: id,
  }),
  addToCart: (product: Product): ProductsAction => ({
    type: "ADD_TO_CART",
    payload: product,
  }),
  increaseFromCart: (id: number): ProductsAction => ({
    type: "INCREASE_FROM_CART",
    payload: id,
  }),
  decreaseFromCart: (id: number): ProductsAction => ({
    type: "DECREASE_FROM_CART",
    payload: id,
  }),
  removeFromCart: (id: number): ProductsAction => ({
    type: "REMOVE_FROM_CART",
    payload: id,
  }),
  clearCart: (): ProductsAction => ({
    type: "CLEAR_CART",
    payload: undefined,
  }),
};

export const createProductsActions = (dispatch: Dispatch<ProductsAction>) => ({
  setLoading: (loading: boolean) => dispatch(productsActions.setLoading(loading)),
  setProducts: (products: Product[], initializeFavorites?: boolean) =>
    dispatch(productsActions.setProducts(products, initializeFavorites)),
  restorePersistedState: (payload: { favorites: number[]; cart: CartItem[] }) =>
    dispatch(productsActions.restorePersistedState(payload)),
  setFavorite: (id: number) => dispatch(productsActions.setFavorite(id)),
  addToCart: (product: Product) => dispatch(productsActions.addToCart(product)),
  increaseFromCart: (id: number) => dispatch(productsActions.increaseFromCart(id)),
  decreaseFromCart: (id: number) => dispatch(productsActions.decreaseFromCart(id)),
  removeFromCart: (id: number) => dispatch(productsActions.removeFromCart(id)),
  clearCart: () => dispatch(productsActions.clearCart()),
});

export type ProductsActions = ReturnType<typeof createProductsActions>;

