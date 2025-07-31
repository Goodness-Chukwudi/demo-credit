import type { Knex } from "knex";
import { addDefaultColumns } from "../../helpers/db/db";
import { BIT } from "../enums/enum";
import { TABLES } from "../../common/constants";

exports.up = function (knex: Knex) {
  return knex.schema
    .createTable(TABLES.LoginSession, function (table) {
      addDefaultColumns(table);
      table.dateTime("expiry_date").defaultTo(new Date(Date.now() + 86400000)); //1 day
      table.boolean("is_expired").defaultTo(false);
      table.boolean("logged_out").defaultTo(false);
      table.integer("user_id").unsigned().references("id").inTable(TABLES.User);
      table.enum("status", Object.values(BIT)).defaultTo(BIT.OFF);
    })
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists(TABLES.LoginSession);
};
