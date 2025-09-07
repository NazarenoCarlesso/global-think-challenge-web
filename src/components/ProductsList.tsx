"use client"
import Image from "next/image"
import "./ProductsList.css"
import { useContext, useEffect } from "react"
import { ProductsContext } from "@/context/products"
import { getAllProducts } from "@/services/products"
import { useRouter } from "next/navigation"

export const ProductsList = () => {
  const { filteredResults: products, loading, favorites, setProducts, setFavorite } = useContext(ProductsContext);

  const router = useRouter();

  useEffect(() => {
    getAllProducts().then(allProducts => setProducts(allProducts))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFavButton = (id: number) => setFavorite(id)

  return (
    <div className='products'>
      <ul>
        {
          loading
            ? <>
              <li className='animated-bg' />
              <li className='animated-bg' />
              <li className='animated-bg' />
              <li className='animated-bg' />
            </>
            : products.map(product => (
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