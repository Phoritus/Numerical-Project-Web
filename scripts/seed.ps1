param(
  [switch]$Prod
)

if ($Prod) {
  docker compose -f docker-compose.prod.yml --env-file .env run --rm seed
} else {
  docker compose run --rm seed
}
