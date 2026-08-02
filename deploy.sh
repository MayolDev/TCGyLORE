#!/usr/bin/env bash
# Despliegue de taponazo.mayoldev.es
#
# El servidor no usa CloudPanel: todo va en Docker detras de Nginx Proxy Manager.
# Este script se ejecuta EN el servidor, dentro de ~/apps/taponazo.
#
#   uso:  ./deploy.sh
set -euo pipefail

cd "$(dirname "$0")"
log(){ printf '\n\033[1;33m> %s\033[0m\n' "$*"; }

[ -f .env ] || { echo "falta .env"; exit 1; }

log "Descargando cambios"
git pull --ff-only origin main

log "Construyendo imagenes"
docker compose build --pull

log "Levantando la pila"
docker compose up -d --remove-orphans

log "Esperando a que la base responda"
for i in $(seq 1 30); do
  if docker compose exec -T mysql mysqladmin ping -h127.0.0.1 --silent 2>/dev/null; then break; fi
  [ "$i" = 30 ] && { echo "la base no arranco"; docker compose logs --tail 30 mysql; exit 1; }
  sleep 3
done

# Las migraciones van aqui y no en el entrypoint: si las lanzara cada contenedor
# al arrancar, un reinicio automatico o una segunda replica migrarian a la vez
# sobre la misma base.
log "Migraciones"
docker compose exec -T app php artisan migrate --force

log "Recacheando"
docker compose exec -T app php artisan config:cache
docker compose exec -T app php artisan route:cache
docker compose exec -T app php artisan view:cache

log "Limpiando imagenes huerfanas"
docker image prune -f >/dev/null

log "Estado"
docker compose ps --format 'table {{.Name}}\t{{.Status}}'

printf '\n\033[0;32mDesplegado — https://taponazo.mayoldev.es\033[0m\n'
