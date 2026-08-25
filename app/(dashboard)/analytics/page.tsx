'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DashboardStats } from '@/types'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/stats')
        const payload = (await response.json()) as DashboardStats & { error?: string }

        if (!response.ok) {
          throw new Error(payload.error ?? 'Failed to load analytics')
        }

        setStats(payload)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    void loadAnalytics()
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-500">Loading analytics…</p>
  }

  if (error || !stats) {
    return <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error ?? 'Unable to load analytics'}</p>
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Analytics</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Explore operational distribution of hospitals, patient cohorts and form lifecycle outcomes.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Countries" value={stats.metrics.countries} description="Participating countries" />
        <MetricCard title="Hospitals" value={stats.metrics.hospitals} description="Hospitals onboarded" />
        <MetricCard title="Departments" value={stats.metrics.departments} description="Registry-enabled departments" />
        <MetricCard title="ICUs" value={stats.metrics.icus} description="Critical care units in scope" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Patient gender distribution</h2>
          <DataTable
            columns={[
              { key: 'gender', header: 'Gender' },
              { key: 'count', header: 'Patients' },
            ]}
            data={stats.patientsByGender}
            keyExtractor={(row) => row.gender}
            emptyMessage="No gender distribution data yet."
          />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Form status distribution</h2>
          <DataTable
            columns={[
              { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'count', header: 'Forms' },
            ]}
            data={stats.formsByStatus}
            keyExtractor={(row) => row.status}
            emptyMessage="No forms distribution data yet."
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Hospital footprint by country</h2>
        <DataTable
          columns={[
            { key: 'country', header: 'Country' },
            { key: 'code', header: 'Code' },
            { key: 'hospitals', header: 'Hospitals' },
          ]}
          data={stats.hospitalsByCountry}
          keyExtractor={(row) => row.code}
          emptyMessage="No hospitals by country available."
        />
      </section>
    </div>
  )
}
