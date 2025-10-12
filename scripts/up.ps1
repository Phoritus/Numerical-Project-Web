param(
  [switch]$Prod
)

if ($Prod) {
  docker compose -f docker-compose.prod.yml --env-file .env up -d --build
} else {
  docker compose up -d --build
}
