import {z} from 'zod';


// user info
export const createUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
});




// when user search info of other user
export const searchSchema = z.object({
  q: z.string().trim().max(50).default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const userIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;









// transfer money
export const transferSchema = z.object({
    to: z.number().int(),
    amount: z.number()
});




