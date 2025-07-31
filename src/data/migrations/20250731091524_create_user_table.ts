import type { Knex } from "knex";
import { addDefaultColumns } from "../../helpers/db/db";
import { USER_STATUS } from "../enums/enum";
import { TABLES } from "../../common/constants";

exports.up = function (knex: Knex) {
  return knex.schema
    .createTable(TABLES.User, function (table) {
      addDefaultColumns(table);
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
      table.string("email", 255).unique().notNullable();
      table.enum("status", Object.values(USER_STATUS)).defaultTo(USER_STATUS.PENDING)
    })
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists(TABLES.User);
};
