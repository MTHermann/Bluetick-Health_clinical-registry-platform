'use client'

import { FormEvent, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [router, status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsSubmitting(false)

    if (result?.error) {
      setError('Invalid email or password')
      return
    }

    router.replace('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="grid w-full max-w-5xl gap-8 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1.2fr_0.8fr]">
        <section className="bg-brand-900 px-8 py-12 text-white lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Bluetick Health</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Clinical Registry Platform</h1>
          <p className="mt-4 max-w-xl text-base text-slate-200">
            Securely capture, validate and analyse critical care registry data across countries,
            hospitals, departments and intensive care units.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              'Registry and organisation master data',
              'Patient cohort and form management',
              'Validator review workflow',
              'Operational analytics and dashboards',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="px-8 py-12 lg:px-10">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use the seeded administrator account or your assigned credentials.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-brand-900 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-800">First time?</p>
              <p className="mt-1">Use the credentials configured during initial setup. See README for setup instructions.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
