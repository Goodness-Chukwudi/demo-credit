import {
  WALLET_TIER,
  WALLET_TYPE,
  WALLET_STATUS,
  CURRENCY
} from "../enums/enum";
import Model from "./model";

interface Wallet extends Model {
  balance: number | string;
  ledger_balance: number | string;
  locked_balance: number | string;
  currency: CURRENCY;
  user_id: number;
  tier: WALLET_TIER;
  settlement_account_id?: number;
  type: WALLET_TYPE;
  status: WALLET_STATUS;
  last_transaction_at?: Date;
  closed_at?: Date;
}

export default Wallet;
