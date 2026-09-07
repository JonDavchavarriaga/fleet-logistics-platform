import { useMemo, useState } from 'react'
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  Map,
  Menu,
  PackageCheck,
  Search,
  Settings,
  Truck,
  Users,
  X,
} from 'lucide-react'

type ShipmentStatus = 'En ruta' | 'Pendiente' | 'Entregado'

type Shipment = {
  id: string
  destination: string
  store: string
  driver: string
  vehicle: string
  status: ShipmentStatus
  eta: string
}

const initialShipments: Shipment[] = [
  { id: 'FLT-0001', destination: 'Carrera 7 # 72-41', store: 'Tienda La Esquina', driver: 'Carlos Ruiz', vehicle: 'FEP-218', status: 'En ruta', eta: '10:35 a. m.' },
  { id: 'FLT-0002', destination: 'Calle 80 # 10-20', store: 'Mini Market 80', driver: 'Andrea Mora', vehicle: 'FEP-304', status: 'En ruta', eta: '11:10 a. m.' },
  { id: 'FLT-0003', destination: 'Av. El Dorado # 68-12', store: 'Super Ahorro', driver: 'Luis Torres', vehicle: 'FEP-119', status: 'Pendiente', eta: '12:00 p. m.' },
  { id: 'FLT-0004', destination: 'Calle 13 # 24-18', store: 'Don Maíz', driver: 'Sin asignar', vehicle: '—', status: 'Pendiente', eta: '1:30 p. m.' },
]

const statusClass: Record<ShipmentStatus, string> = {
  'En ruta': 'status-route',
  Pendiente: 'status-pending',
  Entregado: 'status-delivered',
}

function App() {
  const [shipments, setShipments] = useState(initialShipments)
  const [activeView, setActiveView] = useState('Resumen')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredShipments = useMemo(
    () =>
      shipments.filter((shipment) =>
        `${shipment.id} ${shipment.store} ${shipment.driver}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, shipments],
  )

  function advanceShipment(id: string) {
    setShipments((current) =>
      current.map((shipment) =>
        shipment.id === id ? { ...shipment, status: shipment.status === 'Pendiente' ? 'En ruta' : 'Entregado' } : shipment,
      ),
    )
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span>AP</span>
          </div>
          <div>
            <strong>Alimentos</strong>
            <span>Pepito S.A.S.</span>
          </div>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={20} /></button>
        </div>
        <div className="workspace-label">CENTRO DE OPERACIONES</div>
        <nav className="main-nav" aria-label="Navegación principal">
          {[
            { label: 'Resumen', icon: LayoutDashboard },
            { label: 'Entregas', icon: PackageCheck },
            { label: 'Mapa en vivo', icon: Map },
            { label: 'Conductores', icon: Users },
          ].map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activeView === label ? 'nav-item-active' : ''}`} key={label} onClick={() => { setActiveView(label); setSidebarOpen(false) }}>
              <Icon size={19} strokeWidth={activeView === label ? 2.5 : 2} /><span>{label}</span>
              {label === 'Entregas' && <em>12</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={19} /><span>Configuración</span></button>
          <div className="help-card"><CircleHelp size={21} /><div><strong>¿Necesitas ayuda?</strong><span>Habla con soporte</span></div></div>
          <div className="profile-mini"><div className="avatar">JM</div><div><strong>Jorge Méndez</strong><span>Despachador</span></div><ChevronDown size={16} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={23} /></button>
          <div className="breadcrumb"><span>Operaciones</span><b>/</b><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <div className="connection"><span className="live-dot" /> Sistema operativo</div>
            <button className="icon-button notification-button" aria-label="Notificaciones"><Bell size={20} /><i /></button>
            <div className="top-avatar">JM</div>
          </div>
        </header>

        <div className="page">
          <section className="page-heading">
            <div><p className="eyebrow">LUNES, 07 DE SEPTIEMBRE DE 2026</p><h1>Buenos días, Jorge <span>👋</span></h1><p className="subtitle">Aquí tienes el pulso de las entregas de hoy.</p></div>
            <button className="primary-button"><span>+</span> Nueva entrega</button>
          </section>

          <section className="metrics-grid" aria-label="Indicadores de operación">
            <article className="metric-card"><div className="metric-icon gold"><PackageCheck size={21} /></div><div><span>Entregas de hoy</span><strong>24</strong><small className="positive">↑ 12% <i>vs. ayer</i></small></div></article>
            <article className="metric-card"><div className="metric-icon red"><Truck size={21} /></div><div><span>En ruta ahora</span><strong>8</strong><small className="positive">↑ 2 <i>desde las 8 a. m.</i></small></div></article>
            <article className="metric-card"><div className="metric-icon green"><PackageCheck size={21} /></div><div><span>Entregas completadas</span><strong>14</strong><small className="positive">58% <i>del total diario</i></small></div></article>
            <article className="metric-card"><div className="metric-icon dark"><Clock3 size={21} /></div><div><span>Tiempo promedio</span><strong>42 <small>min</small></strong><small className="neutral">Objetivo: 45 min</small></div></article>
          </section>

          <section className="content-grid">
            <div className="panel shipments-panel">
              <div className="panel-heading"><div><h2>Entregas recientes</h2><p>Seguimiento de la operación del día</p></div><button className="text-button">Ver todas <span>→</span></button></div>
              <div className="table-tools"><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar entrega, tienda o conductor..." /></label><button className="filter-button">Todos los estados <ChevronDown size={15} /></button></div>
              <div className="table-wrap"><table><thead><tr><th>ENTREGA</th><th>DESTINO</th><th>CONDUCTOR</th><th>ESTADO</th><th>LLEGADA</th><th /></tr></thead><tbody>{filteredShipments.map((shipment) => <tr key={shipment.id}><td><strong className="tracking">{shipment.id}</strong><span className="vehicle">{shipment.vehicle}</span></td><td><strong>{shipment.store}</strong><span>{shipment.destination}</span></td><td><div className="driver-cell"><span className="small-avatar">{shipment.driver === 'Sin asignar' ? '?' : shipment.driver.split(' ').map((name) => name[0]).join('')}</span><span>{shipment.driver}</span></div></td><td><span className={`status ${statusClass[shipment.status]}`}><i />{shipment.status}</span></td><td><strong>{shipment.eta}</strong><span>Estimado</span></td><td><button className="row-menu" onClick={() => advanceShipment(shipment.id)} aria-label={`Actualizar ${shipment.id}`}>•••</button></td></tr>)}</tbody></table></div>
              <div className="table-footer"><span>Mostrando {filteredShipments.length} de 24 entregas</span><button className="pagination-active">1</button><button>2</button><button>3</button><button>→</button></div>
            </div>
            <aside className="panel map-panel"><div className="panel-heading"><div><h2>Mapa en vivo</h2><p>Ubicación de tu flota</p></div><button className="icon-button"><Map size={18} /></button></div><div className="map-placeholder"><div className="map-grid" /><div className="route-line route-one" /><div className="route-line route-two" /><div className="map-pin pin-one"><Truck size={14} /></div><div className="map-pin pin-two"><Truck size={14} /></div><div className="plant-pin">AP</div><div className="map-label"><span className="live-dot" />8 vehículos activos</div></div><div className="map-summary"><div><strong>Planta principal</strong><span>Zona Industrial · Bogotá</span></div><button className="text-button">Abrir mapa <span>→</span></button></div></aside>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
