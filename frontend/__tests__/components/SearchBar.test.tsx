import { act, fireEvent, render, screen } from "@testing-library/react";
import { ProductsContext } from "@/context/ProductsContext";
import { ProductContextType } from "@/interfaces";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  it("filters by the selected category and provides an all-categories option", () => {
    const setCategoryFilter = jest.fn();
    const context: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      setProducts: jest.fn(),
      setFavorite: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter: jest.fn(),
      setCategoryFilter,
      categoryFilter: undefined,
      categories: ["Accesorios", "Computadoras", "Electrónica"],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 2,
      setPage: jest.fn(),
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
    expect(setCategoryFilter).toHaveBeenCalledWith("Electrónica");

    fireEvent.click(screen.getByRole("button", { name: "Todas" }));
    expect(setCategoryFilter).toHaveBeenCalledWith(undefined);
  });

  it("applies the latest search value only after the debounce interval", () => {
    jest.useFakeTimers();
    const setFilter = jest.fn();
    const context: ProductContextType = {
      products: [],
      cart: [],
      filteredResults: [],
      loading: false,
      favorites: [],
      setProducts: jest.fn(),
      setFavorite: jest.fn(),
      filter: undefined,
      hasLoadedProducts: true,
      setFilter,
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
      expect(setFilter).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(1));
      expect(setFilter).toHaveBeenCalledTimes(1);
      expect(setFilter).toHaveBeenCalledWith("Sony Camera");
    } finally {
      jest.useRealTimers();
    }
  });
});
