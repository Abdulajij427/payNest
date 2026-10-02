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
    q: z.string(),
    page: z.coerce.number().int(),
    limit: z.coerce.number().int()
});

export const userIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;


