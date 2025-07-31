import type { Knex } from 'knex';
import Env from './common/environment_variables';

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: Env.DB_HOST,
      user: Env.DB_USER,
      password: Env.DB_PASSWORD,
      database: Env.DB_NAME
    },
    pool: { min: 0, max: 5 },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: './src/data/migrations'
    },
  },
};
