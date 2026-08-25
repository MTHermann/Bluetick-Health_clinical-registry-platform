import { FormStatus, Role } from '@/types'

const styles: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  DATA_MANAGER: 'bg-sky-100 text-sky-700',
  VALIDATOR: 'bg-amber-100 text-amber-700',
  VIEWER: 'bg-slate-100 text-slate-700',
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-sky-100 text-sky-700',
  VALIDATED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
}

export function StatusBadge({ value }: { value: Role | FormStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value]}`}>
      {value.replaceAll('_', ' ')}
    </span>
  )
}
