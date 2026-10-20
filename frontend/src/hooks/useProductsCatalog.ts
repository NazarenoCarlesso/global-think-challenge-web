"use client";

import { useEffect, useRef, useState } from "react";
import { UseProductsCatalogProps } from "@/interfaces";
import { getCategories, getProducts } from "@/services/products";
import { PRODUCTS_PER_PAGE } from "@/constants";

export const useProductsCatalog = ({
  currentPage,
  filter,
  categoryFilter,
  persistenceReady,
  filtersReady,
  hasStoredFavorites,
  actions,
  productsPerPage = PRODUCTS_PER_PAGE,
  onProductsLoaded,
}: UseProductsCatalogProps) => {
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const onProductsLoadedRef = useRef(onProductsLoaded);
  onProductsLoadedRef.current = onProductsLoaded;

  useEffect(() => {
    let active = true;

    getCategories()
      .then((availableCategories) => {
        if (active) setCategories(availableCategories);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las categorías.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!persistenceReady || !filtersReady) return;

    let active = true;
    actions.setLoading(true);
    setError(null);

    getProducts(currentPage, productsPerPage, filter?.trim(), categoryFilter)
      .then((result) => {
        if (!active) return;
        actions.setProducts(result.data, !hasStoredFavorites);
        setTotalPages(result.pages);
        setTotalProducts(result.items);
        onProductsLoadedRef.current?.();
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los productos.");
        actions.setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    currentPage,
    filter,
    categoryFilter,
    persistenceReady,
    filtersReady,
    hasStoredFavorites,
    actions,
    productsPerPage,
  ]);

  return {
    categories,
    totalPages,
    totalProducts,
    error,
  };
};

