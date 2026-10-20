"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { ProductsLoading } from "@/components/ProductsLoading"
import { ProductsEmpty } from "@/components/ProductsEmpty"
import { useProductsContext } from "@/hooks/useProductsContext"

export const ProductsList = () => {
  const {
    filteredResults: products,
    loading,
    hasLoadedProducts,
    favorites,
    toggleFavorite,
    clearFilters,
    currentPage,
    totalPages,
    error,
    nextPage,
    prevPage,
  } = useProductsContext();
  const router = useRouter();
  const hasPlayedInitialListAnimation = useRef(false);
  const shouldAnimateInitialList = hasLoadedProducts && !hasPlayedInitialListAnimation.current;

  const handleFavButton = (id: number) => toggleFavorite(id)

  useEffect(() => {
    if (hasLoadedProducts) hasPlayedInitialListAnimation.current = true;
  }, [hasLoadedProducts]);

  if (loading && !hasLoadedProducts) { return (<ProductsLoading />); };

  if (error) {
    return (
      <section className="products" role="alert">
        <p>No se pudieron cargar los productos: {error}</p>
      </section>
    );
  }

  return (
    <div className="products" aria-busy={loading}>
      {!products || !products.length ? (
        <ProductsEmpty onClear={clearFilters} />
      ) : (
        <>
          <motion.ul
            className="grid"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.045 } },
            }}
            initial={shouldAnimateInitialList ? "hidden" : false}
            animate="visible"
          >
            {
              products.map((product, index) => {
                const isFavorite = favorites.includes(product.id);

                return (
                  <motion.li
                    className="card"
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
                    }}
                  >
                    <div className={`tile tile--${(index % 4) + 1}`}>
                      {product.imagen && (
                        <Image
                          src={product.imagen}
                          alt={product.titulo}
                          width={200}
                          height={200}
                        />
                      )}
                      <span className="tile__tag">{product.categoria}</span>
                    </div>
                    <button
                      className="card__title"
                      type="button"
                      onClick={() => router.push(`/detail/${product.id}`)}
                    >
                      {product.titulo}
                    </button>
                    <p className="card__rating" aria-label={`Calificación ${product.rating} de 5`}>
                      ⭐ {product.rating}
                    </p>
                    <p className="description">
                      {product.descripcion}
                    </p>
                    <div className="card__row">
                      <span className="card__price">
                        ${product.precio}
                      </span>
                      <motion.button
                        onClick={() => handleFavButton(product.id)}
                        className="fav-btn"
                        type="button"
                        aria-label={`${isFavorite ? "Quitar" : "Agregar"} ${product.titulo} ${isFavorite ? "de" : "a"} favoritos`}
                        aria-pressed={isFavorite}
                        whileTap={{ scale: 0.88 }}
                      >
                        <motion.svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          fill={isFavorite ? "currentColor" : "none"}
                          initial={false}
                          animate={isFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                          <path
                            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </motion.li>
                );
              })
            }
          </motion.ul>
          {totalPages > 1 && (
            <nav aria-label="Paginación de productos" className="pagination">
              <motion.button
                className="chip pagination__button"
                type="button"
                onClick={() => prevPage()}
                disabled={currentPage === 1}
                whileTap={{ scale: 0.96 }}
              >
                Anterior
              </motion.button>
              <span className="pagination__status" aria-live="polite">
                Página {currentPage} de {totalPages}
              </span>
              <motion.button
                className="chip pagination__button"
                type="button"
                onClick={() => nextPage()}
                disabled={currentPage === totalPages}
                whileTap={{ scale: 0.96 }}
              >
                Siguiente
              </motion.button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}