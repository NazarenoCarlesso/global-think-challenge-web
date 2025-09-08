import Image from "next/image";
import { CartItem as CartItemProps } from "@/interfaces";
import { useContext } from "react";
import { ProductsContext } from "@/context/ProductsContext";

export const CartItem = (item: CartItemProps) => {
  const { addToCart, decreaseFromCart, removeFromCart } = useContext(ProductsContext);
  const { quantity, ...product } = item;

  return (
    <li className='cart-item'>
      <div>
        <Image className='image' src={item.imagen} alt={item.titulo} width={120} height={120} />
        <button className='remove' onClick={() => removeFromCart(product.id)}>
          🗑️
        </button>
      </div>
      <p className='cart-title'>{item.titulo}</p>
      <p className='cart-price'>${item.precio}</p>
      <footer>
        <button onClick={() => decreaseFromCart(product.id)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => addToCart(product)}>+</button>
      </footer>
    </li>
  )
}