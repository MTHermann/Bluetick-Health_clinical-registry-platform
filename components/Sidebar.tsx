'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/organisation', label: 'Organisation' },
  { href: '/users', label: 'Users' },
  { href: '/patients', label: 'Patients' },
  { href: '/forms', label: 'Forms' },
  { href: '/validation', label: 'Validation' },
  { href: '/analytics', label: 'Analytics' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-brand-900 px-4 py-6 text-white lg:flex">
      <div className="border-b border-white/15 px-3 pb-6">
        <h1 className="text-xl font-bold">Clinical Registry</h1>
        <p className="mt-2 text-xs text-slate-300">
          Data collection, validation and registry operations
        </p>
      </div>
      <nav className="mt-6 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        {navigation.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-brand-800 text-white' : 'text-slate-200 hover:bg-brand-800/70 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
