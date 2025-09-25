import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  author: z.string()
    .min(1, 'Author is required')
    .max(50, 'Author name must be less than 50 characters'),
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be less than 5000 characters'),
  status: z.enum(['draft', 'published'], {
    message: 'Status must be either draft or published'
  }),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;