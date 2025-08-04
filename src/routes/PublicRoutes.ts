import { Express } from "express";
import Env from "../common/environment_variables";
import AuthController from "../controllers/AuthController";

/**
 *This route exposes public endpoints that are not protected
 *These endpoints is not protected by the auth guard and access to them do not require authentication
 */
class PublicRoutes {
  private app: Express;
  constructor(app: Express) {
    this.app = app;
  }

  initializeRoutes() {
    this.app.use(Env.API_PATH + "/auth", AuthController);
  }
}

export default PublicRoutes;
