import {
  handleWalletDeposit,
  handleWalletWithdrawal,
  handleWalletTransfer
} from "../src/services/wallet_service";
import {
  fundWalletDTO,
  WalletTransferDTO
} from "../src/data/interfaces/DTOs/app_dto";
import {
  INSUFFICIENT_BALANCE,
  RECIPIENT_WALLET_NOT_FOUND
} from "../src/helpers/errors/error_response";

describe("Wallet Service", () => {
  it("should deposit funds successfully", async () => {
    const depositData: fundWalletDTO = {
      amount: 100,
      description: "Deposit",
      reference: "ref1"
    };
    await expect(handleWalletDeposit(depositData, 1, 1)).resolves.not.toThrow();
  });

  it("should fail to withdraw with insufficient balance", async () => {
    const withdrawData: fundWalletDTO = {
      amount: 1000000,
      description: "Withdraw",
      reference: "ref2"
    };
    await expect(handleWalletWithdrawal(withdrawData, 1, 1)).rejects.toThrow(
      INSUFFICIENT_BALANCE.message
    );
  });

  it("should withdraw funds successfully", async () => {
    const withdrawData: fundWalletDTO = {
      amount: 10,
      description: "Withdraw",
      reference: "ref3"
    };
    await expect(
      handleWalletWithdrawal(withdrawData, 1, 1)
    ).resolves.not.toThrow();
  });

  it("should transfer funds successfully", async () => {
    const transferData: WalletTransferDTO = {
      sender: 1,
      recipient: 2,
      amount: 10,
      description: "Transfer",
      reference: "ref4"
    };
    await expect(handleWalletTransfer(transferData, 1)).resolves.not.toThrow();
  });

  it("should fail to transfer with invalid recipient", async () => {
    const transferData: WalletTransferDTO = {
      sender: 1,
      recipient: 9999,
      amount: 10,
      description: "Transfer",
      reference: "ref5"
    };
    await expect(handleWalletTransfer(transferData, 1)).rejects.toThrow(
      RECIPIENT_WALLET_NOT_FOUND.message
    );
  });

  it("should fail to transfer with insufficient sender balance", async () => {
    const transferData: WalletTransferDTO = {
      sender: 1,
      recipient: 2,
      amount: 1000000,
      description: "Transfer",
      reference: "ref6"
    };
    await expect(handleWalletTransfer(transferData, 1)).rejects.toThrow(
      INSUFFICIENT_BALANCE.message
    );
  });
});
