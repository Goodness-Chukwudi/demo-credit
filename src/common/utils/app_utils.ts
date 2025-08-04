import { Request, Response } from "express";
import winston from "winston";
import Env from "../environment_variables";
import { Environments } from "../config";
import { v4 as uuidv4 } from "uuid";

/**
 * Records and logs the response time for http requests
 * @returns {void}
 */
const recordResponseTime = (req: Request, res: Response, time: number) => {
  console.log(
    `${req.method}: ${req.originalUrl} => ${time.toFixed(3)} ms `,
    res.statusCode
  );
};

/**
 * Logs the provided error to console
 * - Logs to file as well if environment is set to production
 * @param {Error} error javascript error object
 * @param res an optional express Response object
 * - res is provided if the error occurred in a http request and the route and method needs to be recorded
 * @returns void
 */
const logError = (error: Error, res?: Response) => {
  winston.add(
    new winston.transports.Console({
      format: winston.format.prettyPrint()
    })
  );

  if (Env.ENVIRONMENT == Environments.PROD) {
    winston.add(
      new winston.transports.File({
        filename: "Error Logs.log",
        format: winston.format.prettyPrint()
      })
    );
  }

  winston.log({
    level: "error",
    message: `Error on the endpoint, ${res?.req.method} ${res?.req.originalUrl}  ======>    ${error.message}`,
    metadata: error,
    time_stamp: new Date()
  });
};

const generateUUID = (): string => {
  try {
    return uuidv4();
  } catch (error) {
    throw error;
  }
};

export { recordResponseTime, logError, generateUUID };
