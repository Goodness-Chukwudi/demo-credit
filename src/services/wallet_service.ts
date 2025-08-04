import { Knex } from "knex";
import { TRANSFER_CHARGES, WITHDRAWAL_CHARGES } from "../common/constants";
import { generateUUID } from "../common/utils/app_utils";
import LockedFund from "../data/entities/locked_funds";
import {
  ACCOUNT_STATUS,
  TRANSACTION_CHANNEL,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WALLET_STATUS
} from "../data/enums/enum";
import {
  fundWalletDTO,
  WalletTransferDTO
} from "../data/interfaces/DTOs/app_dto";
import { db } from "../helpers/db/db";
import { BadRequestError, NotFoundError } from "../helpers/errors/app_error";
import {
  INSUFFICIENT_BALANCE,
  RECIPIENT_WALLET_NOT_FOUND,
  SETTLEMENT_ACCOUNT_NOT_FOUND,
  SOURCE_WALLET_NOT_FOUND
} from "../helpers/errors/error_response";
import lockedFundRepository from "../repositories/LockedFundRepository";
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
    if (!wallet) throw new NotFoundError(RECIPIENT_WALLET_NOT_FOUND);

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
    if (!wallet) throw new NotFoundError(SOURCE_WALLET_NOT_FOUND);

    const settlementAccount = await settlementAccountRepository.findOne({
      user_id: userId,
      status: ACCOUNT_STATUS.ACTIVE
    });
    if (!settlementAccount) {
      throw new NotFoundError(SETTLEMENT_ACCOUNT_NOT_FOUND);
    }

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

    //post money to account using payment gateway
    //transfer charges to the business's wallet

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

const handleWalletTransfer = async (
  data: WalletTransferDTO,
  sessionId: number
) => {
  const trx = await db.transaction();
  try {
    const recipientWallet = await walletRepository.findOne({
      user_id: data.recipient,
      status: WALLET_STATUS.ACTIVE
    });
    if (!recipientWallet) throw new NotFoundError(RECIPIENT_WALLET_NOT_FOUND);

    const sourceWallet = await walletRepository.findOne({
      user_id: data.sender,
      status: WALLET_STATUS.ACTIVE
    });
    if (!sourceWallet) throw new NotFoundError(SOURCE_WALLET_NOT_FOUND);

    const now = new Date();
    const sourceBalance = new Decimal(sourceWallet.balance);
    const sourceLedgerBalance = new Decimal(sourceWallet.ledger_balance);
    const recipientBalance = new Decimal(recipientWallet.balance);
    const recipientLedgerBalance = new Decimal(recipientWallet.ledger_balance);
    const amountWithCharges = data.amount + TRANSFER_CHARGES;

    if (sourceBalance.lessThan(amountWithCharges)) {
      throw new BadRequestError(INSUFFICIENT_BALANCE);
    }

    const lockedFundData = {
      wallet_id: sourceWallet.id,
      user_id: data.sender,
      amount: amountWithCharges,
      reason: "lock transaction amount before wallet transfer"
    };
    const lockedFund = await lockFund(lockedFundData);
    //A job can be setup up to release locked funds based on expiry date

    const transaction = {
      amount: data.amount,
      charges: TRANSFER_CHARGES,
      description: data.description,
      reference: generateUUID(),
      external_reference: data.reference,
      locked_fund_id: lockedFund,

      sender_user_id: data.sender,
      source_wallet_id: sourceWallet.id,
      source_balance_before: sourceBalance.toString(),
      source_balance_after: sourceBalance.minus(amountWithCharges).toString(),

      recipient_user_id: data.recipient,
      destination_wallet_id: recipientWallet.id,
      destination_balance_before: recipientBalance.toString(),
      destination_balance_after: recipientBalance.add(data.amount).toString(),

      login_session_id: sessionId,
      type: TRANSACTION_TYPE.TRANSFER,
      channel: TRANSACTION_CHANNEL.WALLET,
      status: TRANSACTION_STATUS.COMPLETED,
      completed_at: now
    };

    await transactionRepository.save(transaction, trx);

    const sourceWalletUpdate = {
      balance: sourceBalance.minus(amountWithCharges).toString(),
      ledger_balance: sourceLedgerBalance.minus(amountWithCharges).toString(),
      last_transaction_at: now
    };
    await walletRepository.updateById(sourceWallet.id, sourceWalletUpdate, trx);

    const recipientWalletUpdate = {
      balance: recipientBalance.add(data.amount).toString(),
      ledger_balance: recipientLedgerBalance.add(data.amount).toString(),
      last_transaction_at: now
    };
    await walletRepository.updateById(
      recipientWallet.id,
      recipientWalletUpdate,
      trx
    );

    //transfer charges to the business's wallet

    await unlockFund(lockedFund, "Release fund after transaction", trx);

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

const lockFund = async (data: Partial<LockedFund>) => {
  return await lockedFundRepository.save(data);
};

const unlockFund = async (
  id: number,
  reason: string,
  trx: Knex.Transaction
) => {
  const data = {
    unlocked_at: new Date(),
    reason_unlocked: reason
  };
  return await lockedFundRepository.updateById(id, data, trx);
};

export { handleWalletDeposit, handleWalletWithdrawal, handleWalletTransfer };
