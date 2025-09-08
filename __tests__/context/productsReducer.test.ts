/* eslint-disable @typescript-eslint/no-explicit-any */
import { PRODUCTS_INITIAL_STATE } from "@/constants";
import { productsReducer } from "@/context/productsReducer";
import { Product, ProductsAction, ProductsState } from "@/interfaces";

export const MOCK_PRODUCT: Product = {
  id: 1,
  titulo: 'Producto de prueba',
  descripcion: 'Descripción del producto',
  precio: 100,
  imagen: 'url-imagen',
  fav: false,
  rating: 4.5,
  categoria: 'test',
};

export const MOCK_PRODUCT_2: Product = {
  id: 2,
  titulo: 'Otro producto',
  descripcion: 'Descripción del segundo producto',
  precio: 200,
  imagen: 'url-imagen-2',
  fav: true,
  rating: 4.0,
  categoria: 'test',
};

describe('productsReducer', () => {

  // Estado inicial de prueba para los tests
  const initialState: ProductsState = { ...PRODUCTS_INITIAL_STATE };

  // Caso por defecto: no cambia el estado para acciones desconocidas
  it('should return the initial state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION', payload: null };
    const newState = productsReducer(initialState, action as any);
    expect(newState).toEqual(initialState);
  });

  // --- Test para la acción 'SET_PRODUCTS' ---
  it('should set products and favorites correctly', () => {
    const mockProducts: Product[] = [MOCK_PRODUCT, MOCK_PRODUCT_2];
    const action = { type: 'SET_PRODUCTS', payload: mockProducts };
    const newState = productsReducer(initialState, action as ProductsAction);

    expect(newState.products).toEqual(mockProducts);
    expect(newState.favorites).toEqual([2]); // MOCK_PRODUCT_2 tiene `fav: true`
    expect(newState.loading).toBe(false);
  });

  // --- Test para la acción 'SET_FAVORITE' ---
  it('should add a product to favorites if not already a favorite', () => {
    const stateWithFavorites: ProductsState = {
      ...initialState,
      favorites: [MOCK_PRODUCT.id]
    };
    const action = { type: 'SET_FAVORITE', payload: MOCK_PRODUCT_2.id };
    const newState = productsReducer(stateWithFavorites, action as ProductsAction);
    expect(newState.favorites).toEqual([MOCK_PRODUCT.id, MOCK_PRODUCT_2.id]);
  });

  it('should remove a product from favorites if it is already a favorite', () => {
    const stateWithFavorites: ProductsState = {
      ...initialState,
      favorites: [MOCK_PRODUCT.id, MOCK_PRODUCT_2.id]
    };
    const action = { type: 'SET_FAVORITE', payload: MOCK_PRODUCT.id };
    const newState = productsReducer(stateWithFavorites, action as ProductsAction);
    expect(newState.favorites).toEqual([MOCK_PRODUCT_2.id]);
  });

  // --- Test para la acción 'ADD_TO_CART' ---
  it('should add a product to the cart with quantity 1', () => {
    const action = { type: 'ADD_TO_CART', payload: MOCK_PRODUCT };
    const newState = productsReducer(initialState, action as ProductsAction);
    expect(newState.cart).toEqual([{ ...MOCK_PRODUCT, quantity: 1 }]);
  });

  // --- Test para la acción 'INCREASE_FROM_CART' ---
  it('should increase the quantity of a product in the cart', () => {
    const stateWithCart: ProductsState = {
      ...initialState,
      cart: [{ ...MOCK_PRODUCT, quantity: 1 }]
    };
    const action = { type: 'INCREASE_FROM_CART', payload: MOCK_PRODUCT.id };
    const newState = productsReducer(stateWithCart, action as ProductsAction);
    expect(newState.cart[0].quantity).toBe(2);
  });

  // --- Test para la acción 'DECREASE_FROM_CART' ---
  it('should decrease the quantity of a product in the cart', () => {
    const stateWithCart: ProductsState = {
      ...initialState,
      cart: [{ ...MOCK_PRODUCT, quantity: 2 }]
    };
    const action = { type: 'DECREASE_FROM_CART', payload: MOCK_PRODUCT.id };
    const newState = productsReducer(stateWithCart, action as ProductsAction);
    expect(newState.cart[0].quantity).toBe(1);
  });

  // --- Test para la acción 'REMOVE_FROM_CART' ---
  it('should remove a product from the cart', () => {
    const stateWithCart: ProductsState = {
      ...initialState,
      cart: [{ ...MOCK_PRODUCT, quantity: 1 }, { ...MOCK_PRODUCT_2, quantity: 1 }]
    };
    const action = { type: 'REMOVE_FROM_CART', payload: MOCK_PRODUCT.id };
    const newState = productsReducer(stateWithCart, action as ProductsAction);
    expect(newState.cart).toEqual([{ ...MOCK_PRODUCT_2, quantity: 1 }]);
  });

  // --- Test para la acción 'CLEAR_CART' ---
  it('should clear all products from the cart', () => {
    const stateWithCart: ProductsState = {
      ...initialState,
      cart: [{ ...MOCK_PRODUCT, quantity: 1 }]
    };
    const action = { type: 'CLEAR_CART', payload: undefined };
    const newState = productsReducer(stateWithCart, action as ProductsAction);
    expect(newState.cart).toEqual([]);
  });
});