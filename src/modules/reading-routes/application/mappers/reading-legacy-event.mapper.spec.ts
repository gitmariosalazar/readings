import { ReadingLegacyEventMapper } from './reading-legacy-event.mapper';

describe('ReadingLegacyEventMapper', () => {
  it('should map readingCode without truncation when it has 19 characters (e.g. L-EPAA-000000000045)', () => {
    const fullCode = 'L-EPAA-000000000045';
    const result = ReadingLegacyEventMapper.fromPostgresToLegacyEvent({
      sector: 14,
      cuenta: 293,
      lecturaAnterior: 100,
      lecturaActual: 120,
      fechaLectura: new Date('2026-11-17T10:00:00Z'),
      horaLectura: '10:00:00',
      novedad: 'NORMAL',
      periodoMes: '2026-11',
      username: 'usr-1',
      userCardId: '1002003004',
      lecturaId: 45,
      readingCode: fullCode,
      claveCatastral: '14-293',
    });

    expect(result.readingId).toBe('L-EPAA-000000000045');
    expect(String(result.readingId).length).toBe(19);
    expect(result.sector).toBe(14);
    expect(result.account).toBe(293);
    expect(result.year).toBe(2026);
    expect(result.month).toBe('NOVIEMBRE');
  });

  it('should fallback to lecturaId when readingCode is not provided and preserve up to 20 chars', () => {
    const result = ReadingLegacyEventMapper.fromPostgresToLegacyEvent({
      sector: 1,
      cuenta: 2,
      lecturaAnterior: 0,
      lecturaActual: 10,
      fechaLectura: new Date('2026-10-01'),
      userCardId: '100200',
      lecturaId: 123456,
    });

    expect(result.readingId).toBe('123456');
  });
});
