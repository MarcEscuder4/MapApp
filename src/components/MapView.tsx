import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { fetchPOIs } from '../api/overpass';

// Tipado de props
interface Props {
  city: string;
  coordinates: [number, number] | null;
}

// Tipado de POIs (Puntos de interés)
interface POI {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

// Coordenadas por defecto (Barcelona)
const defaultPosition: LatLngExpression = [41.3874, 2.1686];
const zoom = 12;

// Componente para animar el cambio de ciudad en el mapa
const FlyToCity: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, zoom);
  }, [coords, map]);
  return null;
};

// Componente principal del mapa
export const MapView: React.FC<Props> = ({ city, coordinates }) => {
  const position = coordinates || defaultPosition;
  const [pois, setPOIs] = useState<POI[]>([]);

  useEffect(() => {
    const getPOIs = async () => {
      if (!coordinates) return;
      try {
        const [lat, lon] = coordinates;
        const data = await fetchPOIs(lat, lon, 'nightclub'); // Si se quiere mostrar otro tipo de negocios hay que modificar 'nightclub' (ej. "Shisha", "Supermarket"...)
        setPOIs(data);
      } catch (err) {
        console.error('Error fetching POIs:', err);
      }
    };

    getPOIs();
  }, [coordinates]);

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
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
        // Estilo del mapa
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & contributors'
        />

        {coordinates && (
          <>
            <FlyToCity coords={coordinates} />
            <Marker position={coordinates}>
              <Popup><strong>{city}</strong></Popup>
            </Marker>
          </>
        )}

        {pois.map((poi) => (
          <Marker key={poi.id} position={[poi.lat, poi.lon]}>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
