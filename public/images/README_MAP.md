# 🗺️ Mapa Personalizado de Aethermoor

## 📍 Ubicación del Archivo

Coloca tu imagen de mapa personalizado en:

```
proyectoLore/public/images/map-aethermoor.png
```

## 📐 Especificaciones Recomendadas

### Dimensiones
- **Mínimo:** 1920x1920 px (cuadrado)
- **Recomendado:** 2048x2048 px o 3000x3000 px
- **Aspecto:** Cuadrado (1:1) preferentemente
- **Formato:** PNG (con transparencia) o JPG

### Estilo Visual
- Estilo medieval/fantasy
- Colores tierra/parchment (sepia, ocre, marrón)
- Bordes con estilo manuscrito antiguo
- Rosa de los vientos decorativa (opcional)
- Texto en fuente medieval (opcional)

## 🎨 Herramientas Recomendadas

### Generación de Mapas Fantasy
1. **Inkarnate** - https://inkarnate.com/ (Recomendado, fácil de usar)
2. **Wonderdraft** - https://www.wonderdraft.net/ (Desktop, profesional)
3. **Azgaar's Fantasy Map Generator** - https://azgaar.github.io/Fantasy-Map-Generator/
4. **GIMP/Photoshop** - Para diseño completamente personalizado

### Convertir Imágenes a Estilo Medieval
- Filtros de sepia/parchment
- Texturas de papel viejo
- Bordes desgastados

## 🔧 Activación del Mapa Custom

Una vez que tengas tu imagen:

1. **Coloca la imagen** en `public/images/map-aethermoor.png`

2. **Edita** `resources/js/components/map-view.tsx`

3. **Descomenta** estas líneas (alrededor de la línea 160):

```typescript
// ANTES (comentado):
{/* 
<ImageOverlay
    url="/images/map-aethermoor.png"
    bounds={bounds}
    opacity={0.9}
/>
*/}

// DESPUÉS (descomentado):
<ImageOverlay
    url="/images/map-aethermoor.png"
    bounds={bounds}
    opacity={0.9}
/>
```

4. **(Opcional)** Comenta o elimina el `<TileLayer>` del fondo de textura

5. **Refresca** el navegador (F5)

## 📊 Sistema de Coordenadas

El mapa usa un sistema de **coordenadas simples (0-100)**:

```
(0,0) ─────────────────── (100,0)
  │                          │
  │     MAPA FANTASY         │
  │      AETHERMOOR          │
  │                          │
(0,100) ────────────────── (100,100)
```

### Ejemplo de Ubicaciones:
- **Lumendor** (centro-norte): `coordinate_x = 45, coordinate_y = 30`
- **Puerto Tormenta** (este-sur): `coordinate_x = 70, coordinate_y = 60`
- **Umbravale** (oeste-norte): `coordinate_x = 20, coordinate_y = 15`

## 🎯 Tips para un Mapa Perfecto

1. **Asegúrate** de que los elementos importantes estén dentro del área visible
2. **Deja márgenes** de ~10% en los bordes para los controles del mapa
3. **Usa colores** que contrasten bien con los marcadores (iconos coloridos)
4. **Evita** texto muy pequeño que sea ilegible al hacer zoom
5. **Prueba** diferentes niveles de `opacity` (0.7 - 1.0) en el `ImageOverlay`

## 🔄 Sin Mapa Personalizado

Si no tienes un mapa custom, el sistema usa un **fondo de textura pergamino** generado con SVG que se ve bien y es totalmente funcional.

## 📝 Notas Adicionales

- El mapa soporta zoom (1-5 niveles)
- Las coordenadas son persistentes en la base de datos
- Puedes cambiar el mapa en cualquier momento sin afectar las ubicaciones existentes
- El sistema de coordenadas es independiente del tamaño de la imagen

---

**¿Necesitas ayuda?** Revisa la documentación en `map-view.tsx` o consulta los ejemplos en los seeders.

