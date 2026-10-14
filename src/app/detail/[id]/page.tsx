"use client"
import { Cart, ProductDetail, Header } from "@/components";
import React from "react";

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className="page">
      <main className="store-main">
        <Header />
        <ProductDetail id={id} />
        <Cart />
      </main>
    </div>
  )
}