import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
      quantity: z.number().positive('Quantity must be positive'),
      note: z.string().optional(),
    })),
    totalAmount: z.number().positive('Total amount must be positive'),
    status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']).optional(),
    paymentMethod: z.enum(['cash', 'card', 'momo']),
    deliveryAddress: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
  }),
}); 