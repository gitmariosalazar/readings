import { TariffTrashRateCalculator } from './tariff-trash-rate.calculator';
import {
  TrashRateCategoryTariffModel,
  TrashRateRangeModel,
} from '../../../domain/schemas/model/trash-rate.model';

describe('TariffTrashRateCalculator (Reglas 2, 3 y 4 de Tasa de Basura)', () => {
  describe('Cálculo por Defecto (Reglas Paramétricas Base)', () => {
    it('calculates COMERCIAL category with flat rate $20.44', () => {
      const result = TariffTrashRateCalculator.calculate('COMERCIAL', 25);
      expect(result.amount).toBe(20.44);
      expect(result.formula).toContain('Tarifa fija COMERCIAL: $20.44');
      expect(result.versionSheet).toBe('TB-V1-2026');
    });

    it('calculates INDUSTRIAL category with flat rate $53.04', () => {
      const result = TariffTrashRateCalculator.calculate('INDUSTRIAL', 80);
      expect(result.amount).toBe(53.04);
      expect(result.formula).toContain('Tarifa fija INDUSTRIAL: $53.04');
    });

    it('calculates RESIDENCIAL category correctly for all consumption brackets', () => {
      // 0 - 10 m3 -> $2.31
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 0).amount).toBe(2.31);
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 10).amount).toBe(2.31);

      // 11 - 30 m3 -> $3.33
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 11).amount).toBe(3.33);
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 30).amount).toBe(3.33);

      // 31 - 50 m3 -> $4.66
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 31).amount).toBe(4.66);
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 50).amount).toBe(4.66);

      // 51 - 100 m3 -> $11.02
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 51).amount).toBe(11.02);
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 100).amount).toBe(11.02);

      // 101 - 200 m3 -> $12.85
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 101).amount).toBe(12.85);
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 200).amount).toBe(12.85);

      // >= 201 m3 -> $19.26
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 201).amount).toBe(19.26);
      expect(TariffTrashRateCalculator.calculate('RESIDENCIAL', 500).amount).toBe(19.26);
    });

    it('handles negative or invalid consumption in RESIDENCIAL by falling back to base rate $2.31', () => {
      const result = TariffTrashRateCalculator.calculate('RESIDENCIAL', -5);
      expect(result.amount).toBe(2.31);
    });

    it('enforces Regla 4 (Piso mínimo absoluto de $1.00) for unknown or zero-rate categories', () => {
      const result = TariffTrashRateCalculator.calculate('OFICIAL', 15);
      // OFICIAL calcula $0.00 pero por regla 4 se eleva al piso de $1.00
      expect(result.amount).toBe(1.0);
      expect(result.formula).toContain('Ajuste a piso mínimo de $1.00');
    });
  });

  describe('Cálculo Dinámico con Configuración de BD (Pliego Paramétrico)', () => {
    it('uses database dynamic flat tariff if provided', () => {
      const config = new TrashRateCategoryTariffModel(
        6,
        'COMERCIAL',
        'FIJO',
        1.0,
        25.0,
        'TB-ESTUDIO-2025',
      );

      const result = TariffTrashRateCalculator.calculate('COMERCIAL', 10, config);
      expect(result.amount).toBe(25.0);
      expect(result.versionSheet).toBe('TB-ESTUDIO-2025');
    });

    it('uses database dynamic ranges if provided', () => {
      const ranges = [
        new TrashRateRangeModel(0, 15, 3.5, 1, 'RNG-V2'),
        new TrashRateRangeModel(16, 40, 5.5, 2, 'RNG-V2'),
      ];
      const config = new TrashRateCategoryTariffModel(
        2,
        'RESIDENCIAL',
        'POR_RANGOS_CONSUMO',
        1.0,
        null,
        'TB-V2-2026',
        ranges,
      );

      const result = TariffTrashRateCalculator.calculate('RESIDENCIAL', 12, config);
      expect(result.amount).toBe(3.5);
      expect(result.versionSheet).toBe('RNG-V2');
    });
  });
});
