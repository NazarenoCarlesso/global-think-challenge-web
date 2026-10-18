import { fireEvent, render, screen } from "@testing-library/react";
import { ProductsEmpty } from "@/components/ProductsEmpty";

describe("ProductsEmpty", () => {
  it("explains that no products match the current filters", () => {
    render(<ProductsEmpty onClear={jest.fn()} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("0 resultados")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No se encontraron productos" })).toBeInTheDocument();
    expect(screen.getByText(/No hay productos que coincidan/)).toBeInTheDocument();
    expect(screen.getByText(/Probá con otro término/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Borrar búsqueda y filtros" })).toBeInTheDocument();
  });

  it("calls onClear when the clear button is clicked", () => {
    const onClear = jest.fn();
    render(<ProductsEmpty onClear={onClear} />);

    fireEvent.click(screen.getByRole("button", { name: "Borrar búsqueda y filtros" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
