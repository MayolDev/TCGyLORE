# 🎯 Guía de Uso Rápido - Panel de Administración

## 🚀 Inicio Rápido en 3 Pasos

### Paso 1: Iniciar el servidor
```bash
cd proyectoLore
php artisan serve
```

### Paso 2: Abrir en el navegador
Visita: `http://localhost:8000`

### Paso 3: Iniciar sesión como administrador
```
Email: admin@example.com
Password: password
```

## 📍 Rutas Principales

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Página de inicio | Público |
| `/login` | Iniciar sesión | Público |
| `/register` | Registrarse | Público |
| `/dashboard` | Panel principal | Autenticado |
| `/admin/users` | Gestión de usuarios | Solo Admin |
| `/admin/users/create` | Crear usuario | Solo Admin |
| `/admin/users/{id}/edit` | Editar usuario | Solo Admin |
| `/settings/profile` | Mi perfil | Autenticado |
| `/settings/password` | Cambiar contraseña | Autenticado |
| `/settings/two-factor` | 2FA | Autenticado |

## 🎨 Componentes UI Disponibles

El proyecto incluye los siguientes componentes de shadcn/ui listos para usar:

- ✅ `Button` - Botones con variantes (default, outline, ghost, etc.)
- ✅ `Input` - Campos de texto
- ✅ `Label` - Etiquetas de formulario
- ✅ `Select` - Selector desplegable
- ✅ `Card` - Tarjetas de contenido
- ✅ `Table` - Tablas de datos
- ✅ `Badge` - Etiquetas de estado
- ✅ `Dialog` - Modales
- ✅ `Alert` - Alertas y notificaciones
- ✅ `Checkbox` - Casillas de verificación
- ✅ `Spinner` - Indicadores de carga

## 🔐 Gestión de Usuarios

### Listar Usuarios
1. Ir a `/admin/users`
2. Ver tabla con todos los usuarios
3. Buscar usuarios por nombre o email
4. Navegar entre páginas

### Crear Usuario
1. Ir a `/admin/users`
2. Click en "Nuevo Usuario"
3. Completar formulario:
   - Nombre
   - Email
   - Contraseña
   - Rol (Admin o Usuario)
4. Click en "Crear Usuario"

### Editar Usuario
1. Ir a `/admin/users`
2. Click en el ícono de editar (lápiz)
3. Modificar los datos
4. Click en "Actualizar Usuario"

### Eliminar Usuario
1. Ir a `/admin/users`
2. Click en el ícono de eliminar (basura)
3. Confirmar eliminación
4. **Nota**: No puedes eliminar tu propio usuario

## 🛠️ Personalización

### Agregar Nuevos Roles

```php
// En database/seeders/RoleSeeder.php
Role::firstOrCreate(['name' => 'Editor']);
Role::firstOrCreate(['name' => 'Moderador']);
```

### Agregar Nuevos Permisos

```php
// En database/seeders/RoleSeeder.php
$permissions = [
    'posts.index',
    'posts.create',
    'posts.edit',
    'posts.delete',
];

foreach ($permissions as $permission) {
    Permission::firstOrCreate(['name' => $permission]);
}

// Asignar permisos a un rol
$editorRole = Role::findByName('Editor');
$editorRole->givePermissionTo(['posts.index', 'posts.create', 'posts.edit']);
```

### Proteger Rutas con Permisos

```php
// En routes/web.php
Route::middleware(['auth', 'permission:posts.create'])->group(function () {
    Route::post('posts', [PostController::class, 'store']);
});
```

### Verificar Permisos en Componentes React

```typescript
// En resources/js/pages/SomePage.tsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;

// Verificar si tiene un rol
if (auth.user?.roles?.includes('Admin')) {
    // Mostrar opciones de admin
}
```

## 🎯 Flujo de Trabajo Típico

### 1. Usuario Regular se Registra
```
Usuario → /register → Completa formulario → Se crea con rol "Usuario"
```

### 2. Admin Crea Usuario con Rol Admin
```
Admin → /admin/users/create → Completa formulario → Selecciona "Admin" → Nuevo admin creado
```

### 3. Usuario Actualiza su Perfil
```
Usuario → /settings/profile → Modifica nombre/email → Guarda cambios
```

### 4. Admin Gestiona Usuarios
```
Admin → /admin/users → Busca usuario → Edita/Elimina según necesidad
```

## 💡 Tips y Trucos

### 1. Buscar Usuarios Rápidamente
En `/admin/users`, usa el campo de búsqueda para filtrar por nombre o email en tiempo real.

### 2. Cambiar Tema (Claro/Oscuro)
El proyecto incluye soporte para modo oscuro. Los usuarios pueden cambiar el tema desde el menú de usuario.

### 3. Usar Atajos de Teclado
- `Cmd/Ctrl + K` - Abrir búsqueda rápida (si está implementado)

### 4. Mensajes Flash
El sistema muestra mensajes de éxito/error automáticamente después de cada acción.

### 5. Validación en Tiempo Real
Los formularios validan mientras escribes para mejor UX.

## 🔍 Solución de Problemas Comunes

### No puedo iniciar sesión
- Verifica que ejecutaste `php artisan migrate --seed`
- Usa las credenciales por defecto: `admin@example.com` / `password`
- Limpia caché: `php artisan cache:clear`

### Los estilos no se ven
- Ejecuta `npm run build` o `npm run dev`
- Verifica que los archivos en `public/build` existen

### Error 403 al acceder a /admin/users
- Asegúrate de estar autenticado como Admin
- Verifica los roles: `php artisan tinker` → `User::find(1)->roles`

### La búsqueda no funciona
- Verifica que hay usuarios en la base de datos
- Prueba limpiando el campo de búsqueda

## 📊 Métricas y Estadísticas

El proyecto está configurado para agregar fácilmente estadísticas:

```php
// Ejemplo para agregar al dashboard
$stats = [
    'total_users' => User::count(),
    'admins' => User::role('Admin')->count(),
    'regular_users' => User::role('Usuario')->count(),
    'verified_users' => User::whereNotNull('email_verified_at')->count(),
];
```

## 🎨 Colores del Tema

El proyecto usa Tailwind CSS con una paleta personalizada:

- **Primary**: Azul para acciones principales
- **Secondary**: Gris para acciones secundarias
- **Success**: Verde para confirmaciones
- **Danger**: Rojo para eliminaciones
- **Warning**: Amarillo para alertas
- **Info**: Azul claro para información

## 📱 Responsive Design

La aplicación es completamente responsive:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🚀 Próximos Pasos Recomendados

1. **Agregar Dashboard con Estadísticas**
   - Total de usuarios
   - Gráficas de crecimiento
   - Últimas actividades

2. **Implementar Más Módulos**
   - Posts/Artículos
   - Categorías
   - Comentarios

3. **Mejorar UX**
   - Confirmaciones con modales
   - Drag & drop
   - Búsqueda en tiempo real

4. **Optimizar Performance**
   - Lazy loading
   - Caché de consultas
   - Imágenes optimizadas

## 📞 Recursos Útiles

- [Laravel 12 Docs](https://laravel.com/docs/12.x)
- [React 19 Docs](https://react.dev/)
- [Inertia.js Docs](https://inertiajs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Spatie Permission Docs](https://spatie.be/docs/laravel-permission)

---

¡Disfruta construyendo tu aplicación! 🎉

