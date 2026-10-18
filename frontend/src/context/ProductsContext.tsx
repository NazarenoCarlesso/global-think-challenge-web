"use client"
import { PRODUCTS_INITIAL_STATE } from "@/constants";
import { Product, ProductContextType } from "@/interfaces";
import { getCategories, getProducts } from "@/services/products";
import { createContext, ReactNode, useCallback, useEffect, useReducer, useState } from "react";
import { readPersistedStoreState, writePersistedStoreState } from "./storePersistence";
import { productsReducer } from "./productsReducer";
import { usePathname } from "next/navigation";
import { showToast } from "nextjs-toast-notify";

export const ProductsContext = createContext<ProductContextType | null>(null);

const PRODUCTS_PER_PAGE = 8;

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
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
  const [filtersReady, setFiltersReady] = useState(false);
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
    const restoreFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedPage = Number(params.get("page"));

      setFilterState(params.get("search") || undefined);
      setCategoryFilterState(params.get("category") || undefined);
      setCurrentPage(Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1);
      setFiltersReady(true);
    };

    restoreFiltersFromUrl();
    window.addEventListener("popstate", restoreFiltersFromUrl);
    return () => window.removeEventListener("popstate", restoreFiltersFromUrl);
  }, []);

  useEffect(() => {
    if (!filtersReady) return;

    const url = new URL(window.location.href);
    if (filter?.trim()) url.searchParams.set("search", filter.trim());
    else url.searchParams.delete("search");
    if (categoryFilter) url.searchParams.set("category", categoryFilter);
    else url.searchParams.delete("category");
    if (currentPage > 1) url.searchParams.set("page", String(currentPage));
    else url.searchParams.delete("page");

    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [filtersReady, filter, categoryFilter, currentPage, pathname]);

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
    if (!persistenceReady || !filtersReady) return;

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
  }, [currentPage, filter, categoryFilter, persistenceReady, filtersReady, hasStoredFavorites]);

  /*
      Acciones de dispatch
  */
  const goToPage = (page: number) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  const changeSearchTerm: ProductContextType["changeSearchTerm"] = useCallback((value) => {
    setCurrentPage(1);
    setFilterState(value);
  }, []);
  const selectCategory = (category: string | undefined) => {
    setCurrentPage(1);
    setCategoryFilterState(category);
  };
  const clearFilters = () => {
    setCurrentPage(1);
    setFilterState(undefined);
    setCategoryFilterState(undefined);
  };

  const toggleFavorite = (id: number) => {
    const isFavorite = state.favorites.includes(id);
    dispatch({ type: 'SET_FAVORITE', payload: id });

    if (isFavorite) showToast.info("Producto quitado de favoritos", { duration: 2500, position: "top-right" });
    else showToast.success("Producto agregado a favoritos", { duration: 2500, position: "top-right" });
  };

  const addToCart = (product: Product) => {
    const index = state.cart.findIndex(item => item.id === product.id);

    showToast.success("Producto agregado al carrito", { duration: 2500, position: "top-right" });

    if (index === -1) {
      return dispatch({ type: 'ADD_TO_CART', payload: product });
    }

    return dispatch({ type: 'INCREASE_FROM_CART', payload: product.id });
  };

  const decreaseFromCart = (id: number) => {
    const index = state.cart.findIndex(item => item.id === id);

    if (index === -1) { return null; }

    const cartItem = state.cart[index];
    if (cartItem.quantity === 1) {
      showToast.success(`${cartItem.titulo} eliminado del carrito`, { duration: 2500, position: "top-right" });
      return dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    }

    showToast.info(`Se quitó una unidad de ${cartItem.titulo}`, { duration: 2500, position: "top-right" });
    return dispatch({ type: 'DECREASE_FROM_CART', payload: id });
  };

  const removeFromCart = (id: number) => {
    const item = state.cart.find(cartItem => cartItem.id === id);
    if (!item) return;

    showToast.success(`${item.titulo} eliminado del carrito`, { duration: 2500, position: "top-right" });
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    if (state.cart.length === 0) return;

    dispatch({ type: 'CLEAR_CART', payload: undefined });
    showToast.success("Carrito vaciado", { duration: 2500, position: "top-right" });
  };
  const filteredResults = state.products;
  const resultsCount = totalProducts;
  // Toggle para el carrito
  const toggleCart = () => setCartOpen((state) => !state);
  // Provider
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
        goToPage,
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