export interface Product {
  id: number
  titulo: string
  descripcion: string
  precio: number
  imagen: string
  fav: boolean
  rating: number
  categoria: string
}

export interface CartItem extends Product {
  quantity: number
}