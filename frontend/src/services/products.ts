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

const getApiUrl = () => {
  if (!API_URL) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL en frontend/.env.local");
  }

  return API_URL.replace(/\/+$/, "");
};

export const getCategories = async () => {
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