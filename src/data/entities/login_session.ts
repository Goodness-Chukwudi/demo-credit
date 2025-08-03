import { BIT } from "../enums/enum";
import Model from "./model";

interface LoginSession extends Model {
    expiry_date: Date,
    is_expired: boolean,
    logged_out: boolean,
    user_id: number,
    status: BIT,
}

export default LoginSession;