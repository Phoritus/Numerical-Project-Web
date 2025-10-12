# Deploy on Windows (Self-host) – Numerical-Project-Web

This guide covers self-hosted deployment on a Windows machine using Docker Compose, MongoDB in a container, and Caddy reverse proxy for automatic HTTPS.

## Prereqs
- Docker Desktop with WSL2 integration
- Domain pointing to your server's public IP
- Router port forwarding 80/443 to this machine (if behind NAT)
- Windows Firewall open for 80/443

## Files
- `.env.example` – copy to `.env` and set `DOMAIN`
- `docker-compose.prod.yml` – production compose with caddy
- `caddy/Caddyfile` – routes domain to frontend, /api to backend
- `backend/Dockerfile.prod`, `frontend/Dockerfile.prod` – production images
- `scripts/*.ps1` – helper scripts (up/down/seed/reseed)

## Quick start (dev)
```powershell
# Start dev stack
./scripts/up.ps1
# Seed DB
./scripts/seed.ps1
```

## Quick start (prod)
```powershell
# Prepare .env with DOMAIN
Copy-Item .env.example .env
# Start prod stack
./scripts/up.ps1 -Prod
# Seed
./scripts/seed.ps1 -Prod
```

## Verify
- Frontend: https://<DOMAIN>
- API: https://<DOMAIN>/api/root-finding/bisection/1

## Reseed
```powershell
./scripts/reseed.ps1         # dev
./scripts/reseed.ps1 -Prod   # prod
```

## Logs
```powershell
docker compose logs -f backend
docker compose logs -f caddy
```

## Secure MongoDB
- Create admin user in mongosh and update MONGODB_URI with credentials & authSource=admin.

## Backup/Restore
- Add mongodump or tar volume approach as needed for your ops.
