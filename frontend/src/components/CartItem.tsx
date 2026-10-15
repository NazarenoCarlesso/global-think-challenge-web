import Image from "next/image";
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
          <button
            className="cart-item__remove"
            type="button"
            aria-label={`Quitar ${item.titulo} del carrito`}
            onClick={() => removeFromCart(product.id)}
          >
            🗑️
          </button>
        </div>
        <footer className="cart-item__quantity">
          <button type="button" aria-label={`Quitar una unidad de ${item.titulo}`} onClick={() => decreaseFromCart(product.id)}>
            −
          </button>
          <span aria-label={`Cantidad: ${quantity}`}>{quantity}</span>
          <button type="button" aria-label={`Agregar una unidad de ${item.titulo}`} onClick={() => addToCart(product)}>
            +
          </button>
        </footer>
      </div>
    </li>
  )
}