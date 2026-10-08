'use client'

import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { AuthLayout } from '../layout/auth-layout';
import { GoogleButton } from '../buttons/google-button';
import { InputField } from '@/lib/actions/utils';
import { signIn } from 'next-auth/react'

export default function SignInForm() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [show, setShow] = useState(false); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }
  
    setError('')
    setLoading(true)
  
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
  
      if (!result || result.error) {
        setError('Invalid email or password.')
        return
      }
  
      window.location.href = '/'
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
    return (
   <AuthLayout>
    <section className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b5c55]">Payroll, made clear</p>
            <h1 className="text-[32px] font-semibold tracking-[-0.045em] sm:text-[36px]">Welcome back</h1>
            <p className="mx-auto mt-3 max-w-[330px] text-[14px] leading-6 text-[#718581]">Sign in to manage your payroll and employees.</p>
        </div>
        
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <InputField 
        label="Work email" 
        id="email" 
        type="email" 
        placeholder="you@company.com" 
        value={email} 
        onChange={setEmail} 
        autoComplete="email" />

        <div className="relative">
            <InputField 
            label="Password" 
            id="password" 
            type={show ? 'text' : 'password'} 
            placeholder="Password" 
            value={password} 
            onChange={setPassword} 
            autoComplete="current-password" /> 
            
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-9 p-1 text-[#78908c]">
                {show ? <EyeOff /> : <Eye />}
            </button>
        </div>
        
        {error && 
        
        <p className="text-xs text-[#b75952]">
            {error}
        </p>}
        
        <div className="-mt-1 flex justify-end">
            <Link href="/views/forget-password" className="text-[13px] font-medium text-[#0b5c55]">
                Forgot password?
            </Link>
        </div>
        <button type="submit" disabled={loading} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0b5c55] text-[14px] font-semibold text-white transition hover:bg-[#084740] disabled:opacity-70">
            {loading && <Loader2 className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign in'} 
            {!loading && <ArrowRight />}
        </button>
    </form>
    
    {/* Divider */}
    <div className="mt-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e4eae8]" />

            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9aa9a6]">
            Or
            </span>

            <div className="h-px flex-1 bg-[#e4eae8]" />
        </div>

    <GoogleButton />
    </div>
    <p className="mt-7 text-center text-[13px] text-[#718581]">
        Don&apos;t have an account? 
        <Link href="/views/create-account" className="font-semibold text-[#0b5c55] hover:underline">Create account</Link>
    </p>
    </section>
    </AuthLayout>
  )
}
