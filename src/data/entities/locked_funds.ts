import Model from "./model";

interface LockedFund extends Model {
  wallet_id: number;
  user_id: number;
  amount: number;
  reason: string;
  expiry_date?: Date;
  locked_by?: number; //admin_id. if the fund was locked by an admin
  unlocked_at?: Date;
  reason_unlocked?: string;
  unlocked_by?: number; //admin_id. if the fund was locked by an admin
}

export default LockedFund;
