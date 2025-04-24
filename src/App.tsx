import React, { useState } from 'react';  // Importamos React y hooks necesarios
import { CityInput } from './components/CityInput';  // Importamos el componente CityInput
import { MapView } from './components/MapView';  // Importamos el componente MapView
import { Sidebar } from './components/Sidebar';  // Importamos el componente Sidebar
import './App.css';  // Importamos el archivo de estilos CSS

const App = () => {
  // Estado para almacenar la ciudad seleccionada por el usuario
  const [city, setCity] = useState('');  
  // Estado para almacenar las coordenadas (latitud, longitud) de la ciudad seleccionada
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  // Estado para almacenar el código del país, que puede ser útil para la API de días festivos
  const [countryCode, setCountryCode] = useState<string>(''); 

  return (
    <div className="App">
      {/* Componente CityInput donde el usuario puede buscar una ciudad */}
      <CityInput 
        onCitySelect={setCity}  // Pasamos el setter para manejar la selección de la ciudad
        onCoordinates={setCoordinates}  // Pasamos el setter para manejar las coordenadas
        onCountryCode={setCountryCode}  // Pasamos el setter para manejar el código del país
      />

      <div className="app-body" style={{ display: 'flex' }}>
        {/* Componente MapView que muestra el mapa basado en la ciudad seleccionada */}
        <MapView city={city} coordinates={coordinates} />

        {/* Componente Sidebar que muestra información adicional sobre la ciudad y los días festivos */}
        <Sidebar city={city} countryCode={countryCode} /> {/* Pasamos el código del país para los días festivos */}
      </div>
    </div>
  );
};

export default App;
