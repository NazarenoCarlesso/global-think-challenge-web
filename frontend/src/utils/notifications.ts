import { showToast } from "nextjs-toast-notify";
import { DEFAULT_TOAST_OPTIONS } from "@/constants";

export const notifyFavoriteRemoved = () => {
  showToast.info("Producto quitado de favoritos", DEFAULT_TOAST_OPTIONS);
};

export const notifyFavoriteAdded = () => {
  showToast.success("Producto agregado a favoritos", DEFAULT_TOAST_OPTIONS);
};

export const notifyProductAddedToCart = () => {
  showToast.success("Producto agregado al carrito", DEFAULT_TOAST_OPTIONS);
};

export const notifyProductUnitDecreased = (productTitle: string) => {
  showToast.info(`Se quitó una unidad de ${productTitle}`, DEFAULT_TOAST_OPTIONS);
};

export const notifyProductRemovedFromCart = (productTitle: string) => {
  showToast.success(`${productTitle} eliminado del carrito`, DEFAULT_TOAST_OPTIONS);
};

export const notifyCartCleared = () => {
  showToast.success("Carrito vaciado", DEFAULT_TOAST_OPTIONS);
};

