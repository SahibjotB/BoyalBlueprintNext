import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/app/components/auth/login-form"
import Link from "next/link"

export const metadata = {
    title: "Sign In | Boyal Blueprint",
    description: "Sign in to access exclusive insights and tools.",
}

export default async function LoginPage() {
    const session = await auth()

    if (session?.user) {
        redirect("/dashboard")
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 pt-28 pb-20 bg-gradient-to-b from-[#FFFDFB] via-[#fef4ed] to-[#FCE4D6]">
            <div className="flex w-full max-w-md flex-col items-center space-y-6 bg-white rounded-[28px] p-8 md:p-10 shadow-[0_12px_45px_rgba(249,115,22,0.08)] border border-[#f97316]/15 relative overflow-hidden">
                {/* Decorative top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f97316] to-[#E5A57A]" />

                <div className="text-center space-y-2 pt-2">
                    <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                        Welcome Back
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                        Sign In to Your Account
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Enter your email and password below to access tools and insights.
                    </p>
                </div>

                <LoginForm />

                <div className="relative w-full py-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-zinc-400 font-semibold tracking-wider">Or</span>
                    </div>
                </div>

                <div className="w-full text-center space-y-3 rounded-2xl border border-zinc-200/80 bg-[#f8f9fa] p-5">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-zinc-900">
                            Don&apos;t have an account yet?
                        </p>
                        <p className="text-xs text-zinc-500">
                            Join Boyal Blueprint today to unlock exclusive features.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="flex w-full items-center justify-center rounded-xl border border-[#f97316] bg-white px-4 py-2.5 text-sm font-semibold text-[#f97316] shadow-xs hover:bg-[#f97316] hover:text-white transition-all duration-300"
                    >
                        Sign up for an account
                    </Link>
                </div>
            </div>
        </main>
    )
}
