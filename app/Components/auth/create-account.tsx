'use client'

import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { GoogleButton } from '../buttons/google-button'
import { InputField } from '@/lib/actions/utils'
import { AuthLayout } from '../layout/auth-layout'

export default function CreateAccountForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name || !email || password.length < 8 || password !== confirm) {
      setError('Complete the fields and make sure your passwords match.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

  const data = await response.json()

  if (!response.ok) {
    setError(data.error || 'Unable to create your account.')
    return
  }

    window.location.href = '/'
      } catch (error) {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
}

  return (
    <AuthLayout>
    <section className="w-full max-w-[420px]">
      <div className="mb-8 text-center">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b5c55]">
          Payroll, made clear
        </p>

        <h1 className="text-[32px] font-semibold tracking-[-0.045em] sm:text-[36px]">
          Create your account
        </h1>

        <p className="mx-auto mt-3 max-w-[330px] text-[14px] leading-6 text-[#718581]">
          Set up your account to start managing payroll.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <InputField
          label="Full name"
          id="full-name"
          placeholder="Full name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />

        <InputField
          label="Work email"
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        <InputField
          label="Confirm password"
          id="confirm-password"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />

        {error && (
          <p className="text-xs text-[#b75952]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0b5c55] text-[14px] font-semibold text-white transition hover:bg-[#084740] disabled:opacity-70"
        >
          {loading && <Loader2 size={17} className="animate-spin" />}

          {loading ? 'Creating account...' : 'Create account'}

          {!loading && <ArrowRight size={17} />}
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

      <p className="mt-5 text-center text-[11px] leading-5 text-[#879793]">
        By creating an account, you agree to our{' '}
        <button className="font-medium text-[#0b5c55]">
          Terms of Service
        </button>{' '}
        and{' '}
        <button className="font-medium text-[#0b5c55]">
          Privacy Policy
        </button>
        .
      </p>

      <p className="mt-7 text-center text-[13px] text-[#718581]">
        Already have an account?{' '}
        <Link href="/views/sign-in" className="font-semibold text-[#0b5c55] hover:underline">
          Sign in
        </Link>
      </p>
    </section>
    </AuthLayout>
  )
}

