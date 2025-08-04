import { generateUUID } from "../common/utils/app_utils";
import {
  TRANSACTION_CHANNEL,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WALLET_STATUS
} from "../data/enums/enum";
import { fundWalletDTO } from "../data/interfaces/DTOs/app_dto";
import { db } from "../helpers/db/db";
import { NotFoundError } from "../helpers/errors/app_error";
import { WALLET_NOT_FOUND } from "../helpers/errors/error_response";
import transactionRepository from "../repositories/TransactionRepository";
import walletRepository from "../repositories/WalletRepository";
import Decimal from "decimal.js";

const handleWalletDeposit = async (data: fundWalletDTO, userId: number) => {
  const trx = await db.transaction();
  try {
    const wallet = await walletRepository.findOne({
      user_id: userId,
      status: WALLET_STATUS.ACTIVE
    });
    if (!wallet) throw new NotFoundError(WALLET_NOT_FOUND);

    const now = new Date();
    const balance = new Decimal(wallet.balance);
    const ledgerBalance = new Decimal(wallet.ledger_balance);

    const transaction = {
      amount: data.amount,
      description: data.description,
      reference: generateUUID(),
      external_reference: data.reference,
      recipient_user_id: userId,
      destination_wallet_id: wallet.id,
      destination_balance_before: balance.toString(),
      destination_balance_after: balance.add(data.amount).toString(),
      type: TRANSACTION_TYPE.DEPOSIT,
      channel: TRANSACTION_CHANNEL.BANK,
      status: TRANSACTION_STATUS.COMPLETED,
      completed_at: now
    };

    await transactionRepository.save(transaction, trx);

    const walletUpdate = {
      balance: balance.add(data.amount).toString(),
      ledger_balance: ledgerBalance.add(data.amount).toString(),
      last_transaction_at: now
    };

    await walletRepository.updateById(wallet.id, walletUpdate, trx);

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export { handleWalletDeposit };
