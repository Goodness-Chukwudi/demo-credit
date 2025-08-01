import { Request, Router, Response } from "express";
import User from "../data/entities/user";
import LoginSession from "../data/entities/login_session";

class RequestUtils {

    private router: Router;
    private request: Request;
    private response: Response;

    constructor(router: Router) {
        this.router = router;
        this.router.use((req, res, next) => {
            this.request = req;
            this.response = res;
            next();
        })
    }

    /**
     * Sets the provided data with the provided key to the response.locals object of the express instance.
     * @param {string} key The key to be used to save the provided data 
     * @param {*} data Data of type any, to be saved
     * @returns  void
    */
    addDataToState(key: string, data: any) {
        this.response.locals[key] = data;
    }

    /**
     * fetches the value of the provided key from the response.locals object of express instance.
     * @param {string} key The key to be used to fetch the data 
     * @returns {*} The saved data of type any or null
    */
    getDataFromState(key: string) {
        return this.response.locals[key] || null;
    }

    /**
     * @returns {User} an object containing details of the logged in user.
    */
    getRequestUser() {
        return this.response.locals.user as User;
    }

    /**
     * @returns {LoginSession} an object containing details of the logged in session.
    */
    getLoginSession() {
        return this.response.locals.login_session as LoginSession;
    }
}

export default RequestUtils;
