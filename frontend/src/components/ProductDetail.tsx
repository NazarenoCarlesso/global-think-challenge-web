"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
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
    <motion.div
      className="product-detail"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <motion.section
        className="product-detail__media"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
        }}
      >
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
      </motion.section>
      <motion.aside
        className="product-summary"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
        }}
      >
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
          <motion.button className='purchase' onClick={() => addToCart(product)} whileTap={{ scale: 0.97 }}>
            Comprar
          </motion.button>
          <motion.button className='return' onClick={() => router.push('/')} whileTap={{ scale: 0.97 }}>
            Volver
          </motion.button>
        </footer>
      </motion.aside>
    </motion.div>
  )
}