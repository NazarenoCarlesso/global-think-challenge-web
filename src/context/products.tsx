"use client"
import { Product } from "@/interfaces";
import { createContext, Dispatch, ReactNode, SetStateAction, useReducer, useState } from "react";

interface ProductContextType {
  products: Product[]
  loading: boolean
  favorites: number[]
  setProducts: (products: Product[]) => void
  setFavorite: (id: number) => void
  setFilter: Dispatch<SetStateAction<string | undefined>>
  filteredResults: Product[]
  resultsCount: number
}

interface ProductsState {
  products: Product[]
  loading: boolean
  favorites: number[]
};

const PRODUCTS_INITIAL_STATE = {
  products: [],
  loading: true,
  favorites: []
};

type ProductsAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FAVORITE'; payload: number };

const productsReducer = (state: ProductsState, { type, payload }: ProductsAction) => {
  switch (type) {
    case 'SET_PRODUCTS':
      return {
        products: payload,
        loading: false,
        favorites: payload.filter(p => p.fav).map(p => p.id)
      }
    case 'SET_FAVORITE':
      const index = state.favorites.indexOf(payload)
      return {
        ...state,
        favorites: index === -1
          ? [...state.favorites, payload]
          : state.favorites.filter(fav => fav !== payload)
      }
    default:
      return state;
  }
}

export const ProductsContext = createContext<ProductContextType>();

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);
  const [filter, setFilter] = useState<string | undefined>();

  const filteredResults = filter
    ? state.products.filter(p => p.titulo.toLowerCase().includes(filter.toLowerCase()))
    : state.products

  const resultsCount = filteredResults.length

  const setProducts = (products: Product[]) => dispatch({ type: 'SET_PRODUCTS', payload: products })

  const setFavorite = (id: number) => dispatch({ type: 'SET_FAVORITE', payload: id })

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        setProducts,
        setFavorite,
        setFilter,
        filteredResults,
        resultsCount
      }}>
      {children}
    </ProductsContext.Provider>
  )
};