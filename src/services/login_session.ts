import { USER_SESSION } from "../common/constants";
import { getCache, setCache } from "../common/utils/cache_manager";
import { BIT } from "../data/enums/enum";
import loginSessionRepository from "../repositories/LoginSessionRepository";

const getActiveLoginSession = async (user_id: number, id: number) => {
  let activeSession = await getCache(USER_SESSION + user_id);

  if (!activeSession) {
    activeSession = await loginSessionRepository.findOne({
      id,
      user_id,
      status: BIT.ON
    });

    await setCache(USER_SESSION + user_id, activeSession);
  }

  return activeSession;
};

export { getActiveLoginSession };
