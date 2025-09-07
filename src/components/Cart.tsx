"use client"
import Image from "next/image";
import { useContext } from "react";
import { ProductsContext } from "@/context/products";
import "./Cart.css";
import { CartItem as CartItemProps } from "@/interfaces";

export const Cart = () => {
  const { cart, clearCart } = useContext(ProductsContext)

  return (
    <aside className='cart' style={{ display: 'block' }}>
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


export const CartItem = (item: CartItemProps) => {
  const { addToCart, decreaseFromCart } = useContext(ProductsContext);
  const { quantity, ...product } = item;

  return (
    <li className='cart-item'>
      <Image className='image' src={item.imagen} alt={item.titulo} width={120} height={120} />
      <p>{item.titulo}</p>
      <p>${item.precio}</p>
      <footer>
        <button onClick={() => decreaseFromCart(product.id)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => addToCart(product)}>+</button>
      </footer>
    </li>
  )
}