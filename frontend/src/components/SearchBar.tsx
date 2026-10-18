"use client"
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useProductsContext } from "@/hooks/useProductsContext";

const SEARCH_DEBOUNCE_MS = 300;

export const SearchBar = () => {
  const {
    categories,
    filter,
    changeSearchTerm,
    selectCategory,
    categoryFilter,
    resultsCount,
    error,
  } = useProductsContext();
  const [searchValue, setSearchValue] = useState(filter ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setSearchValue(filter ?? "");
  }, [filter]);

  useEffect(() => {
    if (searchValue === (filter ?? "")) return;

    const timeoutId = window.setTimeout(() => {
      changeSearchTerm(searchValue || undefined);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filter, searchValue, changeSearchTerm]);

  return (
    <div className="filters">
      {!error && (
        <motion.div
          className="category-filters"
          role="group"
          aria-label="Filtrar por categoría"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.035 } },
          }}
        >
          <motion.button
            className={`chip${!categoryFilter ? " chip--active" : ""}`}
            type="button"
            aria-pressed={!categoryFilter}
            onClick={() => selectCategory(undefined)}
            style={{ zIndex: categories.length + 1 }}
            whileTap={{ scale: 0.96 }}
            variants={{
              hidden: { opacity: 0, x: -12, scale: 0.97 },
              visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.24, ease: "easeOut" } },
            }}
          >
            {!categoryFilter && (
              <motion.span
                className="category-chip__indicator"
                layoutId="active-category"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="category-chip__label">Todas</span>
          </motion.button>
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`chip${categoryFilter === category ? " chip--active" : ""}`}
              type="button"
              aria-pressed={categoryFilter === category}
              onClick={() => selectCategory(category)}
              variants={{
                hidden: { opacity: 0, x: -12, scale: 0.97 },
                visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.24, ease: "easeOut" } },
              }}
              style={{ zIndex: categories.length - index }}
              whileTap={{ scale: 0.96 }}
            >
              {categoryFilter === category && (
                <motion.span
                  className="category-chip__indicator"
                  layoutId="active-category"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="category-chip__label">{category}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
      <motion.div
        className="search-controls"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.12, ease: "easeOut" }}
      >
        <p aria-live="polite">
          <motion.span
            key={resultsCount}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {resultsCount} productos
          </motion.span>
        </p>
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
      </motion.div>
    </div>
  )
}