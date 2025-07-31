import { USER_STATUS } from "../enums/enum";
import Model from "./model";
import Password from "./password";

interface User extends Model {
    first_name: string,
    last_name: string,
    email: string,
    password?: Password,
    status: USER_STATUS,
}

export default User;