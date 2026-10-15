"use client"
import { motion } from "motion/react";

export const ProductsEmpty = () => {
  return (
    <motion.section
      className="products empty-state"
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="21" cy="21" r="12" />
          <path d="m30 30 9 9M16.5 21h9M21 16.5v9" />
        </svg>
      </div>
      <span className="empty-state__eyebrow">0 resultados</span>
      <h2>No se encontraron productos</h2>
      <p>
        No hay productos que coincidan con tu búsqueda o los filtros seleccionados.
      </p>
      <p className="empty-state__hint">
        Probá con otro término o seleccioná una categoría diferente.
      </p>
    </motion.section>
  );
};