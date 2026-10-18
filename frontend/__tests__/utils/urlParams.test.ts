import {
  buildUrlWithFilters,
  getFiltersFromUrl,
  syncUrlWithFilters,
} from "@/utils/urlParams";

describe("urlParams utility", () => {
  describe("getFiltersFromUrl", () => {
    it("returns default values when search string is empty", () => {
      const filters = getFiltersFromUrl("");
      expect(filters).toEqual({
        search: undefined,
        category: undefined,
        page: 1,
      });
    });

    it("extracts search, category, and page correctly", () => {
      const filters = getFiltersFromUrl("?search=laptop&category=tech&page=3");
      expect(filters).toEqual({
        search: "laptop",
        category: "tech",
        page: 3,
      });
    });

    it("defaults page to 1 if page parameter is invalid or less than 1", () => {
      expect(getFiltersFromUrl("?page=-1").page).toBe(1);
      expect(getFiltersFromUrl("?page=abc").page).toBe(1);
      expect(getFiltersFromUrl("?page=0").page).toBe(1);
    });
  });

  describe("buildUrlWithFilters", () => {
    it("adds search, category, and page > 1 to URL preserving other parameters", () => {
      const url = buildUrlWithFilters(
        { search: "mouse", category: "accessories", page: 2 },
        "http://localhost:3000/shop?campaign=summer#top"
      );
      expect(url).toBe("/shop?campaign=summer&search=mouse&category=accessories&page=2#top");
    });

    it("deletes search and category when empty, and page when 1", () => {
      const url = buildUrlWithFilters(
        { search: "", category: undefined, page: 1 },
        "http://localhost:3000/shop?search=mouse&category=accessories&page=2"
      );
      expect(url).toBe("/shop");
    });
  });

  describe("syncUrlWithFilters", () => {
    it("calls window.history.replaceState with the updated URL", () => {
      const replaceStateSpy = jest.spyOn(window.history, "replaceState");

      syncUrlWithFilters(
        { search: "keyboard", category: "peripherals", page: 2 },
        "http://localhost:3000/products"
      );

      expect(replaceStateSpy).toHaveBeenCalledWith(
        window.history.state,
        "",
        "/products?search=keyboard&category=peripherals&page=2"
      );

      replaceStateSpy.mockRestore();
    });
  });
});

