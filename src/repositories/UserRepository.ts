import { TABLES } from "../common/constants";
import User from "../data/entities/user";
import Repository from "./Repository";

class UserRepository extends Repository<User> {

    constructor() {
        super(TABLES.User);
    }
}

const userRepository = new UserRepository();

export default userRepository;
