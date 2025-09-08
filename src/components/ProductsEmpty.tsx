import Image from "next/image";

export const ProductsEmpty = () => {
  return (
    <div className='products not-found'>
      <Image
        src='https://static.tildacdn.net/tild3432-3335-4337-b130-363866343062/No_results_1.svg'
        alt='No results'
        width={600}
        height={400}
      />
      <h1>No se encontraron productos</h1>
      <p>No hay productos que coincidan con tu busqueda.</p>
      <p>Intenta justificar tus filtros o verifica que el nombre que estás buscando sea correcto</p>
    </div>
  );
};