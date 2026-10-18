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
  toggleFavorite: () => { },
  filter: undefined,
  hasLoadedProducts: false,
  changeSearchTerm: () => { },
  selectCategory: () => { },
  clearFilters: () => { },
  categoryFilter: undefined,
  categories: [],
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  goToPage: () => { },
  error: null,
  filteredResults: [],
  resultsCount: 0,
  addToCart: () => { },
  decreaseFromCart: () => { },
  clearCart: () => { },
  toggleCart: () => { },
  isCartOpen: false,
  removeFromCart: () => { }
};
