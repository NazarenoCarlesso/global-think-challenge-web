import Image from "next/image"
import { Product } from "@/interfaces"
import "./ProductsList.css"

interface ProductsListProps {
  products: Product[]
}

export const ProductsList = ({ products }: ProductsListProps) => {
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
              <div>
                <h3>{product.titulo}</h3>
                <h3>{product.precio}</h3>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}