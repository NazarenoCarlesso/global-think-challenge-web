"use client";

import { createContext, ReactNode, useCallback, useMemo, useReducer, useState } from "react";
import { PRODUCTS_INITIAL_STATE } from "@/constants";
import { Product, ProductContextType } from "@/interfaces";
import { productsReducer } from "./productsReducer";
import { createProductsActions } from "./productsActions";
import { useProductFilters, useProductsCatalog, useStorePersistence } from "@/hooks";
import {
  notifyCartCleared,
  notifyFavoriteAdded,
  notifyFavoriteRemoved,
  notifyProductAddedToCart,
  notifyProductRemovedFromCart,
  notifyProductUnitDecreased,
} from "@/utils";

export const ProductsContext = createContext<ProductContextType | null>(null);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);
  const actions = useMemo(() => createProductsActions(dispatch), [dispatch]);

  const [productsLoaded, setProductsLoaded] = useState(false);
  const markProductsLoaded = useCallback(() => setProductsLoaded(true), []);

  const {
    isCartOpen,
    toggleCart,
    persistenceReady,
    hasStoredFavorites,
  } = useStorePersistence({
    favorites: state.favorites,
    cart: state.cart,
    actions,
    productsLoaded,
  });

  const {
    currentPage,
    filter,
    categoryFilter,
    filtersReady,
    nextPage: advancePage,
    prevPage: regressPage,
    changeSearchTerm,
    selectCategory,
    clearFilters,
  } = useProductFilters();

  const {
    categories,
    totalPages,
    totalProducts,
    error,
  } = useProductsCatalog({
    currentPage,
    filter,
    categoryFilter,
    persistenceReady,
    filtersReady,
    hasStoredFavorites,
    actions,
    onProductsLoaded: markProductsLoaded,
  });

  const nextPage = () => advancePage(totalPages);
  const prevPage = () => regressPage();

  const toggleFavorite = (id: number) => {
    const isFavorite = state.favorites.includes(id);
    actions.setFavorite(id);

    if (isFavorite) notifyFavoriteRemoved();
    else notifyFavoriteAdded();
  };

  const addToCart = (product: Product) => {
    const index = state.cart.findIndex(item => item.id === product.id);

    notifyProductAddedToCart();

    if (index === -1) {
      return actions.addToCart(product);
    }

    return actions.increaseFromCart(product.id);
  };

  const decreaseFromCart = (id: number) => {
    const index = state.cart.findIndex(item => item.id === id);

    if (index === -1) { return null; }

    const cartItem = state.cart[index];
    if (cartItem.quantity === 1) {
      notifyProductRemovedFromCart(cartItem.titulo);
      return actions.removeFromCart(id);
    }

    notifyProductUnitDecreased(cartItem.titulo);
    return actions.decreaseFromCart(id);
  };

  const removeFromCart = (id: number) => {
    const item = state.cart.find(cartItem => cartItem.id === id);
    if (!item) return;

    notifyProductRemovedFromCart(item.titulo);
    actions.removeFromCart(id);
  };

  const clearCart = () => {
    if (state.cart.length === 0) return;

    actions.clearCart();
    notifyCartCleared();
  };

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        toggleFavorite,
        filter,
        hasLoadedProducts: productsLoaded,
        changeSearchTerm,
        selectCategory,
        clearFilters,
        categoryFilter,
        categories,
        currentPage,
        totalPages,
        totalProducts,
        nextPage,
        prevPage,
        error,
        filteredResults: state.products,
        resultsCount: totalProducts,
        addToCart,
        decreaseFromCart,
        clearCart,
        isCartOpen,
        toggleCart,
        removeFromCart,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};