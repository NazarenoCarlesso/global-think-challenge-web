"use client"
import Image from "next/image";
import "./ProductDetail.css";
import { useRouter } from "next/navigation";
import { useProductsContext } from "@/hooks/useProductsContext";

interface ProductDetailProps { id: string }

export const ProductDetail = ({ id }: ProductDetailProps) => {
  const { products, addToCart } = useProductsContext();

  const router = useRouter()

  const product = products.find(p => String(p.id) === id)

  if (!product) return (<></>)

  return (
    <div className='row product-detail'>
      <div className='column'>
        <Image src={product.imagen} alt={product.titulo} width={400} height={400} />
        <h3>Descripción</h3>
        <p>{product.descripcion}</p>
      </div>
      <div className='box'>
        <h2>{product.titulo}</h2>
        <h5>⭐⭐⭐⭐⭐ {product.rating}</h5>
        <p>Calificación {product.rating} de 5. 177 opiniones</p>
        <p>$ {product.precio}</p>
        <p>Ver los medios de pago</p>
        <p>Llega gratis hoy</p>
        <p>Más formas de entrega</p>
        <p>Devolución gratis</p>
        <p>Tenés 30 días desde que lo recibís</p>
        <p>Conocer más</p>
        <footer>
          <button className='purchase' onClick={() => addToCart(product)}>
            Comprar
          </button>
          <button className='return' onClick={() => router.push('/')}>
            Volver
          </button>
        </footer>
      </div>
    </div>
  )
}