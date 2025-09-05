import Image from "next/image"
import "./ProductsList.css"

interface ProductsListProps {
  products: Product[]
}

export interface Product {
  id: number
  titulo: string
  descripcion: string
  precio: number
  imagen: string
  fav: boolean
  rating: number
  categoria: string
}

export const ProductsList = ({ products }: ProductsListProps) => {
  return (
    <main className='products'>
      <ul>
        {
          products.map(product => (
            <li key={product.id}>
              <Image src={product.imagen} alt={product.titulo} width={200} height={200} />
              <div>
                <h3>{product.titulo}</h3>
                <h3>{product.precio}</h3>
              </div>
            </li>
          ))
        }
      </ul>
    </main>
  )
}