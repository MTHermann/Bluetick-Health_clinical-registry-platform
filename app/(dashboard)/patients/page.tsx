'use client'
import { apiFetch } from '@/lib/client-fetch'

import { FormEvent, useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { ICU, Patient } from '@/types'

type PatientFormState = {
  id?: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  icuId: string
}

const emptyPatient: PatientFormState = {
  mrn: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Female',
  icuId: '',
}


export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [icus, setIcus] = useState<ICU[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState<PatientFormState>(emptyPatient)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [patientsResponse, icusResponse] = await Promise.all([
        apiFetch<Patient[]>('/api/patients'),
        apiFetch<ICU[]>('/api/icus'),
      ])
      setPatients(patientsResponse)
      setIcus(icusResponse)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function openCreate() {
    setFormState({ ...emptyPatient, icuId: icus[0]?.id ?? '' })
    setModalOpen(true)
  }

  function openEdit(patient: Patient) {
    setFormState({
      id: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth.slice(0, 10),
      gender: patient.gender,
      icuId: patient.icuId ?? '',
    })
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this patient record?')) {
      return
    }

    try {
      await apiFetch(`/api/patients/${id}`, { method: 'DELETE' })
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
      const isEditing = Boolean(formState.id)
      const payload = {
        mrn: formState.mrn,
        firstName: formState.firstName,
        lastName: formState.lastName,
        dateOfBirth: formState.dateOfBirth,
        gender: formState.gender,
        icuId: formState.icuId || null,
      }

      await apiFetch(isEditing ? `/api/patients/${formState.id}` : '/api/patients', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      setModalOpen(false)
      setFormState(emptyPatient)
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to save patient')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Patients</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Register ICU patients and keep cohort demographics current.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
          Add patient
        </button>
      </section>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading patients…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'mrn', header: 'MRN' },
            { key: 'name', header: 'Patient', render: (patient) => `${patient.firstName} ${patient.lastName}` },
            { key: 'gender', header: 'Gender' },
            { key: 'dateOfBirth', header: 'DOB', render: (patient) => new Date(patient.dateOfBirth).toLocaleDateString() },
            {
              key: 'icu',
              header: 'ICU',
              render: (patient) =>
                patient.icu
                  ? `${patient.icu.name} • ${patient.icu.department?.hospital?.name ?? patient.icu.department?.name ?? ''}`
                  : 'Unassigned',
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (patient) => (
                <div className="flex gap-2">
                  <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(patient)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(patient.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={patients}
          keyExtractor={(patient) => patient.id}
          emptyMessage="No patients registered yet."
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={formState.id ? 'Edit patient' : 'Create patient'}
        description="Capture the core registry patient information."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">MRN</label>
              <input value={formState.mrn} onChange={(event) => setFormState((current) => ({ ...current, mrn: event.target.value }))} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
              <select value={formState.gender} onChange={(event) => setFormState((current) => ({ ...current, gender: event.target.value }))}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">First name</label>
              <input value={formState.firstName} onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Last name</label>
              <input value={formState.lastName} onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Date of birth</label>
              <input type="date" value={formState.dateOfBirth} onChange={(event) => setFormState((current) => ({ ...current, dateOfBirth: event.target.value }))} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ICU</label>
              <select value={formState.icuId} onChange={(event) => setFormState((current) => ({ ...current, icuId: event.target.value }))}>
                <option value="">Unassigned</option>
                {icus.map((icu) => (
                  <option key={icu.id} value={icu.id}>
                    {icu.name} — {icu.department?.hospital?.name ?? icu.department?.name ?? 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70">
              {saving ? 'Saving…' : formState.id ? 'Update patient' : 'Create patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
