# 🚀 Guía Rápida de Deploy

## Opción 1: GitHub Actions (Automático) ⭐ RECOMENDADO

### Setup inicial (Una sola vez):

1. **En GitHub:**
   - Ve a Settings → Secrets and variables → Actions
   - Añade estos secrets:
     - `SSH_HOST`: taponazo.mayoldev.es (o tu IP)
     - `SSH_USERNAME`: root (o tu usuario)
     - `SSH_PORT`: 22
     - `SSH_PRIVATE_KEY`: Tu clave SSH privada completa

2. **En tu servidor:**
   ```bash
   # Generar clave SSH para deploy
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy
   
   # Ver la clave PRIVADA (copiar a GitHub Secrets)
   cat ~/.ssh/github_deploy
   
   # Añadir la clave PÚBLICA a authorized_keys
   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Deploy automático:**
   ```bash
   git add .
   git commit -m "feat: mi cambio"
   git push origin main
   ```
   
   ✅ ¡Listo! Ve a GitHub → Actions para ver el progreso

---

## Opción 2: Deploy Manual desde el Servidor

En tu servidor, ejecuta:

```bash
cd /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
./deploy.sh
```

---

## Opción 3: Deploy Manual Local

```bash
# Compilar assets localmente
npm run build

# Subir a GitHub
git add .
git commit -m "feat: cambios"
git push origin main

# En el servidor, conectarte por SSH y:
cd /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
git pull origin main
composer install --no-dev
php artisan migrate --force
php artisan config:cache
```

---

## 🔧 Comandos Útiles en el Servidor

```bash
# Ver logs de la aplicación
tail -f storage/logs/laravel.log

# Ver logs de Nginx
tail -f /var/log/nginx/error.log

# Limpiar cachés
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Recompilar assets
npm run build

# Ver status de Git
git status
git log --oneline -5

# Resetear cambios locales (¡CUIDADO!)
git reset --hard
git pull origin main
```

---

## ⚠️ Checklist Pre-Deploy

Antes de hacer push a producción:

- [ ] Los cambios funcionan en local
- [ ] No hay errores en consola del navegador
- [ ] Las migraciones están probadas
- [ ] El archivo `.env` NO está en el commit
- [ ] Has testeado la funcionalidad nueva

---

## 🆘 Problemas Comunes

### Error: Permission denied (publickey)
```bash
# En el servidor, verifica las claves
ls -la ~/.ssh/
cat ~/.ssh/authorized_keys
```

### Error: Composer dependencies
```bash
cd /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
composer install --no-dev --optimize-autoloader
```

### Error: NPM/Node not found
```bash
which node
which npm
# Si no están, instalar Node.js 20.x
```

### La página muestra error 500
```bash
# Ver logs
tail -50 storage/logs/laravel.log

# Verificar permisos
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Limpiar cachés
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📚 Más Información

Para detalles completos, consulta: **DEPLOYMENT.md**

