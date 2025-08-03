import { ACCOUNT_STATUS } from "../enums/enum";
import Model from "./model";

interface SettlementAccount extends Model {
  user_id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  status: ACCOUNT_STATUS;
}

export default SettlementAccount;
