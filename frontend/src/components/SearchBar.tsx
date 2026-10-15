"use client"
import { useEffect, useState } from "react";
import { useProductsContext } from "@/hooks/useProductsContext";

const SEARCH_DEBOUNCE_MS = 300;

export const SearchBar = () => {
  const {
    categories,
    filter,
    setFilter,
    setCategoryFilter,
    categoryFilter,
    resultsCount,
    error,
  } = useProductsContext();
  const [searchValue, setSearchValue] = useState(filter ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (searchValue === (filter ?? "")) return;

    const timeoutId = window.setTimeout(() => {
      setFilter(searchValue || undefined);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filter, searchValue, setFilter]);

  return (
    <div className="filters">
      {!error && (
        <div className="category-filters" role="group" aria-label="Filtrar por categoría">
          <button
            className={`chip${!categoryFilter ? " chip--active" : ""}`}
            type="button"
            aria-pressed={!categoryFilter}
            onClick={() => setCategoryFilter(undefined)}
          >
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`chip${categoryFilter === category ? " chip--active" : ""}`}
              type="button"
              aria-pressed={categoryFilter === category}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      <div className="search-controls">
        <p aria-live="polite">{resultsCount} productos</p>
        <label className="search">
          <span aria-hidden="true">🔎</span>
          <input
            type="search"
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            value={searchValue}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  )
}