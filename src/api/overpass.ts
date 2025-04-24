import axios from 'axios';

export const fetchPOIs = async (lat: number, lon: number, type: 'restaurant' | 'supermarket') => {
  const query = `
    [out:json];
    (
      node["amenity"="${type}"](around:2000,${lat},${lon});
      way["amenity"="${type}"](around:2000,${lat},${lon});
      relation["amenity"="${type}"](around:2000,${lat},${lon});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter`;

  const response = await axios.post(url, query, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.elements.map((element: any) => {
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;
    return {
      id: element.id,
      name: element.tags?.name || type,
      lat,
      lon
    };
  });
};
