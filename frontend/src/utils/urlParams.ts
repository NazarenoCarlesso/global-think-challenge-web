export interface FilterParams {
  search?: string;
  category?: string;
  page: number;
}

export const getFiltersFromUrl = (
  searchParamsString: string = typeof window !== "undefined" ? window.location.search : ""
): FilterParams => {
  const params = new URLSearchParams(searchParamsString);
  const requestedPage = Number(params.get("page"));

  return {
    search: params.get("search") || undefined,
    category: params.get("category") || undefined,
    page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };
};

export const buildUrlWithFilters = (
  filters: FilterParams,
  currentHref: string = typeof window !== "undefined" ? window.location.href : "http://localhost/"
): string => {
  const url = new URL(currentHref);

  if (filters.search?.trim()) {
    url.searchParams.set("search", filters.search.trim());
  } else {
    url.searchParams.delete("search");
  }

  if (filters.category) {
    url.searchParams.set("category", filters.category);
  } else {
    url.searchParams.delete("category");
  }

  if (filters.page > 1) {
    url.searchParams.set("page", String(filters.page));
  } else {
    url.searchParams.delete("page");
  }

  return `${url.pathname}${url.search}${url.hash}`;
};

export const syncUrlWithFilters = (
  filters: FilterParams,
  currentHref?: string
): void => {
  if (typeof window === "undefined") return;
  const newUrl = buildUrlWithFilters(filters, currentHref ?? window.location.href);
  window.history.replaceState(window.history.state, "", newUrl);
};

