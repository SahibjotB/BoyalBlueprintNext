import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { RegistrationForm } from "@/app/components/auth/registration-form"
import Link from "next/link"

export const metadata = {
    title: "Create an Account | Boyal Blueprint",
    description: "Sign up to access exclusive insights and tools.",
}

export default async function RegisterPage() {
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
                        Get Started
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">
                        Create an Account
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Enter your details below to join Boyal Blueprint.
                    </p>
                </div>

                <RegistrationForm />

                <div className="relative w-full py-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200" />
                    </div>
                </div>

                <p className="text-sm text-zinc-600 text-center font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-[#f97316] hover:text-[#ea580c] hover:underline underline-offset-4 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    )
}