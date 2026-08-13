import { Injectable } from '@nestjs/common';
import { InterfaceNoveltyRepository } from '../../../../domain/contracts/novelty.interface.repository';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { NoveltyModel } from '../../../../domain/schemas/model/novelty.model';
import { NoveltySQLResult } from '../../../interfaces/sql/novelty.sql-result';
import { NoveltySQLAdapter } from '../../../adapters/novelty-sql.adapter';

@Injectable()
export class NoveltyPersistenceMySQL implements InterfaceNoveltyRepository {
  // This class can be used to implement PostgreSQL-specific persistence logic for novelties.
  // For example, you might have methods here that interact with a PostgreSQL database using an ORM like TypeORM or Sequelize.
  constructor(
    private readonly databaseService: DatabaseAbstract, // Replace 'any' with the actual type of your database service or ORM instance.
  ) {
    // Initialize any necessary dependencies here, such as a database connection or ORM instance.
  }

  async findAllNovelties(): Promise<NoveltyModel[]> {
    // Implement the logic to retrieve all novelties from the PostgreSQL database.
    // This is a placeholder implementation. You should replace it with actual database queries.
    const sql = `
      SELECT 
          tipo_novedad_lectura_id AS id,
          nombre AS title,
          descripcion AS description,
          min_porcentaje AS min_percentage,
          COALESCE(max_porcentaje, null) AS max_percentage,
          accion_recomendada AS action_recommended
      FROM 
          tipo_novedad_lectura
      ORDER BY 
          tipo_novedad_lectura_id ASC;
    `;
    const results = await this.databaseService.query<NoveltySQLResult>(sql);
    return results.map(NoveltySQLAdapter.toDomain);
  }
}
