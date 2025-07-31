import ResponseHandler from "../../controllers/base_controllers/ResponseHandler";
import { Router } from "express";
import RequestUtils from "../../helpers/RequestUtils";

/**
 * An abstract class that provides a base middleware for all routers.
 * Middleware classes that extend this class get access to:
 * - an instance of RequestUtils
 * - Other non private members of the ResponseHandler class
 * - The express router of the request
*/
abstract class RouterMiddleware extends ResponseHandler {

    public router;
    protected requestUtils: RequestUtils;

    constructor(appRouter: Router) {
        super();
        this.router = appRouter;
        this.requestUtils = new RequestUtils(this.router);
    }
}

export default RouterMiddleware;
