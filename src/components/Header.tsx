import { useContext } from "react";
import "./Header.css";
import { ProductsContext } from "@/context/ProductsContext";

export const Header = () => {
  const { toggleCart, cart } = useContext(ProductsContext);

  const counter = cart.length

  return (
    <header>
      <button onClick={() => toggleCart()}>
        🛒
        {
          counter ? <p>{counter}</p> : null
        }
      </button>
    </header>
  )
}