import React, { useState } from "react";
import UserCard from "./UserCard"; 

const Buscador = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Por favor, ingresa un nombre de usuario.");
      return;
    }

    setError(""); 
    setResult(null); 

    try {
      
      const response = await fetch(`https://api.github.com/users/${searchTerm}`);
      if (!response.ok) {
        throw new Error("Usuario no encontrado");
      }

      const data = await response.json();
      setResult(data); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-32">
      <div>
        <input
          className="bg-[#222630] px-4 py-3 outline-none w-[700px] text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
          name="text"
          placeholder="Ingrese el nombre de usuario de GitHub"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded-lg ml-4"
        >
          Buscar
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && <UserCard user={result} />}
    </div>
  );
};

export default Buscador;
