import type { Knex } from "knex";
import { addDefaultColumns } from "../../helpers/db/db";
import {
    ACCOUNT_STATUS,
    CURRENCY,
    TRANSACTION_CHANNEL,
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
    WALLET_STATUS,
    WALLET_TIER,
    WALLET_TYPE 
} from "../enums/enum";
import { TABLES } from "../../common/constants";

exports.up = async function (knex: Knex) {
    const hasAccountTable = await knex.schema.hasTable(TABLES.SettlementAccount);
    if (!hasAccountTable) {
        await knex.schema.createTable(TABLES.SettlementAccount, function (table) {
            addDefaultColumns(table, knex);
            table.string('account_number').notNullable();
            table.string('account_name').notNullable();
            table.string('bank_name').notNullable();
            table.enum('status', Object.values(ACCOUNT_STATUS)).notNullable().defaultTo(ACCOUNT_STATUS.ACTIVE)
        })
    }

    const hasWalletTable = await knex.schema.hasTable(TABLES.Wallet);
    if (!hasWalletTable) {
        await knex.schema.createTable(TABLES.Wallet, function (table) {
            addDefaultColumns(table, knex);
            table.decimal("balance", 18, 2).notNullable().defaultTo(0);
            table.decimal("ledger_balance", 18, 2).notNullable().defaultTo(0);
            table.decimal("locked_balance", 18, 2).notNullable().defaultTo(0);
            table.enum("currency", Object.values(CURRENCY)).notNullable().defaultTo(CURRENCY.NGN);
            table.integer("user_id").unsigned().notNullable().references("id").inTable(TABLES.User);
            table.integer("tier").unsigned().notNullable().defaultTo(WALLET_TIER.ONE);
            table.integer("settlement_account_id").unsigned().notNullable().references("id").inTable(TABLES.SettlementAccount);
            table.enum("type", Object.values(WALLET_TYPE)).notNullable();
            table.enum("status", Object.values(WALLET_STATUS)).notNullable().defaultTo(WALLET_STATUS.ACTIVE);
            table.datetime("last_transaction_at").nullable();
            table.datetime("closed_at").nullable();
        })
    }

    const hasLockedFundTable = await knex.schema.hasTable(TABLES.LockedFund);
    if (!hasLockedFundTable) {
        await knex.schema.createTable(TABLES.LockedFund, function (table) {
            addDefaultColumns(table, knex);
            table.integer('wallet_id').unsigned().notNullable().references('id').inTable(TABLES.Wallet);
            table.integer('user_id').unsigned().notNullable().references('id').inTable(TABLES.User);
            table.decimal('amount', 18, 2).notNullable();
            table.string('reason', 255).notNullable();
            table.datetime('expiry_date').nullable();
            table.integer('locked_by').unsigned().nullable();
            table.datetime('unlocked_at').nullable();
            table.string('reason_unlocked', 255).nullable();
            table.integer('unlocked_by').unsigned().nullable();
        })
    }

    const hasTransactionTable = await knex.schema.hasTable(TABLES.Transaction);
    if (!hasTransactionTable) {
        await knex.schema.createTable(TABLES.Transaction, function (table) {
            addDefaultColumns(table, knex);
            table.decimal('amount', 18, 2).notNullable();
            table.decimal('charges', 18, 2).notNullable().defaultTo(0);
            table.enum('currency', Object.values(CURRENCY)).notNullable().defaultTo(CURRENCY.NGN);
            table.string('description', 255).nullable();

            table.integer('sender_user_id').unsigned().nullable().references('id').inTable(TABLES.User);
            table.integer('recipient_user_id').unsigned().nullable().references('id').inTable(TABLES.User);

            table.integer('source_wallet_id').unsigned().nullable().references('id').inTable(TABLES.Wallet);
            table.integer('destination_wallet_id').unsigned().nullable().references('id').inTable(TABLES.Wallet);

            table.decimal('source_balance_before', 18, 2).nullable();
            table.decimal('source_balance_after', 18, 2).nullable();
            table.decimal('destination_balance_before', 18, 2).nullable();
            table.decimal('destination_balance_after', 18, 2).nullable();

            table.integer('settlement_account_id').unsigned().nullable().references('id').inTable(TABLES.SettlementAccount);
            table.integer('locked_fund_id').unsigned().nullable().references('id').inTable(TABLES.LockedFund);

            table.enum('type', Object.values(TRANSACTION_TYPE)).notNullable();
            table.enum('channel', Object.values(TRANSACTION_CHANNEL)).notNullable();
            table.enum('status', Object.values(TRANSACTION_STATUS)).notNullable().defaultTo(TRANSACTION_STATUS.PENDING);

            table.datetime('completed_at').nullable();

            table.uuid('reference').unique().notNullable().unique();
            table.string('external_reference').nullable();
            table.integer('login_session_id').unsigned().nullable().references('id').inTable(TABLES.LoginSession);

            table.integer('reversed_transaction_id').unsigned().nullable().references('id').inTable(TABLES.Transaction);
        })
    }
};

exports.down = async function (knex: Knex) {
    await knex.schema.dropTableIfExists(TABLES.Transaction);
    await knex.schema.dropTableIfExists(TABLES.LockedFund);
    await knex.schema.dropTableIfExists(TABLES.Wallet);
    await knex.schema.dropTableIfExists(TABLES.SettlementAccount);
};
