import { PASSWORD_STATUS } from "../enums/enum";
import Model from "./model";

interface Password extends Model {
    password: string,
    email: string,
    user_id: number,
    status: PASSWORD_STATUS,
}

export default Password;