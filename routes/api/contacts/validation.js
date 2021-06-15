const Joi = require('joi');

const mongoose = require('mongoose');

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string(),
  favorite: Joi.boolean().optional(),
}).or('email', 'phone');

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string(),
  favorite: Joi.boolean().optional(),
}).or('name', 'phone', 'email', 'favorite');

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ''),
    });
  }
};

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': "Missing 'favorite' field.",
  }),
});

module.exports = {
  validationCreateContact: (req, res, next) => {
    return validate(schemaCreateContact, req.body, next);
  },
  validationUpdateContact: (req, res, next) => {
    return validate(schemaUpdateContact, req.body, next);
  },

  validationUpdateFavorite: (req, res, next) => {
    return validate(schemaUpdateFavorite, req.body, next);
  },

  validateMondoId: (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.contactId)) {
      return next({
        status: 400,
        message: 'Invalid ObjectId',
      });
    }
    next();
  },
};
