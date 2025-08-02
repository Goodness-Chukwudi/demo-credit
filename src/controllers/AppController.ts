import RequestValidator from "../helpers/validators/RequestValidator";
import ApiController from "./base_controllers/ApiController";
import { loginUser, logoutUser } from "../services/user_service";
import { passwordUpdate } from "../helpers/validators/validator";
import { updateUserPassword } from "../services/password_service";

class AppController extends ApiController {
    private validator: RequestValidator;

    constructor() {
        super();
    }

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.validator = new RequestValidator(this.router)
    }

    protected initializeRoutes() {
        this.me("/me"); //GET
        this.logout("/logout"); //PATCH
        this.updatePassword("/password"); //PATCH
    }

    me(path:string) {
        //returns the logged in user
        this.router.get(path, (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                this.handleSuccess(res, {...user, password: undefined}); 
            } catch (error: any) {
                this.handleError(res, error);
            }
        })
    }

    logout(path:string) {
        this.router.patch(path, async (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                await logoutUser(user.id);

                this.handleSuccess(res);
            } catch (error: any) {
                this.handleError(res, error);
            }
        });
    }

    updatePassword(path:string) {
        this.router.patch(
            path,
            this.validator.validateBody(passwordUpdate),
            this.userMiddleWare.validatePassword,
            this.userMiddleWare.hashNewPassword
        );

        this.router.patch(path, async (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                await updateUserPassword(user, req.body.password);

                await logoutUser(user.id);
                const token = await loginUser(user.id);
        
                this.handleSuccess(res, { message: "Password update successful", token: token});
            } catch (error:any) {
                this.handleError(res, error) 
            }
        });
    }
}

export default new AppController().router;
