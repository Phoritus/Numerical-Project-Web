param(
  [switch]$Prod
)

if ($Prod) {
  docker compose -f docker-compose.prod.yml --env-file .env down -v
  docker compose -f docker-compose.prod.yml --env-file .env up -d --build
  docker compose -f docker-compose.prod.yml --env-file .env run --rm seed
} else {
  docker compose down -v
  docker compose up -d --build
  docker compose run --rm seed
}
