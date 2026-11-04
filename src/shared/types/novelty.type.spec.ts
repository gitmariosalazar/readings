import {
  getTypeCurrentConsumption,
  INovelty,
  BASE_CONSUMPTION_THRESHOLD_M3,
} from './novelty.type';

describe('getTypeCurrentConsumption - Escudo de Tarifa Base (0 a 10 m3)', () => {
  const mockNovelties: INovelty[] = [
    {
      id: 1,
      title: 'NORMAL',
      description: 'Consumo dentro del rango esperado.',
      minPercentage: 60.0,
      maxPercentage: 140.0,
      actionRecommended: 'Registrar lectura normalmente.',
    },
    {
      id: 2,
      title: 'CONSUMO BAJO',
      description: 'Consumo bajo (20-59.99%).',
      minPercentage: 20.0,
      maxPercentage: 59.99,
      actionRecommended: 'Verificar medidor.',
    },
    {
      id: 3,
      title: 'CONSUMO ALTO',
      description: 'Consumo alto (140.01-200%).',
      minPercentage: 140.01,
      maxPercentage: 200.0,
      actionRecommended: 'Inspeccionar en campo.',
    },
    {
      id: 4,
      title: 'CONSUMO MUY BAJO',
      description: 'Consumo extremadamente bajo (0-19.99%).',
      minPercentage: 0.0,
      maxPercentage: 19.99,
      actionRecommended: 'INSPECCIÓN URGENTE.',
    },
    {
      id: 5,
      title: 'CONSUMO EXCESIVO',
      description: 'Consumo extremadamente alto (>200%).',
      minPercentage: 200.01,
      maxPercentage: null,
      actionRecommended: 'EMERGENCIA: Fuga grave o error en medidor.',
    },
    {
      id: 6,
      title: 'LECTURA INVÁLIDA',
      description: 'Lectura inconsistente.',
      minPercentage: null,
      maxPercentage: null,
      actionRecommended: 'INSPECCIÓN INMEDIATA.',
    },
    {
      id: 7,
      title: 'SIN LECTURA',
      description: 'No se pudo obtener lectura.',
      minPercentage: null,
      maxPercentage: null,
      actionRecommended: 'Programar nueva visita.',
    },
  ];

  it('debe clasificar como NORMAL si el consumo es 10 m3 aunque el promedio histórico sea 0 m3 (Escudo Base)', () => {
    // Caso: Casa desocupada durante meses que pasa a consumir 10 m3
    const result = getTypeCurrentConsumption(0, 10, 0, mockNovelties);

    expect(result.id).toBe(1);
    expect(result.title).toBe('NORMAL');
  });

  it('debe admitir averageValue como 4to argumento opcional y clasificar correctamente como NORMAL', () => {
    // Sobrecarga de 5 argumentos pasando averageValue ($3.70 base residencial)
    const result = getTypeCurrentConsumption(0, 10, 0, 3.7, mockNovelties);

    expect(result.id).toBe(1);
    expect(result.title).toBe('NORMAL');
  });

  it('debe clasificar como NORMAL si el consumo es 8 m3 y el promedio histórico es 1 m3', () => {
    // Sin el escudo base, 8/1 = 800% hubiera sido "CONSUMO EXCESIVO" (falso positivo)
    const result = getTypeCurrentConsumption(100, 108, 1, 3.7, mockNovelties);

    expect(result.id).toBe(1);
    expect(result.title).toBe('NORMAL');
  });

  it('debe clasificar como CONSUMO MUY BAJO si el consumo es exactamente 0 m3', () => {
    const result = getTypeCurrentConsumption(50, 50, 15, mockNovelties);

    expect(result.id).toBe(4);
    expect(result.title).toBe('CONSUMO MUY BAJO');
  });

  it('debe clasificar como LECTURA INVÁLIDA si la lectura actual es menor a la anterior', () => {
    const result = getTypeCurrentConsumption(50, 40, 15, mockNovelties);

    expect(result.id).toBe(6);
    expect(result.title).toBe('LECTURA INVÁLIDA');
  });

  it('debe clasificar como CONSUMO EXCESIVO (Fuga) si el consumo es 45 m3 y el promedio histórico venía en 0 m3', () => {
    // 45 m3 supera los 10 m3 de la base. Al comparar con la base de 10 m3: 45/10 = 450% (>200%)
    const result = getTypeCurrentConsumption(0, 45, 0, mockNovelties);

    expect(result.id).toBe(5);
    expect(result.title).toBe('CONSUMO EXCESIVO');
  });

  it('debe clasificar como CONSUMO EXCESIVO (Fuga) si un usuario habitual de 15 m3 sube a 55 m3', () => {
    // 55 m3 > 15 m3 * 3.0 -> >300%
    const result = getTypeCurrentConsumption(100, 155, 15, mockNovelties);

    expect(result.id).toBe(5);
    expect(result.title).toBe('CONSUMO EXCESIVO');
  });

  it('debe clasificar como SIN LECTURA si alguno de los parámetros requeridos es nulo', () => {
    const result = getTypeCurrentConsumption(null, 10, 15, mockNovelties);

    expect(result.id).toBe(7);
    expect(result.title).toBe('SIN LECTURA');
  });
});
