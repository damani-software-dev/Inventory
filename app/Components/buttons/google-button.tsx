"use client"

import { login } from "@/lib/actions/auth"

export const GoogleButton = () => {
    return (
      <button onClick={() => login()} type="button" className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-[#d8e1df] bg-white text-[14px] font-medium text-[#263b37] transition hover:bg-[#f8faf9]">
        <span className="text-[17px] font-semibold">G</span>
        Continue with Google
      </button>
    )
  }