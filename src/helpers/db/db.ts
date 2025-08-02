import knex, { Knex } from 'knex';
import config from '../../knexfile';
import Env from '../../common/environment_variables';

const db = knex(config[Env.ENVIRONMENT]);

const addDefaultColumns = (table: Knex.CreateTableBuilder, knex: Knex) => {
    table.increments('id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
    table.datetime('deleted_at').nullable();
}

export {
    db,
    addDefaultColumns
}