"use client"
import { Cart, Header, ProductsList, SearchBar, Title } from "@/components";

export default function Home() {
  return (
    <div className="page">
      <main className="store-main">
        <Header />
        <Title />
        <SearchBar />
        <ProductsList />
        <Cart />
      </main>
    </div>
  );
}
