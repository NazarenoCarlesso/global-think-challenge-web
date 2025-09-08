import { ProductsContext } from "@/context/ProductsContext";
import { useContext } from "react";

export const useProductsContext = () => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProductsContext debe usarse dentro de un ProductsProvider');
  }

  return context;
};
