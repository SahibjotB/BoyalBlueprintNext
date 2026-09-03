"use server"

import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import { signUpSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export type ActionState = {
    error?: string
    success?: boolean
}

export async function registerUser(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawFields = Object.fromEntries(formData.entries())
    const validated = signUpSchema.safeParse(rawFields)

    if (!validated.success) {
        const firstError = Object.values(validated.error.flatten().fieldErrors)[0]?.[0]
        return { error: firstError || "Invalid registration parameters." }
    }

    const { name, email, password, phone } = validated.data

    try {
        const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email])

        if (userExists.rowCount && userExists.rowCount > 0) {
            return { error: "An account with this email already exists." }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await pool.query(
            `INSERT INTO users (name, email, password_hash, phone) VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, phone || null]
        )
    } catch (error) {
        console.error("Database registration error:", error)
        return { error: "Internal server error. Please try again later." }
    }

    // Redirect is intentionally called outside the try/catch block as it throws a Next.js internal error to execute
    redirect("/login")
}

export async function loginUser(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
        return { error: "Please enter both email and password." }
    }

    try {
        await signIn("credentials", {
            email: String(email).toLowerCase().trim(),
            password: String(password),
            redirectTo: "/dashboard",
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid email or password." }
                default:
                    return { error: "Something went wrong during sign in. Please try again." }
            }
        }
        // Next.js redirect throws an internal error that must be re-thrown
        throw error
    }
}