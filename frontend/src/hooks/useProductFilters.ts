"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getFiltersFromUrl, syncUrlWithFilters } from "@/utils";

export const useProductFilters = () => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilterState] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilterState] = useState<string | undefined>();
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const restoreFilters = () => {
      const { search, category, page } = getFiltersFromUrl();
      setFilterState(search);
      setCategoryFilterState(category);
      setCurrentPage(page);
      setFiltersReady(true);
    };

    restoreFilters();
    window.addEventListener("popstate", restoreFilters);
    return () => window.removeEventListener("popstate", restoreFilters);
  }, []);

  useEffect(() => {
    if (!filtersReady) return;

    syncUrlWithFilters({
      search: filter,
      category: categoryFilter,
      page: currentPage,
    });
  }, [filtersReady, filter, categoryFilter, currentPage, pathname]);

  const nextPage = useCallback((totalPages?: number) => {
    setCurrentPage((prev) => (totalPages !== undefined ? Math.min(prev + 1, Math.max(totalPages, 1)) : prev + 1));
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const changeSearchTerm = useCallback((value: string | undefined) => {
    setCurrentPage(1);
    setFilterState(value);
  }, []);

  const selectCategory = useCallback((category: string | undefined) => {
    setCurrentPage(1);
    setCategoryFilterState(category);
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentPage(1);
    setFilterState(undefined);
    setCategoryFilterState(undefined);
  }, []);

  return {
    currentPage,
    filter,
    categoryFilter,
    filtersReady,
    nextPage,
    prevPage,
    changeSearchTerm,
    selectCategory,
    clearFilters,
  };
};
