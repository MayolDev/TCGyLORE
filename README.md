# Panel de Administración Laravel 12 con React

Panel de administración completo construido con Laravel 12 y React 19, incluyendo sistema de roles y permisos, gestión de usuarios y autenticación.

## Stack Tecnológico

- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: React 19, Inertia.js 2, TypeScript
- **Estilos**: Tailwind CSS 4, shadcn/ui
- **Base de datos**: MySQL
- **Autenticación**: Laravel Fortify
- **Roles y Permisos**: Spatie Laravel Permission

## Características

- ✅ Sistema de autenticación completo (registro, login, recuperación de contraseña)
- ✅ Autenticación de dos factores (2FA)
- ✅ Sistema de roles y permisos con Spatie Permission
- ✅ CRUD completo de usuarios
- ✅ Panel de administración con interfaz moderna
- ✅ Búsqueda y filtrado de usuarios
- ✅ Asignación de roles a usuarios
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Componentes UI con shadcn/ui

## Requisitos Previos

- PHP 8.3 o superior
- Composer
- Node.js 18 o superior
- MySQL
- NPM o Yarn

## Instalación

### 1. Clonar el repositorio

```bash
cd proyectoLore
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Configurar el archivo .env

Copia el archivo `.env.example` a `.env` y configura las variables de entorno:

```bash
cp .env.example .env
```

Configura la conexión a la base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=proyectolore
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generar la clave de la aplicación

```bash
php artisan key:generate
```

### 5. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

Esto creará:
- Las tablas necesarias
- Dos roles: **Admin** y **Usuario**
- Permisos para gestión de usuarios
- Dos usuarios de prueba:
  - **Admin**: admin@example.com / password
  - **Usuario**: user@example.com / password

### 6. Instalar dependencias de Node.js

```bash
npm install
```

### 7. Compilar assets

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm run build
```

## Uso

### Iniciar el servidor de desarrollo

```bash
php artisan serve
```

La aplicación estará disponible en `http://localhost:8000`

### Usuarios de prueba

- **Administrador**:
  - Email: `admin@example.com`
  - Contraseña: `password`
  - Tiene acceso al panel de administración

- **Usuario Regular**:
  - Email: `user@example.com`
  - Contraseña: `password`
  - No tiene acceso al panel de administración

### Acceder al panel de administración

Una vez autenticado como administrador, accede a:
- Gestión de usuarios: `/admin/users`

## Características del Panel de Administración

### Gestión de Usuarios

- **Listar usuarios**: Ver todos los usuarios con búsqueda y paginación
- **Crear usuarios**: Agregar nuevos usuarios con nombre, email, contraseña y rol
- **Editar usuarios**: Modificar información de usuarios existentes
- **Eliminar usuarios**: Borrar usuarios del sistema (con protección para no eliminar el propio usuario)
- **Asignar roles**: Cambiar el rol de un usuario (Admin o Usuario)

### Sistema de Roles

El sistema incluye dos roles predefinidos:

1. **Admin**: Tiene acceso completo al panel de administración
2. **Usuario**: Usuario regular sin permisos administrativos

### Permisos

Los siguientes permisos están configurados:
- `users.index`: Ver lista de usuarios
- `users.create`: Crear nuevos usuarios
- `users.edit`: Editar usuarios existentes
- `users.delete`: Eliminar usuarios

## Estructura del Proyecto

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Admin/
│   │   │       └── UserController.php      # Controlador CRUD de usuarios
│   │   └── Middleware/
│   │       └── IsAdmin.php                 # Middleware de autorización
│   └── Models/
│       └── User.php                        # Modelo con trait HasRoles
│
├── database/
│   └── seeders/
│       ├── RoleSeeder.php                  # Seeder de roles y permisos
│       └── DatabaseSeeder.php              # Seeder principal
│
├── resources/
│   └── js/
│       ├── components/
│       │   └── ui/                         # Componentes shadcn/ui
│       ├── layouts/
│       │   └── admin-layout.tsx            # Layout del panel admin
│       └── pages/
│           └── Admin/
│               └── Users/
│                   ├── Index.tsx           # Lista de usuarios
│                   ├── Create.tsx          # Crear usuario
│                   └── Edit.tsx            # Editar usuario
│
└── routes/
    └── web.php                             # Rutas protegidas con middleware
```

## Comandos Útiles

### Formatear código PHP
```bash
vendor/bin/pint
```

### Ejecutar tests
```bash
php artisan test
```

### Limpiar caché
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Crear nuevo administrador
```bash
php artisan tinker
```

Luego en el shell de Tinker:
```php
$user = \App\Models\User::create([
    'name' => 'Nuevo Admin',
    'email' => 'nuevo@admin.com',
    'password' => \Hash::make('password'),
    'email_verified_at' => now()
]);
$user->assignRole('Admin');
```

## Tecnologías y Paquetes

### Backend
- [Laravel 12](https://laravel.com/docs/12.x)
- [Laravel Fortify](https://laravel.com/docs/12.x/fortify)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)

### Frontend
- [React 19](https://react.dev/)
- [Inertia.js 2](https://inertiajs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)

## Desarrollo

Para contribuir o personalizar el proyecto:

1. Las rutas administrativas están protegidas con el middleware `isAdmin`
2. Los componentes React están en `resources/js/`
3. Los estilos utilizan Tailwind CSS
4. Sigue las convenciones de Laravel y React

## Seguridad

- Las contraseñas se almacenan con hash usando bcrypt
- Las rutas administrativas requieren autenticación y rol de Admin
- CSRF protection habilitado en todos los formularios
- Validación de datos en backend y frontend

## Licencia

Este proyecto está bajo la licencia MIT.

## Soporte

Para preguntas o problemas, por favor abre un issue en el repositorio.

