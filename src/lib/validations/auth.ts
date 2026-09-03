import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format").optional().or(z.literal("")),
})

export type SignUpInput = z.infer<typeof signUpSchema>