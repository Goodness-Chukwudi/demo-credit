import Joi from "joi";

const signUp = Joi.object({
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
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

export {
    signUp,
    login,
    passwordUpdate
}