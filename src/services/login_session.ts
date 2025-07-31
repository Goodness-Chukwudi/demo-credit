import { BIT } from "../data/enums/enum"
import loginSessionRepository from "../repositories/LoginSessionRepository"

const getActiveLoginSession = async (user_id: number, id: number) => {
    //check cache first and query db on a miss
    const loginSession = await loginSessionRepository
        .findOne({
            id,
            user_id,
            status: BIT.ON
        })

    return loginSession;
}

export {
    getActiveLoginSession
}