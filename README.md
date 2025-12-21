# 🗺️ ProyectoLore - Sistema de Gestión de Lore para TCG RPG

Sistema de administración completo para gestionar el lore, personajes, ubicaciones y cartas de un juego de cartas coleccionables (TCG) con elementos de rol.

## ✨ Características

### 🎮 Gestión de Lore
- **Mundos**: Crea y administra universos completos
- **Historias**: Editor amigable para escritores con contador de palabras
- **Personajes**: Fichas de personajes con biografías, hechizos y relaciones
- **Ubicaciones**: Mapa interactivo con coordenadas y descripciones detalladas
- **Línea de Tiempo**: Gestión de eventos históricos con relaciones

### 🃏 Sistema de Cartas TCG
- **Cartas**: Creación de cartas con ilustraciones, efectos y atributos
- **Tipos de Carta**: Criaturas, hechizos, trampas, eventos
- **Rarezas**: Común, Rara, Épica, Legendaria
- **Atributos**: Fuerza, Agilidad, Carisma, Mente
- **Relaciones**: Alineaciones, Facciones, Arquetipos, Artistas

### 🗺️ Mapa Interactivo
- Sistema de coordenadas personalizado
- Click para establecer ubicaciones
- Marcadores personalizados por tipo
- Popups informativos
- Vista de mapa y lista intercambiable

### 👥 Sistema de Usuarios
- Roles y permisos (Admin/User)
- CRUD completo de usuarios
- Autenticación con Laravel Fortify

### 🎨 Interfaz
- Tema medieval de taberna
- Diseño responsive
- Modo oscuro/claro
- Animaciones y efectos visuales
- Componentes UI personalizados

## 🛠️ Stack Tecnológico

### Backend
- **Laravel 12** - Framework PHP
- **MySQL** - Base de datos
- **Laravel Fortify** - Autenticación
- **Spatie Laravel Permission** - Roles y permisos
- **Inertia.js 2** - Comunicación Frontend-Backend

### Frontend
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **shadcn/ui** - Componentes UI
- **Leaflet** - Mapas interactivos
- **Vite** - Build tool

## 📦 Instalación

### Requisitos
- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8.0+

### Pasos

1. **Clonar repositorio**
```bash
git clone <tu-repo>
cd proyectoLore
```

2. **Instalar dependencias PHP**
```bash
composer install
```

3. **Instalar dependencias Node**
```bash
npm install
```

4. **Configurar entorno**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar base de datos**
Edita `.env` con tus credenciales de MySQL:
```env
DB_DATABASE=proyectolore
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

6. **Ejecutar migraciones y seeders**
```bash
php artisan migrate --seed
```

7. **Crear enlace simbólico para storage**
```bash
php artisan storage:link
```

8. **Compilar assets**
```bash
npm run build
```

9. **Iniciar servidor de desarrollo**
```bash
# Terminal 1: Servidor PHP
php artisan serve

# Terminal 2: Vite (desarrollo)
npm run dev
```

10. **Acceder**
- URL: `http://localhost:8000`
- Admin: `admin@example.com` / `password`
- User: `user@example.com` / `password`

## 📸 Capturas

### Dashboard
Panel principal con estadísticas y accesos rápidos

### Mapa Interactivo
Sistema de ubicaciones con mapa personalizado

### Editor de Historias
Interfaz cómoda para escritores con contadores

### Cartas TCG
Vista previa de cartas con todos sus atributos

## 🗂️ Estructura del Proyecto

```
proyectoLore/
├── app/
│   ├── Http/Controllers/Admin/  # Controladores del panel admin
│   ├── Models/                  # Modelos Eloquent
│   └── Http/Middleware/         # Middleware personalizado
├── database/
│   ├── migrations/              # Migraciones de BD
│   └── seeders/                 # Seeders con datos de ejemplo
├── resources/
│   ├── js/
│   │   ├── components/          # Componentes React
│   │   ├── layouts/             # Layouts de página
│   │   └── pages/               # Páginas Inertia
│   └── css/                     # Estilos CSS
├── routes/
│   └── web.php                  # Rutas de la aplicación
└── public/
    └── images/                  # Imágenes del mapa
```

## 🚀 Despliegue

### Opción 1: Railway (Recomendado)
1. Crea cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio GitHub
3. Railway detectará Laravel automáticamente
4. Configura variables de entorno
5. Despliega

### Opción 2: DigitalOcean
1. Crea un Droplet Ubuntu
2. Instala LAMP stack
3. Clona el repositorio
4. Configura Nginx/Apache
5. Ejecuta migraciones

### Opción 3: Vercel (Frontend) + PlanetScale (DB)
- Frontend en Vercel
- Base de datos en PlanetScale
- API en Railway o similar

## 🧪 Testing

```bash
# Tests backend (Pest)
php artisan test

# Tests con cobertura
php artisan test --coverage

# Formatear código
vendor/bin/pint
```

## 📝 Comandos Útiles

```bash
# Limpiar cache
php artisan optimize:clear

# Regenerar assets
npm run build

# Crear nueva migración
php artisan make:migration nombre_migracion

# Crear nuevo modelo
php artisan make:model NombreModelo -mfs

# Ejecutar un seeder específico
php artisan db:seed --class=NombreSeeder
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Autor

**Tu Nombre** - [Tu GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Laravel por el excelente framework
- React por la librería UI
- shadcn/ui por los componentes
- Leaflet por el sistema de mapas
- Comunidad open source

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2025
