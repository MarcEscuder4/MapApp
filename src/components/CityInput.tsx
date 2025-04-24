import React, { useState } from 'react';
import axios from 'axios';

// Props esperadas desde el componente padre (App)
// - onCitySelect: función que actualiza la ciudad seleccionada
// - onCoordinates: función que guarda las coordenadas (lat, lon)
// - onCountryCode: función que guarda el código del país
interface Props {
  onCitySelect: (city: string) => void;
  onCoordinates: (coords: [number, number]) => void;
  onCountryCode: (countryCode: string) => void;
}

// Componente funcional que permite al usuario introducir una ciudad
export const CityInput: React.FC<Props> = ({ onCitySelect, onCoordinates, onCountryCode }) => {
  const [input, setInput] = useState(''); // Estado para guardar el valor del input

  // Función que se ejecuta al hacer clic en "Buscar"
  const handleSearch = async () => {
    if (!input) return; // Si el input está vacío, no hace nada

    try {
      // Accede a la API Key desde el archivo .env
      const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;

      // Solicitud HTTP a la API de geocodificación con la ciudad ingresada
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${apiKey}`
      );

      console.log(response.data); // Para depuración: imprime los datos completos

      // Toma el primer resultado de los encontrados por la API
      const result = response.data.results[0];

      // Si hay resultado y tiene coordenadas
      if (result && result.geometry) {
        const { lat, lng } = result.geometry; // Extrae latitud y longitud
        const countryCode = result.components?.country_code?.toUpperCase() || 'ES'; // Obtiene el código del país, con fallback a 'ES'

        // Llama a las funciones pasadas por props para actualizar los estados en el componente padre
        onCitySelect(input);
        onCoordinates([lat, lng]);
        onCountryCode(countryCode);
      } else {
        alert('Ciudad no encontrada'); // Si no hay resultado válido
      }

    } catch (error) {
      // Manejo de errores de red o API
      console.error('Error in Geocoding:', error);
      alert('Error fetching coordinates');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Input controlado: lo que escribe el usuario se guarda en el estado */}
      <input
        type="text"
        placeholder="Introduce una ciudad"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
      />
      
      {/* Botón que ejecuta la búsqueda */}
      <button onClick={handleSearch} style={{ padding: '0.5rem' }}>
        Buscar
      </button>
    </div>
  );
};
