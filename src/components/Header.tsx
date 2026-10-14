"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProductsContext } from "@/hooks/useProductsContext";

export const Header = () => {
  const { toggleCart, cart } = useProductsContext();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") {
      setTheme("dark");
    }
  }, []);

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
            onClick={() => {
              setTheme("light");
              document.documentElement.dataset.theme = "light";
            }}
          >
            ☀️
          </button>
          <button
            type="button"
            aria-label="Tema oscuro"
            aria-pressed={theme === "dark"}
            onClick={() => {
              setTheme("dark");
              document.documentElement.dataset.theme = "dark";
            }}
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