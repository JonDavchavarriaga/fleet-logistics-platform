# Demo deployment

The demo is split into two services:

- Frontend: Netlify, built from `frontend/`.
- Backend: Render, built from `backend/Dockerfile`.
- Database: Render PostgreSQL, provisioned by `render.yaml`.

## 1. Deploy the backend on Render

1. Create a new Blueprint in Render using this repository and `render.yaml`.
2. Keep the generated `APP_JWT_SECRET`; never commit a JWT secret.
3. Set `APP_CORS_ALLOWED_ORIGINS` to the final Netlify URL, for example:
   `https://fleet.jonatanchavarriaga.codes`
4. Wait for the health check to pass at:
   `https://<render-service>.onrender.com/actuator/health`

The production profile uses PostgreSQL through `DATABASE_URL` and does not load
the development seed users because `DataInitializer` is restricted to `dev`.

## 2. Deploy the frontend on Netlify

1. Create a site from the same GitHub repository.
2. Use the repository `netlify.toml` settings, or configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Add the environment variable:
   `VITE_API_URL=https://<render-service>.onrender.com/api/v1`
4. Redeploy after saving the variable.

The redirect rule in `netlify.toml` keeps React routes working on refresh.

## 3. Configure the custom domain

The recommended demo URL is:

`https://fleet.jonatanchavarriaga.codes`

In Netlify, add that custom domain to the site and create the DNS record
requested by Netlify in the DNS provider for `jonatanchavarriaga.codes`.
Keep the portfolio at the root domain and link to the demo and repository:

- Demo: `https://fleet.jonatanchavarriaga.codes`
- Repository: `https://github.com/JonDavchavarriaga/fleet-logistics-platform`

After the domain is active, update Render's `APP_CORS_ALLOWED_ORIGINS` to the
custom domain and redeploy the backend.

## Local commands

```bash
# backend
cd backend
mvn spring-boot:run

# frontend
cd frontend
npm run dev
```

Production must use `SPRING_PROFILES_ACTIVE=prod`; never use the `dev` profile
for a public deployment.
