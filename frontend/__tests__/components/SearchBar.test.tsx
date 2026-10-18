import { act, fireEvent, render, screen } from "@testing-library/react";
import { ProductsContext } from "@/context/ProductsContext";
import { ProductContextType } from "@/interfaces";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  it("filters by the selected category and provides an all-categories option", () => {
    const selectCategory = jest.fn();
    const context: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      toggleFavorite: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      changeSearchTerm: jest.fn(),
      selectCategory,
      clearFilters: jest.fn(),
      categoryFilter: undefined,
      categories: ["Accesorios", "Computadoras", "Electrónica"],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 2,
      goToPage: jest.fn(),
      error: null,
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
    expect(screen.getByRole("button", { name: "Accesorios" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Computadoras" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Electrónica" }));
    expect(selectCategory).toHaveBeenCalledWith("Electrónica");

    fireEvent.click(screen.getByRole("button", { name: "Todas" }));
    expect(selectCategory).toHaveBeenCalledWith(undefined);
  });

  it("applies the latest search value only after the debounce interval", () => {
    jest.useFakeTimers();
    const changeSearchTerm = jest.fn();
    const context: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      toggleFavorite: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      changeSearchTerm,
      selectCategory: jest.fn(),
      clearFilters: jest.fn(),
      categoryFilter: undefined,
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      goToPage: jest.fn(),
      error: null,
      resultsCount: 0,
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      clearCart: jest.fn(),
      toggleCart: jest.fn(),
      isCartOpen: false,
      removeFromCart: jest.fn(),
    };

    try {
      render(
        <ProductsContext.Provider value={context}>
          <SearchBar />
        </ProductsContext.Provider>
      );
      const input = screen.getByRole("searchbox", { name: "Buscar productos" });

      fireEvent.change(input, { target: { value: "Sony" } });
      expect(input).toHaveValue("Sony");

      act(() => jest.advanceTimersByTime(200));
      fireEvent.change(input, { target: { value: "Sony Camera" } });
      act(() => jest.advanceTimersByTime(299));
      expect(changeSearchTerm).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(1));
      expect(changeSearchTerm).toHaveBeenCalledTimes(1);
      expect(changeSearchTerm).toHaveBeenCalledWith("Sony Camera");
    } finally {
      jest.useRealTimers();
    }
  });
});
