import { Dispatch, SetStateAction } from "react";

export interface Product {
  id: number
  titulo: string
  descripcion: string
  precio: number
  imagen: string
  fav: boolean
  rating: number
  categoria: string
};

export interface CartItem extends Product {
  quantity: number
};

export interface ProductsState {
  products: Product[]
  loading: boolean
  favorites: number[]
  cart: CartItem[]
};

export type ProductsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[]; initializeFavorites?: boolean }
  | { type: 'RESTORE_PERSISTED_STATE'; payload: Pick<ProductsState, 'favorites' | 'cart'> }
  | { type: 'SET_FAVORITE'; payload: number }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'INCREASE_FROM_CART'; payload: number }
  | { type: 'DECREASE_FROM_CART'; payload: number }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART'; payload: undefined };

export interface ProductContextType extends ProductsState {
  setProducts: (products: Product[]) => void
  setFavorite: (id: number) => void
  setFilter: Dispatch<SetStateAction<string | undefined>>
  setCategoryFilter: (category: string | undefined) => void
  categoryFilter: string | undefined
  categories: string[]
  currentPage: number
  totalPages: number
  totalProducts: number
  setPage: (page: number) => void
  error: string | null
  filteredResults: Product[]
  resultsCount: number
  addToCart: (product: Product) => void
  decreaseFromCart: (id: number) => void
  clearCart: () => void
  toggleCart: () => void
  isCartOpen: boolean
  removeFromCart: (id: number) => void
};
