export class SectorPerformanceFilterRequest {
  month!: string;
  sector?: number;
  sortBy?: 'revenue' | 'volume' | 'readings' | 'sector';
}
