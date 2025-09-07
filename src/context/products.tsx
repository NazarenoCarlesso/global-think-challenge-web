"use client"
import { CartItem, Product } from "@/interfaces";
import { getAllProducts } from "@/services/products";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useReducer, useState } from "react";

interface ProductContextType extends ProductsState {
  setProducts: (products: Product[]) => void
  setFavorite: (id: number) => void
  setFilter: Dispatch<SetStateAction<string | undefined>>
  filteredResults: Product[]
  resultsCount: number
  addToCart: (product: Product) => void
  decreaseFromCart: (id: number) => void
  clearCart: () => void
  toggleCart: () => void
  isCartOpen: boolean
}

interface ProductsState {
  products: Product[]
  loading: boolean
  favorites: number[]
  cart: CartItem[]
};

const PRODUCTS_INITIAL_STATE = {
  products: [],
  loading: true,
  favorites: [],
  cart: []
};

type ProductsAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FAVORITE'; payload: number }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'DECREASE_FROM_CART'; payload: number }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART'; payload: undefined };

const productsReducer = (state: ProductsState, { type, payload }: ProductsAction) => {
  switch (type) {
    case 'SET_PRODUCTS':
      return {
        ...PRODUCTS_INITIAL_STATE,
        products: payload,
        favorites: payload.filter(p => p.fav).map(p => p.id),
        loading: false
      }
    case 'SET_FAVORITE':
      const index = state.favorites.indexOf(payload)
      return {
        ...state,
        favorites: index === -1
          ? [...state.favorites, payload]
          : state.favorites.filter(fav => fav !== payload)
      }
    case 'ADD_TO_CART':
      const productInCart = state.cart.findIndex(item => item.id === payload.id)
      return {
        ...state,
        cart: productInCart === -1
          ? [...state.cart, { ...payload, quantity: 1 }]
          : state.cart.map((item, index) =>
            index === productInCart
              ? {
                ...item,
                quantity: item.quantity + 1
              } : item
          )
      }
    case 'DECREASE_FROM_CART': {
      const index = state.cart.findIndex(item => item.id === payload)

      if (index === -1) return state; // si no está en el carrito, no hacemos nada

      const item = state.cart[index];

      return {
        ...state,
        cart:
          item.quantity === 1
            ? state.cart.filter((_, i) => i !== index)
            : state.cart.map((item, i) =>
              i === index
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
      }
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== payload)
      }
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        cart: []
      }
    }
    default:
      return state;
  }
}

export const ProductsContext = createContext<ProductContextType>();

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);
  const [filter, setFilter] = useState<string | undefined>();
  const [isCartOpen, setCartOpen] = useState<boolean>(false);

  useEffect(() => {
    getAllProducts().then(allProducts => setProducts(allProducts))
  }, []);

  const filteredResults = filter
    ? state.products.filter(p => p.titulo.toLowerCase().includes(filter.toLowerCase()))
    : state.products

  const resultsCount = filteredResults.length

  const setProducts = (products: Product[]) => dispatch({ type: 'SET_PRODUCTS', payload: products })

  const setFavorite = (id: number) => dispatch({ type: 'SET_FAVORITE', payload: id })

  const addToCart = (product: Product) =>
    dispatch({ type: 'ADD_TO_CART', payload: product })

  const decreaseFromCart = (id: number) => dispatch({ type: 'DECREASE_FROM_CART', payload: id })

  const clearCart = () => dispatch({ type: 'CLEAR_CART', payload: undefined })

  const toggleCart = () => setCartOpen((state) => !state)

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
        toggleCart
      }}>
      {children}
    </ProductsContext.Provider>
  )
};