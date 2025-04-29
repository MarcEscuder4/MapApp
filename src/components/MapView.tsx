import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { fetchPOIs } from '../api/overpass';

// Props esperadas por el componente MapView: nombre de ciudad y coordenadas (lat, lon)
interface Props {
  city: string;
  coordinates: [number, number] | null;
}

// Definición del tipo para un Punto de Interés (POI) obtenido vía Overpass API
interface POI {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

// Coordenadas por defecto (Barcelona)
const defaultPosition: LatLngExpression = [41.3874, 2.1686];

// Nivel de zoom predeterminado para el mapa
const zoom = 12;

/**
 * Componente auxiliar que fuerza al mapa a realizar una animación
 * cuando cambian las coordenadas de destino.
 */
const FlyToCity: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap(); // Obtiene instancia del mapa desde el contexto de react-leaflet
  useEffect(() => {
    map.flyTo(coords, zoom); // Anima el cambio de vista al nuevo centro
  }, [coords, map]);
  return null;
};

/**
 * Componente principal que renderiza el mapa junto con marcadores de POIs.
 */
export const MapView: React.FC<Props> = ({ city, coordinates }) => {
  // Usa las coordenadas proporcionadas o un valor por defecto
  const position = coordinates || defaultPosition;

  // Estado local que almacena los POIs obtenidos desde la API externa
  const [pois, setPOIs] = useState<POI[]>([]);

  /**
   * Hook de efecto que se ejecuta al montar el componente o al cambiar las coordenadas.
   * Llama a la función fetchPOIs para obtener puntos de interés cercanos.
   */
  useEffect(() => {
    const getPOIs = async () => {
      if (!coordinates) return; // Salida anticipada si no hay coordenadas válidas

      try {
        const [lat, lon] = coordinates;
        // Se consulta la API para obtener POIs del tipo 'nightclub'
        const data = await fetchPOIs(lat, lon, 'nightclub');
        setPOIs(data); // Actualiza el estado local con los resultados
      } catch (err) {
        console.error('Error fetching POIs:', err);
      }
    };

    getPOIs();
  }, [coordinates]); // Dependencia: se ejecuta cada vez que cambian las coordenadas

  return (
    <div
      style={{
        height: '600px',
        width: '70vw',
        margin: '1rem auto',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(136, 136, 136, 0.25)',
      }}
    >
      {/* Contenedor del mapa con scroll habilitado y vista inicial definida */}
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        {/* Capa de teselas (tiles) del mapa con diseño claro provisto por Carto */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & contributors'
        />

        {/* Si hay coordenadas disponibles, renderiza un marcador de ciudad y anima la vista */}
        {coordinates && (
          <>
            <FlyToCity coords={coordinates} />
            <Marker position={coordinates}>
              <Popup>
                <strong>{city}</strong>
              </Popup>
            </Marker>
          </>
        )}

        {/* Renderizado dinámico de los POIs como marcadores individuales con popups */}
        {pois.map((poi) => (
          <Marker key={poi.id} position={[poi.lat, poi.lon]}>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
