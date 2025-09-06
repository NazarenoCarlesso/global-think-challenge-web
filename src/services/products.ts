// import axios from "axios"
import productsMock from "../mocks/articles.json"
import { Product } from "@/interfaces";

export const getAllProducts = async () => {
  // return await axios.get('/products').then(res => res.data);
  // console.log('Cargando...')
  await new Promise(resolve => setTimeout(resolve, 3000));
  // console.log('Listo!')
  return productsMock as Product[];
}