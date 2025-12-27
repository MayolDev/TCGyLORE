#!/bin/bash

# Script de deploy manual para taponazo.mayoldev.es
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es"

cd "$PROJECT_DIR"

echo -e "${YELLOW}📋 Activando modo mantenimiento...${NC}"
php artisan down || true

echo -e "${YELLOW}📥 Descargando cambios de GitHub...${NC}"
git pull origin main

echo -e "${YELLOW}🧹 Limpiando vendor y cache de Composer...${NC}"
rm -rf vendor
composer clear-cache

echo -e "${YELLOW}📦 Instalando dependencias de Composer...${NC}"
composer install --optimize-autoloader --no-interaction

echo -e "${YELLOW}📦 Instalando dependencias de NPM...${NC}"
npm ci

echo -e "${YELLOW}🔨 Compilando assets...${NC}"
npm run build

echo -e "${YELLOW}🗄️  Ejecutando migraciones...${NC}"
php artisan migrate --force

echo -e "${YELLOW}🧹 Limpiando cachés...${NC}"
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo -e "${YELLOW}🧹 Reconstruyendo cachés...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

echo -e "${YELLOW}🔑 Ajustando permisos...${NC}"
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo -e "${YELLOW}✅ Desactivando modo mantenimiento...${NC}"
php artisan up

echo -e "${GREEN}🎉 Deploy completado exitosamente!${NC}"
echo -e "${GREEN}✨ La aplicación está lista en: https://taponazo.mayoldev.es${NC}"

