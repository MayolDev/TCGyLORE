#!/bin/bash

# Script de configuración inicial para el servidor
# Solo necesitas ejecutar este script UNA VEZ después de clonar el repo

set -e

echo "🔧 Configurando proyecto Laravel..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es"

cd "$PROJECT_DIR"

echo -e "${YELLOW}📦 Instalando dependencias de Composer...${NC}"
composer install --no-dev --optimize-autoloader

echo -e "${YELLOW}📦 Instalando dependencias de NPM...${NC}"
npm install

echo -e "${YELLOW}🔑 Generando key de aplicación...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creando archivo .env desde .env.example...${NC}"
    cp .env.example .env
    php artisan key:generate
else
    echo -e "${GREEN}✅ El archivo .env ya existe${NC}"
fi

echo -e "${YELLOW}🔗 Creando enlace simbólico de storage...${NC}"
php artisan storage:link

echo -e "${YELLOW}🗄️  Ejecutando migraciones...${NC}"
read -p "¿Quieres ejecutar las migraciones ahora? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    php artisan migrate
fi

echo -e "${YELLOW}🌱 ¿Quieres ejecutar los seeders?${NC}"
read -p "¿Poblar la base de datos con datos de ejemplo? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    php artisan db:seed
fi

echo -e "${YELLOW}🔨 Compilando assets...${NC}"
npm run build

echo -e "${YELLOW}🔑 Ajustando permisos...${NC}"
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo -e "${YELLOW}🧹 Limpiando cachés...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

echo -e "${GREEN}✅ Configuración completada!${NC}"
echo -e "${GREEN}🎉 El proyecto está listo!${NC}"
echo ""
echo -e "📝 ${YELLOW}Recuerda:${NC}"
echo "   1. Configurar las variables de .env (base de datos, etc.)"
echo "   2. Configurar el webhook o GitHub Actions para auto-deploy"
echo "   3. Revisar los permisos de archivos y carpetas"
echo ""
echo -e "📚 ${YELLOW}Más información en:${NC} DEPLOYMENT.md"

