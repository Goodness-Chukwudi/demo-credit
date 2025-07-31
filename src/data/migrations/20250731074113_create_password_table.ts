import type { Knex } from "knex";
import { addDefaultColumns } from "../../helpers/db/db";
import { PASSWORD_STATUS } from "../enums/enum";
import { TABLES } from "../../common/constants";

exports.up = function (knex: Knex) {
  return knex.schema
    .createTable(TABLES.Password, function (table) {
      addDefaultColumns(table);
      table.string("password").notNullable();
      table.string("email", 255).notNullable();
      table.string("user_id").unsigned().references("id").inTable(TABLES.User);
      table.enum("status", Object.values(PASSWORD_STATUS)).defaultTo(PASSWORD_STATUS.ACTIVE)
    })
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists(TABLES.Password);
};
