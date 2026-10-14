import { ProductContextType, ProductsState } from "@/interfaces";

export const PRODUCTS_INITIAL_STATE: ProductsState = {
  products: [],
  loading: true,
  favorites: [],
  cart: []
};

export const DEFAULT_CONTEXT_VALUE: ProductContextType = {
  // Valores iniciales de ProductsState
  products: [],
  loading: false,
  favorites: [],
  cart: [],
  // Funciones y otros valores con implementaciones "vacías" o iniciales
  setProducts: () => { },
  setFavorite: () => { },
  setFilter: () => { }, // Dispatch no hace nada por defecto
  setCategoryFilter: () => { },
  categoryFilter: undefined,
  filteredResults: [],
  resultsCount: 0,
  addToCart: () => { },
  decreaseFromCart: () => { },
  clearCart: () => { },
  toggleCart: () => { },
  isCartOpen: false,
  removeFromCart: () => { }
};
