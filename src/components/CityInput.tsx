import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onCitySelect: (city: string) => void;
  onCoordinates: (coords: [number, number]) => void;
  onCountryCode: (countryCode: string) => void;
}

export const CityInput: React.FC<Props> = ({
  onCitySelect,
  onCoordinates,
  onCountryCode,
}) => {
  const [input, setInput] = useState('');

  const handleSearch = async () => {
    if (!input) return;

    try {
      const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${apiKey}`
      );

      const result = response.data.results[0];

      if (result && result.geometry) {
        const { lat, lng } = result.geometry;
        const countryCode = result.components?.country_code?.toUpperCase() || 'ES';

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
      <input
        type="text"
        placeholder="Introduce una ciudad"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          flex: 1,
          padding: '0.6rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontSize: '1rem',
        }}
      />
      <button
        onClick={handleSearch}
        className="search-button"
      >
        Buscar
      </button>
    </div>
  );
};
