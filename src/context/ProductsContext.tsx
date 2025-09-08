"use client"
import { PRODUCTS_INITIAL_STATE } from "@/constants";
import { Product, ProductContextType } from "@/interfaces";
import { getAllProducts } from "@/services/products";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { productsReducer } from "./productsReducer";

export const ProductsContext = createContext<ProductContextType | null>(null);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);
  // Carga todos los productos en el contexto, demora 1s
  useEffect(() => {
    getAllProducts().then(allProducts => setProducts(allProducts))
  }, []);
  /*
      Acciones de dispatch
  */
  const setProducts = (products: Product[]) => dispatch({ type: 'SET_PRODUCTS', payload: products });

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
  // Filtro de búsqueda
  const [filter, setFilter] = useState<string | undefined>();
  const filteredResults = filter
    ? state.products.filter(p => p.titulo.toLowerCase().includes(filter.toLowerCase()))
    : state.products;
  // Resultados de búsqueda
  const resultsCount = filteredResults.length;
  // Toggle para el carrito
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const toggleCart = () => setCartOpen((state) => !state);
  // Provider
  return (
    <ProductsContext.Provider
      value={{
        ...state,
        setProducts,
        setFavorite,
        setFilter,
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