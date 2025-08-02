import redisClient from "./redis";

const setCache = async (key: string, data: any, expiry = 86400) => {
    try {
        await redisClient.setEx(key, expiry, JSON.stringify(data))
    } catch (error) {
        throw error;
    }
}

const getCache = async (key: string) => {
    try {
        const data = await redisClient.get(key);

        const jsonData = data ? JSON.parse(data) : null;

        return jsonData;
    } catch (error) {
        throw error;
    }

}

const deleteCache = async (keys: string[]) => {
    try {
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