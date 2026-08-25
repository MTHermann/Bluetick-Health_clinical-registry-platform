'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DashboardStats } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/stats')
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.error ?? 'Failed to load dashboard stats')
        }

        setStats(payload)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard metrics…</p>
  }

  if (error || !stats) {
    return <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error ?? 'Unable to load dashboard'}</p>
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Clinical registry overview</h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor operational activity, patient registrations and form validation throughput.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Patients" value={stats.metrics.patients} description="Registered across all ICUs" />
        <MetricCard title="Forms" value={stats.metrics.forms} description="Data forms captured in the registry" />
        <MetricCard title="Submitted" value={stats.metrics.submittedForms} description="Awaiting validator review" />
        <MetricCard title="Validated" value={stats.metrics.validatedForms} description="Approved records ready for analysis" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Form status mix</h2>
          <div className="mt-4 space-y-3">
            {stats.formsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <StatusBadge value={item.status} />
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Hospitals by country</h2>
          <div className="mt-4 space-y-3">
            {stats.hospitalsByCountry.map((item) => (
              <div key={item.code} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{item.country}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{item.code}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.hospitals}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent patients</h2>
          <DataTable
            columns={[
              { key: 'mrn', header: 'MRN' },
              {
                key: 'name',
                header: 'Patient',
                render: (patient) => `${patient.firstName} ${patient.lastName}`,
              },
              { key: 'gender', header: 'Gender' },
              {
                key: 'icu',
                header: 'ICU',
                render: (patient) => patient.icu?.name ?? 'Unassigned',
              },
            ]}
            data={stats.recentPatients}
            keyExtractor={(patient) => patient.id}
            emptyMessage="No patients available yet."
          />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent forms</h2>
          <DataTable
            columns={[
              { key: 'title', header: 'Form' },
              {
                key: 'patient',
                header: 'Patient',
                render: (form) =>
                  form.patient ? `${form.patient.firstName} ${form.patient.lastName} (${form.patient.mrn})` : 'Unknown',
              },
              {
                key: 'status',
                header: 'Status',
                render: (form) => <StatusBadge value={form.status} />,
              },
              {
                key: 'updatedAt',
                header: 'Updated',
                render: (form) => new Date(form.updatedAt).toLocaleDateString(),
              },
            ]}
            data={stats.recentForms}
            keyExtractor={(form) => form.id}
            emptyMessage="No forms have been created yet."
          />
        </div>
      </section>
    </div>
  )
}
