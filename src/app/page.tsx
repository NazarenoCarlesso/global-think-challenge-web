import { ProductsList } from "@/components/ProductsList";
import { Header, SearchBar, Title } from "@/components";
import styles from "./page.module.css";
import { ProductsProvider } from "@/context/products";

export default function Home() {
  return (
    <ProductsProvider>
      <div className={styles.page}>
        <main className={styles.main}>
          <Header />
          <Title />
          <SearchBar />
          <ProductsList />
        </main>
      </div>
    </ProductsProvider>
  );
}
