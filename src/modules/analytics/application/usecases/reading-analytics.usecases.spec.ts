import { Test, TestingModule } from '@nestjs/testing';
import { GetExecutiveDashboardAnalyticsUseCase } from './GetExecutiveDashboardAnalyticsUseCase';
import { GetSectorPerformanceAnalyticsUseCase } from './GetSectorPerformanceAnalyticsUseCase';
import { GetMonthlyTrendAnalyticsUseCase } from './GetMonthlyTrendAnalyticsUseCase';
import { GetNoveltyEconomicImpactAnalyticsUseCase } from './GetNoveltyEconomicImpactAnalyticsUseCase';
import { GetTopConsumersAnalyticsUseCase } from './GetTopConsumersAnalyticsUseCase';
import { GetInterannualComparisonAnalyticsUseCase } from './GetInterannualComparisonAnalyticsUseCase';
import { InterfaceReadingAnalyticsRepository } from '../../domain/contracts/reading-analytics.interface.repository';
import { ExecutiveDashboardModel } from '../../domain/schemas/model/executive-dashboard.model';
import { SectorPerformanceModel } from '../../domain/schemas/model/sector-performance.model';
import { MonthlyTrendModel } from '../../domain/schemas/model/monthly-trend.model';
import { NoveltyEconomicImpactModel } from '../../domain/schemas/model/novelty-economic-impact.model';
import { TopConsumerModel } from '../../domain/schemas/model/top-consumer.model';
import { InterannualComparisonModel } from '../../domain/schemas/model/interannual-comparison.model';
import { ReadingAnalyticsSQLAdapter } from '../../infrastructure/adapters/reading-analytics-sql.adapter';

describe('Reading Analytics UseCases', () => {
  let executiveDashboardUseCase: GetExecutiveDashboardAnalyticsUseCase;
  let sectorPerformanceUseCase: GetSectorPerformanceAnalyticsUseCase;
  let monthlyTrendUseCase: GetMonthlyTrendAnalyticsUseCase;
  let noveltyImpactUseCase: GetNoveltyEconomicImpactAnalyticsUseCase;
  let topConsumersUseCase: GetTopConsumersAnalyticsUseCase;
  let interannualComparisonUseCase: GetInterannualComparisonAnalyticsUseCase;

  const mockExecutiveDashboardModel = new ExecutiveDashboardModel(
    '2026-10',
    15939,
    40,
    15939,
    328479.0,
    20.61,
    0.0,
    6341.0,
    166862.77,
    66748.76,
    233611.53,
    14.66,
    0.508,
    6579,
    41.28,
  );

  const mockSectorPerformanceModel = new SectorPerformanceModel(
    1,
    2819,
    57976.0,
    20.57,
    26697.79,
    10679.11,
    37376.9,
    15.57,
    10.47,
    0.4605,
    1020,
    36.18,
    1,
    1,
  );

  const mockMonthlyTrendModel = new MonthlyTrendModel(
    '2026-10',
    15939,
    328479.0,
    17496.0,
    5.63,
    166862.77,
    66748.76,
    233611.53,
    33898.5,
    16.97,
  );

  const mockNoveltyImpactModel = new NoveltyEconomicImpactModel(
    'NORMAL',
    9360,
    58.72,
    190245.0,
    20.33,
    83099.3,
    33241.69,
    116340.99,
  );

  const mockTopConsumerModel = new TopConsumerModel(
    2537592,
    4,
    226,
    '4-226',
    '4-226',
    '040308013',
    '21 DE JUNIO Y BOLIVAR',
    'CLIENTE TEST',
    5.0,
    6346.0,
    6341.0,
    0.0,
    0.0,
    0.0,
    'CONSUMO EXCESIVO',
    '2026-10-08T09:21:32.355Z',
    'POINT(-78.2138041 0.3368672)',
  );

  const mockInterannualModel = new InterannualComparisonModel(
    1,
    313,
    3087,
    3087,
    0,
    58419.0,
    65248.0,
    6829.0,
    11.69,
    35904.64,
    42944.16,
    7039.52,
    19.61,
    'ALTA RECUPERACION (>+15%)',
  );

  const mockRepository: InterfaceReadingAnalyticsRepository = {
    getExecutiveDashboard: jest.fn().mockResolvedValue(mockExecutiveDashboardModel),
    getSectorPerformance: jest.fn().mockResolvedValue([mockSectorPerformanceModel]),
    getMonthlyTrend: jest.fn().mockResolvedValue([mockMonthlyTrendModel]),
    getNoveltyEconomicImpact: jest.fn().mockResolvedValue([mockNoveltyImpactModel]),
    getTopConsumers: jest.fn().mockResolvedValue([mockTopConsumerModel]),
    getInterannualComparison: jest.fn().mockResolvedValue([mockInterannualModel]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetExecutiveDashboardAnalyticsUseCase,
        GetSectorPerformanceAnalyticsUseCase,
        GetMonthlyTrendAnalyticsUseCase,
        GetNoveltyEconomicImpactAnalyticsUseCase,
        GetTopConsumersAnalyticsUseCase,
        GetInterannualComparisonAnalyticsUseCase,
        {
          provide: 'ReadingAnalyticsRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    executiveDashboardUseCase = module.get<GetExecutiveDashboardAnalyticsUseCase>(
      GetExecutiveDashboardAnalyticsUseCase,
    );
    sectorPerformanceUseCase = module.get<GetSectorPerformanceAnalyticsUseCase>(
      GetSectorPerformanceAnalyticsUseCase,
    );
    monthlyTrendUseCase = module.get<GetMonthlyTrendAnalyticsUseCase>(
      GetMonthlyTrendAnalyticsUseCase,
    );
    noveltyImpactUseCase = module.get<GetNoveltyEconomicImpactAnalyticsUseCase>(
      GetNoveltyEconomicImpactAnalyticsUseCase,
    );
    topConsumersUseCase = module.get<GetTopConsumersAnalyticsUseCase>(
      GetTopConsumersAnalyticsUseCase,
    );
    interannualComparisonUseCase = module.get<GetInterannualComparisonAnalyticsUseCase>(
      GetInterannualComparisonAnalyticsUseCase,
    );
  });

  it('should return executive dashboard analytics response', async () => {
    const result = await executiveDashboardUseCase.execute({ month: '2026-10' });
    expect(result.analyzedPeriod).toBe('2026-10');
    expect(result.totalReadingsTaken).toBe(15939);
    expect(result.totalBilledUsd).toBe(233611.53);
  });

  it('should return sector performance analytics response list', async () => {
    const result = await sectorPerformanceUseCase.execute({ month: '2026-10' });
    expect(result).toHaveLength(1);
    expect(result[0].sector).toBe(1);
    expect(result[0].consumedVolumeM3).toBe(57976.0);
  });

  it('should return monthly trend analytics response list', async () => {
    const result = await monthlyTrendUseCase.execute({ year: 2026 });
    expect(result).toHaveLength(1);
    expect(result[0].readingMonth).toBe('2026-10');
    expect(result[0].deltaVolumeM3).toBe(17496.0);
  });

  it('should return novelty economic impact analytics response list', async () => {
    const result = await noveltyImpactUseCase.execute({ month: '2026-10' });
    expect(result).toHaveLength(1);
    expect(result[0].novelty).toBe('NORMAL');
    expect(result[0].casesCount).toBe(9360);
  });

  it('should return top consumers analytics response list', async () => {
    const result = await topConsumersUseCase.execute({ month: '2026-10', limit: 10 });
    expect(result).toHaveLength(1);
    expect(result[0].readingId).toBe(2537592);
    expect(result[0].consumedVolumeM3).toBe(6341.0);
  });

  it('should return interannual comparison analytics response list', async () => {
    const result = await interannualComparisonUseCase.execute({
      baseYear: 2025,
      targetYear: 2026,
      startMonthNumber: 1,
      endMonthNumber: 10,
    });
    expect(result).toHaveLength(1);
    expect(result[0].sector).toBe(1);
    expect(result[0].readingsBaseYear).toBe(3087);
    expect(result[0].readingsTargetYear).toBe(3087);
    expect(result[0].deltaReadings).toBe(0);
    expect(result[0].managementDiagnostic).toBe('ALTA RECUPERACION (>+15%)');
  });

  it('should map SQL results correctly via ReadingAnalyticsSQLAdapter without context binding issues', () => {
    const mockSqlResult = {
      sector: '1',
      acometidas_homologas: '2800',
      lecturas_2025: '2800',
      lecturas_2026: '2800',
      delta_lecturas: '0',
      m3_2025: '52482.00',
      m3_2026: '58028.00',
      delta_m3: '5546.00',
      pct_var_m3: '10.57',
      facturado_2025_usd: '32342.48',
      facturado_2026_usd: '37427.37',
      delta_facturado_usd: '5084.89',
      pct_var_facturado: '15.72',
      diagnostico_gestion: 'ALTA RECUPERACION (>+15%)',
    };

    // Test both direct call and Array.prototype.map callback
    const directResult = ReadingAnalyticsSQLAdapter.toInterannualComparisonModel(mockSqlResult);
    expect(directResult.sector).toBe(1);
    expect(directResult.deltaVolumeM3).toBe(5546.0);

    const mapResult = [mockSqlResult].map(ReadingAnalyticsSQLAdapter.toInterannualComparisonModel);
    expect(mapResult).toHaveLength(1);
    expect(mapResult[0].sector).toBe(1);
    expect(mapResult[0].billedTargetYearUsd).toBe(37427.37);
  });
});
