import { Express } from "express";
import Env from "../common/environment_variables";
import AppController from "../controllers/AppController";
import WalletController from "../controllers/WalletController";

class AppRoutes {
  private app: Express;
  constructor(app: Express) {
    this.app = app;
  }

  initializeRoutes() {
    this.app.use(Env.API_PATH + "/", AppController);
    this.app.use(Env.API_PATH + "/wallets", WalletController);
  }
}

export default AppRoutes;
