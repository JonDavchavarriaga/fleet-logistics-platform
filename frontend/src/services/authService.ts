import { apiRequest } from './api'

export type AuthResponse = {
  token: string
  email: string
  fullName: string
  role: string
}

export async function login(email: string, password: string) {
  const session = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('fleet_token', session.token)
  localStorage.setItem('fleet_user', JSON.stringify(session))
  return session
}

export function getStoredSession(): AuthResponse | null {
  const stored = localStorage.getItem('fleet_user')
  return stored ? JSON.parse(stored) as AuthResponse : null
}

export function logout() {
  localStorage.removeItem('fleet_token')
  localStorage.removeItem('fleet_user')
}
