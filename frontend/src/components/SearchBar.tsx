"use client"
import { useProductsContext } from "@/hooks/useProductsContext";

export const SearchBar = () => {
  const {
    categories,
    setFilter,
    setCategoryFilter,
    categoryFilter,
    resultsCount,
    loading,
    error,
  } = useProductsContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  };

  return (
    <div className="filters">
      {!loading && !error && (
        <>
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
          <div className="search-controls">
            <p aria-live="polite">{resultsCount} productos</p>
            <label className="search">
              <span aria-hidden="true">🔎</span>
              <input
                type="search"
                aria-label="Buscar productos"
                placeholder="Buscar productos..."
                onChange={handleChange}
              />
            </label>
          </div>
        </>
      )}
    </div>
  )
}