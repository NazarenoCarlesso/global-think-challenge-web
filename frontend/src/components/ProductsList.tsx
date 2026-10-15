"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProductsLoading } from "@/components/ProductsLoading"
import { ProductsEmpty } from "@/components/ProductsEmpty"
import { useProductsContext } from "@/hooks/useProductsContext"

export const ProductsList = () => {
  const {
    filteredResults: products,
    loading,
    hasLoadedProducts,
    favorites,
    setFavorite,
    currentPage,
    totalPages,
    setPage,
    error,
  } = useProductsContext();
  const router = useRouter();

  const handleFavButton = (id: number) => setFavorite(id)

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
        <ProductsEmpty />
      ) : (
        <>
          <ul className="grid">
            {
              products.map((product, index) => (
                <li className="card" key={product.id}>
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
                    <button
                      onClick={() => handleFavButton(product.id)}
                      className="fav-btn"
                      type="button"
                      aria-pressed={favorites.includes(product.id)}
                    >
                      {favorites.includes(product.id) ? "🤍" : "🧡"}
                    </button>
                  </div>
                </li>
              ))
            }
          </ul>
          {totalPages > 1 && (
            <nav aria-label="Paginación de productos" className="pagination">
              <button
                className="chip pagination__button"
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="pagination__status" aria-live="polite">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="chip pagination__button"
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}