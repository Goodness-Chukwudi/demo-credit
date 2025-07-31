import { NextFunction, Request, Response, Router } from "express";
import { AnySchema } from "joi";
import RouterMiddleware from "../../middlewares/base_middlewares/RouterMiddleware";
import { JoiValidatorOptions } from "../../common/config";
import { UnprocessableEntityError } from "../errors/app_error";

class RequestValidator extends RouterMiddleware {

    constructor(appRouter: Router) {
        super(appRouter);
    }

    validateBody = (schema: AnySchema) => {
        return async ( req: Request, res: Response, next: NextFunction ) => {
            try {
                await schema.validateAsync(req.body, JoiValidatorOptions);
                next();
            } catch (error: any) {
                const errorMessage = {
                    code: 0,
                    message: error.message
                }
                this.handleError(res, new UnprocessableEntityError(errorMessage));
            }
        };
    }

    validateQuery = (schema: AnySchema) => {
        return async ( req: Request, res: Response, next: NextFunction ) => {
            try {
                await schema.validateAsync(req.query, JoiValidatorOptions);
                next();
            } catch (error: any) {
                const errorMessage = {
                    code: 0,
                    message: error.message
                }
                this.handleError(res, new UnprocessableEntityError(errorMessage));
            }
        };
    }

    validateParams = (schema: AnySchema) => {
        return async ( req: Request, res: Response, next: NextFunction ) => {
            try {
                await schema.validateAsync(req.params, JoiValidatorOptions);
                next();
            } catch (error: any) {
                const errorMessage = {
                    code: 0,
                    message: error.message
                }
                this.handleError(res, new UnprocessableEntityError(errorMessage));
            }
        };
    }
}

export default RequestValidator;