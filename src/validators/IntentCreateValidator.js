const { Joi } = require('express-validation')

const intentValidator = Joi.object({
    name: Joi.string().required(),
    fallbackIntent: Joi.boolean().required(),
    endInteraction: Joi.boolean().required(),
    utterances: Joi.array().items(Joi.string()).required(),
    inputContexts: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      lifespanCount: Joi.number().required()
    })).required(),
    outputContexts: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      lifespanCount: Joi.number().required()
    })).required(),
    responses: Joi.array().items(Joi.object({
      parameters: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required()
      })),
      message: Joi.array().items(Joi.object({
        type: Joi.string().required(),
        plataform: Joi.string().required(),
        text: Joi.array().items(Joi.string()).required()
      })).required()
    })).required()
  }).required()

module.exports = intentValidator;
