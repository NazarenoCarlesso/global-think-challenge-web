"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProductsLoading } from "@/components/ProductsLoading"
import { ProductsEmpty } from "@/components/ProductsEmpty"
import { useProductsContext } from "@/hooks/useProductsContext"

export const ProductsList = () => {
  const { filteredResults: products, loading, favorites, setFavorite } = useProductsContext();
  const router = useRouter();

  const handleFavButton = (id: number) => setFavorite(id)

  if (loading) { return (<ProductsLoading />); };

  if (!products || !products.length) { return <ProductsEmpty /> };

  return (
    <div className="products">
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
    </div>
  )
}