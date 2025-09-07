"use client"
import { Cart, ProductDetail, Header } from "@/components";
import styles from "../../page.module.css";
import React from "react";

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <ProductDetail id={id} />
        <Cart />
      </main>
    </div>
  )
}