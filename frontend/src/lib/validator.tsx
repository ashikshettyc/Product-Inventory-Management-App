import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock must be zero or more'),
});

export type Product = z.infer<typeof productSchema>;
