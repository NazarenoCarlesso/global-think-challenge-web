import Image from "next/image";
import { motion } from "motion/react";
import { CartItem as CartItemProps } from "@/interfaces";
import { useProductsContext } from "@/hooks/useProductsContext";

export const CartItem = (item: CartItemProps) => {
  const { addToCart, decreaseFromCart, removeFromCart } = useProductsContext();
  const { quantity, ...product } = item;

  return (
    <li className="cart-item">
      <div className="cart-item__image">
        {item.imagen ? (
          <Image className="image" src={item.imagen} alt={item.titulo} width={120} height={120} />
        ) : (
          <div className="image image-placeholder" role="img" aria-label={item.titulo} />
        )}
      </div>
      <div className="cart-item__content">
        <div className="cart-item__heading">
          <div>
            <p className="cart-title">{item.titulo}</p>
            <p className="cart-price">${item.precio}</p>
          </div>
          <motion.button
            className="cart-item__remove"
            type="button"
            aria-label={`Quitar ${item.titulo} del carrito`}
            onClick={() => removeFromCart(product.id)}
            whileHover={{ scale: 1.08, rotate: -6 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.14 }}
          >
            🗑️
          </motion.button>
        </div>
        <footer className="cart-item__quantity">
          <motion.button
            type="button"
            aria-label={`Quitar una unidad de ${item.titulo}`}
            onClick={() => decreaseFromCart(product.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.12 }}
          >
            −
          </motion.button>
          <span aria-label={`Cantidad: ${quantity}`}>{quantity}</span>
          <motion.button
            type="button"
            aria-label={`Agregar una unidad de ${item.titulo}`}
            onClick={() => addToCart(product)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.12 }}
          >
            +
          </motion.button>
        </footer>
      </div>
    </li>
  )
}