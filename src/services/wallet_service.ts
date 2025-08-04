import { WITHDRAWAL_CHARGES } from "../common/constants";
import { generateUUID } from "../common/utils/app_utils";
import {
  ACCOUNT_STATUS,
  TRANSACTION_CHANNEL,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WALLET_STATUS
} from "../data/enums/enum";
import { fundWalletDTO } from "../data/interfaces/DTOs/app_dto";
import { db } from "../helpers/db/db";
import { BadRequestError, NotFoundError } from "../helpers/errors/app_error";
import {
  INSUFFICIENT_BALANCE,
  SETTLEMENT_ACCOUNT_NOT_FOUND,
  WALLET_NOT_FOUND
} from "../helpers/errors/error_response";
import settlementAccountRepository from "../repositories/SettlementAccountRepository";
import transactionRepository from "../repositories/TransactionRepository";
import walletRepository from "../repositories/WalletRepository";
import Decimal from "decimal.js";

const handleWalletDeposit = async (
  data: fundWalletDTO,
  userId: number,
  sessionId: number
) => {
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
      login_session_id: sessionId,
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

const handleWalletWithdrawal = async (
  data: fundWalletDTO,
  userId: number,
  sessionId: number
) => {
  const trx = await db.transaction();
  try {
    const wallet = await walletRepository.findOne({
      user_id: userId,
      status: WALLET_STATUS.ACTIVE
    });
    if (!wallet) throw new NotFoundError(WALLET_NOT_FOUND);

    const settlementAccount = await settlementAccountRepository.findOne({
      user_id: userId,
      status: ACCOUNT_STATUS.ACTIVE
    });
    if (!settlementAccount)
      throw new NotFoundError(SETTLEMENT_ACCOUNT_NOT_FOUND);

    const now = new Date();
    const balance = new Decimal(wallet.balance);
    const ledgerBalance = new Decimal(wallet.ledger_balance);
    const amountWithCharges = data.amount + WITHDRAWAL_CHARGES;

    if (balance.lessThan(amountWithCharges)) {
      throw new BadRequestError(INSUFFICIENT_BALANCE);
    }

    const transaction = {
      amount: data.amount,
      charges: WITHDRAWAL_CHARGES,
      description: data.description,
      reference: generateUUID(),
      external_reference: data.reference,
      sender_user_id: userId,
      source_wallet_id: wallet.id,
      source_balance_before: balance.toString(),
      source_balance_after: balance.minus(amountWithCharges).toString(),
      settlement_account_id: settlementAccount.id,
      login_session_id: sessionId,
      type: TRANSACTION_TYPE.WITHDRAWAL,
      channel: TRANSACTION_CHANNEL.BANK,
      status: TRANSACTION_STATUS.COMPLETED,
      completed_at: now
    };

    await transactionRepository.save(transaction, trx);

    const walletUpdate = {
      balance: balance.minus(amountWithCharges).toString(),
      ledger_balance: ledgerBalance.minus(amountWithCharges).toString(),
      last_transaction_at: now
    };

    await walletRepository.updateById(wallet.id, walletUpdate, trx);

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export { handleWalletDeposit, handleWalletWithdrawal };
