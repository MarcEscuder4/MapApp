import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { fetchPOIs } from '../api/overpass';

interface Props {
  city: string;
  coordinates: [number, number] | null;
}

interface POI {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

const defaultPosition: LatLngExpression = [41.3874, 2.1686]; // Barcelona default
const zoom = 12;

const FlyToCity: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(coords, zoom);
  }, [coords, map]);

  return null;
};

export const MapView: React.FC<Props> = ({ city, coordinates }) => {
  const position = coordinates || defaultPosition;
  const [pois, setPOIs] = useState<POI[]>([]);

  useEffect(() => {
    const getPOIs = async () => {
      if (!coordinates) return;
      try {
        const [lat, lon] = coordinates;
        const data = await fetchPOIs(lat, lon, 'restaurant'); // Can switch to 'supermarket'
        setPOIs(data);
      } catch (err) {
        console.error('Error fetching POIs:', err);
      }
    };

    getPOIs();
  }, [coordinates]);

  return (
    <div style={{ height: '600px', width: '70vw', margin: '1rem' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordinates && (
          <>
            <FlyToCity coords={coordinates} />
            <Marker position={coordinates}>
              <Popup>{city}</Popup>
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
