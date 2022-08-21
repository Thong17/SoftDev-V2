const Joi = require('joi')

const createTransactionValidation = Joi.object({
    description: Joi.string().required(),
    product: Joi.string().required(),
    color: Joi.string().optional().allow(null),
    price: Joi.number().required(),
    currency: Joi.string().required(),
    quantity: Joi.number().required(),
    options: Joi.array().required(),
    promotion: Joi.object().optional()
})

module.exports = {
    createTransactionValidation
}