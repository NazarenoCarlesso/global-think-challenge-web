import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProductsProvider } from "@/context/ProductsContext";
import { ProductsList } from "@/components/ProductsList";
import { SearchBar } from "@/components/SearchBar";
import { Product } from "@/interfaces";
import { getCategories, getProducts } from "@/services/products";

jest.mock("@/services/products", () => ({
  getCategories: jest.fn(),
  getProducts: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const categories = ["Accesorios", "Computadoras", "Electrónica"];
const products: Product[] = Array.from({ length: 25 }, (_, index) => {
  const id = index + 1;
  const featuredTitles: Record<number, { titulo: string; categoria: string }> = {
    1: { titulo: "Apple iPhone", categoria: "Electrónica" },
    2: { titulo: "Apple MacBook", categoria: "Computadoras" },
    3: { titulo: "Sony Camera", categoria: "Electrónica" },
    4: { titulo: "Apple Watch", categoria: "Accesorios" },
    5: { titulo: "Apple Headphones", categoria: "Accesorios" },
  };
  const featured = featuredTitles[id];

  return {
    id,
    titulo: featured?.titulo ?? `Producto ${id}`,
    descripcion: `Descripción ${id}`,
    precio: id * 10,
    imagen: "",
    fav: false,
    rating: 4,
    categoria: featured?.categoria ?? categories[index % categories.length],
  };
});

const mockGetProducts = jest.mocked(getProducts);
const mockGetCategories = jest.mocked(getCategories);

const mockPaginatedApi = (
  page: number,
  perPage: number,
  search?: string,
  category?: string
) => {
  const filtered = products.filter((product) => {
    const matchesSearch = !search || product.titulo.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || product.categoria === category;
    return matchesSearch && matchesCategory;
  });
  const pages = Math.ceil(filtered.length / perPage);
  const data = filtered.slice((page - 1) * perPage, page * perPage);

  return Promise.resolve({
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
    last: pages,
    pages,
    items: filtered.length,
    data,
  });
};

const renderStore = async () => {
  render(
    <ProductsProvider>
      <SearchBar />
      <ProductsList />
    </ProductsProvider>
  );

  await screen.findByRole("button", { name: "Todas" });
};

describe("Products pagination and filters", () => {
  beforeEach(() => {
    mockGetCategories.mockResolvedValue(categories);
    mockGetProducts.mockImplementation(mockGetProductsForTest);
  });

  it("shows the total result count and total pages, not just the current page size", async () => {
    await renderStore();

    expect(screen.getByText("25 productos")).toBeInTheDocument();
    expect(screen.getByRole("list").children).toHaveLength(8);
    expect(screen.getByText("Página 1 de 4")).toBeInTheDocument();
    expect(mockGetProducts).toHaveBeenLastCalledWith(1, 8, undefined, undefined);
  });

  it("loads and displays the selected page", async () => {
    await renderStore();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(await screen.findByRole("button", { name: "Producto 9" })).toBeInTheDocument();
    expect(screen.getByText("Página 2 de 4")).toBeInTheDocument();
    expect(screen.getByText("25 productos")).toBeInTheDocument();
    expect(mockGetProducts).toHaveBeenLastCalledWith(2, 8, undefined, undefined);
  });

  it("filters by category without removing the other category buttons", async () => {
    await renderStore();

    fireEvent.click(screen.getByRole("button", { name: "Accesorios" }));

    expect(await screen.findByRole("button", { name: "Apple Watch" })).toBeInTheDocument();
    expect(screen.getByText("9 productos")).toBeInTheDocument();
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    expect(mockGetProducts).toHaveBeenLastCalledWith(1, 8, undefined, "Accesorios");

    for (const category of categories) {
      expect(screen.getByRole("button", { name: category })).toBeInTheDocument();
    }
  });

  it("searches product titles and displays the matching total", async () => {
    await renderStore();

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "Sony" },
    });

    expect(await screen.findByRole("button", { name: "Sony Camera" })).toBeInTheDocument();
    expect(screen.getByText("1 productos")).toBeInTheDocument();
    expect(mockGetProducts).toHaveBeenLastCalledWith(1, 8, "Sony", undefined);
    expect(screen.queryByRole("button", { name: "Producto 9" })).not.toBeInTheDocument();
  });

  it("combines search and category filters in the API request", async () => {
    await renderStore();

    fireEvent.click(screen.getByRole("button", { name: "Accesorios" }));
    await screen.findByRole("button", { name: "Apple Watch" });
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "Apple" },
    });

    expect(await screen.findByRole("button", { name: "Apple Headphones" })).toBeInTheDocument();
    expect(screen.getByText("2 productos")).toBeInTheDocument();
    expect(mockGetProducts).toHaveBeenLastCalledWith(1, 8, "Apple", "Accesorios");
    expect(screen.queryByRole("button", { name: "Apple MacBook" })).not.toBeInTheDocument();
  });

  it("returns to page one when a filter changes", async () => {
    await renderStore();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await screen.findByRole("button", { name: "Producto 9" });
    fireEvent.click(screen.getByRole("button", { name: "Electrónica" }));

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenLastCalledWith(1, 8, undefined, "Electrónica");
    });
    expect(await screen.findByText("Página 1 de 2")).toBeInTheDocument();
  });
});

function mockGetProductsForTest(
  page: number,
  perPage: number,
  search?: string,
  category?: string
) {
  return mockPaginatedApi(page, perPage, search, category);
}
