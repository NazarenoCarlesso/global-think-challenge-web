"use client"
import "./Cart.css";
import { CartItem } from "./CartItem";
import { useProductsContext } from "@/hooks/useProductsContext";

export const Cart = () => {
  const { cart, clearCart, isCartOpen } = useProductsContext();

  return (
    <aside className='cart' style={{ display: isCartOpen ? 'block' : 'none' }}>
      <ul>
        {
          cart.map(item =>
            <CartItem
              key={item.id}
              {...item}
            />)
        }
      </ul>
      <button className='limpiar' onClick={() => clearCart()}>
        Vaciar Carrito
      </button>
    </aside>
  )
}