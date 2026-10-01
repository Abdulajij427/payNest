import {z} from 'zod';

export const createUserSchema = z.object({
    username: z.string().min(2),
    password: z.string().min(10),
    firstName: z.string(),
    lastName: z.string()
})

export const userIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;


