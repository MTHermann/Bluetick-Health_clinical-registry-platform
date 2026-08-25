'use client'

import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard': 'Operations dashboard',
  '/organisation': 'Organisation management',
  '/users': 'User administration',
  '/patients': 'Patient registry',
  '/forms': 'Data collection forms',
  '/validation': 'Validation workflow',
  '/analytics': 'Analytics overview',
}

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur lg:px-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{titles[pathname] ?? 'Clinical Registry Platform'}</h2>
        <p className="mt-1 text-sm text-slate-500">{session?.user?.role ?? 'VIEWER'} access</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{session?.user?.name ?? 'Authenticated user'}</p>
          <p className="text-xs text-slate-500">{session?.user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-700 hover:text-brand-900"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
