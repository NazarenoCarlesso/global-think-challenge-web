"use client"
import { AnimatePresence, motion } from "motion/react";
import "./Cart.css";
import { CartItem } from "./CartItem";
import { useProductsContext } from "@/hooks/useProductsContext";

export const Cart = () => {
  const { cart, clearCart, isCartOpen, toggleCart } = useProductsContext();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.aside
          className="cart"
          aria-label="Carrito de compras"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <header className="cart__header">
            <div>
              <span className="cart__eyebrow">Tu selección</span>
              <h2>Carrito <span>({cart.length})</span></h2>
            </div>
            <motion.button
              className="cart__close"
              type="button"
              aria-label="Cerrar carrito"
              onClick={toggleCart}
              whileHover={{ scale: 1.06, rotate: 90 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.16 }}
            >
              ×
            </motion.button>
          </header>
          {cart.length > 0 ? (
            <>
              <ul className="cart__items">
                {cart.map(item => <CartItem key={item.id} {...item} />)}
              </ul>
              <footer className="cart__footer">
                <motion.button
                  className="cart__clear"
                  type="button"
                  onClick={clearCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                >
                  Vaciar carrito
                </motion.button>
              </footer>
            </>
          ) : (
            <div className="cart__empty">
              <span aria-hidden="true">🛒</span>
              <h3>Tu carrito está vacío</h3>
              <p>Agregá productos y aparecerán acá.</p>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}