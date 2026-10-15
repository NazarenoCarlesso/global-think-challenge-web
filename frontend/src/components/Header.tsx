"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProductsContext } from "@/hooks/useProductsContext";

const THEME_STORAGE_KEY = "global-think-theme";

export const Header = () => {
  const { toggleCart, cart } = useProductsContext();
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

  return (
    <header className="header">
      <Link className="logo" href="/">
        Global Think <span>Store</span>
      </Link>
      <div className="header__actions">
        <div className="theme-toggle" role="group" aria-label="Seleccionar tema">
          <button
            type="button"
            aria-label="Tema claro"
            aria-pressed={theme === "light"}
            onClick={() => selectTheme("light")}
          >
            ☀️
          </button>
          <button
            type="button"
            aria-label="Tema oscuro"
            aria-pressed={theme === "dark"}
            onClick={() => selectTheme("dark")}
          >
            🌙
          </button>
        </div>
        <button
          className="cart-btn"
          type="button"
          aria-label={`Abrir carrito${cart.length ? ` (${cart.length} productos)` : ""}`}
          onClick={() => toggleCart()}
        >
          🛒
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </button>
      </div>
    </header>
  )
}