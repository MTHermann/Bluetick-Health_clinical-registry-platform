/**
 * Shared fetch helper used by client-side pages to call the API routes.
 * Automatically sets Content-Type and throws on non-OK responses.
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })

  const payload = (await response.json().catch(() => null)) as T & { error?: string }
  if (!response.ok) {
    throw new Error(payload?.error ?? 'Request failed')
  }

  return payload
}
