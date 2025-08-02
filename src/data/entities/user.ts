import { GENDER, USER_STATUS } from "../enums/enum";
import Model from "./model";

interface User extends Model {
    first_name: string;
    last_name: string;
    gender: GENDER;
    email: string;
    phone: string;
    address: string;
    dob: Date;
    status: USER_STATUS;
    password?: string;
    password_id?: number;
}

export default User;