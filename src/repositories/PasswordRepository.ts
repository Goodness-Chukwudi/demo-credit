import { TABLES } from "../common/constants";
import Password from "../data/entities/password";
import Repository from "./Repository";

class PasswordRepository extends Repository<Password> {

    constructor() {
        super(TABLES.Password);
    }
}

const passwordRepository = new PasswordRepository();

export default passwordRepository;
