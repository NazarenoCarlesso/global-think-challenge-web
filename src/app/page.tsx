// import Image from "next/image";
import { ProductsList, Product } from "@/components/ProductsList";
import articlesMock from "../mocks/articles.json";
// import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main>
        <ProductsList products={articlesMock as Product[]} />
      </main>
      <footer>
      </footer>
    </div>
  );
}
