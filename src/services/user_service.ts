import { KARMA_BLACKLIST, ONE_DAY_IN_SECS, ONE_DAY_IN_MILLI_SECS, USER_SESSION } from "../common/constants";
import Env from "../common/environment_variables";
import { createAuthToken } from "../common/utils/auth_utils";
import { deleteCache, getCache, setCache } from "../common/utils/cache_manager";
import LoginSession from "../data/entities/login_session";
import Password from "../data/entities/password";
import User from "../data/entities/user";
import { BIT } from "../data/enums/enum"
import { db } from "../helpers/db/db";
import { BadRequestError } from "../helpers/errors/app_error";
import { DUPLICATE_EMAIL } from "../helpers/errors/error_response";
import HttpService from "../helpers/HttpService";
import loginSessionRepository from "../repositories/LoginSessionRepository"
import passwordRepository from "../repositories/PasswordRepository";
import userRepository from "../repositories/UserRepository";

const logoutUser = async (userId: number): Promise<LoginSession> => {
    const activeLoginSession = await loginSessionRepository.findOne({ user_id: userId, status: BIT.ON })
    if(activeLoginSession) {
        if (activeLoginSession.expiry_date > new Date()) {
            activeLoginSession.logged_out = true;
        } else {
            activeLoginSession.is_expired = true
        }
        activeLoginSession.status = BIT.OFF;
        await loginSessionRepository.updateById(activeLoginSession.id, activeLoginSession);
    }

    await deleteCache(USER_SESSION+userId)

    return activeLoginSession;
 }

const createNewUser = async (user: Partial<User>, passwordHash: string): Promise<any> => {
    const trx = await db.transaction();
    try {
        const existingUser = await userRepository .findOne({ email: user.email?.toLowerCase() });
        if(existingUser) throw new BadRequestError(DUPLICATE_EMAIL);
    
        user.id = await userRepository.save(user, trx);
    
        const password: Partial<Password> = {
            password: passwordHash,
            email: user.email,
            user_id: user.id
        }
        await passwordRepository.save(password, trx);
        await trx.commit();
        const token = await loginUser(user.id);
    
        return { user, token };
    } catch (error) {
        await trx.rollback();
        throw error;
    }
}

const loginUser = async (userId: number): Promise<string> => {
    const loginSession = {
        user_id: userId,
        expiry_date: new Date(Date.now() + ONE_DAY_IN_MILLI_SECS)
    }
    const loginSessionId = await loginSessionRepository.save(loginSession);
    const activeSession = await loginSessionRepository.findById(loginSessionId);
    await setCache(USER_SESSION+userId, activeSession);
    return createAuthToken(userId, loginSessionId);
}

const isBlacklisted = async (identity: string): Promise<boolean> => {
    let data = await getCache(KARMA_BLACKLIST+identity);

    if (!data) {
        const httpService = new HttpService(Env.ADJUTOR_URL, Env.KARMA_API_KEY);
        const karmaRecord = await httpService.get(`/verification/karma/${identity}`);
        if (karmaRecord.status == "success") {
            data = karmaRecord.data;
            await setCache(KARMA_BLACKLIST+identity, data, ONE_DAY_IN_SECS);
        }
    }

    if (data) return true;
    return false
}

export {
    logoutUser,
    createNewUser,
    loginUser,
    isBlacklisted
}