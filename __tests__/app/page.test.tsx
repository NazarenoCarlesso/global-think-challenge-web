import Home from '@/app/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/Cart', () => ({
  Cart: () => <aside>esto es un carrito</aside>,
}));

jest.mock('@/components/Header', () => ({
  Header: () => <header>esto es un header</header>,
}));

jest.mock('@/components/Title', () => ({
  Title: () => <h1>esto es un titulo</h1>,
}));

jest.mock('@/components/ProductsList', () => ({
  ProductsList: () => <></>,
}));

jest.mock('@/components/SearchBar', () => ({
  SearchBar: () => <></>,
}));

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });

    // Mostrar HTML en consola
    screen.debug();

    expect(heading).toBeInTheDocument();
  });
});
