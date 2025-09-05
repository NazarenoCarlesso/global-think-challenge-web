import "./SearchBar.css"

export const SearchBar = () => {
  return (
    <div className='searchbar'>
      <h4>Buscar</h4>
      <div>
        <input />
        <button>
          {/* TODO: ícono de lupa */}
          🔎
        </button>
        {/* TODO: calcular número de resultados */}
        <p>10 productos</p>
      </div>
    </div>
  )
}