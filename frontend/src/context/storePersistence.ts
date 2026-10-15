import { CartItem, Product, ProductsState } from "@/interfaces";

const STORAGE_KEY = "global-think-store";

export type PersistedStoreState = Pick<ProductsState, "favorites" | "cart"> & {
  hasStoredFavorites: boolean;
  isCartOpen: boolean;
};

const emptyPersistedState = (): PersistedStoreState => ({
  favorites: [],
  cart: [],
  hasStoredFavorites: false,
  isCartOpen: false,
});

const isPositiveInteger = (value: unknown): value is number => (
  typeof value === "number" && Number.isInteger(value) && value > 0
);

const getStoredFavorites = (value: unknown): number[] | null => {
  if (!Array.isArray(value) || !value.every(isPositiveInteger)) return null;
  return [...new Set(value.filter(isPositiveInteger))];
};

const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Record<string, unknown>;
  return typeof product.id === "number"
    && typeof product.titulo === "string"
    && typeof product.descripcion === "string"
    && typeof product.precio === "number"
    && typeof product.imagen === "string"
    && typeof product.fav === "boolean"
    && typeof product.rating === "number"
    && typeof product.categoria === "string";
};

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return isProduct(item)
    && typeof item.quantity === "number"
    && Number.isInteger(item.quantity)
    && item.quantity > 0;
};

export const readPersistedStoreState = (
  storage: Pick<Storage, "getItem">
): PersistedStoreState => {
  const storedValue = storage.getItem(STORAGE_KEY);
  if (storedValue === null) return emptyPersistedState();

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch (error) {
    console.error("No se pudo leer la persistencia de favoritos y carrito:", error);
    return emptyPersistedState();
  }

  if (typeof parsed !== "object" || parsed === null) {
    console.error("La persistencia de favoritos y carrito tiene un formato inválido.");
    return emptyPersistedState();
  }

  const stored = parsed as Record<string, unknown>;
  const favorites = getStoredFavorites(stored.favorites);
  const storedCart = Array.isArray(stored.cart) ? stored.cart : [];
  const cartIsValid = Array.isArray(stored.cart) && storedCart.every(isCartItem);
  const cartOpenIsValid = typeof stored.isCartOpen === "boolean"
    || !Object.prototype.hasOwnProperty.call(stored, "isCartOpen");

  if (favorites === null || !cartIsValid || !cartOpenIsValid) {
    console.error("La persistencia de favoritos, carrito o estado de apertura tiene datos inválidos; se ignorará el dato afectado.");
  }

  return {
    favorites: favorites ?? [],
    cart: cartIsValid ? storedCart.filter(isCartItem) : [],
    hasStoredFavorites: favorites !== null,
    isCartOpen: typeof stored.isCartOpen === "boolean" ? stored.isCartOpen : false,
  };
};

export const writePersistedStoreState = (
  storage: Pick<Storage, "setItem">,
  state: Pick<ProductsState, "favorites" | "cart"> & Pick<PersistedStoreState, "isCartOpen">
) => {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
};
