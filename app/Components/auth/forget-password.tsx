'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { AuthLayout } from '../layout/auth-layout'
import { InputField } from '@/lib/actions/utils'


export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email) {
      setError('Enter your work email to continue.')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 900)
  }

  return (
  <AuthLayout>
    <section className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b5c55]">Account recovery</p>
            <h1 className="text-[32px] font-semibold tracking-[-0.045em] sm:text-[36px]">Forgot your password?</h1>
            <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-6 text-[#718581]">Enter your work email and we&apos;ll send you a link to reset your password.</p>
        </div>
   
   {sent ? 
    
    <div className="rounded-[12px] border border-[#dbe4e1] bg-white p-6 text-center shadow-sm">
      
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#e7f3ef] text-[#0b5c55]">
        <MailCheck />
      </div>
        
        <h2 className="text-[17px] font-semibold">Check your inbox</h2>
        
        <p className="mt-2 text-[14px] leading-6 text-[#718581]">
            If an account exists for <span className="font-medium text-[#29403e]">{email}</span>, a reset link is on its way.
        </p>
        
        <Link href="/sign-in" className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#0b5c55] hover:underline"><ArrowLeft data-icon="inline-start" />
        Back to sign in
        </Link>
    
    </div> : 
    
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      
      <InputField label="Work email" id="email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} error={error} autoComplete="email" />
        
        <button type="submit" disabled={loading} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0b5c55] text-[14px] font-semibold text-white transition hover:bg-[#084740] disabled:opacity-70">
            {loading && <Loader2 className="animate-spin" />}{loading ? 'Sending link...' : 'Send reset link'} {!loading && <ArrowRight />}
        </button>
      
      <Link href="/sign-in" className="mt-2 inline-flex items-center justify-center gap-2 text-[13px] font-medium text-[#718581] hover:text-[#0b5c55]">
        <ArrowLeft data-icon="inline-start" />Back to sign in
      </Link>
    
    </form>}
    
    </section>
  
  </AuthLayout>
  )
}

