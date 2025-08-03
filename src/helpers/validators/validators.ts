import Joi from "joi";
import { GENDER } from "../../data/enums/enum";

const signUp = Joi.object({
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  gender: Joi.string()
    .valid(...Object.values(GENDER))
    .required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  dob: Joi.date(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string().required()
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const passwordUpdate = Joi.object({
  password: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string().required()
});

const setSettlementAccount = Joi.object({
  account_name: Joi.string().required(),
  account_number: Joi.string().required(),
  bank_name: Joi.string().required()
});

export { signUp, login, passwordUpdate, setSettlementAccount };
