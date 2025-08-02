import { ONE_DAY } from "../constants";
import redisClient from "./redis";

const setCache = async (key: string, data: any, expiry = ONE_DAY) => {
    try {
        await redisClient.setEx(key, expiry, JSON.stringify(data))
    } catch (error) {
        throw error;
    }
}

const getCache = async (key: string) => {
    try {
        const data = await redisClient.get(key);

        const jsonData = data ? JSON.parse(data) : undefined;

        return jsonData;
    } catch (error) {
        throw error;
    }

}

const deleteCache = async (keys: string[]|string) => {
    try {
        if (typeof keys === "string") keys = [keys]
        await redisClient.del(keys);
    } catch (error) {
        throw error;
    }
}

export {
    setCache,
    getCache,
    deleteCache
};