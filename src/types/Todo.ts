import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  userEmail: z.string().email(),
  status: z.enum(['PENDING', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().datetime(), // depending on your API
  createdAt: z
    .string()
    .datetime(),
  updatedAt: z
    .string()
    .datetime(),
});

export type Todo = z.infer<typeof TodoSchema>;
