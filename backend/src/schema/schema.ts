import {z} from 'zod';

export const createUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

export const userIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;


