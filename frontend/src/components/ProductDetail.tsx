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
    <div className="product-detail">
      <section className="product-detail__media">
        <div className="product-detail__image">
          {product.imagen ? (
            <Image src={product.imagen} alt={product.titulo} width={600} height={600} />
          ) : (
            <div className="product-image-placeholder" role="img" aria-label={product.titulo} />
          )}
        </div>
        <div className="product-description">
          <h2>Descripción</h2>
          <p>{product.descripcion}</p>
        </div>
      </section>
      <aside className="product-summary">
        <div className="product-summary__heading">
          <span className="product-summary__eyebrow">{product.categoria}</span>
          <h1>{product.titulo}</h1>
          <div className="product-summary__rating">
            <span aria-hidden="true">{"★".repeat(Math.round(product.rating))}</span>
            <strong>{product.rating}</strong>
            <span className="product-summary__rating-label">Calificación sobre 5</span>
          </div>
        </div>
        <div className="product-summary__price">
          <span>Precio</span>
          <strong>$ {product.precio}</strong>
        </div>
        <div className="product-benefits">
          <section className="product-benefit">
            <span className="product-benefit__icon" aria-hidden="true">💳</span>
            <div>
              <h2>Medios de pago</h2>
              <p>Consultá las opciones disponibles para tu compra.</p>
              <span className="product-benefit__detail">Ver los medios de pago</span>
            </div>
          </section>
          <section className="product-benefit">
            <span className="product-benefit__icon" aria-hidden="true">📦</span>
            <div>
              <h2>Entrega</h2>
              <p className="product-benefit__highlight">Llega gratis hoy</p>
              <span className="product-benefit__detail">Más formas de entrega</span>
            </div>
          </section>
          <section className="product-benefit">
            <span className="product-benefit__icon" aria-hidden="true">↩</span>
            <div>
              <h2>Devolución gratis</h2>
              <p>Tenés 30 días desde que lo recibís.</p>
              <span className="product-benefit__detail">Conocer más</span>
            </div>
          </section>
        </div>
        <footer className="product-summary__actions">
          <button className='purchase' onClick={() => addToCart(product)}>
            Comprar
          </button>
          <button className='return' onClick={() => router.push('/')}>
            Volver
          </button>
        </footer>
      </aside>
    </div>
  )
}