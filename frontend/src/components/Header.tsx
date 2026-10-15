"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useProductsContext } from "@/hooks/useProductsContext";

const THEME_STORAGE_KEY = "global-think-theme";

export const Header = () => {
  const { toggleCart, cart, setFilter, setCategoryFilter, setPage } = useProductsContext();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const selectTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const clearFilters = () => {
    setFilter(undefined);
    setCategoryFilter(undefined);
    setPage(1);
  };

  return (
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
        <motion.button
          className="cart-btn"
          type="button"
          aria-label={`Abrir carrito${cart.length ? ` (${cart.length} productos)` : ""}`}
          onClick={() => toggleCart()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.16 }}
        >
          🛒
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                key={cart.length}
                className="cart-count"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.header>
  )
}