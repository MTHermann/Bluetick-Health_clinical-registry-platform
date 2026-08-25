'use client'
import { apiFetch } from '@/lib/client-fetch'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { MetricCard } from '@/components/ui/MetricCard'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataForm, FormStatus } from '@/types'

type ValidationAction = 'VALIDATED' | 'REJECTED'

type ValidationState = {
  formId: string
  nextStatus: ValidationAction
  note: string
}


export default function ValidationPage() {
  const [forms, setForms] = useState<DataForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [validationState, setValidationState] = useState<ValidationState>({
    formId: '',
    nextStatus: 'VALIDATED',
    note: '',
  })

  async function loadForms() {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch<DataForm[]>('/api/forms')
      setForms(response)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load validation queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadForms()
  }, [])

  const actionableForms = useMemo(() => forms.filter((form) => form.status !== 'DRAFT'), [forms])
  const queueCount = actionableForms.filter((form) => form.status === 'SUBMITTED').length
  const validatedCount = actionableForms.filter((form) => form.status === 'VALIDATED').length
  const rejectedCount = actionableForms.filter((form) => form.status === 'REJECTED').length

  function openModal(formId: string, nextStatus: ValidationAction) {
    setValidationState({ formId, nextStatus, note: '' })
    setModalOpen(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await apiFetch(`/api/forms/${validationState.formId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: validationState.nextStatus,
          validationNote: validationState.note,
          recordValidation: true,
        }),
      })

      setModalOpen(false)
      await loadForms()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to save validation outcome')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Validation workflow</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Review submitted forms, document decisions and maintain an auditable validation trail.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Pending review" value={queueCount} description="Submitted forms waiting for action" />
        <MetricCard title="Validated" value={validatedCount} description="Forms approved by validators" />
        <MetricCard title="Rejected" value={rejectedCount} description="Forms returned for correction" />
      </section>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading validation queue…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'title', header: 'Form' },
            {
              key: 'patient',
              header: 'Patient',
              render: (form) =>
                form.patient ? `${form.patient.firstName} ${form.patient.lastName} (${form.patient.mrn})` : 'Unknown',
            },
            { key: 'status', header: 'Current status', render: (form) => <StatusBadge value={form.status} /> },
            {
              key: 'lastValidation',
              header: 'Latest note',
              render: (form) => form.validations?.[0]?.notes ?? 'No notes yet',
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (form) => (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    onClick={() => openModal(form.id, 'VALIDATED')}
                  >
                    Validate
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                    onClick={() => openModal(form.id, 'REJECTED')}
                  >
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
          data={actionableForms}
          keyExtractor={(form) => form.id}
          emptyMessage="No forms in the validation workflow."
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={validationState.nextStatus === 'VALIDATED' ? 'Validate form' : 'Reject form'}
        description="Record a validation decision and supporting notes."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Decision</label>
            <select
              value={validationState.nextStatus}
              onChange={(event) =>
                setValidationState((current) => ({ ...current, nextStatus: event.target.value as ValidationAction }))
              }
            >
              <option value="VALIDATED">VALIDATED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Validation notes</label>
            <textarea
              rows={6}
              value={validationState.note}
              onChange={(event) => setValidationState((current) => ({ ...current, note: event.target.value }))}
              placeholder="Summarise issues found or confirm data quality."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70">
              {saving ? 'Saving…' : 'Save decision'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
