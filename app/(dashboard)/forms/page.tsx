'use client'
import { apiFetch } from '@/lib/client-fetch'

import { FormEvent, useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataForm, FormStatus, Patient } from '@/types'

type FormEditorState = {
  id?: string
  title: string
  patientId: string
  status: FormStatus
  data: string
}

const emptyForm: FormEditorState = {
  title: '',
  patientId: '',
  status: 'DRAFT',
  data: '{\n  "vitals": {},\n  "outcomes": {}\n}',
}


export default function FormsPage() {
  const [forms, setForms] = useState<DataForm[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState<FormEditorState>(emptyForm)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [formsResponse, patientsResponse] = await Promise.all([
        apiFetch<DataForm[]>('/api/forms'),
        apiFetch<Patient[]>('/api/patients'),
      ])
      setForms(formsResponse)
      setPatients(patientsResponse)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load forms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function openCreate() {
    setFormState({ ...emptyForm, patientId: patients[0]?.id ?? '' })
    setModalOpen(true)
  }

  function openEdit(form: DataForm) {
    setFormState({
      id: form.id,
      title: form.title,
      patientId: form.patientId,
      status: form.status,
      data: JSON.stringify(form.data ?? {}, null, 2),
    })
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this form?')) {
      return
    }

    try {
      await apiFetch(`/api/forms/${id}`, { method: 'DELETE' })
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Delete failed')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      let parsedData: unknown = {}

      if (formState.data.trim()) {
        parsedData = JSON.parse(formState.data)
      }

      const isEditing = Boolean(formState.id)
      await apiFetch(isEditing ? `/api/forms/${formState.id}` : '/api/forms', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify({
          title: formState.title,
          patientId: formState.patientId,
          status: formState.status,
          data: parsedData,
        }),
      })

      setModalOpen(false)
      setFormState(emptyForm)
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Forms</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage patient-linked clinical forms and submission states.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
          Add form
        </button>
      </section>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading forms…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'title', header: 'Title' },
            {
              key: 'patient',
              header: 'Patient',
              render: (form) =>
                form.patient ? `${form.patient.firstName} ${form.patient.lastName} (${form.patient.mrn})` : 'Unknown',
            },
            { key: 'status', header: 'Status', render: (form) => <StatusBadge value={form.status} /> },
            {
              key: 'validations',
              header: 'Validation history',
              render: (form) => form.validations?.length ?? 0,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (form) => (
                <div className="flex gap-2">
                  <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(form)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(form.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={forms}
          keyExtractor={(form) => form.id}
          emptyMessage="No forms created yet."
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={formState.id ? 'Edit form' : 'Create form'}
        description="Store structured clinical payloads as JSON against a patient record."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Patient</label>
            <select value={formState.patientId} onChange={(event) => setFormState((current) => ({ ...current, patientId: event.target.value }))} required>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} ({patient.mrn})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value as FormStatus }))}>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="VALIDATED">VALIDATED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">JSON data</label>
            <textarea rows={12} value={formState.data} onChange={(event) => setFormState((current) => ({ ...current, data: event.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70">
              {saving ? 'Saving…' : formState.id ? 'Update form' : 'Create form'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
