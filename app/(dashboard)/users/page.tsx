'use client'
import { apiFetch } from '@/lib/client-fetch'

import { FormEvent, useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Role, UserRecord } from '@/types'

type UserFormState = {
  id?: string
  name: string
  email: string
  password: string
  role: Role
}

const emptyUser: UserFormState = {
  name: '',
  email: '',
  password: '',
  role: 'VIEWER',
}


export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState<UserFormState>(emptyUser)

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch<UserRecord[]>('/api/users')
      setUsers(response)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  function openCreate() {
    setFormState(emptyUser)
    setModalOpen(true)
  }

  function openEdit(user: UserRecord) {
    setFormState({
      id: user.id,
      name: user.name ?? '',
      email: user.email,
      password: '',
      role: user.role,
    })
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this user?')) {
      return
    }

    try {
      await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
      await loadUsers()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to delete user')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const isEditing = Boolean(formState.id)
      const payload: Record<string, unknown> = {
        name: formState.name,
        email: formState.email,
        role: formState.role,
      }

      if (formState.password) {
        payload.password = formState.password
      }

      if (!isEditing && !formState.password) {
        throw new Error('Password is required when creating a user')
      }

      await apiFetch(isEditing ? `/api/users/${formState.id}` : '/api/users', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      setModalOpen(false)
      setFormState(emptyUser)
      await loadUsers()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Provision and manage platform users with registry-specific roles.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Add user
        </button>
      </section>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading users…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (user) => user.name ?? '—' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role', render: (user) => <StatusBadge value={user.role} /> },
            {
              key: 'createdAt',
              header: 'Created',
              render: (user) => new Date(user.createdAt).toLocaleDateString(),
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (user) => (
                <div className="flex gap-2">
                  <button type="button" className="text-brand-900 hover:text-brand-700" onClick={() => openEdit(user)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose-600 hover:text-rose-500" onClick={() => void handleDelete(user.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={users}
          keyExtractor={(user) => user.id}
          emptyMessage="No users created yet."
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={formState.id ? 'Edit user' : 'Create user'}
        description="Assign credentials and a role for this team member."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={formState.password}
              onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
              placeholder={formState.id ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
            <select value={formState.role} onChange={(event) => setFormState((current) => ({ ...current, role: event.target.value as Role }))}>
              <option value="ADMIN">ADMIN</option>
              <option value="DATA_MANAGER">DATA MANAGER</option>
              <option value="VALIDATOR">VALIDATOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70">
              {saving ? 'Saving…' : formState.id ? 'Update user' : 'Create user'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
