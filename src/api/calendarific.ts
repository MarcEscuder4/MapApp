// Se obtiene la clave de la API desde las variables de entorno
const API_KEY = process.env.REACT_APP_CALENDARIFIC_API_KEY; // La clave de la API de Calendarific

// Función para obtener los días festivos de un país y año determinado
export const fetchHolidays = async (country: string, year: number) => {
  // Se construye la URL de la API para obtener los festivos, incluyendo el país y el año
  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`;

  try {
    // Realiza una solicitud HTTP para obtener los datos de la API
    const response = await fetch(url);
    const data = await response.json();

    // Devuelve los días festivos que se encuentran en la respuesta de la API
    return data.response.holidays;
  } catch (error) {
    // Si ocurre algún error, se captura y se imprime en la consola
    console.error('Error al obtener los festivos:', error);
    return []; // En caso de error, se retorna un array vacío
  }
};
