import knex, { Knex } from 'knex';
import { config } from '../../knexfile';
import Env from '../../common/environment_variables';

const db = knex(config[Env.ENVIRONMENT]);

const addDefaultColumns = (table: Knex.CreateTableBuilder) => {
    table.increments('id');
    table.timestamps(true, true);
    table.datetime('deleted_at').nullable();
}

export {
    db,
    addDefaultColumns
}