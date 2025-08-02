import RouterMiddleware from "./base_middlewares/RouterMiddleware";
import { NextFunction, Request, Response, Router } from "express";
import { TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { UnauthorizedError } from "../helpers/errors/app_error";
import { INVALID_SESSION_USER, INVALID_TOKEN, SESSION_EXPIRED } from "../helpers/errors/error_response";
import { BIT } from "../data/enums/enum";
import { LOGIN_SESSION_LABEL, USER_LABEL } from "../common/constants";
import { getTokenFromRequest, verifyJwtToken } from "../common/utils/auth_utils";
import { AuthTokenPayload } from "../data/interfaces/interface";
import { getActiveLoginSession } from "../services/login_session";
import userRepository from "../repositories/UserRepository";
import LoginSession from "../data/entities/login_session";
import loginSessionRepository from "../repositories/LoginSessionRepository";

export class AuthMiddleware extends RouterMiddleware {

    constructor(appRouter: Router) {
        super(appRouter);
    }

    public authGuard = (req: Request, res: Response, next: NextFunction) => {

        const jwt = getTokenFromRequest(req);
        
        verifyJwtToken(jwt, async (error:VerifyErrors|null, decoded?: AuthTokenPayload) => {
            try {
                if (error) {
                    if (error instanceof TokenExpiredError) throw new UnauthorizedError(SESSION_EXPIRED);

                    throw new UnauthorizedError(INVALID_TOKEN);
                } 

                const loginSession = await getActiveLoginSession(decoded!.user, decoded!.loginSession);
                
                if (loginSession) {                
                    await this.validateLoginSession(loginSession, req, res);
                    const user = await userRepository.findById(loginSession.user_id);
                    
                    this.requestUtils.addDataToState(USER_LABEL, user);
                    this.requestUtils.addDataToState(LOGIN_SESSION_LABEL, loginSession);

                    return next();
                }
                
                throw new UnauthorizedError(INVALID_SESSION_USER);
            } catch (error:any) {
                this.handleError(res, error);
            }
        })
    }

    private async validateLoginSession(loginSession: LoginSession, req: Request, res: Response): Promise<void> {
        try {
            if (loginSession.expiry_date <= new Date()) {
                loginSession.is_expired = true;
                loginSession.status = BIT.OFF;
                await loginSessionRepository.updateById(loginSession.id, loginSession);
                throw new UnauthorizedError(SESSION_EXPIRED);
            }
            
        } catch (error) {
            throw error;
        }
    }
}

export default AuthMiddleware;
