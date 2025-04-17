import Joi from 'joi';

export const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required(),
      note: Joi.string().allow('').optional()
    })
  ).min(1).required(),
  totalAmount: Joi.number().min(0).required(),
  paymentMethod: Joi.string().valid('cash', 'momo', 'card').required(),
  note: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'preparing', 'ready', 'completed', 'cancelled').default('pending')
});

export const updateOrderSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED').required()
});

export const orderIdSchema = Joi.object({
  id: Joi.string().required()
}); 