// Importaciones necesarias de React y Leaflet
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { fetchPOIs } from '../api/overpass'; // Función para obtener puntos de interés desde la API de Overpass

// Interfaz para las props que recibe este componente
interface Props {
  city: string;
  coordinates: [number, number] | null; // Coordenadas de la ciudad seleccionada
}

// Interfaz que define cómo es un Punto de Interés (POI)
interface POI {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

// Coordenadas por defecto para inicializar el mapa (Barcelona)
const defaultPosition: LatLngExpression = [41.3874, 2.1686];
const zoom = 12; // Nivel de zoom del mapa

/**
 * Componente auxiliar que "vuela" hacia las coordenadas indicadas en el mapa.
 * Esto crea una animación suave cuando el usuario selecciona una nueva ciudad.
 */
const FlyToCity: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap(); // Hook que nos da acceso al mapa de Leaflet

  useEffect(() => {
    // Este efecto se ejecuta cuando cambian las coordenadas
    map.flyTo(coords, zoom); // La función flyTo realiza una animación hasta la ubicación
  }, [coords, map]);

  return null; // No renderiza nada, solo actúa como controlador de movimiento del mapa
};

/**
 * Componente principal del mapa.
 * Se encarga de mostrar mapa, marcadores, y actualizar la vista según la ciudad seleccionada.
 */
export const MapView: React.FC<Props> = ({ city, coordinates }) => {
  const position = coordinates || defaultPosition; // Si no hay coordenadas, usa la ubicación por defecto
  const [pois, setPOIs] = useState<POI[]>([]); // Estado donde se guardan los puntos de interés (como restaurantes o supermercados)

  /**
   * Este useEffect se ejecuta cada vez que cambian las coordenadas.
   * Llama a una función asincrónica que obtiene los POIs desde la API de Overpass.
   */
  useEffect(() => {
    const getPOIs = async () => {
      if (!coordinates) return; // Si no hay coordenadas, no hacemos nada

      try {
        const [lat, lon] = coordinates;

        // Llamamos a la función que obtiene los POIs alrededor de las coordenadas
        // Actualmente está configurado para buscar 'restaurant' pero se puede cambiar a 'supermarket' u otro tipo
        const data = await fetchPOIs(lat, lon, 'restaurant');

        // Guardamos los datos recibidos en el estado
        setPOIs(data);
      } catch (err) {
        // En caso de error lo mostramos en consola
        console.error('Error fetching POIs:', err);
      }
    };

    getPOIs(); // Ejecutamos la función cuando cambian las coordenadas
  }, [coordinates]); // Este efecto depende de las coordenadas

  return (
    <div style={{ height: '600px', width: '70vw', margin: '1rem' }}>
      {/* Componente principal del mapa de Leaflet */}
      <MapContainer
        center={position} // Centro del mapa
        zoom={zoom} // Nivel de zoom inicial
        scrollWheelZoom={true} // Permite hacer zoom con la rueda del mouse
        style={{ height: '100%', width: '100%' }}
      >
        {/* Capa base del mapa que muestra el terreno desde OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Si tenemos coordenadas, añadimos el marcador y hacemos "flyTo" */}
        {coordinates && (
          <>
            <FlyToCity coords={coordinates} />
            <Marker position={coordinates}>
              <Popup>{city}</Popup> {/* Muestra el nombre de la ciudad */}
            </Marker>
          </>
        )}

        {/* Iteramos sobre todos los POIs y mostramos un marcador para cada uno */}
        {pois.map((poi) => (
          <Marker key={poi.id} position={[poi.lat, poi.lon]}>
            <Popup>{poi.name}</Popup> {/* Mostramos el nombre del lugar */}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
