import type { Product } from "@/interfaces";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const remoteProducts: Product[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  titulo: index === 8 ? "Sony Cámara" : `Producto ${index + 1}`,
  descripcion: `Descripción ${index + 1}`,
  precio: (index + 1) * 10,
  imagen: "",
  fav: false,
  rating: 4,
  categoria: index % 2 === 0 ? "Electrónica" : "Accesorios",
}));

describe("products service with a static JSON source", () => {
  const originalDataUrl = process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;

  afterEach(() => {
    if (originalDataUrl === undefined) {
      delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    } else {
      process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = originalDataUrl;
    }
    jest.resetModules();
  });

  it("loads the JSON once and applies category, search and pagination locally", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = "https://example.test/db.json";

    const [{ default: axios }, { getCategories, getProducts }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    const database = {
      products: remoteProducts.map((product) => ({ ...product, id: String(product.id) })),
      categories: [
        { id: 1, nombre: "Electrónica" },
        { id: 2, nombre: "Accesorios" },
      ],
    };

    jest.mocked(axios.get).mockResolvedValue({
      data: database,
    } as Awaited<ReturnType<typeof axios.get>>);

    await expect(getCategories()).resolves.toEqual(["Accesorios", "Electrónica"]);

    const secondPage = await getProducts(2, 8);
    expect(secondPage.items).toBe(25);
    expect(secondPage.pages).toBe(4);
    expect(secondPage.data).toHaveLength(8);
    expect(secondPage.data[0].id).toBe(9);

    const filtered = await getProducts(1, 8, "sony", "Electrónica");
    expect(filtered.items).toBe(1);
    expect(filtered.pages).toBe(1);
    expect(filtered.data.map((product) => product.titulo)).toEqual(["Sony Cámara"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("https://example.test/db.json");
  });
});
