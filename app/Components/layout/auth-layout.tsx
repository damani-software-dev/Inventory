"use client";

import Link from "next/link"
import { Footer } from "../footer"

export function AuthLayout({children,}: {children: React.ReactNode}) {
    return (
      <main className="min-h-screen bg-[#f7faf8] px-5 py-8 text-[#172b2a] sm:px-8 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1120px] flex-col">
  
          <header className="flex items-center justify-between">
            
            {/* Brand */}
            <Link href="/sign-in" className="inline-flex items-center gap-2.5" aria-label="Ledger home">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#0b5c55] text-white shadow-sm"><span className="text-lg font-bold leading-none">L</span></span>
                <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#172b2a]">ledger</span>
            </Link>

            {/* <div>
              <span className="text-lg font-semibold">
                Payroll
              </span>
            </div> */}
            
  
            <span className="hidden items-center gap-2 text-xs text-[#718581] sm:flex">
              Secure workspace access
            </span>
          </header>
  
          <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
            {children}
          </div>
  
          <Footer />
        </div>
      </main>
    )
  }