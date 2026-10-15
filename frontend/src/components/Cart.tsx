"use client"
import "./Cart.css";
import { CartItem } from "./CartItem";
import { useProductsContext } from "@/hooks/useProductsContext";

export const Cart = () => {
  const { cart, clearCart, isCartOpen, toggleCart } = useProductsContext();

  return (
    <aside
      className="cart"
      aria-label="Carrito de compras"
      aria-hidden={!isCartOpen}
      style={{ display: isCartOpen ? "flex" : "none" }}
    >
      <header className="cart__header">
        <div>
          <span className="cart__eyebrow">Tu selección</span>
          <h2>Carrito <span>({cart.length})</span></h2>
        </div>
        <button className="cart__close" type="button" aria-label="Cerrar carrito" onClick={toggleCart}>
          ×
        </button>
      </header>
      {cart.length > 0 ? (
        <>
          <ul className="cart__items">
            {cart.map(item => <CartItem key={item.id} {...item} />)}
          </ul>
          <footer className="cart__footer">
            <button className="cart__clear" type="button" onClick={clearCart}>
              Vaciar carrito
            </button>
          </footer>
        </>
      ) : (
        <div className="cart__empty">
          <span aria-hidden="true">🛒</span>
          <h3>Tu carrito está vacío</h3>
          <p>Agregá productos y aparecerán acá.</p>
        </div>
      )}
    </aside>
  )
}