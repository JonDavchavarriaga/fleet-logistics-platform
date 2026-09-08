import { apiRequest } from './api'

export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'INCIDENT'

export type Shipment = {
  id: number
  trackingNumber: string
  destinationAddress: string
  latitude: number
  longitude: number
  cargoDetails: string
  status: ShipmentStatus
}

export function getAssignedShipments() {
  return apiRequest<Shipment[]>('/driver/shipments/assigned')
}

export function updateShipmentStatus(id: number, status: Extract<ShipmentStatus, 'IN_TRANSIT' | 'DELIVERED'>) {
  return apiRequest<Shipment>(`/driver/shipments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
