import { Pool, PoolConfig, QueryResult } from 'pg';
import { environments } from 'src/settings/environments/environments';
import { DatabaseAbstract } from '../abstract/abstract.database';

// Custom error class for database-specific errors
class DatabaseError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseServicePostgreSQL extends DatabaseAbstract {
  private static instance: DatabaseServicePostgreSQL;
  private pool: Pool;
  private isConnected: boolean = false;
  private readonly maxRetries: number = 3;
  private readonly retryDelayMs: number = 1000;
  private readonly queryTimeoutMs: number = 10000;

  private constructor() {
    super();
    // Validate environment variables
    this.validateConfig();
    
    // Configure connection pool with sensible defaults
    const poolConfig: PoolConfig = {
      user: environments.DATABASE_USER,
      host: environments.DATABASE_HOST,
      password: environments.DATABASE_PASSWORD,
      database: environments.DATABASE_NAME,
      port: environments.DATABASE_PORT,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Connection timeout
    };

    this.pool = new Pool(poolConfig);
    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      this.isConnected = false;
    });
  }

  // Singleton pattern
  public static getInstance(): DatabaseServicePostgreSQL {
    if (!DatabaseServicePostgreSQL.instance) {
      DatabaseServicePostgreSQL.instance = new DatabaseServicePostgreSQL();
    }
    return DatabaseServicePostgreSQL.instance;
  }

  private validateConfig(): void {
    const requiredConfigs = {
      databaseUsername: environments.DATABASE_USER,
      databaseHostname: environments.DATABASE_HOST,
      databasePassword: environments.DATABASE_PASSWORD,
      databaseName: environments.DATABASE_NAME,
      databasePort: environments.DATABASE_PORT
    };

    for (const [key, value] of Object.entries(requiredConfigs)) {
      if (!value) {
        throw new DatabaseError(`Missing required configuration: ${key}`);
      }
    }
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to PostgreSQL');
      return;
    }

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.pool.query('SELECT NOW()');
        this.isConnected = true;
        console.log('🛢️ Connected to PostgreSQL successfully 🎉!');
        return;
      } catch (error) {
        const errorMessage = `Attempt ${attempt}/${this.maxRetries} - Failed to connect to PostgreSQL: ${error.message}`;
        console.error(errorMessage);

        if (attempt === this.maxRetries) {
          throw new DatabaseError('Database connection failed after maximum retries', error.code);
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, this.retryDelayMs * Math.pow(2, attempt)));
      }
    }
  }

  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isConnected) {
      throw new DatabaseError('Database is not connected');
    }

    try {
      // Set query timeout
      const result: QueryResult<T> = await Promise.race([
        this.pool.query<T>(sql, params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new DatabaseError('Query timeout')), this.queryTimeoutMs)
        )
      ]) as QueryResult<T>;

      console.log(`Query executed successfully: ${sql.slice(0, 50)}...`);
      return result.rows;
    } catch (error) {
      const errorMessage = `Database query failed: ${error.message}`;
      console.error(errorMessage, { sql, params });
      throw new DatabaseError(errorMessage, error.code);
    }
  }

  public async close(): Promise<void> {
    if (!this.isConnected) {
      console.log('Database connection already closed');
      return;
    }

    try {
      await this.pool.end();
      this.isConnected = false;
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error(`Failed to close database connection: ${error.message}`);
      throw new DatabaseError('Failed to close database connection', error.code);
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}