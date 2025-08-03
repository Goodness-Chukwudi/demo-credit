import { TRANSACTION_CHANNEL, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../enums/enum";
import Model from "./model";

interface Transaction extends Model {
  // Core transaction values
  amount: number;
  charges: number;
  currency: string;
  description?: string;
  reference: string;
  external_reference?: string;

  // Participants
  sender_user_id?: number;
  recipient_user_id?: number;

  // Wallets involved
  source_wallet_id?: number;
  destination_wallet_id?: number;

  // Balances before and after transaction
  source_balance_before?: number;
  source_balance_after?: number;
  destination_balance_before?: number;
  destination_balance_after?: number;

  // Related records
  settlement_account_id?: number;
  locked_fund_id?: number;
  reversed_transaction_id?: number;

  // Metadata
  type: TRANSACTION_TYPE;
  channel: TRANSACTION_CHANNEL;
  status: TRANSACTION_STATUS;
  completed_at?: Date;
  login_session_id?: string;
}

export default Transaction;