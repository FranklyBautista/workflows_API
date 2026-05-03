import z from "zod";

export const registerSchema=z.object({
    name: z.string().min(2, "Name must have at least 2 characters").max(80, "name must have less than 80 characters"),

    email: z.string().email("invalid email format"),

    password: z.string().min(6,"Password must have at least 6 characters").max(100,"Password must have less than 100 characters")
})

export const loginSchema=z.object({
    email: z.string().email("Invalid email format"),

    password: z.string().min(6,"Password must have at least 6 characters")
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>