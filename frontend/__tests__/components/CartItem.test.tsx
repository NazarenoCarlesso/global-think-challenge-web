import { fireEvent, render, screen } from "@testing-library/react";
import { DEFAULT_CONTEXT_VALUE } from "@/constants";
import { ProductsContext } from "@/context/ProductsContext";
import { ProductContextType } from "@/interfaces";
import { CartItem } from "@/components/CartItem";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const item = {
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

const renderCartItem = (overrides: Partial<ProductContextType> = {}, image = "") => {
  const context = { ...DEFAULT_CONTEXT_VALUE, ...overrides };
  return render(
    <ProductsContext.Provider value={context}>
      <ul>
        <CartItem {...item} imagen={image} />
      </ul>
    </ProductsContext.Provider>
  );
};

describe("CartItem", () => {
  it("renders the placeholder and calls quantity and remove actions", () => {
    const addToCart = jest.fn();
    const decreaseFromCart = jest.fn();
    const removeFromCart = jest.fn();
    renderCartItem({ addToCart, decreaseFromCart, removeFromCart });

    expect(screen.getByRole("img", { name: "Auriculares" })).toHaveClass("image-placeholder");
    expect(screen.getByLabelText("Cantidad: 2")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "Quitar una unidad de Auriculares" }));
    fireEvent.click(screen.getByRole("button", { name: "Agregar una unidad de Auriculares" }));
    fireEvent.click(screen.getByRole("button", { name: "Quitar Auriculares del carrito" }));

    expect(decreaseFromCart).toHaveBeenCalledWith(7);
    expect(addToCart).toHaveBeenCalledWith({
      id: item.id,
      titulo: item.titulo,
      descripcion: item.descripcion,
      precio: item.precio,
      imagen: item.imagen,
      fav: item.fav,
      rating: item.rating,
      categoria: item.categoria,
    });
    expect(removeFromCart).toHaveBeenCalledWith(7);
  });

  it("renders the product image when one is available", () => {
    renderCartItem({}, "/headphones.jpg");

    expect(screen.getByRole("img", { name: "Auriculares" })).toHaveAttribute("src", "/headphones.jpg");
  });
});
