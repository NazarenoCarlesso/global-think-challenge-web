import { ProductsList } from "@/components/ProductsList";
import { Product } from "@/interfaces";
import articlesMock from "../mocks/articles.json";
import { Header, SearchBar, Title } from "@/components";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <Title />
        <SearchBar />
        <ProductsList products={articlesMock as Product[]} />
      </main>
    </div>
  );
}
