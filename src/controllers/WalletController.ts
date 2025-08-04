import RequestValidator from "../helpers/validators/RequestValidator";
import ApiController from "./base_controllers/ApiController";
import { fundWallet, walletTransfer } from "../helpers/validators/validators";
import {
  handleWalletDeposit,
  handleWalletTransfer,
  handleWalletWithdrawal
} from "../services/wallet_service";
import { LOGIN_SESSION_LABEL } from "../common/constants";

class WalletController extends ApiController {
  private validator: RequestValidator;

  constructor() {
    super();
  }

  protected initializeServices() {}

  protected initializeMiddleware() {
    this.validator = new RequestValidator(this.router);
  }

  protected initializeRoutes() {
    this.deposit("/deposit"); //POST
    this.withdraw("/withdraw"); //POST
    this.transfer("/transfer"); //POST
  }

  // Ideally, should be a webhook for payment gateway to notify the system of transactions
  deposit(path: string) {
    this.router.post(path, this.validator.validateBody(fundWallet));
    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getRequestUser();
        const loginSession = await this.requestUtils.getDataFromState(
          LOGIN_SESSION_LABEL
        );
        await handleWalletDeposit(req.body, user.id, loginSession.id);

        this.handleSuccess(res);
      } catch (error: any) {
        this.handleError(res, error);
      }
    });
  }

  withdraw(path: string) {
    this.router.post(path, this.validator.validateBody(fundWallet));
    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getRequestUser();
        const loginSession = await this.requestUtils.getDataFromState(
          LOGIN_SESSION_LABEL
        );
        await handleWalletWithdrawal(req.body, user.id, loginSession.id);

        this.handleSuccess(res);
      } catch (error: any) {
        this.handleError(res, error);
      }
    });
  }

  transfer(path: string) {
    this.router.post(path, this.validator.validateBody(walletTransfer));
    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getRequestUser();
        const loginSession = await this.requestUtils.getDataFromState(
          LOGIN_SESSION_LABEL
        );

        const walletTransfer = {
          sender: user.id,
          recipient: req.body.recipient,
          amount: req.body.amount,
          description: req.body.description,
          reference: req.body.reference
        };

        await handleWalletTransfer(walletTransfer, loginSession.id);

        this.handleSuccess(res);
      } catch (error: any) {
        this.handleError(res, error);
      }
    });
  }
}

export default new WalletController().router;
