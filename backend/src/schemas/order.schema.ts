import { z } from 'zod';

// Đơn giản hóa schema tối đa
const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  price: z.number()
}).passthrough(); // Cho phép các trường khác đi qua

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema),
  totalAmount: z.number(),
  paymentMethod: z.string()
}).passthrough();

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
});

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
}); 