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
  toggleFavorite: (id: number) => void
  filter: string | undefined
  hasLoadedProducts: boolean
  changeSearchTerm: (searchTerm: string | undefined) => void
  selectCategory: (category: string | undefined) => void
  clearFilters: () => void
  categoryFilter: string | undefined
  categories: string[]
  currentPage: number
  totalPages: number
  totalProducts: number
  nextPage: () => void
  prevPage: () => void
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

export interface ProductsActions {
  setLoading: (loading: boolean) => void;
  setProducts: (products: Product[], initializeFavorites?: boolean) => void;
  restorePersistedState: (payload: { favorites: number[]; cart: CartItem[] }) => void;
  setFavorite: (id: number) => void;
  addToCart: (product: Product) => void;
  increaseFromCart: (id: number) => void;
  decreaseFromCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export interface UseStorePersistenceProps {
  favorites: number[];
  cart: CartItem[];
  actions: Pick<ProductsActions, "restorePersistedState">;
  productsLoaded: boolean;
}

export interface UseProductsCatalogProps {
  currentPage: number;
  filter: string | undefined;
  categoryFilter: string | undefined;
  persistenceReady: boolean;
  filtersReady: boolean;
  hasStoredFavorites: boolean;
  actions: Pick<ProductsActions, "setLoading" | "setProducts">;
  productsPerPage?: number;
  onProductsLoaded?: () => void;
}

