"use client"
import "./SearchBar.css"
import { useProductsContext } from "@/hooks/useProductsContext";

export const SearchBar = () => {
  const { setFilter, resultsCount, loading } = useProductsContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  };

  return (
    <div className='searchbar'>
      <h4>Buscar</h4>
      <div>
        <input onChange={handleChange} />
        <button>
          {/* TODO: ícono de lupa */}
          🔎
        </button>
        {
          !loading ? <p>{resultsCount} productos</p> : null
        }
      </div>
    </div>
  )
}