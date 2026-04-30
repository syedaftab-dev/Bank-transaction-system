const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  next();
};

const authSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const transactionSchemas = {
  transfer: Joi.object({
    fromAccount: Joi.string().required().length(24),
    toAccount: Joi.string().required().length(24),
    amount: Joi.number().required().positive(),
    idempotencyKey: Joi.string().required(),
    pin: Joi.string().required().length(4),
  }),
  initialFunds: Joi.object({
    toAccount: Joi.string().required().length(24),
    amount: Joi.number().required().positive(),
    idempotencyKey: Joi.string().required(),
  }),
};

module.exports = {
  validate,
  authSchemas,
  transactionSchemas,
};
