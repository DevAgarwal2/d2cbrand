import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'data', 
  schema: z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    categoryName: z.string(),
    price: z.string(),
    originalPrice: z.string(),
    discount: z.string().optional(),
    rating: z.number(),
    reviews: z.number(),
    image: z.string(),
    images: z.array(z.string()).optional(),
    description: z.string(),
    features: z.array(z.string()).optional(),
    shipping: z.string().optional(),
    inStock: z.boolean(),
    fastDelivery: z.boolean().optional(),
  }),
});

export const collections = { products };