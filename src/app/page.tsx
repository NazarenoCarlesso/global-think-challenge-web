"use client"
import { Cart, Header, ProductsList, SearchBar, Title } from "@/components";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <Title />
        <SearchBar />
        <ProductsList />
        <Cart />
      </main>
    </div>
  );
}
