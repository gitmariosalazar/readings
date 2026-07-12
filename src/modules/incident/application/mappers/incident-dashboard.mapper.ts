import {
  DistribucionCategoriaDto,
  DistribucionEstadoDto,
  DistribucionOrigenDto,
  DistribucionPrioridadDto,
  IncidenteCriticoDto,
  IncidentDashboardResponseDto,
  KpisGeneralesDto,
  TendenciaDiariaDto,
} from '../dtos/response/incident-dashboard.dto';

export class IncidentDashboardMapper {
  static toDto(rawData: Record<string, unknown> | null): IncidentDashboardResponseDto | null {
    if (!rawData) return null;

    return {
      kpis_generales: this.mapKpis(rawData.kpis_generales as Record<string, unknown>),
      por_estado: this.mapEstados(rawData.por_estado as Record<string, unknown>[]),
      por_categoria: this.mapCategorias(rawData.por_categoria as Record<string, unknown>[]),
      por_origen_reporte: this.mapOrigenes(rawData.por_origen_reporte as Record<string, unknown>[]),
      por_prioridad: this.mapPrioridades(rawData.por_prioridad as Record<string, unknown>[]),
      tendencia_ultimos_30_dias: this.mapTendencias(rawData.tendencia_ultimos_30_dias as Record<string, unknown>[]),
      atencion_inmediata: this.mapCriticos(rawData.atencion_inmediata as Record<string, unknown>[]),
    };
  }

  private static mapKpis(raw: Record<string, unknown> | null): KpisGeneralesDto {
    if (!raw) {
      return {
        total_incidentes: 0,
        total_pendientes: 0,
        total_resueltos: 0,
        total_criticos_activos: 0,
        costo_reparacion_acumulado: 0,
        tiempo_promedio_resolucion_dias: 0,
      };
    }
    return {
      total_incidentes: Number(raw.total_incidentes) || 0,
      total_pendientes: Number(raw.total_pendientes) || 0,
      total_resueltos: Number(raw.total_resueltos) || 0,
      total_criticos_activos: Number(raw.total_criticos_activos) || 0,
      costo_reparacion_acumulado: Number(raw.costo_reparacion_acumulado) || 0,
      tiempo_promedio_resolucion_dias: Number(raw.tiempo_promedio_resolucion_dias) || 0,
    };
  }

  private static mapEstados(raw: Record<string, unknown>[] | null): DistribucionEstadoDto[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      estado: String(r.estado || 'DESCONOCIDO'),
      cantidad: Number(r.cantidad) || 0,
    }));
  }

  private static mapCategorias(raw: Record<string, unknown>[] | null): DistribucionCategoriaDto[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      categoria: String(r.categoria || 'SIN CATEGORÍA'),
      cantidad: Number(r.cantidad) || 0,
      costo_total: Number(r.costo_total) || 0,
    }));
  }

  private static mapOrigenes(raw: Record<string, unknown>[] | null): DistribucionOrigenDto[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      origen: String(r.origen || 'DESCONOCIDO'),
      cantidad: Number(r.cantidad) || 0,
    }));
  }

  private static mapPrioridades(raw: Record<string, unknown>[] | null): DistribucionPrioridadDto[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      prioridad: String(r.prioridad || 'DESCONOCIDO'),
      cantidad: Number(r.cantidad) || 0,
    }));
  }

  private static mapTendencias(raw: Record<string, unknown>[] | null): TendenciaDiariaDto[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      fecha: String(r.fecha || ''),
      cantidad_reportada: Number(r.cantidad_reportada) || 0,
    }));
  }

  private static mapCriticos(raw: Record<string, unknown>[] | null): IncidenteCriticoDto[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      incident_code: String(r.incident_code || ''),
      connection_id: String(r.connection_id || ''),
      category: String(r.category || ''),
      type: String(r.type || ''),
      days_open: Number(r.days_open) || 0,
      latitude: r.latitude != null ? Number(r.latitude) : null,
      longitude: r.longitude != null ? Number(r.longitude) : null,
    }));
  }
}
