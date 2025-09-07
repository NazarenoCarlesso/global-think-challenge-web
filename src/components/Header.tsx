import { useContext } from "react";
import "./Header.css";
import { ProductsContext } from "@/context/products";

export const Header = () => {
  const { toggleCart } = useContext(ProductsContext);

  return (
    <header>
      <button onClick={() => toggleCart()}>
        🛒
      </button>
    </header>
  )
}