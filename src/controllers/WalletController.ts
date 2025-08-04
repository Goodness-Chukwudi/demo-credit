import RequestValidator from "../helpers/validators/RequestValidator";
import ApiController from "./base_controllers/ApiController";
import { fundWallet } from "../helpers/validators/validators";
import { handleWalletDeposit } from "../services/wallet_service";

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
    this.fundWallet("/:user_id"); //POST
  }

  fundWallet(path: string) {
    this.router.post(path, this.validator.validateBody(fundWallet));
    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getRequestUser();
        await handleWalletDeposit(req.body, Number(req.params.user_id));

        this.handleSuccess(res);
      } catch (error: any) {
        this.handleError(res, error);
      }
    });
  }
}

export default new WalletController().router;
