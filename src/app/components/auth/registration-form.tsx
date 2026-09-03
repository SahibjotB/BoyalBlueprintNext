"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { registerUser } from "@/app/actions/auth"
import { AlertCircle, Loader2 } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-3 text-base font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] disabled:opacity-50 transition-all duration-300 cursor-pointer"
        >
            {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> : "Create Account"}
        </button>
    )
}

export function RegistrationForm() {
    const [state, formAction] = useActionState(registerUser, { error: "", success: false })

    return (
        <form action={formAction} className="w-full space-y-5" aria-label="Registration Form">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-semibold text-zinc-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-xs"
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-semibold text-zinc-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-xs"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-sm font-semibold text-zinc-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Phone Number <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-xs"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-semibold text-zinc-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-xs"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {state?.error && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200/80 p-3.5 text-sm text-red-600 font-medium" role="alert">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{state.error}</p>
                </div>
            )}

            <SubmitButton />
        </form>
    )
}