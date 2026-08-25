'use client'
import { apiFetch } from '@/lib/client-fetch'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { Country, Department, Hospital, ICU } from '@/types'

type OrgTab = 'countries' | 'hospitals' | 'departments' | 'icus'

type OrganisationFormState = {
  id?: string
  name: string
  code: string
  countryId: string
  latitude: string
  longitude: string
  hospitalId: string
  departmentId: string
}

const emptyState: OrganisationFormState = {
  name: '',
  code: '',
  countryId: '',
  latitude: '',
  longitude: '',
  hospitalId: '',
  departmentId: '',
}

const tabConfig: Record<OrgTab, { title: string; singular: string; description: string }> = {
  countries: {
    title: 'Countries',
    singular: 'Country',
    description: 'Manage participating countries and region-level onboarding.',
  },
  hospitals: {
    title: 'Hospitals',
    singular: 'Hospital',
    description: 'Register hospitals and map them to countries.',
  },
  departments: {
    title: 'Departments',
    singular: 'Department',
    description: 'Model hospital departments feeding the registry.',
  },
  icus: {
    title: 'ICUs',
    singular: 'ICU',
    description: 'Create intensive care units where patient records are captured.',
  },
}


export default function OrganisationPage() {
  const [activeTab, setActiveTab] = useState<OrgTab>('countries')
  const [countries, setCountries] = useState<Country[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [icus, setIcus] = useState<ICU[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formState, setFormState] = useState<OrganisationFormState>(emptyState)

  const canCreate =
    activeTab === 'countries' ||
    (activeTab === 'hospitals' && countries.length > 0) ||
    (activeTab === 'departments' && hospitals.length > 0) ||
    (activeTab === 'icus' && departments.length > 0)

  async function loadOrganisation() {
    try {
      setLoading(true)
      setError(null)

      const [countriesResponse, hospitalsResponse, departmentsResponse, icusResponse] = await Promise.all([
        apiFetch<Country[]>('/api/countries'),
        apiFetch<Hospital[]>('/api/hospitals'),
        apiFetch<Department[]>('/api/departments'),
        apiFetch<ICU[]>('/api/icus'),
      ])

      setCountries(countriesResponse)
      setHospitals(hospitalsResponse)
      setDepartments(departmentsResponse)
      setIcus(icusResponse)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load organisation data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrganisation()
  }, [])

  const currentTitle = tabConfig[activeTab].title
  const currentSingular = tabConfig[activeTab].singular
  const currentDescription = tabConfig[activeTab].description

  function openCreate() {
    setFormState({
      ...emptyState,
      countryId: countries[0]?.id ?? '',
      hospitalId: hospitals[0]?.id ?? '',
      departmentId: departments[0]?.id ?? '',
    })
    setModalOpen(true)
  }

  function openEdit(record: Country | Hospital | Department | ICU) {
    if (activeTab === 'countries') {
      const country = record as Country
      setFormState({ ...emptyState, id: country.id, name: country.name, code: country.code })
    }

    if (activeTab === 'hospitals') {
      const hospital = record as Hospital
      setFormState({
        ...emptyState,
        id: hospital.id,
        name: hospital.name,
        countryId: hospital.countryId,
        latitude: hospital.latitude?.toString() ?? '',
        longitude: hospital.longitude?.toString() ?? '',
      })
    }

    if (activeTab === 'departments') {
      const department = record as Department
      setFormState({
        ...emptyState,
        id: department.id,
        name: department.name,
        hospitalId: department.hospitalId,
      })
    }

    if (activeTab === 'icus') {
      const icu = record as ICU
      setFormState({
        ...emptyState,
        id: icu.id,
        name: icu.name,
        departmentId: icu.departmentId,
      })
    }

    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!window.confirm(`Delete this ${currentSingular.toLowerCase()}?`)) {
      return
    }

    try {
      const base = activeTab === 'countries' ? 'countries' : activeTab
      await apiFetch(`/api/${base}/${id}`, { method: 'DELETE' })
      await loadOrganisation()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Delete failed')
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const isEditing = Boolean(formState.id)
      let url = '/api/countries'
      let payload: Record<string, unknown> = {}

      if (activeTab === 'countries') {
        url = isEditing ? `/api/countries/${formState.id}` : '/api/countries'
        payload = { name: formState.name, code: formState.code }
      }

      if (activeTab === 'hospitals') {
        url = isEditing ? `/api/hospitals/${formState.id}` : '/api/hospitals'
        payload = {
          name: formState.name,
          countryId: formState.countryId,
          latitude: formState.latitude,
          longitude: formState.longitude,
        }
      }

      if (activeTab === 'departments') {
        url = isEditing ? `/api/departments/${formState.id}` : '/api/departments'
        payload = { name: formState.name, hospitalId: formState.hospitalId }
      }

      if (activeTab === 'icus') {
        url = isEditing ? `/api/icus/${formState.id}` : '/api/icus'
        payload = { name: formState.name, departmentId: formState.departmentId }
      }

      await apiFetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      setModalOpen(false)
      setFormState(emptyState)
      await loadOrganisation()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  function renderTable() {
    if (activeTab === 'countries') {
      return (
        <DataTable
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'code', header: 'Code' },
            {
              key: 'hospitals',
              header: 'Hospitals',
              render: (country: Country) => country._count?.hospitals ?? 0,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (country: Country) => (
                <div className="flex gap-2">
                  <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(country)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(country.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={countries}
          keyExtractor={(country) => country.id}
          emptyMessage={`No ${currentTitle.toLowerCase()} available yet.`}
        />
      )
    }

    if (activeTab === 'hospitals') {
      return (
        <DataTable
          columns={[
            { key: 'name', header: 'Hospital' },
            {
              key: 'country',
              header: 'Country',
              render: (hospital: Hospital) => hospital.country?.name ?? '—',
            },
            {
              key: 'coordinates',
              header: 'Coordinates',
              render: (hospital: Hospital) =>
                hospital.latitude !== null && hospital.longitude !== null
                  ? `${hospital.latitude}, ${hospital.longitude}`
                  : '—',
            },
            {
              key: 'departments',
              header: 'Departments',
              render: (hospital: Hospital) => hospital._count?.departments ?? 0,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (hospital: Hospital) => (
                <div className="flex gap-2">
                  <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(hospital)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(hospital.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={hospitals}
          keyExtractor={(hospital) => hospital.id}
          emptyMessage={`No ${currentTitle.toLowerCase()} available yet.`}
        />
      )
    }

    if (activeTab === 'departments') {
      return (
        <DataTable
          columns={[
            { key: 'name', header: 'Department' },
            {
              key: 'hospital',
              header: 'Hospital',
              render: (department: Department) => department.hospital?.name ?? '—',
            },
            {
              key: 'country',
              header: 'Country',
              render: (department: Department) => department.hospital?.country?.name ?? '—',
            },
            {
              key: 'icus',
              header: 'ICUs',
              render: (department: Department) => department._count?.icus ?? 0,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (department: Department) => (
                <div className="flex gap-2">
                  <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(department)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(department.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={departments}
          keyExtractor={(department) => department.id}
          emptyMessage={`No ${currentTitle.toLowerCase()} available yet.`}
        />
      )
    }

    return (
      <DataTable
        columns={[
          { key: 'name', header: 'ICU' },
          {
            key: 'department',
            header: 'Department',
            render: (icu: ICU) => icu.department?.name ?? '—',
          },
          {
            key: 'hospital',
            header: 'Hospital',
            render: (icu: ICU) => icu.department?.hospital?.name ?? '—',
          },
          {
            key: 'patients',
            header: 'Patients',
            render: (icu: ICU) => icu._count?.patients ?? 0,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (icu: ICU) => (
              <div className="flex gap-2">
                <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(icu)}>
                  Edit
                </button>
                <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(icu.id)}>
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        data={icus}
        keyExtractor={(icu) => icu.id}
        emptyMessage={`No ${currentTitle.toLowerCase()} available yet.`}
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Organisation management</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Configure the registry hierarchy from countries to operational ICU units.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={!canCreate}
          className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add {currentSingular}
        </button>
      </section>

      <section className="flex flex-wrap gap-2">
        {(Object.keys(tabConfig) as OrgTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeTab === tab ? 'bg-brand-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tabConfig[tab].title}
          </button>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">{currentTitle}</h2>
        <p className="mt-1 text-sm text-slate-500">{currentDescription}</p>
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading organisation records…</p>
          ) : (
            renderTable()
          )}
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${formState.id ? 'Edit' : 'Add'} ${currentSingular}`}
        description={currentDescription}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>

          {activeTab === 'countries' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Code</label>
              <input
                value={formState.code}
                maxLength={3}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, code: event.target.value.toUpperCase() }))
                }
                required
              />
            </div>
          ) : null}

          {activeTab === 'hospitals' ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                <select
                  value={formState.countryId}
                  onChange={(event) => setFormState((current) => ({ ...current, countryId: event.target.value }))}
                  required
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Latitude</label>
                  <input
                    value={formState.latitude}
                    onChange={(event) => setFormState((current) => ({ ...current, latitude: event.target.value }))}
                    placeholder="51.4985"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Longitude</label>
                  <input
                    value={formState.longitude}
                    onChange={(event) => setFormState((current) => ({ ...current, longitude: event.target.value }))}
                    placeholder="-0.1181"
                  />
                </div>
              </div>
            </>
          ) : null}

          {activeTab === 'departments' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Hospital</label>
              <select
                value={formState.hospitalId}
                onChange={(event) => setFormState((current) => ({ ...current, hospitalId: event.target.value }))}
                required
              >
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {activeTab === 'icus' ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
              <select
                value={formState.departmentId}
                onChange={(event) => setFormState((current) => ({ ...current, departmentId: event.target.value }))}
                required
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} — {department.hospital?.name ?? 'Unknown hospital'}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving…' : formState.id ? 'Update record' : 'Create record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
