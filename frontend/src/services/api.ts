const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('fleet_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = 'No fue posible completar la solicitud'
    try {
      const body = await response.json()
      message = body.message ?? message
    } catch {
      // Preserve the user-facing fallback when the API returns no JSON body.
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204 || response.status === 202) return undefined as T
  return response.json() as Promise<T>
}
