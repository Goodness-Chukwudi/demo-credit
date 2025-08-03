import { ACCOUNT_STATUS } from "../enums/enum";
import Model from "./model";

interface SettlementAccount extends Model {
    account_name: string,
    account_number: string,
    bank_name: number,
    status: ACCOUNT_STATUS,
}

export default SettlementAccount;