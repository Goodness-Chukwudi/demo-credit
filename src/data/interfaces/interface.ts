import { TABLES } from "../../common/constants";

interface ErrorMessage {
    code: number;
    message: string;
}

interface AuthTokenPayload {
    user: number;
    loginSession: number;
}

interface QueryOptions<T> {
    page?: {
        size: number;
        number: number;
    },
    sort?: {
        by: string;
        order: "asc"|"desc";
    },
    select?: [keyof T];
    join?: {
        table: TABLES;
        condition: Record<string, any>
    }
}

export {
    ErrorMessage,
    AuthTokenPayload,
    QueryOptions
}