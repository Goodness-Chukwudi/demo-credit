import { Knex } from "knex";
import { TABLES } from "../common/constants";
import { db } from "../helpers/db/db";
import { QueryOptions } from "../data/interfaces/interface";

/**
 * An abstract class that provides methods for performing DB queries.
 * Classes(entity repositories) that extends this class:
 * - provide the interface of the entity
 * - inherit it's database query methods
*/
abstract class Repository<T> {

    private readonly table: string;

    constructor(table: TABLES) {
        this.table = table;
    }

    public async save(data: Partial<T>, trx?: Knex.Transaction): Promise<number>;
    public async save(data: Partial<T>[], trx?: Knex.Transaction): Promise<number[]>;
    public async save(data: Partial<T> | Partial<T>[], trx?: Knex.Transaction): Promise<number | number[]> {
        let result: number[];
        if (trx) {
            result = await trx(this.table).insert(data);
        } else {
            result = await db(this.table).insert(data);
        }

        if (Array.isArray(data)) {
            return result as number[];
        }
        return result[0] as number;
    }

    public async findById(id: number, options?: QueryOptions<T>) {
        let result: T;
        if (options?.join) {
            result = await db(this.table)
            .leftJoin(options.join.table, options.join.condition)
            .where({id}).select(options?.select || "*")
            .first();
        } else {
            result = await db(this.table).where({id}).select(options?.select || "*").first();
        }

        return result as T;
    }

    public async findOne(query: Record<string, any>, options?: QueryOptions<T>) {
        let result: T;
        if (options?.join) {
            result = await db(this.table)
            .leftJoin(options.join.table, options.join.condition)
            .where(query).select(options?.select || "*")
            .first();
        } else {
            result = await db(this.table).where(query).select(options?.select || "*").first();
        }

        return result as T;
    }

    public async find(query: Record<string, any>, options?: QueryOptions<T>) {

        const page = {
            size: options?.page?.size || 10,
            number: options?.page?.number || 1
        }

        const [result, countResult] = await Promise.all([
            db(this.table)
            .where(query)
            .orderBy(options?.sort?.by || "created_at", options?.sort?.order || "desc")
            .limit(page.size)
            .offset((page.number - 1) * page.size)
            .select(options?.select || ""),

            db(this.table)
            .where({ is_active: true })
            .count<{ count: string }[]>('* as count')
        ]);

        const total = Number(countResult[0].count);

          return {
            total,
            page,
            result
        };
    }

    public async updateById(id: number, update: Partial<T>, trx?: Knex.Transaction) {
        let result: number[];
        if (trx) {
            result = await trx(this.table).where({id}).update({ ...update, updated_at: new Date()});
        } else {
            result = await db(this.table).where({id}).update({ ...update, updated_at: new Date()});
        }

        return result[0] as number;
    }

    public async update(query: Record<string, any>, update: Partial<T>, trx?: Knex.Transaction) {
        let result: number[];
        if (trx) {
            result = await trx(this.table).where(query).update({ ...update, updated_at: new Date()});
        } else {
            result = await db(this.table).where(query).update({ ...update, updated_at: new Date()});
        }

        return result[0] as number;
    }
}

export default Repository;