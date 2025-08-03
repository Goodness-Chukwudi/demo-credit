import { TRANSACTION_CHANNEL, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../enums/enum";
import Model from "./model";

export interface Transaction extends Model {
    amount: number;
    charges: number;
    currency: string;
    description: string;
    sender?: number; //sending user
    recipient?: number; //receiving user
    source_wallet?: number;
    destination_wallet?: number;
    source_balance_before?: number;
    source_balance_after?: number;
    destination_balance_before?: number;
    destination_balance_after?: number;
    settlement_account?: number;
    locked_fund_id?: number;
    type: TRANSACTION_TYPE,
    channel: TRANSACTION_CHANNEL;
    status: TRANSACTION_STATUS;
    completed_at: Date;
    reference: string;
    external_reference?: string;
    login_session_id?: string;
    reversal_of?: number;
}