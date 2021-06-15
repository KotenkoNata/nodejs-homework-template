const Joi = require('joi');
const { Subscription } = require('../../../helpers/constants');
const subscriptionOptions = Object.values(Subscription);

const schemaNewUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(5).max(25).required(),
  subscription: Joi.string()
    .valid(...subscriptionOptions)
    .optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const schemaSubscriptionUpdate = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionOptions)
    .required(),
});

const validate = async (schema, request, next) => {
  try {
    await schema.validateAsync(request);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.message.replace(/"/g, ''),
    });
  }
};

module.exports = {
  validationNewUser: (req, res, next) => {
    return validate(schemaNewUser, req.body, next);
  },
  validationLoginUser: (req, res, next) => {
    return validate(schemaLoginUser, req.body, next);
  },
  validationSubscription: (req, res, next) => {
    return validate(schemaSubscriptionUpdate, req.body, next);
  },
};
