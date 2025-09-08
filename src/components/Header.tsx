import "./Header.css";
import { useProductsContext } from "@/hooks/useProductsContext";

export const Header = () => {
  const { toggleCart, cart } = useProductsContext();

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