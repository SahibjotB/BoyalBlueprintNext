import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { LogOut, Home, Settings, Search, Calculator, TrendingUp, ArrowRight, User } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Dashboard | Boyal Blueprint",
  description: "Manage your real estate profile and saved listings.",
}

export default async function DashboardPage() {
  // 1. Secure the route on the server
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const firstName = session.user.name?.split(" ")[0] || "User"
  // @ts-ignore - Phone is injected via custom auth.ts jwt callback
  const phone = session.user.phone || "Not provided"

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFDFB] via-[#fef4ed] to-[#FCE4D6] pt-28 pb-20">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white rounded-[24px] p-6 md:p-8 shadow-[0_10px_35px_rgba(249,115,22,0.06)] border border-[#f97316]/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f97316] to-[#E5A57A]" />
          <div>
            <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Member Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 font-sans">
              Welcome back, {firstName}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage your Boyal Blueprint profile, preferences, and saved real estate assets.
            </p>
          </div>

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-xs hover:bg-[#f97316] hover:text-white hover:border-[#f97316] transition-all duration-300 cursor-pointer group"
            >
              <LogOut className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
              Sign Out
            </button>
          </form>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Profile Card */}
          <div className="col-span-1 rounded-[24px] border border-[#f97316]/15 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.05)] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] to-[#E5A57A]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2.5 font-sans">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f97316]/10 text-[#f97316]">
                    <User className="h-4 w-4" />
                  </div>
                  Account Details
                </h2>
              </div>
              <div className="space-y-4 text-sm">
                <div className="pb-3 border-b border-zinc-100">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">Full Name</span>
                  <span className="font-semibold text-zinc-900 text-base">{session.user.name}</span>
                </div>
                <div className="pb-3 border-b border-zinc-100">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">Email Address</span>
                  <span className="font-medium text-zinc-700 truncate block">{session.user.email}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">Phone Number</span>
                  <span className="font-medium text-zinc-700">{phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
              <span>Status</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Member
              </span>
            </div>
          </div>

          {/* Quick Actions / Stats */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* AI Search Card */}
            <Link 
              href="/ai-search"
              className="group flex flex-col justify-between rounded-[24px] border border-[#f97316]/15 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.05)] hover:border-[#f97316] hover:shadow-[0_14px_40px_rgba(249,115,22,0.15)] transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316] group-hover:bg-[#f97316] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#f97316] transition-colors flex items-center justify-between">
                  AI Property Search
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#f97316]" />
                </h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Start a new conversation with your personal AI realtor to find opportunities tailored to your criteria.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-[#f97316] flex items-center gap-1">
                Launch AI Assistant &rarr;
              </div>
            </Link>

            {/* Saved Properties Card */}
            <div className="flex flex-col justify-between rounded-[24px] border border-[#f97316]/15 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.05)] relative overflow-hidden">
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316]">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Saved Properties
                </h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Keep track of listings and investment options you&apos;ve saved to your personal blueprint.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Total Saved</span>
                <span className="bg-[#f97316]/10 text-[#f97316] text-xs font-bold px-2.5 py-1 rounded-full">0 Properties</span>
              </div>
            </div>

            {/* Investment Calculator Card */}
            <Link 
              href="/calculator"
              className="group flex flex-col justify-between rounded-[24px] border border-[#f97316]/15 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.05)] hover:border-[#f97316] hover:shadow-[0_14px_40px_rgba(249,115,22,0.15)] transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316] group-hover:bg-[#f97316] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#f97316] transition-colors flex items-center justify-between">
                  Investment Calculator
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#f97316]" />
                </h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Analyze ROI, mortgage payments, cap rates, and cash flow projections for potential real estate acquisitions.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-[#f97316] flex items-center gap-1">
                Open Calculator &rarr;
              </div>
            </Link>

            {/* Exclusive Deals Card */}
            <Link 
              href="/deals"
              className="group flex flex-col justify-between rounded-[24px] border border-[#f97316]/15 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.05)] hover:border-[#f97316] hover:shadow-[0_14px_40px_rgba(249,115,22,0.15)] transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316] group-hover:bg-[#f97316] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#f97316] transition-colors flex items-center justify-between">
                  Exclusive Deals
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#f97316]" />
                </h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Browse curated, high-yield opportunities and off-market blueprints vetted by the Boyal Blueprint team.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-[#f97316] flex items-center gap-1">
                Explore Deals &rarr;
              </div>
            </Link>

          </div>

        </div>
      </div>
    </main>
  )
}
