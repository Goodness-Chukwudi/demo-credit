import RouterMiddleware from "./base_middlewares/RouterMiddleware";
import { NextFunction, Request, Response, Router } from 'express';
import { PASSWORD_STATUS } from "../data/enums/enum";
import { hashData, validateHashedData } from "../common/utils/auth_utils";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../helpers/errors/app_error";
import userRepository from "../repositories/UserRepository";
import { TABLES, USER_LABEL, USER_PASSWORD_LABEL } from "../common/constants";
import { EMAIL_REQUIRED, INVALID_LOGIN, NEW_PASSWORD_REQUIRED, PASSWORD_MISMATCH, USER_NOT_FOUND } from "../helpers/errors/error_response";
import passwordRepository from "../repositories/PasswordRepository";
import { logoutUser } from "../services/user_service";

class UserMiddleware extends RouterMiddleware {

    constructor(appRouter: Router) {
        super(appRouter)
    }

    /**
     * A middleware that fetches a user from the db using the email provided in the request.
     * - The fetched user is available through the getDataFromState or getRequestUser method of the request service
    */
    public loadUserToRequestByEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.body.email;
            if (!email) throw new BadRequestError(EMAIL_REQUIRED);

            const joinPassword = {table: TABLES.Password, condition: { "passwords.user_id": "users.id"} };
            const user = await userRepository.findOne({ email, status: PASSWORD_STATUS.ACTIVE }, { join: joinPassword});

            if (!user) throw new NotFoundError(USER_NOT_FOUND);

            this.requestUtils.addDataToState(USER_LABEL, user);
            this.requestUtils.addDataToState(USER_PASSWORD_LABEL, user.password);
            next();
        } catch (error: any) {
            this.handleError(res, error)
        }
    }

    /**
     * Hashes a new password.
     * - Returns an invalid login error response for invalid password
    */
    public hashNewPassword = async (req: Request, res: Response, next: any) => {
        try {
            if (req.body.new_password) {
    
                if (req.body.confirm_password !== req.body.new_password) throw new BadRequestError(PASSWORD_MISMATCH);
                req.body.password = await hashData(req.body.new_password);
    
                next();
            } 
            throw new BadRequestError(NEW_PASSWORD_REQUIRED);
            
        } catch (error:any) {
            this.handleError(res, error);
        }

    }

    /**
     * Validates user's password.
     * Returns an invalid login error response for invalid password
    */
    public validatePassword = async (req: Request, res: Response, next: any) => {
        try {
            let userPassword = this.requestUtils.getDataFromState(USER_PASSWORD_LABEL);
            if (!userPassword) {
                const user = this.requestUtils.getRequestUser();
                userPassword = await passwordRepository.findOne({email: user.email, status: PASSWORD_STATUS.ACTIVE});
                this.requestUtils.addDataToState(USER_PASSWORD_LABEL, userPassword);
            }

            const isCorrectPassword = await validateHashedData(req.body.password, userPassword.password);
            if (!isCorrectPassword) throw new UnauthorizedError(INVALID_LOGIN);

            next();
        } catch (error: any) {
            return this.handleError(res, error);
        }

    }

    /**
     * Logs out a user's session.
    */
    public logoutExistingSession = async (req: Request, res: Response, next: any) => {
        try {
            
            const user = this.requestUtils.getRequestUser();
            await logoutUser(user.id);
            next();
        } catch (error: any) {
            return this.handleError(res, error);
        }
    }
}

export default UserMiddleware;
