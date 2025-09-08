import { PRODUCTS_INITIAL_STATE } from "@/constants";
import { ProductsAction, ProductsState } from "@/interfaces";

export const productsReducer = (state: ProductsState, { type, payload }: ProductsAction) => {
  switch (type) {
    case 'SET_PRODUCTS':
      return {
        ...PRODUCTS_INITIAL_STATE,
        products: payload,
        favorites: payload.filter(p => p.fav).map(p => p.id),
        loading: false
      }
    case 'SET_FAVORITE':
      const index = state.favorites.indexOf(payload)
      return {
        ...state,
        favorites: index === -1
          ? [...state.favorites, payload]
          : state.favorites.filter(fav => fav !== payload)
      }
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, { ...payload, quantity: 1 }]
      }
    case 'INCREASE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === payload ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
    }
    case 'DECREASE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === payload ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== payload)
      }
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        cart: []
      }
    }
    default:
      return state;
  }
};
