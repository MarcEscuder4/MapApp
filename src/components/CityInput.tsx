import React, { useState } from 'react';
import axios from 'axios';

// Props del componente: funciones de callback para pasar datos al componente padre
interface Props {
  onCitySelect: (city: string) => void;               // Notifica ciudad seleccionada
  onCoordinates: (coords: [number, number]) => void;  // Envía coordenadas geográficas
  onCountryCode: (countryCode: string) => void;       // Envía código de país (ISO 3166-1 alpha-2)
}

/**
 * Componente de entrada de ciudad que realiza geocodificación directa
 * utilizando la API de OpenCage y comunica los datos al componente padre.
 */
export const CityInput: React.FC<Props> = ({
  onCitySelect,
  onCoordinates,
  onCountryCode,
}) => {
  // Estado local para controlar el valor del campo de texto
  const [input, setInput] = useState('');

  /**
   * Función manejadora que realiza la búsqueda geográfica al hacer clic.
   * Usa la API de OpenCage para obtener lat/lon y código de país.
   */
  const handleSearch = async () => {
    if (!input) return; // Validación temprana: campo vacío

    try {
      // Clave de API almacenada en variable de entorno
      const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;

      // Llamada a la API de geocodificación directa
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${apiKey}`
      );

      // Toma el primer resultado devuelto por la API
      const result = response.data.results[0];

      if (result && result.geometry) {
        const { lat, lng } = result.geometry; // Extrae coordenadas
        const countryCode = result.components?.country_code?.toUpperCase() || 'ES'; // Código de país por defecto 'ES'

        // Llama a los callbacks con los datos obtenidos
        onCitySelect(input);
        onCoordinates([lat, lng]);
        onCountryCode(countryCode);
      } else {
        alert('Ciudad no encontrada'); // Manejo básico de error de búsqueda vacía
      }
    } catch (error) {
      console.error('Error in Geocoding:', error);
      alert('Error fetching coordinates'); // Notificación de error genérico
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        backgroundColor: '#2c2c2c',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(136, 136, 136, 0.25)',
        marginBottom: '1rem',
        maxWidth: '500px',
        margin: '1rem auto',
      }}
    >
      {/* Campo de texto controlado para ingresar el nombre de una ciudad */}
      <input
        type="text"
        placeholder="Introduce una ciudad"
        value={input}
        onChange={(e) => setInput(e.target.value)} // Actualiza estado al escribir
        style={{
          flex: 1,
          padding: '0.6rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontSize: '1rem',
        }}
      />
      {/* Botón que dispara la búsqueda de geocodificación */}
      <button
        onClick={handleSearch}
        className="search-button" // Clase opcional para estilos CSS externos
      >
        Buscar
      </button>
    </div>
  );
};
