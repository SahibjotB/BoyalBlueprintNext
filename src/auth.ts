import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import pool from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = String(credentials.email).toLowerCase().trim()
                const password = String(credentials.password)

                try {
                    const result = await pool.query(
                        "SELECT id, name, email, password_hash, phone FROM users WHERE email = $1",
                        [email]
                    )

                    if (result.rowCount === 0 || !result.rows[0]) {
                        return null
                    }

                    const user = result.rows[0]
                    const isValidPassword = await bcrypt.compare(password, user.password_hash)

                    if (!isValidPassword) {
                        return null
                    }

                    return {
                        id: String(user.id),
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    }
                } catch (error) {
                    console.error("Authorize error:", error)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.phone = (user as any).phone
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                if (token.id) session.user.id = token.id as string
                if (token.phone) (session.user as any).phone = token.phone as string
            }
            return session
        },
    },
})
