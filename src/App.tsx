import React, { useState } from 'react';
import './App.css';
import { CityInput } from './components/CityInput';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';

const App = () => {
  const [city, setCity] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [countryCode, setCountryCode] = useState<string>(''); // State for country code

  return (
    <div className="App">
      <CityInput 
        onCitySelect={setCity} 
        onCoordinates={setCoordinates}
        onCountryCode={setCountryCode} // Pass country code setter
      />
      <div className="app-body" style={{ display: 'flex' }}>
        <MapView city={city} coordinates={coordinates} />
        <Sidebar city={city} countryCode={countryCode} /> {/* Pass countryCode */}
      </div>
    </div>
  );
};

export default App;
