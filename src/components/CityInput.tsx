import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onCitySelect: (city: string) => void;
  onCoordinates: (coords: [number, number]) => void;
  onCountryCode: (countryCode: string) => void; // Add countryCode prop
}

export const CityInput: React.FC<Props> = ({ onCitySelect, onCoordinates, onCountryCode }) => {
  const [input, setInput] = useState('');

  const handleSearch = async () => {
    if (!input) return;

    try {
      const apiKey = '5ac0e3f8e385419f89e4631605d9f953'; // Your OpenCage API key
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${apiKey}`);
      console.log(response.data);
      const result = response.data.results[0];

      if (result && result.geometry) {
        const { lat, lng } = result.geometry;
        const countryCode = result.components?.country_code?.toUpperCase() || 'ES'; // fallback to 'ES'
      
        onCitySelect(input);
        onCoordinates([lat, lng]);
        onCountryCode(countryCode);
      } else {
        alert('Ciudad no encontrada');
      }
      
    } catch (error) {
      console.error('Error in Geocoding:', error);
      alert('Error fetching coordinates');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <input
        type="text"
        placeholder="Introduce una ciudad"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem' }}>
        Buscar
      </button>
    </div>
  );
};
