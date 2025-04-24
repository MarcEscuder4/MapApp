import React, { useEffect, useState } from 'react';
import { fetchHolidays } from '../api/calendarific'; // Importa la función para obtener los festivos

interface Props {
  city: string; // Nombre de la ciudad seleccionada
  countryCode: string; // Código del país, necesario para obtener los festivos
}

interface Holiday {
  name: string; // Nombre del festivo
  date: { iso: string }; // Fecha del festivo en formato ISO
}

const HOLIDAYS_PER_PAGE = 8; // Número de festivos por página

// Componente Sidebar que muestra los festivos de la ciudad seleccionada
export const Sidebar: React.FC<Props> = ({ city, countryCode }) => {
  // Estado para almacenar los festivos obtenidos
  const [holidays, setHolidays] = useState<Holiday[]>([]); 
  // Estado para controlar si los festivos se están cargando
  const [loading, setLoading] = useState(false); 
  // Estado para manejar la página actual de los festivos
  const [currentPage, setCurrentPage] = useState(0); 

  // useEffect para obtener los festivos cada vez que la ciudad o el país cambian
  useEffect(() => {
    const getHolidays = async () => {
      // Si no se ha seleccionado ciudad o país, no hace nada
      if (!city || !countryCode) return;

      setLoading(true); // Establece el estado de carga en verdadero
      try {
        // Llama a la API para obtener los festivos del país y el año actual
        const data = await fetchHolidays(countryCode, new Date().getFullYear());
        setHolidays(data); // Almacena los festivos en el estado
        setCurrentPage(0); // Reinicia la página a 0 si la ciudad cambia
      } catch (err) {
        console.error(err); // Si ocurre un error, lo muestra en la consola
      } finally {
        setLoading(false); // Cambia el estado de carga a falso cuando termine la operación
      }
    };

    getHolidays(); // Ejecuta la función para obtener los festivos
  }, [city, countryCode]); // Dependencias: la ciudad y el país

  // Calcula el índice de inicio para la paginación
  const startIndex = currentPage * HOLIDAYS_PER_PAGE;
  // Crea una lista de festivos para la página actual
  const paginatedHolidays = holidays.slice(startIndex, startIndex + HOLIDAYS_PER_PAGE);
  // Calcula el número total de páginas
  const totalPages = Math.ceil(holidays.length / HOLIDAYS_PER_PAGE);

  return (
    <div style={{ padding: '1rem', width: '30vw' }}>
      {/* Muestra el nombre de la ciudad seleccionada */}
      <h4>Ciudad seleccionada:</h4>
      <h2>{city || 'Ninguna'}</h2>

      {/* Título de los festivos */}
      <h3>📅 Festivos</h3>
      {loading ? (
        <p>Cargando...</p> // Muestra "Cargando..." mientras se obtienen los festivos
      ) : (
        <>
          {/* Muestra la lista de festivos de la página actual */}
          <ul>
            {paginatedHolidays.map((holiday, index) => (
              <li key={index}>
                {holiday.name} – {holiday.date.iso} {/* Muestra el nombre y la fecha del festivo */}
              </li>
            ))}
          </ul>
          {/* Paginación solo si hay más de una página de festivos */}
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem' }}>
              {/* Botón de "Anterior" */}
              <button
                disabled={currentPage === 0} // Deshabilita si estamos en la primera página
                onClick={() => setCurrentPage((prev) => prev - 1)} // Resta 1 al número de la página
                style={{ marginRight: '0.5rem' }}
              >
                Anterior
              </button>
              {/* Muestra la página actual y el total de páginas */}
              <span>Página {currentPage + 1} de {totalPages}</span>
              {/* Botón de "Siguiente" */}
              <button
                disabled={currentPage >= totalPages - 1} // Deshabilita si estamos en la última página
                onClick={() => setCurrentPage((prev) => prev + 1)} // Suma 1 al número de la página
                style={{ marginLeft: '0.5rem' }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
