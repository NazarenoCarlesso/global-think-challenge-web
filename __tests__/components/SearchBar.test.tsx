import { fireEvent, render, screen } from "@testing-library/react";
import { ProductsContext } from "@/context/ProductsContext";
import { ProductContextType } from "@/interfaces";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  it("filters by the selected category and provides an all-categories option", () => {
    const setCategoryFilter = jest.fn();
    const context: ProductContextType = {
      products: [
        {
          id: 1,
          titulo: "Galaxy S23",
          descripcion: "Teléfono",
          precio: 650,
          imagen: "",
          fav: false,
          rating: 5,
          categoria: "Electrónica",
        },
        {
          id: 2,
          titulo: "Auriculares",
          descripcion: "Audio",
          precio: 100,
          imagen: "",
          fav: false,
          rating: 4,
          categoria: "Accesorios",
        },
      ],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      setProducts: jest.fn(),
      setFavorite: jest.fn(),
      setFilter: jest.fn(),
      setCategoryFilter,
      categoryFilter: undefined,
      resultsCount: 2,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    render(
      <ProductsContext.Provider value={context}>
        <SearchBar />
      </ProductsContext.Provider>
    );

    expect(screen.getByText("2 productos")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Buscar productos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Electrónica" }));
    expect(setCategoryFilter).toHaveBeenCalledWith("Electrónica");

    fireEvent.click(screen.getByRole("button", { name: "Todas" }));
    expect(setCategoryFilter).toHaveBeenCalledWith(undefined);
  });
});
