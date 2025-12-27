# 🚀 Guía de Auto-Deploy desde GitHub

## Configuración de GitHub Actions

Este proyecto está configurado para desplegarse automáticamente al servidor cuando hagas push a la rama `main`.

### 📋 Paso 1: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub:
1. Click en **Settings** (Configuración)
2. En el menú lateral, click en **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Añade los siguientes secrets:

#### Secrets necesarios:

**SSH_HOST**
- Nombre: `SSH_HOST`
- Valor: IP o dominio de tu servidor (ejemplo: `taponazo.mayoldev.es` o `123.123.123.123`)

**SSH_USERNAME**
- Nombre: `SSH_USERNAME`
- Valor: Tu usuario SSH (ejemplo: `root` o `mayoldev-taponazo`)

**SSH_PORT**
- Nombre: `SSH_PORT`
- Valor: Puerto SSH (normalmente `22`)

**SSH_PRIVATE_KEY**
- Nombre: `SSH_PRIVATE_KEY`
- Valor: Tu clave SSH privada (ver cómo obtenerla abajo)

---

### 🔑 Paso 2: Obtener tu clave SSH privada

#### Opción A: Si ya tienes una clave SSH

En tu servidor, ejecuta:
```bash
cat ~/.ssh/id_rsa
```

Copia TODO el contenido, incluyendo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...todo el contenido...
-----END OPENSSH PRIVATE KEY-----
```

#### Opción B: Crear una nueva clave SSH (Recomendado)

En tu **servidor**, ejecuta:
```bash
# Crear una nueva clave específica para GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Ver la clave privada (la que pondrás en GitHub Secrets)
cat ~/.ssh/github_deploy

# Ver la clave pública (la que añadirás a authorized_keys)
cat ~/.ssh/github_deploy.pub
```

Luego, añade la clave pública a tu servidor:
```bash
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

### 📝 Paso 3: Ajustar el archivo .gitignore

Asegúrate de que estos archivos NO se suban a GitHub:

```
/vendor
/node_modules
/public/hot
/public/storage
/storage/*.key
.env
.env.backup
.phpunit.result.cache
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log
/.idea
/.vscode
```

---

### 🔧 Paso 4: Preparar el servidor

En tu servidor, asegúrate de que:

1. **Git está configurado** para no pedir credenciales:
```bash
cd /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
git config pull.rebase false
```

2. **Los permisos son correctos**:
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

3. **El .env existe** (NO lo subas a GitHub):
```bash
# El .env debe existir en el servidor pero NO en GitHub
ls -la .env
```

---

### ✅ Paso 5: Hacer tu primer deploy

Una vez configurado todo:

```bash
git add .
git commit -m "feat: configurar auto-deploy"
git push origin main
```

Ve a GitHub → **Actions** y verás el proceso de deploy en tiempo real.

---

## 🔄 Opción Alternativa: Webhook + Script (Más simple pero menos robusto)

Si prefieres algo más simple:

### 1. Crear un script de deploy en el servidor

```bash
nano /home/mayoldev-taponazo/htdocs/deploy.sh
```

Contenido:
```bash
#!/bin/bash
cd /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es

# Activar modo mantenimiento
php artisan down

# Pull cambios
git pull origin main

# Instalar dependencias
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Migraciones
php artisan migrate --force

# Cachés
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Desactivar mantenimiento
php artisan up

echo "Deploy completado!"
```

Darle permisos:
```bash
chmod +x /home/mayoldev-taponazo/htdocs/deploy.sh
```

### 2. Crear un endpoint webhook

Crear `public/deploy.php`:
```php
<?php
// Verifica un token secreto
$secret = 'TU_TOKEN_SECRETO_AQUI';

if (!isset($_GET['token']) || $_GET['token'] !== $secret) {
    http_response_code(403);
    die('Unauthorized');
}

// Ejecuta el script de deploy
exec('/home/mayoldev-taponazo/htdocs/deploy.sh > /tmp/deploy.log 2>&1 &');

echo "Deploy iniciado!";
```

### 3. Configurar Webhook en GitHub

1. Ve a tu repo → **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL**: `https://taponazo.mayoldev.es/deploy.php?token=TU_TOKEN_SECRETO_AQUI`
3. **Content type**: `application/json`
4. **Events**: Solo `push`

---

## 📊 Monitoring

Para ver los logs de deploy:

**GitHub Actions:**
- Ve a GitHub → **Actions** → Click en el workflow

**Webhook:**
```bash
tail -f /tmp/deploy.log
```

---

## ⚠️ Recomendaciones de Seguridad

1. ✅ **Nunca subas** el archivo `.env` a GitHub
2. ✅ **Usa claves SSH específicas** para deploy (no tu clave personal)
3. ✅ **Revisa los logs** regularmente
4. ✅ **Haz backups** antes de cada deploy automático
5. ✅ **Usa ramas** (develop, staging, main) para testing antes de producción

---

## 🔧 Troubleshooting

### Error: Permission denied
```bash
# En el servidor
chmod 755 /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
chown -R tu-usuario:tu-usuario /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
```

### Error: Git pull conflicts
```bash
# En el servidor
cd /home/mayoldev-taponazo/htdocs/taponazo.mayoldev.es
git reset --hard
git pull origin main
```

### Error: Composer/NPM no encontrado
```bash
# Verificar que estén en el PATH
which composer
which npm
```

---

## 📞 Contacto

Si tienes problemas con el deploy, revisa:
1. Los logs en GitHub Actions
2. Los logs del servidor: `tail -f /var/log/nginx/error.log`
3. Los permisos de archivos y carpetas

