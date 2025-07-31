import Password from "../data/entities/password";
import User from "../data/entities/user";
import { PASSWORD_STATUS } from "../data/enums/enum";
import { db } from "../helpers/db/db";
import passwordRepository from "../repositories/PasswordRepository";


const updateUserPassword = async (user: User, passwordHash:string, oldPassword: Password) => {
    const trx = await db.transaction();
    try {
        const password = {
            password: passwordHash,
            email: user.email,
            user_id: user.id
        }
        await passwordRepository.save(password, trx);

        oldPassword.status = PASSWORD_STATUS.DEACTIVATED;
        await passwordRepository.updateById(oldPassword.id, oldPassword, trx);
        
        await trx.commit();
    } catch (error) {
        await trx.rollback();
        throw error;
    }
}

export {
    updateUserPassword
}