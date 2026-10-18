"use client";

import { useCallback, useEffect, useState } from "react";
import { UseStorePersistenceProps } from "@/interfaces";
import { readPersistedStoreState, writePersistedStoreState } from "@/context/storePersistence";

export const useStorePersistence = ({
  favorites,
  cart,
  actions,
  productsLoaded,
}: UseStorePersistenceProps) => {
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const [hasStoredFavorites, setHasStoredFavorites] = useState(false);

  useEffect(() => {
    try {
      const persistedState = readPersistedStoreState(window.localStorage);
      actions.restorePersistedState({
        favorites: persistedState.favorites,
        cart: persistedState.cart,
      });
      setCartOpen(persistedState.isCartOpen);
      setHasStoredFavorites(persistedState.hasStoredFavorites);
    } catch (loadError) {
      console.error("No se pudo acceder a la persistencia de favoritos y carrito:", loadError);
    } finally {
      setPersistenceReady(true);
    }
  }, [actions]);

  useEffect(() => {
    if (!persistenceReady || !productsLoaded) return;

    try {
      writePersistedStoreState(window.localStorage, {
        favorites,
        cart,
        isCartOpen,
      });
    } catch (saveError) {
      console.error("No se pudo guardar favoritos y carrito:", saveError);
    }
  }, [persistenceReady, productsLoaded, favorites, cart, isCartOpen]);

  const toggleCart = useCallback(() => setCartOpen((prev) => !prev), []);

  return {
    isCartOpen,
    toggleCart,
    persistenceReady,
    hasStoredFavorites,
  };
};

