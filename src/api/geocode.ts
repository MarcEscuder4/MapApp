// Esta función se encarga de obtener las coordenadas (latitud y longitud)
// y el código de país de una ciudad utilizando la API de OpenCage.
export const geocodeCity = async (city: string) => {
  // Se accede a la API key desde la variable de entorno
  const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;

  // Se construye la URL de la petición, codificando el nombre de la ciudad
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    // Se realiza la petición HTTP a la API de OpenCage
    const response = await fetch(url);
    const data = await response.json();

    // Si se obtienen resultados, extraemos latitud, longitud y código de país
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry; // Coordenadas geográficas
      const countryCode = data.results[0].components['ISO_3166-1_alpha-2']; // Código de país (ej: ES, US)

      // Se retorna un objeto con coordenadas y código de país
      return {
        coordinates: [lat, lng],
        countryCode,
      };
    } else {
      // Si no se obtienen resultados, lanzamos un error personalizado
      throw new Error('No se encontraron resultados');
    }
  } catch (error) {
    // Captura y muestra cualquier error ocurrido durante la petición
    console.error('Error al obtener coordenadas:', error);
    return null; // Se retorna null en caso de error
  }
};
