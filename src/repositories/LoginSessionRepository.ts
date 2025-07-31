import { TABLES } from "../common/constants";
import LoginSession from "../data/entities/login_session";
import Repository from "./Repository";

class LoginSessionRepository extends Repository<LoginSession> {

    constructor() {
        super(TABLES.LoginSession);
    }
}

const loginSessionRepository = new LoginSessionRepository();

export default loginSessionRepository;
