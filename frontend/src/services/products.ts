import axios from "axios";
import { Product } from "@/interfaces";

export interface PaginatedProducts {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Array<Omit<Product, "id"> & { id: number | string }>;
}

export interface ProductCategory {
  id: number | string;
  nombre: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PRODUCTS_DATA_URL = process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
type ProductsDatabase = {
  products: Array<Omit<Product, "id"> & { id: number | string }>;
  categories?: ProductCategory[] | string[];
};

let productsDatabasePromise: Promise<ProductsDatabase> | null = null;

const getApiUrl = () => {
  if (!API_URL) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL en frontend/.env.local");
  }

  return API_URL.replace(/\/+$/, "");
};

const normalizeProducts = (products: ProductsDatabase["products"]): Product[] => (
  products.map((product) => ({
    ...product,
    id: Number(product.id),
  }))
);

const normalizeProduct = (product: ProductsDatabase["products"][number]): Product => ({
  ...product,
  id: Number(product.id),
});

const getProductsDatabase = async (dataUrl: string) => {
  if (!productsDatabasePromise) {
    productsDatabasePromise = axios
      .get<ProductsDatabase>(dataUrl)
      .then(({ data }) => {
        if (!data || !Array.isArray(data.products)) {
          throw new Error("El JSON remoto no contiene una colección válida de productos.");
        }
        return data;
      })
      .catch((error: unknown) => {
        productsDatabasePromise = null;
        throw error;
      });
  }

  return productsDatabasePromise;
};

export const getCategories = async () => {
  if (PRODUCTS_DATA_URL) {
    const database = await getProductsDatabase(PRODUCTS_DATA_URL);
    const categories = database.categories?.map((category) => (
      typeof category === "string" ? category : category.nombre
    )) ?? normalizeProducts(database.products).map((product) => product.categoria);
    return [...new Set(categories)].sort((a, b) => a.localeCompare(b, "es"));
  }

  const response = await axios.get<ProductCategory[]>(`${getApiUrl()}/categories`);
  return response.data
    .map((category) => category.nombre)
    .sort((a, b) => a.localeCompare(b, "es"));
};

export const getProducts = async (
  page: number,
  perPage: number,
  search?: string,
  category?: string
) => {
  if (PRODUCTS_DATA_URL) {
    const database = await getProductsDatabase(PRODUCTS_DATA_URL);
    const filteredProducts = normalizeProducts(database.products).filter((product) => {
      const matchesSearch = !search
        || product.titulo.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es"));
      const matchesCategory = !category || product.categoria === category;
      return matchesSearch && matchesCategory;
    });
    const pages = Math.ceil(filteredProducts.length / perPage);
    const normalizedPage = Math.max(1, Math.min(page, pages || 1));
    const start = (normalizedPage - 1) * perPage;

    return {
      first: pages ? 1 : null,
      prev: normalizedPage > 1 ? normalizedPage - 1 : null,
      next: normalizedPage < pages ? normalizedPage + 1 : null,
      last: pages,
      pages,
      items: filteredProducts.length,
      data: filteredProducts.slice(start, start + perPage),
    };
  }

  const response = await axios.get<PaginatedProducts>(`${getApiUrl()}/products`, {
    params: {
      _page: page,
      _per_page: perPage,
      ...(search ? { "titulo:contains": search } : {}),
      ...(category ? { categoria: category } : {}),
    },
  });

  return {
    ...response.data,
    data: response.data.data.map((product) => ({
      ...product,
      id: Number(product.id),
    })),
  };
}

export const getProductById = async (id: string | number): Promise<Product | null> => {
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) return null;

  if (PRODUCTS_DATA_URL) {
    const database = await getProductsDatabase(PRODUCTS_DATA_URL);
    const product = database.products.find((item) => Number(item.id) === productId);
    return product ? normalizeProduct(product) : null;
  }

  try {
    const response = await axios.get<ProductsDatabase["products"][number]>(
      `${getApiUrl()}/products/${productId}`
    );
    return normalizeProduct(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
};