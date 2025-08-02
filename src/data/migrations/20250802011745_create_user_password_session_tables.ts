import type { Knex } from "knex";
import { addDefaultColumns } from "../../helpers/db/db";
import { BIT, GENDER, PASSWORD_STATUS, USER_STATUS } from "../enums/enum";
import { TABLES } from "../../common/constants";

exports.up = async function (knex: Knex) {
    const hasUserTable = await knex.schema.hasTable(TABLES.User);
    if (!hasUserTable) {
        await knex.schema.createTable(TABLES.User, function (table) {
            addDefaultColumns(table, knex);
            table.string("first_name", 255).notNullable().index();
            table.string("last_name", 255).notNullable().index();
            table.enum("gender", Object.values(GENDER)).notNullable();
            table.string("email", 255).unique().notNullable().index();
            table.string("phone", 20).notNullable();
            table.string("address", 255).notNullable();
            table.date("dob").notNullable();
            table.enum("status", Object.values(USER_STATUS)).defaultTo(USER_STATUS.PENDING)
        })
    }

    const hasPasswordTable = await knex.schema.hasTable(TABLES.Password);
    if (!hasPasswordTable) {
        await knex.schema.createTable(TABLES.Password, function (table) {
            addDefaultColumns(table, knex);
            table.string("password").notNullable();
            table.string("email", 255).notNullable();
            table.integer("user_id").unsigned().references("id").inTable(TABLES.User);
            table.enum("status", Object.values(PASSWORD_STATUS)).defaultTo(PASSWORD_STATUS.ACTIVE)
        })
    }

    const hasLoginSessionTable = await knex.schema.hasTable(TABLES.LoginSession);
    if (!hasLoginSessionTable) {
        await knex.schema.createTable(TABLES.LoginSession, function (table) {
            addDefaultColumns(table, knex);
            table.dateTime("expiry_date").notNullable();
            table.boolean("is_expired").defaultTo(false);
            table.boolean("logged_out").defaultTo(false);
            table.integer("user_id").unsigned().references("id").inTable(TABLES.User);
            table.enum("status", Object.values(BIT)).defaultTo(BIT.ON);
        })
    }
};

exports.down = async function (knex: Knex) {
    await knex.schema.dropTableIfExists(TABLES.LoginSession);
    await knex.schema.dropTableIfExists(TABLES.Password);
    await knex.schema.dropTableIfExists(TABLES.User);
};
