// readings/src/modules/reading-routes/application/mappers/reading-legacy-event.mapper.ts
import { ReadingCreatedLegacyEvent } from '../ports/reading-legacy-publisher.port';

const MONTH_NAMES_ES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

export class ReadingLegacyEventMapper {
  static fromPostgresToLegacyEvent(data: {
    sector: number | string;
    cuenta: number | string;
    lecturaAnterior: number;
    lecturaActual: number;
    fechaLectura: Date | string;
    horaLectura?: string;
    novedad?: string | null;
    periodoMes?: string | null; // Formato YYYY-MM
    username?: string;
    userCardId: string;
    lecturaId?: number;
    claveCatastral?: string;
  }): ReadingCreatedLegacyEvent {
    const fecha =
      data.fechaLectura instanceof Date
        ? data.fechaLectura
        : new Date(data.fechaLectura || Date.now());

    let anio = fecha.getFullYear();
    let mesNombre = MONTH_NAMES_ES[fecha.getMonth()];

    // Si viene el periodo programado de la ruta (ej. '2026-11'), priorizarlo
    if (data.periodoMes && data.periodoMes.includes('-')) {
      const [yearPart, monthPart] = data.periodoMes.split('-').map(Number);
      if (
        !isNaN(yearPart) &&
        !isNaN(monthPart) &&
        monthPart >= 1 &&
        monthPart <= 12
      ) {
        anio = yearPart;
        mesNombre = MONTH_NAMES_ES[monthPart - 1];
      }
    }

    const hora =
      data.horaLectura ||
      new Intl.DateTimeFormat('es-EC', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Guayaquil',
      }).format(fecha);

    return {
      sector: Number(data.sector || 0),
      account: Number(data.cuenta || 0),
      year: anio,
      month: mesNombre,
      previousReading: Number(data.lecturaAnterior || 0),
      currentReading: Number(data.lecturaActual || 0),
      readingDate: fecha.toISOString().split('T')[0],
      readingTime: hora,
      novelty:
        data.novedad && data.novedad.trim()
          ? data.novedad.trim().toUpperCase()
          : 'NORMAL',
      meterStatus: 'BUENO',
      username:
        data.userCardId && !data.userCardId.includes('-')
          ? data.userCardId.slice(0, 15)
          : 'MOVIL',
      userCardId: data.userCardId ? data.userCardId.slice(0, 20) : '',
      readingId: data.lecturaId ? String(data.lecturaId).slice(0, 10) : '',
      cadastralKey: data.claveCatastral ? data.claveCatastral.slice(0, 20) : '',
    };
  }
}
