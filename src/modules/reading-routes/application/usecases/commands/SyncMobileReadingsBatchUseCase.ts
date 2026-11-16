import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
  Optional,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UUID } from 'crypto';
import {
  IRouteAssignmentRepository,
  ROUTE_ASSIGNMENT_REPOSITORY,
  SyncBatchResult,
} from '../../../domain/contracts/route-assignment.repository.interface';
import { SyncMobileReadingsBatchRequest } from '../../dtos/request/route-dtos.request';
import { CreateReadingUseCase } from '../../../../reading/application/usecases/commands/CreateReadingUseCase';
import { CreateReadingRequest } from '../../../../reading/application/dtos/request/create-reading.request';
import {
  IReadingLegacyPublisherPort,
  READING_LEGACY_PUBLISHER_PORT,
  ReadingCreatedLegacyEvent,
} from '../../ports/reading-legacy-publisher.port';
import { ReadingLegacyEventMapper } from '../../mappers/reading-legacy-event.mapper';

/**
 * Caso de uso: Sincronización masiva de lecturas móviles de ruta.
 *
 * Aplica Clean Architecture y principios SOLID:
 * - Single Responsibility Principle (SRP): Orquesta la sincronización del lote,
 *   delegando la liquidación tarifaria y creación al caso de uso especializado CreateReadingUseCase,
 *   y la persistencia del avance de ruta al repositorio IRouteAssignmentRepository.
 * - Open/Closed Principle (OCP): No altera el módulo de lecturas preexistente; lo reutiliza como componente de primer orden.
 * - Dependency Inversion Principle (DIP): Depende de contratos e inyección de dependencias (IRouteAssignmentRepository y ModuleRef).
 */
@Injectable()
export class SyncMobileReadingsBatchUseCase {
  private readonly logger = new Logger(SyncMobileReadingsBatchUseCase.name);
  private resolvedCreateReadingUseCase?: CreateReadingUseCase;

  constructor(
    @Inject(ROUTE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IRouteAssignmentRepository,
    @Inject(READING_LEGACY_PUBLISHER_PORT)
    private readonly legacyPublisher: IReadingLegacyPublisherPort,
    private readonly moduleRef: ModuleRef,
    @Optional()
    @Inject(CreateReadingUseCase)
    createReadingUseCase?: CreateReadingUseCase,
  ) {
    this.resolvedCreateReadingUseCase = createReadingUseCase;
  }

  private getCreateReadingUseCase(): CreateReadingUseCase {
    if (this.resolvedCreateReadingUseCase) {
      return this.resolvedCreateReadingUseCase;
    }
    this.resolvedCreateReadingUseCase = this.moduleRef.get(
      CreateReadingUseCase,
      { strict: false },
    );
    return this.resolvedCreateReadingUseCase;
  }

  async execute(
    dto: SyncMobileReadingsBatchRequest,
    usuarioId: string,
    userCardId: string,
  ): Promise<SyncBatchResult> {
    if (!dto.asignacionId) {
      throw new BadRequestException('ID de asignación requerido.');
    }

    if (!dto.lecturas || dto.lecturas.length === 0) {
      throw new BadRequestException('El lote de lecturas está vacío.');
    }

    const assignmentInfo = await this.assignmentRepo.getAssignmentPeriod(
      dto.asignacionId,
    );

    if (!assignmentInfo) {
      return {
        success: false,
        totalSincronizados: 0,
        totalExitosos: 0,
        totalFallidos: dto.lecturas.length,
        errores: [
          {
            idDetalleAvance: 0,
            acometidaId: '',
            error: `Asignación ${dto.asignacionId} no encontrada.`,
          },
        ],
      };
    }

    const periodoMes = assignmentInfo.periodoMes;
    const [year, month] = periodoMes.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const previousMonthReading = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const createReadingUseCase = this.getCreateReadingUseCase();

    let totalExitosos = 0;
    let totalFallidos = 0;
    const errores: Array<{
      idDetalleAvance: number;
      acometidaId: string;
      error: string;
    }> = [];

    const legacyEvents: ReadingCreatedLegacyEvent[] = [];

    const isUuid = (val?: string) =>
      !!val &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        val,
      );

    for (const item of dto.lecturas) {
      try {
        const context =
          await this.assignmentRepo.getAssignmentDetailSyncContext(
            item.idDetalleAvance,
            dto.asignacionId,
          );

        if (!context) {
          throw new Error(
            `Detalle de avance ${item.idDetalleAvance} no corresponde a la asignación ${dto.asignacionId}`,
          );
        }

        const fechaHora = item.fechaHoraCaptura
          ? new Date(item.fechaHoraCaptura)
          : new Date();
        const horaFormatted = fechaHora.toTimeString().split(' ')[0];

        // Construir la solicitud canónica CreateReadingRequest requerida por el módulo reading
        const createReadingRequest: CreateReadingRequest = {
          connectionId: context.acometidaId,
          cadastralKey: context.claveCatastral,
          sector: Number(context.sector),
          account: Number(context.cuenta),
          previousReading: Number(context.lecturaAnterior ?? 0),
          currentReading: Number(item.lecturaActual),
          incomeCode: 0,
          rentalIncomeCode: 0,
          sewerRate: 0,
          readingValue: 0,
          consumptionM3: Math.max(
            0,
            Number(item.lecturaActual) - Number(context.lecturaAnterior ?? 0),
          ),
          totalValue: 0,
          averageConsumption: Number(context.averageConsumption ?? 0),
          averageValue: Number(context.averageValue ?? 0),
          previousMonthReading,
          currentMonthReading: periodoMes,
          novelty: item.novedadId ?? null,
          typeNoveltyReadingId: 1,
          meterStatus: 'BUENO',
          locationCapture:
            item.latitudGps != null && item.longitudGps != null
              ? { lat: Number(item.latitudGps), lng: Number(item.longitudGps) }
              : null,
          readingDate: fechaHora,
          readingTime: horaFormatted,
        };

        const effectiveUserId = (
          isUuid(usuarioId)
            ? usuarioId
            : isUuid(context.asignacionUsuarioId)
              ? context.asignacionUsuarioId
              : '00000000-0000-0000-0000-000000000001'
        ) as UUID;

        // Si el detalle ya fue procesado y cuenta con lectura asociada, garantizar consistencia de forma idempotente
        if (
          (context.estadoLectura === 'LEIDA' ||
            context.estadoLectura === 'NOVEDAD') &&
          context.lecturaId
        ) {
          this.logger.log(
            `Detalle de avance ${item.idDetalleAvance} ya registrado previamente con lectura ${context.lecturaId}.`,
          );
          totalExitosos++;
          continue;
        }

        // Ejecutar el caso de uso central del módulo reading (realiza tarifas, desglose comercial, novedades, observaciones)
        let readingCreated: any = null;
        try {
          readingCreated = await createReadingUseCase.execute(
            createReadingRequest,
            effectiveUserId,
          );
        } catch (createErr: any) {
          const errMsg = (
            createErr?.message ||
            createErr?.error ||
            ''
          ).toString();
          if (
            errMsg.toLowerCase().includes('ya existe') ||
            errMsg.toLowerCase().includes('conflict') ||
            errMsg.toLowerCase().includes('duplicate')
          ) {
            this.logger.log(
              `Lectura para acometida ${context.acometidaId} ya existía en periodo ${periodoMes}. Procediendo como exitoso.`,
            );
            readingCreated = { readingId: context.lecturaId ?? null };
          } else {
            throw createErr;
          }
        }

        const isNovedad =
          !!item.novedadId &&
          item.novedadId.trim() !== '' &&
          item.novedadId.toUpperCase() !== 'NORMAL';
        const nuevoEstado = isNovedad ? 'NOVEDAD' : 'LEIDA';

        // Actualizar detalle_avance_ruta con la lectura creada y coordenadas
        await this.assignmentRepo.updateAdvanceDetail({
          idDetalle: item.idDetalleAvance,
          estadoLectura: nuevoEstado,
          lecturaId: readingCreated?.readingId ?? null,
          latitudGps: item.latitudGps,
          longitudGps: item.longitudGps,
          fechaCaptura: fechaHora,
          novedad: item.novedadId ?? 'NORMAL',
          tipoNovedadLecturaId:
            (readingCreated as any)?.typeNoveltyReadingId ??
            (isNovedad ? 2 : 1),
        });

        totalExitosos++;

        // Construir y acumular el evento legacy para SQL Server 2000
        try {
          const legacyEvent =
            ReadingLegacyEventMapper.fromPostgresToLegacyEvent({
              sector: context.sector,
              cuenta: context.cuenta,
              lecturaAnterior: context.lecturaAnterior ?? 0,
              lecturaActual: item.lecturaActual,
              fechaLectura: fechaHora,
              horaLectura: horaFormatted,
              novedad: item.novedadId ?? 'NORMAL',
              periodoMes,
              username: usuarioId,
              userCardId: userCardId ?? '',
              lecturaId: readingCreated?.readingId ?? context.lecturaId,
              claveCatastral: context.claveCatastral,
            });
          legacyEvents.push(legacyEvent);
        } catch (mapErr: any) {
          this.logger.warn(
            `Error mapeando evento legacy para predio ${context.cuenta}: ${mapErr.message}`,
          );
        }
      } catch (err: any) {
        totalFallidos++;
        this.logger.warn(
          `Error al sincronizar lectura detalle ${item.idDetalleAvance}: ${err.message}`,
        );
        errores.push({
          idDetalleAvance: item.idDetalleAvance,
          acometidaId: item.acometidaId,
          error: err.message || 'Error desconocido al sincronizar',
        });
      }
    }

    if (legacyEvents.length > 0) {
      this.legacyPublisher
        .publishBatchReadingsCreated(legacyEvents)
        .catch((pubErr) => {
          this.logger.error(
            `[SyncBatch] Error emitiendo ${legacyEvents.length} eventos a Kafka para SQL Server 2000: ${pubErr.message}`,
            pubErr.stack,
          );
        });
      this.logger.log(
        `[SyncBatch] ${legacyEvents.length} lecturas encoladas hacia SQL Server 2000 de forma asíncrona.`,
      );
    }

    return {
      success: totalFallidos === 0,
      totalSincronizados: totalExitosos,
      totalExitosos,
      totalFallidos,
      errores,
    };
  }
}
