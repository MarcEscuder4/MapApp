const API_KEY = '5ac0e3f8e385419f89e4631605d9f953';

export const geocodeCity = async (city: string) => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      const countryCode = data.results[0].components['ISO_3166-1_alpha-2'];

      return {
        coordinates: [lat, lng],
        countryCode,
      };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};
