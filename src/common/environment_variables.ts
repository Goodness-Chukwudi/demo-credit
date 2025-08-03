import 'dotenv/config'

interface IEnv {
    ENVIRONMENT: string;
    PORT: number;
    ALLOWED_ORIGINS: string[];
    API_VERSION: string;
    API_PATH: string;
    JWT_PRIVATE_KEY: string;
    JWT_EXPIRY: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_PORT: number;
    REDIS_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    KARMA_API_KEY: string;
}


const Env: IEnv = {
    ENVIRONMENT: process.env.ENVIRONMENT as string,
    PORT: process.env.PORT as unknown as number,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(", ") as string[],
    API_VERSION: process.env.API_VERSION as string,
    API_PATH: "/api/" + process.env.API_VERSION,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY as string,
    JWT_EXPIRY: process.env.JWT_EXPIRY as string,
    DB_HOST: process.env.DB_HOST as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,
    DB_PORT: process.env.DB_PORT as unknown as number,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as unknown as number,
    KARMA_API_KEY: process.env.KARMA_API_KEY as string
}

export default Env;