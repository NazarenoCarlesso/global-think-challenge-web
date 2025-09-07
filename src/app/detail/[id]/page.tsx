"use client"
import { ProductDetail } from "@/components";
import styles from "../../page.module.css";
import { Header } from "@/components";
import React from "react";

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <ProductDetail id={id} />
      </main>
    </div>
  )
}