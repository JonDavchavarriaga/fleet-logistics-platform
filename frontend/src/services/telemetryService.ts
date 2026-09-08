import { apiRequest } from './api'

export function sendLocation(latitude: number, longitude: number) {
  return apiRequest<void>('/telemetry/location', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude }),
  })
}
