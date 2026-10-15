import { render, screen } from "@testing-library/react";
import { ProductsEmpty } from "@/components/ProductsEmpty";

describe("ProductsEmpty", () => {
  it("explains that no products match the current filters", () => {
    render(<ProductsEmpty />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("0 resultados")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No se encontraron productos" })).toBeInTheDocument();
    expect(screen.getByText(/No hay productos que coincidan/)).toBeInTheDocument();
    expect(screen.getByText(/Probá con otro término/)).toBeInTheDocument();
  });
});
