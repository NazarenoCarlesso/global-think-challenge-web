"use client"
import { useContext } from "react";
import { ProductsContext } from "@/context/ProductsContext";
import "./Cart.css";
import { CartItem } from "./CartItem";

export const Cart = () => {
  const { cart, clearCart, isCartOpen } = useContext(ProductsContext)

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