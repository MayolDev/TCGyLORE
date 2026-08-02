#!/bin/sh
# Arranque del contenedor de aplicacion.
#
# Las migraciones NO se lanzan aqui: si el contenedor se reinicia solo (o si
# escalas replicas) acabarias con varios procesos migrando a la vez sobre la
# misma base. Se ejecutan una sola vez desde deploy.sh.
set -e

cd /var/www/html

if [ ! -f .env ]; then
  echo "!! falta .env en /var/www/html — el contenedor no puede arrancar"
  exit 1
fi

# El enlace de storage puede venir ya en la imagen o en el volumen.
if [ ! -e public/storage ]; then
  php artisan storage:link || true
fi

# Cachear en el arranque, no en la build: la config depende del .env montado.
php artisan config:cache
php artisan route:cache
php artisan view:cache

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

exec "$@"
