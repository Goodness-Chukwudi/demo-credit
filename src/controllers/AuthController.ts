import ApiController from "./base_controllers/ApiController";
import RequestValidator from "../helpers/validators/RequestValidator";
import { createNewUser, loginUser } from "../services/user_service";
import { login, signUp } from "../helpers/validators/validators";
import { USER_STATUS } from "../data/enums/enum";

class AuthController extends ApiController {

    validator: RequestValidator;

    constructor() {
        super();
    } 

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.validator = new RequestValidator(this.router);
    }

    protected initializeRoutes() {
        this.login("/login"); //POST
        this.signup("/signup"); //POST
    }

    signup(path:string) {
        this.router.post(path,
            this.validator.validateBody(signUp),
            this.userMiddleWare.hashNewPassword,
            this.userMiddleWare.blacklistCheck
        );
        this.router.post(path, async (req, res) => {
            try {
                const body = req.body;
                const userData = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    email: body.email,
                    gender: body.gender,
                    phone: body.phone,
                    address: body.address,
                    dob: new Date(body.dob),
                    status: USER_STATUS.ACTIVE
                }
                const { token } = await createNewUser(userData, body.password);
                const response = {
                    message: "Signup successful!",
                    token: token
                }

                this.handleSuccess(res, response, 201);
            } catch (error:any) {
                this.handleError(res, error);
            }
        });
    }

    login(path:string) {
        this.router.post(path,
            this.validator.validateBody(login),
            this.userMiddleWare.loadUserToRequestByEmail,
            this.userMiddleWare.validatePassword,
            this.userMiddleWare.logoutExistingSession
        );

        this.router.post(path, async (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                
                const token = await loginUser(user.id);
                const response = {
                    message: "Login successful!",
                    token: token,
                    user: {...user, password: undefined }
                }

                this.handleSuccess(res, response);
            } catch (error:any) {
                this.handleError(res, error);
            }
        });
    }
}

export default new AuthController().router;
