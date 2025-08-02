import User from "../data/entities/user";
import { PASSWORD_STATUS } from "../data/enums/enum";
import { db } from "../helpers/db/db";
import passwordRepository from "../repositories/PasswordRepository";


const updateUserPassword = async (user: User, passwordHash:string) => {
    const trx = await db.transaction();
    try {
        await passwordRepository.update({user_id: user.id}, { status: PASSWORD_STATUS.DEACTIVATED }, trx);

        const password = {
            password: passwordHash,
            email: user.email,
            user_id: user.id
        }
        await passwordRepository.save(password, trx);
        
        await trx.commit();
    } catch (error) {
        await trx.rollback();
        throw error;
    }
}

export {
    updateUserPassword
}