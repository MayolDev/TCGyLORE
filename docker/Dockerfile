# syntax=docker/dockerfile:1

# ─────────────────────────────── assets ───────────────────────────────
FROM node:20-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# WAYFINDER=0 desactiva la generacion de rutas tipadas, que necesita `php
# artisan` y aqui no hay PHP. Los ficheros generados vienen versionados en el
# repositorio, asi que se compila con ellos.
ENV WAYFINDER=0
RUN npm run build

# ────────────────────────────── vendor ────────────────────────────────
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
      --no-dev --no-scripts --no-autoloader \
      --prefer-dist --no-interaction --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev

# ────────────────────────────── runtime ───────────────────────────────
FROM php:8.3-fpm-alpine AS runtime

RUN apk add --no-cache \
      icu-dev libzip-dev libpng-dev libjpeg-turbo-dev freetype-dev \
      oniguruma-dev libxml2-dev $PHPIZE_DEPS \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j"$(nproc)" \
      pdo_mysql mbstring intl zip gd exif bcmath opcache pcntl \
 && apk del $PHPIZE_DEPS \
 && rm -rf /tmp/* /var/cache/apk/*

COPY docker/php.ini /usr/local/etc/php/conf.d/99-app.ini

WORKDIR /var/www/html
COPY --from=vendor  /app                 /var/www/html
COPY --from=assets  /app/public/build    /var/www/html/public/build

RUN chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 9000
ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]

# ──────────────────────────────── nginx ───────────────────────────────
# El servidor web lleva `public/` horneado en la imagen en lugar de compartir
# un volumen con la aplicacion. Con un volumen con nombre, Docker solo copia el
# contenido la primera vez —cuando esta vacio—, asi que los assets nuevos de
# cada despliegue no llegarian nunca a nginx.
FROM nginx:alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=runtime /var/www/html/public /var/www/html/public
