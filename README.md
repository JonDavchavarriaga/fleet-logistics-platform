# Fleet Logistics Platform

Demo funcional de una plataforma web para el seguimiento y la coordinación de
entregas de **Alimentos Pepito S.A.S.**, una empresa ficticia dedicada a la
distribución de productos derivados del maíz a tiendas y puntos de venta.

El proyecto representa la primera fase de una solución logística: un conductor
puede consultar sus entregas, actualizar el estado de cada pedido, reportar su
ubicación y abrir el destino en Google Maps, Waze o Apple Maps. El despachador
puede consultar la operación desde una interfaz responsive pensada para
computadores, tablets y teléfonos.

> **Nota:** este repositorio contiene una demo para portafolio y validación
> técnica. No representa todavía un sistema de producción ni procesa
> información real de clientes, conductores o pedidos.

## Demo y enlaces

- **Demo web:** [fleet.jonatanchavarriaga.codes](https://fleet.jonatanchavarriaga.codes)
- **Demo Netlify:** [profound-lollipop-217c14.netlify.app](https://profound-lollipop-217c14.netlify.app/)
- **Backend de demo:** [fleet-api-b9xa.onrender.com](https://fleet-api-b9xa.onrender.com/actuator/health)
- **Portafolio:** [jonatanchavarriaga.codes](https://jonatanchavarriaga.codes)

El frontend se publica en Netlify y el backend en Render. La URL del backend
es un endpoint de salud público; las operaciones de la API requieren
autenticación JWT.

## Funcionalidades principales

### Conductor

- Inicio de sesión con JWT.
- Resumen de entregas asignadas.
- Consulta del destino y detalles de la carga.
- Flujo de estados `PENDING -> IN_TRANSIT -> DELIVERED`.
- Apertura del destino en Google Maps, Waze o Apple Maps.
- Reporte de ubicación mediante la Geolocation API del navegador.
- Diseño responsive para móvil, tablet y escritorio.

### Despachador y operación

- Vista general del centro de operaciones.
- Entregas asignadas y búsqueda por número de seguimiento o destino.
- Mapa operativo visual para la demo.
- Vista de conductores y estado operativo.
- Configuración básica del perfil y conexión de la API.

## Arquitectura

```text
React + TypeScript + Vite
              |
              | HTTPS / JSON / JWT
              v
Spring Boot 3.5.6 + Spring Security
              |
              v
        H2 (demo local)
        PostgreSQL (producción)
```

### Tecnologías

- **Frontend:** React 18, TypeScript, Vite, Lucide React.
- **Backend:** Java 25, Spring Boot 3.5.6, Spring Security, Spring Data JPA.
- **Seguridad:** JWT stateless y BCrypt.
- **Datos:** H2 para desarrollo y PostgreSQL para producción.
- **Despliegue:** Netlify para el frontend y Render para el backend.

## Ejecución local

### Requisitos

- Java 25.
- Maven 3.9+.
- Node.js 20+ y npm.

### Backend

En una terminal:

```bash
cd backend
mvn spring-boot:run
```

El backend queda disponible en `http://localhost:8080`.

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible normalmente en
`http://localhost:5173`.

Para conectar el frontend con otro backend, crea `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Credenciales de demo

El perfil local `dev` crea usuarios de prueba automáticamente cuando la base
está vacía:

| Rol | Correo | Contraseña |
|---|---|---|
| Despachador | `admin@fleet.com` | `admin123` |
| Conductor | `driver@fleet.com` | `driver123` |

Estas credenciales son únicamente para la demo. No deben utilizarse en un
entorno real.

## Validación

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
mvn clean verify
```

El backend cuenta con pruebas unitarias para autenticación, JWT, usuarios,
entregas y telemetría.

## Despliegue

La configuración de despliegue se encuentra en:

- `backend/Dockerfile`
- `render.yaml`
- `netlify.toml`
- `docs/DEPLOYMENT.md`

Para producción se utiliza el perfil `prod`, variables de entorno para el
secreto JWT y la conexión PostgreSQL, y una lista explícita de orígenes CORS.
Consulta [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para el procedimiento
completo.

## Próximas fases

- Crear endpoints de despachador para crear, importar y asignar pedidos.
- Incorporar carga masiva mediante CSV.
- Sustituir el mapa visual por Leaflet/OpenStreetMap o Mapbox.
- Añadir persistencia y observabilidad de telemetría.
- Convertir el frontend en una PWA instalable.
- Agregar pruebas de integración y pipeline CI/CD.

## Licencia

Proyecto de demostración y portafolio de Jonatan Chavarriaga.
