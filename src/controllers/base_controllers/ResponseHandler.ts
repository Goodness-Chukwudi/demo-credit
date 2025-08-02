import { Response } from "express";
import { AppError, InternalServerError } from "../../helpers/errors/app_error";
import { logError } from "../../common/utils/app_utils";
import { INPUT_VALIDATION_ERROR } from "../../common/constants";

abstract class ResponseHandler {
    
    /**
     * Terminates the http request with the provided express res object.
     * An error response is created with the provided error details and returned to the client.
     * @param {Request} res The express response object to be used to send the error response 
     * @param {AppError} error The error object. This is only for log purposes and it's not returned to client
     * @param {*} data Optional data to return to client
     * @returns {void} void
    */
    protected handleError( res: Response, error: Error, data?: any) {
        try {
            let statusCode = 500;
            let errorCode;

            if (error instanceof AppError) {
                statusCode = error.status_code;
                errorCode = error.custom_code;
            }

            let errors;
            let message = error.message;
            if (errorCode === 0) {
                errors = error.message.split(". ");
                message = INPUT_VALIDATION_ERROR;
            }

            const response = {
                message,
                success: false,
                error_code: errorCode,
                errors,
                status_code: statusCode,
                data: data
            };

            if (
                error instanceof InternalServerError || !(error instanceof AppError)
            ) {
                logError(error, res);
                response.message = "Internal server error. Please try again later or contact support if issue persists";
            };

            res.status(statusCode).json(response);
        } catch (error: any) {
            logError(error, res);
        }
    }

    /**
     * Terminates the http request with the provided express res object.
     * A success response is created and an optional data object data returned to the client.
     * @param {Response} res The express response object to be used to send the success response 
     * @param {*} data An optional data to be returned to the user
     * @param {number} statusCode HTTP status code of the success response
     * @returns  void
    */
    protected handleSuccess(res: Response, data?:any, statusCode = 200) {
        const response = {
            success: true,
            data,
            status_code: statusCode,
        }
        res.status(statusCode).json(response);
    }
}

export default ResponseHandler;
