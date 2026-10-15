"use client"
import { PRODUCTS_INITIAL_STATE } from "@/constants";
import { Product, ProductContextType } from "@/interfaces";
import { getCategories, getProducts } from "@/services/products";
import { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from "react";
import { readPersistedStoreState, writePersistedStoreState } from "./storePersistence";
import { productsReducer } from "./productsReducer";

export const ProductsContext = createContext<ProductContextType | null>(null);

const PRODUCTS_PER_PAGE = 8;

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilterState] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilterState] = useState<string | undefined>();
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [hasStoredFavorites, setHasStoredFavorites] = useState(false);

  useEffect(() => {
    try {
      const persistedState = readPersistedStoreState(window.localStorage);
      dispatch({
        type: "RESTORE_PERSISTED_STATE",
        payload: {
          favorites: persistedState.favorites,
          cart: persistedState.cart,
        },
      });
      setCartOpen(persistedState.isCartOpen);
      setHasStoredFavorites(persistedState.hasStoredFavorites);
    } catch (loadError) {
      console.error("No se pudo acceder a la persistencia de favoritos y carrito:", loadError);
    } finally {
      setPersistenceReady(true);
    }
  }, []);

  useEffect(() => {
    if (!persistenceReady || !productsLoaded) return;

    try {
      writePersistedStoreState(window.localStorage, {
        favorites: state.favorites,
        cart: state.cart,
        isCartOpen,
      });
    } catch (saveError) {
      console.error("No se pudo guardar favoritos y carrito:", saveError);
    }
  }, [persistenceReady, productsLoaded, state.favorites, state.cart, isCartOpen]);

  useEffect(() => {
    let active = true;

    getCategories()
      .then((availableCategories) => {
        if (active) setCategories(availableCategories);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las categorías.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!persistenceReady) return;

    let active = true;
    dispatch({ type: "SET_LOADING", payload: true });
    setError(null);

    getProducts(currentPage, PRODUCTS_PER_PAGE, filter?.trim(), categoryFilter)
      .then((result) => {
        if (!active) return;
        dispatch({
          type: "SET_PRODUCTS",
          payload: result.data,
          initializeFavorites: !hasStoredFavorites,
        });
        setTotalPages(result.pages);
        setTotalProducts(result.items);
        setProductsLoaded(true);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los productos.");
        dispatch({ type: "SET_LOADING", payload: false });
      });

    return () => {
      active = false;
    };
  }, [currentPage, filter, categoryFilter, persistenceReady, hasStoredFavorites]);

  /*
      Acciones de dispatch
  */
  const setProducts = (products: Product[]) => dispatch({ type: 'SET_PRODUCTS', payload: products });

  const setPage = (page: number) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  const setFilter: ProductContextType["setFilter"] = useCallback((value) => {
    setCurrentPage(1);
    setFilterState(value);
  }, []);
  const setCategoryFilter = (category: string | undefined) => {
    setCurrentPage(1);
    setCategoryFilterState(category);
  };

  const setFavorite = (id: number) => dispatch({ type: 'SET_FAVORITE', payload: id });

  const addToCart = (product: Product) => {
    const index = state.cart.findIndex(item => item.id === product.id);

    if (index === -1) {
      return dispatch({ type: 'ADD_TO_CART', payload: product });
    }

    return dispatch({ type: 'INCREASE_FROM_CART', payload: product.id });
  };

  const decreaseFromCart = (id: number) => {
    const index = state.cart.findIndex(item => item.id === id);

    if (index === -1) { return null; }

    if (state.cart[index].quantity === 1) {
      return dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    }

    return dispatch({ type: 'DECREASE_FROM_CART', payload: id });
  };

  const removeFromCart = (id: number) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const clearCart = () => dispatch({ type: 'CLEAR_CART', payload: undefined });
  const filteredResults = state.products;
  const resultsCount = totalProducts;
  // Toggle para el carrito
  const toggleCart = () => setCartOpen((state) => !state);
  // Provider
  return (
    <ProductsContext.Provider
      value={{
        ...state,
        setProducts,
        setFavorite,
        filter,
        hasLoadedProducts: productsLoaded,
        setFilter,
        setCategoryFilter,
        categoryFilter,
        categories,
        currentPage,
        totalPages,
        totalProducts,
        setPage,
        error,
        filteredResults,
        resultsCount,
        addToCart,
        decreaseFromCart,
        clearCart,
        isCartOpen,
        toggleCart,
        removeFromCart
      }}>
      {children}
    </ProductsContext.Provider>
  )
};