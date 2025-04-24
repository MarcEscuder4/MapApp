const API_KEY = 'RtPTGgl5LCZccl3A0xgbuvsLHMZoEusp'; // https://calendarific.com key

export const fetchHolidays = async (country: string, year: number) => {
  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.response.holidays;
  } catch (error) {
    console.error('Error al obtener los festivos:', error);
    return [];
  }
};
