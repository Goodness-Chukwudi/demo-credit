import App from "./App";
import { Environments } from "./common/config";
import Env from "./common/environment_variables";
import validateEnvironmentVariables from "./helpers/validators/env_validator";

validateEnvironmentVariables();

App.listen(Env.PORT, async () => {
  if (Env.ENVIRONMENT == Environments.DEV) {
    console.log(`Express is listening on http://localhost:${Env.PORT}${Env.API_PATH}`);
  }
});

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  console.error('Unhandled Rejection at:\n', p);
  console.log("\n")
  console.error('Reason:\n', reason);
  //Track error with error logger
  
  process.exit(1);
  //Restart with pm2 in production
});

process.on('uncaughtException', (error: Error) => {
  console.error(`Uncaught exception:`);
  console.log("\n")
  console.error(error);
  //Track error with error logger

  process.exit(1);
  //Restart with pm2 in production
});