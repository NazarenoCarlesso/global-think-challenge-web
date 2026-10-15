import type { Product } from "@/interfaces";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    isAxiosError: jest.fn((error: unknown) => (
      typeof error === "object" && error !== null && "isAxiosError" in error
    )),
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

    const [{ default: axios }, { getCategories, getProductById, getProducts }] = await Promise.all([
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
    await expect(getProductById(9)).resolves.toEqual(remoteProducts[8]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("https://example.test/db.json");
  });

  it("returns null when a product ID is absent from the JSON database", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = "https://example.test/db.json";
    const [{ default: axios }, { getProductById }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get).mockResolvedValue({
      data: { products: remoteProducts.map((product) => ({ ...product, id: String(product.id) })) },
    } as Awaited<ReturnType<typeof axios.get>>);

    await expect(getProductById(999)).resolves.toBeNull();
  });

  it("derives unique categories when the JSON has no category collection", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = "https://example.test/db.json";
    const [{ default: axios }, { getCategories }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get).mockResolvedValue({
      data: {
        products: [
          { ...remoteProducts[0], id: "1" },
          { ...remoteProducts[2], id: "3" },
          { ...remoteProducts[1], id: "2" },
        ],
      },
    } as Awaited<ReturnType<typeof axios.get>>);

    await expect(getCategories()).resolves.toEqual(["Accesorios", "Electrónica"]);
  });

  it("returns an empty page for filters with no matches and clamps pages to the last page", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = "https://example.test/db.json";
    const [{ default: axios }, { getProducts }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get).mockResolvedValue({
      data: { products: remoteProducts.map((product) => ({ ...product, id: String(product.id) })) },
    } as Awaited<ReturnType<typeof axios.get>>);

    const empty = await getProducts(1, 8, "no existe");
    expect(empty).toMatchObject({
      first: null,
      prev: null,
      next: null,
      last: 0,
      pages: 0,
      items: 0,
      data: [],
    });

    const clamped = await getProducts(99, 8);
    expect(clamped.data.map((product) => product.id)).toEqual([25]);
    expect(clamped.prev).toBe(3);
    expect(clamped.next).toBeNull();
  });

  it("rejects malformed JSON and retries the failed database request", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = "https://example.test/db.json";
    const [{ default: axios }, { getCategories }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get)
      .mockResolvedValueOnce({ data: { invalid: true } } as Awaited<ReturnType<typeof axios.get>>)
      .mockResolvedValueOnce({
        data: { products: [], categories: ["Audio"] },
      } as Awaited<ReturnType<typeof axios.get>>);

    await expect(getCategories()).rejects.toThrow("El JSON remoto no contiene una colección válida de productos.");
    await expect(getCategories()).resolves.toEqual(["Audio"]);
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

});

describe("products service with json-server", () => {
  const originalDataUrl = process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalDataUrl === undefined) {
      delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    } else {
      process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL = originalDataUrl;
    }
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
    jest.resetModules();
  });

  it("fetches a product by ID and normalizes its numeric ID", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://example.test/api/";
    const [{ default: axios }, { getProductById }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get).mockResolvedValue({
      data: { ...remoteProducts[8], id: "9" },
    } as Awaited<ReturnType<typeof axios.get>>);

    await expect(getProductById("9")).resolves.toEqual(remoteProducts[8]);
    expect(axios.get).toHaveBeenCalledWith("https://example.test/api/products/9");
  });

  it("returns null when json-server responds that the product does not exist", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://example.test/api";
    const [{ default: axios }, { getProductById }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get).mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    });

    await expect(getProductById(999)).resolves.toBeNull();
  });

  it("loads and normalizes categories and paginated products with optional query params", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://example.test/api/";
    const [{ default: axios }, { getCategories, getProducts }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get)
      .mockResolvedValueOnce({
        data: [
          { id: 1, nombre: "Électronique" },
          { id: 2, nombre: "Accesorios" },
        ],
      } as Awaited<ReturnType<typeof axios.get>>)
      .mockResolvedValueOnce({
        data: {
          first: 1,
          prev: null,
          next: null,
          last: 1,
          pages: 1,
          items: 1,
          data: [{ ...remoteProducts[8], id: "9" }],
        },
      } as Awaited<ReturnType<typeof axios.get>>);

    await expect(getCategories()).resolves.toEqual(["Accesorios", "Électronique"]);
    const result = await getProducts(1, 8, "Sony", "Electrónica");
    expect(result.data).toEqual([remoteProducts[8]]);
    expect(axios.get).toHaveBeenNthCalledWith(1, "https://example.test/api/categories");
    expect(axios.get).toHaveBeenNthCalledWith(2, "https://example.test/api/products", {
      params: {
        _page: 1,
        _per_page: 8,
        "titulo:contains": "Sony",
        categoria: "Electrónica",
      },
    });
  });

  it("omits empty query filters when requesting paginated products", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://example.test/api";
    const [{ default: axios }, { getProducts }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    jest.mocked(axios.get).mockResolvedValue({
      data: {
        first: 1,
        prev: null,
        next: null,
        last: 1,
        pages: 1,
        items: 1,
        data: [{ ...remoteProducts[0], id: 1 }],
      },
    } as Awaited<ReturnType<typeof axios.get>>);

    await getProducts(1, 8, "", undefined);
    expect(axios.get).toHaveBeenCalledWith("https://example.test/api/products", {
      params: { _page: 1, _per_page: 8 },
    });
  });

  it("returns null for invalid product IDs without making a request", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://example.test/api";
    const [{ default: axios }, { getProductById }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);

    await expect(getProductById("not-a-number")).resolves.toBeNull();
    await expect(getProductById(0)).resolves.toBeNull();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("rethrows non-404 errors when loading a product", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://example.test/api";
    const [{ default: axios }, { getProductById }] = await Promise.all([
      import("axios"),
      import("@/services/products"),
    ]);
    const error = { isAxiosError: true, response: { status: 500 } };
    jest.mocked(axios.get).mockRejectedValue(error);

    await expect(getProductById(9)).rejects.toBe(error);
  });

  it("reports missing API configuration", async () => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_PRODUCTS_DATA_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    const { getCategories, getProducts, getProductById } = await import("@/services/products");

    await expect(getCategories()).rejects.toThrow("Falta configurar NEXT_PUBLIC_API_URL");
    await expect(getProducts(1, 8)).rejects.toThrow("Falta configurar NEXT_PUBLIC_API_URL");
    await expect(getProductById(1)).rejects.toThrow("Falta configurar NEXT_PUBLIC_API_URL");
  });
});
