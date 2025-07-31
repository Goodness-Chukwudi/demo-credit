import { Response } from "express";
import { AppError, InternalServerError } from "../../helpers/errors/app_error";
import { logError } from "../../common/utils/app_utils";

abstract class ResponseHandler {
    
    /**
     * Terminates the http request with the provided express res object.
     * An error response is created with the provided error details and returned to the client.
     * @param {Request} res The express response object to be used to send the error response 
     * @param {AppError} error The error object. This is only for log purposes and it's not returned to client
     * @param {*} data Optional data to return to client
     * @returns {void} void
    */
    protected handleError( res: Response, error: Error, data?: unknown) {

        let statusCode = 500;
        let errorCode;

        if (error instanceof AppError) {
            statusCode = error.status_code;
            errorCode = error.custom_code;
        }
        const response = {
            message: error.message,
            success: false,
            custom_error_code: errorCode,
            status_code: statusCode,
            data: data
        };

        if (
            error instanceof InternalServerError ||
            (error instanceof Error && error.constructor === Error)
        ) {
            logError(error, res);
            response.message = "Internal server error. Please try again later or contact support if issue persists";
        };

        res.status(statusCode).json(response);
    }

    /**
     * Terminates the http request with the provided express res object.
     * A success response is created and an optional data object data returned to the client.
     * @param {Response} res The express response object to be used to send the success response 
     * @param {*} data An optional data to be returned to the user
     * @param {number} statusCode HTTP status code of the success response
     * @returns  void
    */
    protected handleSuccess(res: Response, data:any = null, statusCode = 200) {
        const response = {
            success: true,
            data: data,
            status_code: statusCode,
        }
        res.status(statusCode).json(response);
    }
}

export default ResponseHandler;
