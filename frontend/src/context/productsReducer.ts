import { ProductsAction, ProductsState } from "@/interfaces";

export const productsReducer = (state: ProductsState, action: ProductsAction) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: payload
      }
    case 'RESTORE_PERSISTED_STATE':
      return {
        ...state,
        favorites: payload.favorites,
        cart: payload.cart
      }
    case 'SET_PRODUCTS': {
      const initializeFavorites = action.initializeFavorites ?? state.products.length === 0;
      return {
        ...state,
        products: payload,
        favorites: initializeFavorites
          ? payload.filter(p => p.fav).map(p => p.id)
          : state.favorites,
        loading: false
      }
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
