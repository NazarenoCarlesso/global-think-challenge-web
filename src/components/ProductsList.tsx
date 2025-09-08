"use client"
import Image from "next/image"
import "./ProductsList.css"
import { useContext } from "react"
import { ProductsContext } from "@/context/ProductsContext"
import { useRouter } from "next/navigation"
import { ProductsLoading } from "./ProductsLoading"
import { ProductsEmpty } from "./ProductsEmpty"

export const ProductsList = () => {
  const { filteredResults: products, loading, favorites, setFavorite } = useContext(ProductsContext);
  const router = useRouter();

  const handleFavButton = (id: number) => setFavorite(id)

  if (loading) { return (<ProductsLoading />); };

  if (!products || products.length === 0) { return <ProductsEmpty /> };

  return (
    <div className='products'>
      <ul>
        {
          products.map(product => (
            <li key={product.id}>
              <Image
                src={product.imagen}
                alt={product.titulo}
                width={200}
                height={200}
              />
              <div className='product-card'>
                <div className='product-title'>
                  <div>
                    <h4 onClick={() => router.push(`/detail/${product.id}`)}>
                      {product.titulo}
                    </h4>
                    <p>{product.categoria}</p>
                  </div>
                  <h3>⭐{product.rating}</h3>
                </div>
                <p className='description'>
                  {product.descripcion}
                </p>
                <h3 className='price'>
                  ${product.precio}
                </h3>
                <button
                  onClick={() => handleFavButton(product.id)}
                  className={`favorite ${favorites.includes(product.id) ? 'fav' : undefined}`}>
                  {favorites.includes(product.id) ? '🤍' : '🧡'}
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}