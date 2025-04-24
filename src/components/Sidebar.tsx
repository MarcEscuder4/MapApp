import React, { useEffect, useState } from 'react';
import { fetchHolidays } from '../api/calendarific';

interface Props {
  city: string;
  countryCode: string;
}

interface Holiday {
  name: string;
  date: { iso: string };
}

const HOLIDAYS_PER_PAGE = 8;

export const Sidebar: React.FC<Props> = ({ city, countryCode }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const getHolidays = async () => {
      if (!city || !countryCode) return;

      setLoading(true);
      try {
        const data = await fetchHolidays(countryCode, new Date().getFullYear());
        setHolidays(data);
        setCurrentPage(0); // reset to first page when city changes
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getHolidays();
  }, [city, countryCode]);

  const startIndex = currentPage * HOLIDAYS_PER_PAGE;
  const paginatedHolidays = holidays.slice(startIndex, startIndex + HOLIDAYS_PER_PAGE);
  const totalPages = Math.ceil(holidays.length / HOLIDAYS_PER_PAGE);

  return (
    <div style={{ padding: '1rem', width: '30vw' }}>
      <h4>Ciudad seleccionada:</h4>
      <h2>{city || 'Ninguna'}</h2>

      <h3>📅 Festivos</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <ul>
            {paginatedHolidays.map((holiday, index) => (
              <li key={index}>
                {holiday.name} – {holiday.date.iso}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem' }}>
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{ marginRight: '0.5rem' }}
              >
                Anterior
              </button>
              <span>Página {currentPage + 1} de {totalPages}</span>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
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
