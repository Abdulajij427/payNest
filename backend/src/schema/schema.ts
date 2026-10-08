import {z} from 'zod';


// user info
export const signupSchema = z.object({
    username: z.string().trim().email().max(100),
    password: z.string().min(6).max(72),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100)
});

export const signinSchema = z.object({
    username: z.string().trim().email().max(100),
    password: z.string().min(1).max(72)
});

export const updateUserSchema = z.object({
    firstName: z.string().trim().min(1).max(100).optional(),
    lastName: z.string().trim().min(1).max(100).optional(),
}).refine((value) => value.firstName !== undefined || value.lastName !== undefined, { message: "At least one field is required" });




// when user search info of other user
export const searchSchema = z.object({
  q: z.string().trim().max(50).default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const userIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof signupSchema>;









// transfer money
export const transferSchema = z.object({
    to: z.coerce.number().int().positive(),
    amount: z.coerce.number().positive().finite().max(1_000_000)
});




