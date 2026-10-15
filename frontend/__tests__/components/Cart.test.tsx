import { fireEvent, render, screen } from "@testing-library/react";
import { DEFAULT_CONTEXT_VALUE } from "@/constants";
import { ProductsContext } from "@/context/ProductsContext";
import { ProductContextType } from "@/interfaces";
import { Cart } from "@/components/Cart";

const renderCart = (overrides: Partial<ProductContextType> = {}) => {
  const context = { ...DEFAULT_CONTEXT_VALUE, ...overrides };
  return render(
    <ProductsContext.Provider value={context}>
      <Cart />
    </ProductsContext.Provider>
  );
};

describe("Cart", () => {
  it("does not render the cart while it is closed", () => {
    renderCart();

    expect(screen.queryByLabelText("Carrito de compras")).not.toBeInTheDocument();
  });

  it("renders cart items and invokes clear and close actions", () => {
    const product = {
      id: 7,
      titulo: "Auriculares",
      descripcion: "Auriculares inalámbricos",
      precio: 250,
      imagen: "",
      fav: false,
      rating: 4,
      categoria: "Audio",
      quantity: 2,
    };
    const clearCart = jest.fn();
    const toggleCart = jest.fn();
    renderCart({ cart: [product], isCartOpen: true, clearCart, toggleCart });

    expect(screen.getByLabelText("Carrito de compras")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Carrito (1)" })).toBeInTheDocument();
    expect(screen.getByText("Auriculares")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar carrito" }));
    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(toggleCart).toHaveBeenCalledTimes(1);
  });
});
