import { createAuthToken } from "../common/utils/auth_utils";
import LoginSession from "../data/entities/login_session";
import Password from "../data/entities/password";
import User from "../data/entities/user";
import { BIT } from "../data/enums/enum"
import { db } from "../helpers/db/db";
import { BadRequestError, InternalServerError } from "../helpers/errors/app_error";
import { DUPLICATE_EMAIL } from "../helpers/errors/error_response";
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
    
        const loginSession: Partial<LoginSession> = {
            user_id: user.id,
            expiry_date: new Date(Date.now() + 86400000) //1 day
        }
        loginSession.id = await loginSessionRepository.save(loginSession, trx);
        
        const token = createAuthToken(user.id, loginSession.id);
        if (!user || !token) throw new InternalServerError();

        await trx.commit();
    
        return { user, token };
    } catch (error) {
        await trx.rollback();
        throw error;
    }
}


const loginUser = async (userId: number): Promise<string> => {
    const loginSession = {
        user_id: userId,
        expiry_date: new Date(Date.now() + 86400000) //1 day
    }
    const loginSessionId = await loginSessionRepository.save(loginSession);
    return createAuthToken(userId, loginSessionId);
}

export {
    logoutUser,
    createNewUser,
    loginUser
}