"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import "./ProductDetail.css";
import { useRouter } from "next/navigation";
import { useProductsContext } from "@/hooks/useProductsContext";
import { getProductById } from "@/services/products";
import { Product } from "@/interfaces";

interface ProductDetailProps { id: string }

export const ProductDetail = ({ id }: ProductDetailProps) => {
  const { addToCart } = useProductsContext();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setLoading(true);
    setError(null);

    getProductById(id)
      .then((loadedProduct) => {
        if (active) setProduct(loadedProduct);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el producto.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <section className="product-detail-state" role="status">Cargando producto...</section>;
  }

  if (error) {
    return (
      <section className="product-detail-state" role="alert">
        <p>No se pudo cargar el producto: {error}</p>
        <button className="return" type="button" onClick={() => router.push("/")}>Volver</button>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-detail-state" role="status">
        <p>No se encontró el producto solicitado.</p>
        <button className="return" type="button" onClick={() => router.push("/")}>Volver</button>
      </section>
    );
  }

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