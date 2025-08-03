import { WALLET_TIER, WALLET_TYPE, WALLET_STATUS } from "../enums/enum";
import Model from "./model";

interface Wallet extends Model {
    balance: number;
    ledger_balance: number;
    locked_balance: number;
    currency: string;
    user_id: number;
    tier: WALLET_TIER;
    settlement_account_id?: number;
    type: WALLET_TYPE;
    status: WALLET_STATUS;
    last_transaction_at?: Date;
    closed_at?: Date;
}

export default Wallet;