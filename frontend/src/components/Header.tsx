"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useProductsContext } from "@/hooks/useProductsContext";

const THEME_STORAGE_KEY = "global-think-theme";
const COMPACT_HEADER_SCROLL_THRESHOLD = 180;

interface CartButtonProps {
  cartCount: number;
  onClick: () => void;
}

const CartButton = ({ cartCount, onClick }: CartButtonProps) => (
  <motion.button
    className="cart-btn"
    type="button"
    aria-label={`Abrir carrito${cartCount ? ` (${cartCount} productos)` : ""}`}
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.92 }}
    transition={{ duration: 0.16 }}
  >
    🛒
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.span
          key={cartCount}
          className="cart-count"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          {cartCount}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.button>
);

export const Header = () => {
  const { toggleCart, cart, clearFilters } = useProductsContext();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isCompactHeaderVisible, setIsCompactHeaderVisible] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  useEffect(() => {
    const updateCompactHeaderVisibility = () => {
      setIsCompactHeaderVisible(window.scrollY > COMPACT_HEADER_SCROLL_THRESHOLD);
    };

    updateCompactHeaderVisibility();
    window.addEventListener("scroll", updateCompactHeaderVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateCompactHeaderVisibility);
  }, []);

  const selectTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  return (
    <>
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Link className="logo" href="/" onClick={clearFilters}>
          Global Think <span>Store</span>
        </Link>
        <div className="header__actions">
          <div className="theme-toggle" role="group" aria-label="Seleccionar tema">
            <motion.button
              type="button"
              aria-label="Tema claro"
              aria-pressed={theme === "light"}
              onClick={() => selectTheme("light")}
              animate={{ scale: theme === "light" ? 1.04 : 1 }}
              whileTap={{ scale: 0.9, rotate: -12 }}
              transition={{ duration: 0.2 }}
            >
              ☀️
            </motion.button>
            <motion.button
              type="button"
              aria-label="Tema oscuro"
              aria-pressed={theme === "dark"}
              onClick={() => selectTheme("dark")}
              animate={{ scale: theme === "dark" ? 1.04 : 1 }}
              whileTap={{ scale: 0.9, rotate: 12 }}
              transition={{ duration: 0.2 }}
            >
              🌙
            </motion.button>
          </div>
          <CartButton cartCount={cart.length} onClick={toggleCart} />
        </div>
      </motion.header>
      <AnimatePresence>
        {isCompactHeaderVisible && (
          <motion.div
            className="header header--compact"
            role="group"
            aria-label="Navegación compacta"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link className="logo" href="/" onClick={clearFilters}>
              Global Think <span>Store</span>
            </Link>
            <CartButton cartCount={cart.length} onClick={toggleCart} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}