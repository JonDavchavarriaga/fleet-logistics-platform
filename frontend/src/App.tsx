import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Bell, ChevronDown, CircleHelp, Clock3, LayoutDashboard, LogOut, Map, Menu, PackageCheck, Search, Settings, Truck, Users, X } from 'lucide-react'
import { ApiError } from './services/api'
import { AuthResponse, getStoredSession, login, logout } from './services/authService'
import { getAssignedShipments, Shipment, ShipmentStatus, updateShipmentStatus } from './services/shipmentService'
import { sendLocation } from './services/telemetryService'

type DemoShipment = Shipment & { store: string; driver: string; vehicle: string; eta: string }
const demoShipments: DemoShipment[] = [
  { id: 1, trackingNumber: 'FLT-0001', destinationAddress: 'Carrera 7 # 72-41', cargoDetails: 'Harina de maíz y arepas', store: 'Tienda La Esquina', driver: 'Carlos Ruiz', vehicle: 'FEP-218', status: 'IN_TRANSIT', eta: '10:35 a. m.', latitude: 4.667, longitude: -74.054 },
  { id: 2, trackingNumber: 'FLT-0002', destinationAddress: 'Calle 80 # 10-20', cargoDetails: 'Suministros de maíz', store: 'Mini Market 80', driver: 'Andrea Mora', vehicle: 'FEP-304', status: 'IN_TRANSIT', eta: '11:10 a. m.', latitude: 4.71, longitude: -74.07 },
  { id: 3, trackingNumber: 'FLT-0003', destinationAddress: 'Av. El Dorado # 68-12', cargoDetails: 'Paquetes familiares', store: 'Super Ahorro', driver: 'Luis Torres', vehicle: 'FEP-119', status: 'PENDING', eta: '12:00 p. m.', latitude: 4.67, longitude: -74.09 },
  { id: 4, trackingNumber: 'FLT-0004', destinationAddress: 'Calle 13 # 24-18', cargoDetails: 'Productos de maíz', store: 'Don Maíz', driver: 'Sin asignar', vehicle: '—', status: 'PENDING', eta: '1:30 p. m.', latitude: 4.6, longitude: -74.08 },
]

const statusText: Record<ShipmentStatus, string> = { PENDING: 'Pendiente', IN_TRANSIT: 'En ruta', DELIVERED: 'Entregado', INCIDENT: 'Incidente' }
const statusClass: Record<ShipmentStatus, string> = { PENDING: 'status-pending', IN_TRANSIT: 'status-route', DELIVERED: 'status-delivered', INCIDENT: 'status-incident' }

function LoginScreen({ onLogin }: { onLogin: (session: AuthResponse) => void }) {
  const [email, setEmail] = useState('driver@fleet.com')
  const [password, setPassword] = useState('driver123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try { onLogin(await login(email, password)) } catch (exception) {
      setError(exception instanceof ApiError ? exception.message : 'No se pudo conectar con el backend')
    } finally { setLoading(false) }
  }
  return <main className="login-page"><section className="login-brand"><div className="brand-mark login-mark"><span>AP</span></div><h1>Alimentos Pepito</h1><p>Entregas que llegan con sabor.</p><div className="login-illustration"><span>🌽</span><Truck size={80} /></div></section><form className="login-card" onSubmit={submit}><p className="eyebrow">CENTRO DE OPERACIONES</p><h2>Bienvenido de vuelta</h2><p className="login-subtitle">Ingresa para continuar con tus entregas.</p><label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <div className="form-error">{error}</div>}<button className="primary-button login-button" disabled={loading}>{loading ? 'Conectando...' : 'Ingresar al centro de operaciones'}</button><p className="demo-hint">Demo: <strong>driver@fleet.com</strong> / <strong>driver123</strong></p></form></main>
}

function App() {
  const [session, setSession] = useState<AuthResponse | null>(getStoredSession)
  const [shipments, setShipments] = useState<Shipment[]>(demoShipments)
  const [activeView, setActiveView] = useState('Resumen')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('Modo demo: conecta el backend para cargar datos reales.')

  useEffect(() => { if (session) getAssignedShipments().then((items) => { setShipments(items); setNotice('Datos sincronizados con el backend.') }).catch(() => undefined) }, [session])
  const filteredShipments = useMemo(() => shipments.filter((shipment) => `${shipment.trackingNumber} ${shipment.destinationAddress} ${shipment.cargoDetails}`.toLowerCase().includes(search.toLowerCase())), [search, shipments])
  const inTransit = shipments.filter((item) => item.status === 'IN_TRANSIT').length
  const delivered = shipments.filter((item) => item.status === 'DELIVERED').length

  if (!session) return <LoginScreen onLogin={(nextSession) => setSession(nextSession)} />
  async function advanceShipment(shipment: Shipment) {
    const nextStatus = shipment.status === 'PENDING' ? 'IN_TRANSIT' : 'DELIVERED'
    try {
      const updated = await updateShipmentStatus(shipment.id, nextStatus)
      setShipments((current) => current.map((item) => item.id === updated.id ? updated : item)); setNotice('Estado actualizado en el backend.')
    } catch {
      setShipments((current) => current.map((item) => item.id === shipment.id ? { ...item, status: nextStatus } : item)); setNotice('Modo demo: estado actualizado solo en esta vista.')
    }
  }
  function reportLocation() {
    navigator.geolocation?.getCurrentPosition(async ({ coords }) => { try { await sendLocation(coords.latitude, coords.longitude); setNotice('Ubicación enviada correctamente.') } catch { setNotice('No se pudo enviar la ubicación al backend.') } }, () => setNotice('Permiso de ubicación no concedido.'))
  }
  return <div className="app-shell">{sidebarOpen && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)} />}<aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}><div className="brand"><div className="brand-mark"><span>AP</span></div><div><strong>Alimentos</strong><span>Pepito S.A.S.</span></div><button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={20} /></button></div><div className="workspace-label">CENTRO DE OPERACIONES</div><nav className="main-nav">{[{ label: 'Resumen', icon: LayoutDashboard }, { label: 'Entregas', icon: PackageCheck }, { label: 'Mapa en vivo', icon: Map }, { label: 'Conductores', icon: Users }].map(({ label, icon: Icon }) => <button className={`nav-item ${activeView === label ? 'nav-item-active' : ''}`} key={label} onClick={() => { setActiveView(label); setSidebarOpen(false) }}><Icon size={19} /><span>{label}</span>{label === 'Entregas' && <em>{shipments.length}</em>}</button>)}</nav><div className="sidebar-bottom"><button className="nav-item"><Settings size={19} /><span>Configuración</span></button><div className="help-card"><CircleHelp size={21} /><div><strong>¿Necesitas ayuda?</strong><span>Habla con soporte</span></div></div><div className="profile-mini"><div className="avatar">JM</div><div><strong>{session.fullName}</strong><span>{session.role === 'ROLE_DRIVER' ? 'Conductor' : 'Despachador'}</span></div><button className="icon-button" onClick={() => { logout(); setSession(null) }} aria-label="Cerrar sesión"><LogOut size={15} /></button></div></div></aside><main className="main-content"><header className="topbar"><button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={23} /></button><div className="breadcrumb"><span>Operaciones</span><b>/</b><strong>{activeView}</strong></div><div className="topbar-actions"><div className="connection"><span className="live-dot" /> Sistema operativo</div><button className="icon-button notification-button" aria-label="Notificaciones"><Bell size={20} /><i /></button><div className="top-avatar">JM</div></div></header><div className="page"><section className="page-heading"><div><p className="eyebrow">LUNES, 07 DE SEPTIEMBRE DE 2026</p><h1>Buenos días, {session.fullName.split(' ')[0]} <span>👋</span></h1><p className="subtitle">{notice}</p></div><button className="primary-button" onClick={reportLocation}>Enviar mi ubicación</button></section><section className="metrics-grid"><article className="metric-card"><div className="metric-icon gold"><PackageCheck size={21} /></div><div><span>Entregas asignadas</span><strong>{shipments.length}</strong><small className="positive">Operación del día</small></div></article><article className="metric-card"><div className="metric-icon red"><Truck size={21} /></div><div><span>En ruta ahora</span><strong>{inTransit}</strong><small className="positive">Seguimiento activo</small></div></article><article className="metric-card"><div className="metric-icon green"><PackageCheck size={21} /></div><div><span>Entregas completadas</span><strong>{delivered}</strong><small className="positive">Sincronizado</small></div></article><article className="metric-card"><div className="metric-icon dark"><Clock3 size={21} /></div><div><span>Tiempo promedio</span><strong>42 <small>min</small></strong><small className="neutral">Objetivo: 45 min</small></div></article></section><section className="content-grid"><div className="panel shipments-panel"><div className="panel-heading"><div><h2>Mis entregas</h2><p>Seguimiento de la operación del día</p></div><button className="text-button">Actualizar <span>↻</span></button></div><div className="table-tools"><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar entrega o destino..." /></label></div><div className="table-wrap"><table><thead><tr><th>ENTREGA</th><th>DESTINO</th><th>CARGA</th><th>ESTADO</th><th>ACCIÓN</th></tr></thead><tbody>{filteredShipments.map((shipment) => <tr key={shipment.id}><td><strong className="tracking">{shipment.trackingNumber}</strong><span className="vehicle">ID {shipment.id}</span></td><td><strong>{shipment.destinationAddress}</strong><span>Destino asignado</span></td><td><span>{shipment.cargoDetails || 'Suministros de maíz'}</span></td><td><span className={`status ${statusClass[shipment.status]}`}><i />{statusText[shipment.status]}</span></td><td><button className="row-action" disabled={shipment.status === 'DELIVERED'} onClick={() => advanceShipment(shipment)}>{shipment.status === 'PENDING' ? 'Iniciar' : shipment.status === 'IN_TRANSIT' ? 'Entregar' : 'Listo'}</button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Mostrando {filteredShipments.length} entregas</span></div></div><aside className="panel map-panel"><div className="panel-heading"><div><h2>Mapa en vivo</h2><p>Ubicación de tu flota</p></div><Map size={18} /></div><div className="map-placeholder"><div className="map-grid" /><div className="route-line route-one" /><div className="route-line route-two" /><div className="map-pin pin-one"><Truck size={14} /></div><div className="map-pin pin-two"><Truck size={14} /></div><div className="plant-pin">AP</div><div className="map-label"><span className="live-dot" />{inTransit} vehículos activos</div></div><div className="map-summary"><div><strong>Planta principal</strong><span>Zona Industrial · Bogotá</span></div><button className="text-button">Abrir mapa <span>→</span></button></div></aside></section></div></main></div>
}

export default App
