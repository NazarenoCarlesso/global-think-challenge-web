import { render, screen } from "@testing-library/react";
import { Title } from "@/components/Title";

describe("Title", () => {
  it("renders the store hero heading and description", () => {
    render(<Title />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tecnología que te conecta");
    expect(screen.getByText("Encontrá tus próximos favoritos en Global Think Technology Store.")).toBeInTheDocument();
  });
});
