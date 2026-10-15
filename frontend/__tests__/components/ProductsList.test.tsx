/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductsList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductsContext } from '@/context/ProductsContext';
import { Product, ProductContextType } from '@/interfaces';
import { ProductsList } from '@/components';

// Mock del componente ProductsLoading y ProductsEmpty
// Esto evita que React Testing Library intente renderizar esos componentes de forma real
jest.mock('@/components/ProductsLoading', () => ({
  ProductsLoading: () => <div>Cargando productos...</div>,
}));

jest.mock('@/components/ProductsEmpty', () => ({
  ProductsEmpty: () => <div>No hay productos para mostrar.</div>,
}));

// Mock del hook useRouter de Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock del componente Image de Next.js para evitar errores de renderizado
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock de productos para los tests
const mockProducts: Product[] = [
  {
    id: 1,
    titulo: 'Producto 1',
    descripcion: 'Descripción 1',
    precio: 100,
    imagen: 'imagen1.jpg',
    fav: false,
    rating: 4,
    categoria: 'categoria1'
  },
  {
    id: 2,
    titulo: 'Producto 2',
    descripcion: 'Descripción 2',
    precio: 200,
    imagen: 'imagen2.jpg',
    fav: true,
    rating: 5,
    categoria: 'categoria2'
  },
];

describe('ProductsList', () => {
  // Test 1: Muestra el componente de carga cuando está cargando
  it('should render the loading component when loading is true', () => {
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: true,
      favorites: [],
      setFavorite: jest.fn(),
      // ... otras propiedades del contexto
      setProducts: jest.fn(),
      filter: undefined,
      hasLoadedProducts: false,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      setPage: jest.fn(),
      error: null,
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn()
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
  });

  // Test 2: Muestra el componente de "vacío" cuando no hay productos
  it('should render the empty component when there are no products', () => {
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      setFavorite: jest.fn(),
      // ... otras propiedades
      setProducts: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      setPage: jest.fn(),
      error: null,
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument();
  });

  it("should show an error when products cannot be loaded", () => {
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      setProducts: jest.fn(),
      setFavorite: jest.fn(),
      filter: undefined,
      hasLoadedProducts: false,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      setPage: jest.fn(),
      error: "Fallo de red",
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("No se pudieron cargar los productos: Fallo de red");
    expect(screen.queryByText("Cargando productos...")).not.toBeInTheDocument();
  });

  // Test 3: Renderiza la lista de productos correctamente
  it('should render the list of products correctly', () => {
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: mockProducts,
      loading: false,
      favorites: [1], // Simula un producto favorito
      setFavorite: jest.fn(),
      // ... otras propiedades
      setProducts: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: mockProducts.length,
      setPage: jest.fn(),
      error: null,
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    // Verifica que los títulos de los productos se rendericen
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();

    const favoriteButton = screen.getByRole("button", { name: "Quitar Producto 1 de favoritos" });
    const notFavoriteButton = screen.getByRole("button", { name: "Agregar Producto 2 a favoritos" });

    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
    expect(favoriteButton.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    expect(notFavoriteButton).toHaveAttribute("aria-pressed", "false");
    expect(notFavoriteButton.querySelector("svg")).toHaveAttribute("fill", "none");
  });

  // Test 4: Simula el clic en el título de un producto
  it('should call router.push when a product title is clicked', () => {
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: mockProducts,
      loading: false,
      favorites: [],
      setFavorite: jest.fn(),
      // ... otras propiedades
      setProducts: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: mockProducts.length,
      setPage: jest.fn(),
      error: null,
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    const productTitle = screen.getByText('Producto 1');
    fireEvent.click(productTitle);

    expect(mockPush).toHaveBeenCalledWith('/detail/1');
  });

  it("should request the previous page when the previous button is clicked", () => {
    const setPage = jest.fn();
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: mockProducts,
      loading: false,
      favorites: [],
      setProducts: jest.fn(),
      setFavorite: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 2,
      totalPages: 3,
      totalProducts: 20,
      setPage,
      error: null,
      resultsCount: 20,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

    expect(setPage).toHaveBeenCalledWith(1);
  });

  // Test 5: Simula el clic en el botón de favoritos
  it('should call setFavorite with the correct product ID when favorite button is clicked', () => {
    const mockSetFavorite = jest.fn();
    const mockContext: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: mockProducts,
      loading: false,
      favorites: [],
      setFavorite: mockSetFavorite,
      // ... otras propiedades
      setProducts: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: mockProducts.length,
      setPage: jest.fn(),
      error: null,
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={mockContext}>
        <ProductsList />
      </ProductsContext.Provider>
    );

    const favButton = screen.getByRole("button", { name: "Agregar Producto 1 a favoritos" });
    fireEvent.click(favButton);

    expect(mockSetFavorite).toHaveBeenCalledWith(1);
  });
});