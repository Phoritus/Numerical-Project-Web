param(
  [switch]$Prod,
  [switch]$Volumes
)

$files = @()
if ($Prod) { $files += '-f','docker-compose.prod.yml','--env-file','.env' }

if ($Volumes) {
  docker compose @files down -v
} else {
  docker compose @files down
}
