"use client"
import { useContext } from "react";
import "./SearchBar.css"
import { ProductsContext } from "@/context/products";

export const SearchBar = () => {
  const { setFilter, resultsCount, loading } = useContext(ProductsContext);

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