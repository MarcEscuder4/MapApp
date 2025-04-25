import axios from 'axios';

// Función para obtener Puntos de Interés (POIs) de un tipo específico (restaurante o supermercado)
// Las coordenadas (lat, lon) son el punto central para la búsqueda, y el tipo es 'restaurant' o 'supermarket'
export const fetchPOIs = async (lat: number, lon: number, type: 'nightclub') => {
  // Consulta en lenguaje Overpass para obtener nodos, caminos y relaciones de tipo "restaurant" o "supermarket"
  // Los resultados se obtendrán dentro de un radio de 2 km alrededor de las coordenadas proporcionadas
  const query = `
    [out:json];  // Indica que la salida será en formato JSON
    (
      node["amenity"="${type}"](around:3000,${lat},${lon}); // Buscar nodos de tipo "restaurant" dentro de 3 km
      way["amenity"="${type}"](around:3000,${lat},${lon});  // Buscar caminos (way) de tipo "discoteca" (nightclub) dentro de 3 km
      relation["amenity"="${type}"](around:3000,${lat},${lon});  // Buscar relaciones (relation) de tipo "restaurant" dentro de 3 km
    );
    out center;  // Obtener los centros de los elementos encontrados
  `;

  // URL de la API de Overpass para hacer la solicitud de datos
  const url = `https://overpass-api.de/api/interpreter`;

  // Realiza una solicitud POST a la API de Overpass con la consulta definida anteriormente
  const response = await axios.post(url, query, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'  // Especifica el tipo de contenido de la solicitud
    }
  });

  // Procesa los elementos obtenidos y devuelve un array con los detalles de los puntos de interés encontrados
  return response.data.elements.map((element: any) => {
    // Extrae la latitud y longitud de cada elemento; si no están disponibles directamente, las obtiene desde el centro
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;
    
    // Retorna un objeto con el id, nombre, latitud y longitud de cada punto de interés
    return {
      id: element.id, // ID único del POI
      name: element.tags?.name || type, // Si el POI tiene un nombre, lo usa; de lo contrario, usa el tipo (restaurante)
      lat, // Latitud del POI
      lon // Longitud del POI
    };
  });
};