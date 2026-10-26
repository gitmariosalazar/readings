import { DistributeEmelnorteTrashRateUseCase } from './DistributeEmelnorteTrashRateUseCase';
import { InterfaceTrashRateRepository } from '../../../domain/contracts/trash-rate.interface.repository';

describe('DistributeEmelnorteTrashRateUseCase (Regla 1 - Distribución Exacta EMELNORTE)', () => {
  let useCase: DistributeEmelnorteTrashRateUseCase;
  let mockRepository: jest.Mocked<InterfaceTrashRateRepository>;

  beforeEach(() => {
    mockRepository = {
      findActiveAssignmentByConnection: jest.fn(),
      findActiveCategoryTariff: jest.fn(),
      saveAssignment: jest.fn(),
      saveBatchAssignments: jest.fn().mockResolvedValue(undefined),
      getEmelnorteData: jest.fn(),
      getActiveConnectionsByClientId: jest.fn(),
    };

    useCase = new DistributeEmelnorteTrashRateUseCase(mockRepository);
  });

  it('distributes $39.38 among 3 active connections matching exact cent conservation and detecting cadastral mismatch', async () => {
    // Caso exacto presentado por el usuario:
    // Cliente '0200236479001', Septiembre = $39.38, 4 medidores en Emelnorte, 3 acometidas en EPAA
    const input = {
      clientId: '0200236479001',
      septemberTotal: 39.38,
      activeConnectionIds: ['22-240', '22-492', '22-493'],
      emelnorteQuantity: 4,
      persist: true,
    };

    const result = await useCase.execute(input);

    expect(result).toHaveLength(3);

    // 3938 centavos / 3 = 1312 centavos base, residuo = 2 centavos
    // Acometida 1 (22-240): 1312 + 1 = 1313 centavos = $13.13
    expect(result[0].connectionId).toBe('22-240');
    expect(result[0].assignedAmount).toBe(13.13);
    expect(result[0].isPennyRemainder).toBe(true);
    expect(result[0].hasCadastralMismatch).toBe(true);

    // Acometida 2 (22-492): 1312 + 1 = 1313 centavos = $13.13
    expect(result[1].connectionId).toBe('22-492');
    expect(result[1].assignedAmount).toBe(13.13);
    expect(result[1].isPennyRemainder).toBe(true);
    expect(result[1].hasCadastralMismatch).toBe(true);

    // Acometida 3 (22-493): 1312 + 0 = 1312 centavos = $13.12
    expect(result[2].connectionId).toBe('22-493');
    expect(result[2].assignedAmount).toBe(13.12);
    expect(result[2].isPennyRemainder).toBe(false);
    expect(result[2].hasCadastralMismatch).toBe(true);

    // Suma exacta garantizada al centavo: 13.13 + 13.13 + 13.12 = 39.38
    const totalSum = Number(
      result.reduce((sum, item) => sum + item.assignedAmount, 0).toFixed(2),
    );
    expect(totalSum).toBe(39.38);

    // Verificación de persistencia en el repositorio
    expect(mockRepository.saveBatchAssignments).toHaveBeenCalledTimes(1);
    const savedModels = mockRepository.saveBatchAssignments.mock.calls[0][0];
    expect(savedModels).toHaveLength(3);
    expect(savedModels[0].connectionId).toBe('22-240');
    expect(savedModels[0].assignedAmount).toBe(13.13);
    expect(savedModels[0].versionSheet).toBe('EMELNORTE-2025-09');
    expect(savedModels[0].startDate.getUTCFullYear()).toBe(2026);
    expect(savedModels[0].startDate.getUTCMonth()).toBe(0); // Enero
  });

  it('distributes cleanly without remainder when total divides evenly', async () => {
    const input = {
      clientId: '1001234567',
      septemberTotal: 30.0,
      activeConnectionIds: ['10-001', '10-002', '10-003'],
      emelnorteQuantity: 3,
    };

    const result = await useCase.execute(input);
    expect(result).toHaveLength(3);
    expect(result[0].assignedAmount).toBe(10.0);
    expect(result[1].assignedAmount).toBe(10.0);
    expect(result[2].assignedAmount).toBe(10.0);
    expect(result[0].isPennyRemainder).toBe(false);
    expect(result[0].hasCadastralMismatch).toBe(false);
  });

  it('enforces Regla 4 (Piso mínimo de $1.00) when division yields less than $1.00', async () => {
    const input = {
      clientId: '1009999999',
      septemberTotal: 1.5, // 1.50 / 3 = 0.50 cada una
      activeConnectionIds: ['A-1', 'A-2', 'A-3'],
      emelnorteQuantity: 3,
    };

    const result = await useCase.execute(input);
    expect(result).toHaveLength(3);
    expect(result[0].assignedAmount).toBe(1.0);
    expect(result[1].assignedAmount).toBe(1.0);
    expect(result[2].assignedAmount).toBe(1.0);
  });

  it('returns empty array when activeConnectionIds is empty (prevents division by zero)', async () => {
    const input = {
      clientId: '1000000000',
      septemberTotal: 50.0,
      activeConnectionIds: [],
    };

    const result = await useCase.execute(input);
    expect(result).toEqual([]);
  });
});
