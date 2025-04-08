import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    category: z.enum(['coffee', 'tea', 'smoothie', 'food', 'dessert']),
    discountPrice: z.number().positive().optional(),
    status: z.enum(['available', 'unavailable', 'coming_soon']),
    ingredients: z.array(z.string()).optional(),
    preparationTime: z.number().positive().optional(),
    calories: z.number().positive().optional(),
    isBestSeller: z.boolean().optional(),
  }),
});

export const updateProductSchema = createProductSchema.deepPartial();

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
}); 