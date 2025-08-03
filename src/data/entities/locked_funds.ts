import Model from "./model";

interface Wallet extends Model {
    wallet_id: string;
    user_id: string;
    amount: number;
    reason: string;
    expiry_date?: Date;
    locked_by?: number; //admin_id. if the fund was locked by an admin
    unlocked_at?: Date;
    reason_unlocked?: string;
    unlocked_by?: number;//admin_id. if the fund was locked by an admin
}

export default Wallet;