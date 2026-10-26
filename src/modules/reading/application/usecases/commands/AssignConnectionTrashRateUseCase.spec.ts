import { AssignConnectionTrashRateUseCase } from './AssignConnectionTrashRateUseCase';
import { InterfaceTrashRateRepository } from '../../../domain/contracts/trash-rate.interface.repository';
import { TrashRateAssignmentModel } from '../../../domain/schemas/model/trash-rate.model';

describe('AssignConnectionTrashRateUseCase (Reglas 2, 3 y 4 - Asignación de Tasa de Basura)', () => {
  let useCase: AssignConnectionTrashRateUseCase;
  let mockRepository: jest.Mocked<InterfaceTrashRateRepository>;

  beforeEach(() => {
    mockRepository = {
      findActiveAssignmentByConnection: jest.fn(),
      findActiveCategoryTariff: jest.fn(),
      saveAssignment: jest.fn().mockResolvedValue(undefined),
      saveBatchAssignments: jest.fn().mockResolvedValue(undefined),
      getEmelnorteData: jest.fn(),
      getActiveConnectionsByClientId: jest.fn(),
      findClientIdByConnectionId: jest.fn(),
    };

    useCase = new AssignConnectionTrashRateUseCase(mockRepository);
  });

  describe('Inmutabilidad de Asignaciones Existentes (Regla 1 y 2)', () => {
    it('retorna la asignación activa existente sin sobreescribir ni reinsertar si ya existe en acometida_tasa_basura', async () => {
      const existingAssignment = new TrashRateAssignmentModel(
        '22-492',
        '0200236479001',
        13.13,
        'EMELNORTE_DISTRIBUCION',
        'EMELNORTE-2025-09',
        1,
        39.38,
        4,
        3,
        true,
        true,
        true,
      );

      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(
        existingAssignment,
      );

      const result = await useCase.execute({
        connectionId: '22-492',
        clientId: '0200236479001',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 50,
      });

      expect(result).toBe(existingAssignment);
      expect(result.assignedAmount).toBe(13.13);
      expect(mockRepository.findActiveAssignmentByConnection).toHaveBeenCalledWith(
        '22-492',
      );
      expect(mockRepository.saveAssignment).not.toHaveBeenCalled();
    });
  });

  describe('Inserción de Nueva Acometida cuando Aún No Existe (Reglas 2 y 3)', () => {
    it('inserta en acometida_tasa_basura cuando la acometida no existe previamente en la tabla', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: '22-500',
        clientId: '0200236479001',
        categoryName: 'COMERCIAL',
        consumptionM3: 15,
      });

      expect(result.connectionId).toBe('22-500');
      expect(result.assignedAmount).toBe(20.44);
      expect(result.origin).toBe('TARIFA_NUEVA_ACOMETIDA');
      expect(result.versionSheet).toBe('TB-V1-2026');
      expect(result.isActive).toBe(true);

      // Verificación clave: DEBE INSERTARSE en acometida_tasa_basura
      expect(mockRepository.saveAssignment).toHaveBeenCalledTimes(1);
      expect(mockRepository.saveAssignment).toHaveBeenCalledWith(
        expect.objectContaining({
          connectionId: '22-500',
          originClientId: '0200236479001',
          assignedAmount: 20.44,
          origin: 'TARIFA_NUEVA_ACOMETIDA',
          versionSheet: 'TB-V1-2026',
        }),
      );
    });

    it('resuelve automáticamente el clientId desde la acometida si no es suministrado', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);
      (mockRepository.findClientIdByConnectionId as jest.Mock).mockResolvedValueOnce(
        '1002003004',
      );

      const result = await useCase.execute({
        connectionId: '22-600',
        categoryName: 'INDUSTRIAL',
      });

      expect(result.originClientId).toBe('1002003004');
      expect(result.assignedAmount).toBe(53.04);
      expect(mockRepository.findClientIdByConnectionId).toHaveBeenCalledWith(
        '22-600',
      );
      expect(mockRepository.saveAssignment).toHaveBeenCalledWith(
        expect.objectContaining({
          connectionId: '22-600',
          originClientId: '1002003004',
          assignedAmount: 53.04,
        }),
      );
    });
  });

  describe('Cálculo según Pliego Paramétrico por Categoría y Rangos de Consumo', () => {
    it('aplica tarifa fija COMERCIAL $20.44 e inserta', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'COM-01',
        clientId: 'CLI-01',
        categoryName: 'COMERCIAL',
        consumptionM3: 0,
      });

      expect(result.assignedAmount).toBe(20.44);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica tarifa fija INDUSTRIAL $53.04 e inserta', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'IND-01',
        clientId: 'CLI-02',
        categoryName: 'INDUSTRIAL',
        consumptionM3: 150,
      });

      expect(result.assignedAmount).toBe(53.04);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica rangos escalonados para RESIDENCIAL (0 a 10 m3 -> $2.31)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'RES-01',
        clientId: 'CLI-03',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 8,
      });

      expect(result.assignedAmount).toBe(2.31);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica rangos escalonados para RESIDENCIAL (11 a 30 m3 -> $3.33)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'RES-02',
        clientId: 'CLI-03',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 25,
      });

      expect(result.assignedAmount).toBe(3.33);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica rangos escalonados para RESIDENCIAL (31 a 50 m3 -> $4.66)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'RES-03',
        clientId: 'CLI-03',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 42,
      });

      expect(result.assignedAmount).toBe(4.66);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica rangos escalonados para RESIDENCIAL (51 a 100 m3 -> $11.02)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'RES-04',
        clientId: 'CLI-03',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 75,
      });

      expect(result.assignedAmount).toBe(11.02);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica rangos escalonados para RESIDENCIAL (101 a 200 m3 -> $12.85)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'RES-05',
        clientId: 'CLI-03',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 150,
      });

      expect(result.assignedAmount).toBe(12.85);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('aplica rangos escalonados para RESIDENCIAL (>= 201 m3 -> $19.26)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'RES-06',
        clientId: 'CLI-03',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 250,
      });

      expect(result.assignedAmount).toBe(19.26);
      expect(mockRepository.saveAssignment).toHaveBeenCalled();
    });

    it('garantiza el piso mínimo de $1.00 ante cualquier categoría no tarifada (Regla 4)', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'OTR-01',
        clientId: 'CLI-04',
        categoryName: 'OFICIAL_EXONERADA',
        consumptionM3: 0,
      });

      expect(result.assignedAmount).toBe(1.0);
      expect(mockRepository.saveAssignment).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedAmount: 1.0,
        }),
      );
    });
  });

  describe('Casos Borde y Configuración Opcional', () => {
    it('no persiste si se indica explícitamente persist: false', async () => {
      mockRepository.findActiveAssignmentByConnection.mockResolvedValueOnce(null);

      const result = await useCase.execute({
        connectionId: 'NO-SAVE-01',
        clientId: 'CLI-05',
        categoryName: 'RESIDENCIAL',
        consumptionM3: 10,
        persist: false,
      });

      expect(result.assignedAmount).toBe(2.31);
      expect(mockRepository.saveAssignment).not.toHaveBeenCalled();
    });

    it('opera de forma resiliente si el repositorio no está inyectado', async () => {
      const caseWithoutRepo = new AssignConnectionTrashRateUseCase(undefined);

      const result = await caseWithoutRepo.execute({
        connectionId: 'NO-REPO-01',
        clientId: 'CLI-06',
        categoryName: 'COMERCIAL',
      });

      expect(result.assignedAmount).toBe(20.44);
    });
  });
});
