<?php

namespace Database\Seeders;

use App\Models\ManualSection;
use Illuminate\Database\Seeder;

class ManualSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fundamentos
        ManualSection::create([
            'title' => 'Introducción al Juego',
            'category' => 'fundamentos',
            'content' => '## ¿Qué es Proyecto Lore?

Proyecto Lore es un juego de cartas coleccionables estratégico que combina narrativa épica con mecánicas profundas de combate. Los jugadores asumen el rol de invocadores que pueden convocar personajes legendarios, usar poderosos hechizos y controlar ubicaciones místicas para derrotar a sus oponentes.

## Objetivo del Juego

El objetivo principal es reducir los puntos de vida del oponente de 20 a 0, utilizando estratégicamente tus cartas de personaje, hechizos y habilidades especiales.

## Componentes Básicos

- **Cartas de Personaje**: Criaturas y héroes que luchan por ti
- **Cartas de Acción**: Hechizos y efectos instantáneos
- **Cartas de Ubicación**: Lugares que modifican el campo de batalla
- **Recursos**: Energía necesaria para jugar cartas

El juego está diseñado para 2 jugadores y una partida típica dura entre 20-30 minutos.',
            'order' => 1,
            'is_published' => true,
        ]);

        ManualSection::create([
            'title' => 'Preparación del Juego',
            'category' => 'fundamentos',
            'content' => '## Antes de Empezar

Cada jugador necesita:
- Un mazo de 40-60 cartas
- Fichas de vida (o dado de 20 caras)
- Marcadores de estado

## Pasos de Preparación

### 1. Construcción del Mazo
Cada jugador debe tener un mazo que cumpla:
- Mínimo 40 cartas, máximo 60 cartas
- Máximo 3 copias de cada carta (excepto cartas básicas)
- Solo 1 copia de cartas legendarias

### 2. Área de Juego
Configura las siguientes zonas:
- **Zona de Mazo**: Donde colocas tu mazo boca abajo
- **Zona de Mano**: Cartas en tu mano
- **Campo de Batalla**: Donde se juegan los personajes
- **Cementerio**: Cartas descartadas o destruidas

### 3. Inicio de Partida
1. Cada jugador baraja su mazo
2. Se lanza una moneda para determinar quién empieza
3. Ambos jugadores roban 5 cartas iniciales
4. Cada jugador empieza con 20 puntos de vida',
            'order' => 2,
            'is_published' => true,
        ]);

        // Mecánicas
        ManualSection::create([
            'title' => 'Estructura de un Turno',
            'category' => 'mecanicas',
            'content' => '## Fases del Turno

Cada turno se divide en las siguientes fases que deben ejecutarse en orden:

### 1. Fase de Inicio
- Endereza todas tus cartas agotadas
- Activa habilidades de "inicio de turno"
- Ganas 1 recurso adicional (máximo 10)

### 2. Fase de Robo
- Roba 1 carta de tu mazo
- Si no puedes robar, pierdes el juego

### 3. Fase Principal
Puedes realizar las siguientes acciones en cualquier orden:
- Jugar personajes pagando su coste
- Jugar hechizos
- Activar habilidades de tus personajes
- Atacar con tus personajes

### 4. Fase Final
- Descarta cartas hasta tener 7 en mano
- Efectos de "fin de turno" se activan
- El turno pasa al oponente',
            'order' => 1,
            'is_published' => true,
        ]);

        ManualSection::create([
            'title' => 'Sistema de Combate',
            'category' => 'mecanicas',
            'content' => '## Combate Básico

### Declarar Ataque
En tu turno, durante la fase principal, puedes declarar que tus personajes atacan:

1. **Selecciona Atacantes**: Elige qué personajes atacan (deben estar enderezados)
2. **Agota Personajes**: Los atacantes se agotan (giran 90°)
3. **El Oponente Declara Bloqueadores**: Tu oponente elige con qué personajes bloquea

### Resolución del Combate

#### Daño No Bloqueado
Si un personaje no es bloqueado, inflige su valor de ataque directamente al oponente.

#### Daño Bloqueado
- El atacante y el bloqueador se infligen daño simultáneamente
- Si un personaje recibe daño igual o superior a su defensa, es destruido
- Ambos pueden morir en combate

### Ejemplo
Tu **Guerrero Élfico** (Ataque: 3, Defensa: 2) ataca.
Tu oponente bloquea con **Guardia de Piedra** (Ataque: 2, Defensa: 4).

**Resultado:**
- Guerrero Élfico recibe 2 de daño → Sobrevive (tenía 2 de defensa, queda con 0)
- Guardia de Piedra recibe 3 de daño → Sobrevive (tenía 4 de defensa)',
            'order' => 2,
            'is_published' => true,
        ]);

        // Cartas
        ManualSection::create([
            'title' => 'Tipos de Cartas',
            'category' => 'cartas',
            'content' => '## Categorías Principales

### Cartas de Personaje
Representan criaturas, héroes y guerreros que luchan en el campo de batalla.

**Atributos:**
- **Coste**: Recursos necesarios para invocarlo
- **Ataque**: Daño que inflige en combate
- **Defensa**: Daño que puede resistir
- **Habilidades**: Efectos especiales

### Cartas de Hechizo
Efectos mágicos que se resuelven inmediatamente y van al cementerio.

**Tipos de hechizos:**
- **Instantáneos**: Se pueden jugar en cualquier momento
- **Rituales**: Solo en tu turno, durante fase principal

### Cartas de Ubicación
Permanentes que modifican el campo de batalla.

**Características:**
- Permanecen en juego hasta ser destruidas
- Proporcionan efectos pasivos o activables
- Máximo 1 ubicación activa por jugador',
            'order' => 1,
            'is_published' => true,
        ]);

        ManualSection::create([
            'title' => 'Sistema de Rarezas',
            'category' => 'cartas',
            'content' => '## Niveles de Rareza

### Común ⚪
Las cartas más frecuentes. Forman la base de cualquier mazo.
- **Símbolo**: Círculo blanco
- **En mazo**: Sin restricción

### Rara 🔵
Cartas con mecánicas más complejas.
- **Símbolo**: Rombo azul
- **En mazo**: Máximo 3 copias

### Épica 🟣
Cartas poderosas con efectos significativos.
- **Símbolo**: Estrella púrpura
- **En mazo**: Máximo 3 copias

### Legendaria 🟠
Las cartas más poderosas y únicas del juego.
- **Símbolo**: Corona dorada
- **En mazo**: Máximo 1 copia por carta legendaria

## Construcción de Mazos

Se recomienda:
- 60-70% comunes
- 20-25% raras
- 8-12% épicas
- 2-5% legendarias',
            'order' => 2,
            'is_published' => true,
        ]);

        // Lore
        ManualSection::create([
            'title' => 'Las Facciones',
            'category' => 'lore',
            'content' => '## Introducción a las Facciones

El mundo de Proyecto Lore está dividido en varias facciones, cada una con su filosofía, estilo de juego y personajes únicos.

### Facción de Luz ☀️
**Filosofía**: Orden, justicia y protección

**Estilo de juego**: 
- Enfoque defensivo
- Curación y protección
- Personajes con alta defensa
- Habilidades de soporte

**Color característico**: Dorado y blanco

### Facción de Oscuridad 🌙
**Filosofía**: Poder, sacrificio y control

**Estilo de juego**:
- Mecánicas de sacrificio
- Control del campo enemigo
- Alto poder ofensivo
- Efectos de robo de recursos

**Color característico**: Negro y púrpura

### Facción Neutral ⚖️
**Filosofía**: Balance y adaptabilidad

**Estilo de juego**:
- Cartas versátiles
- Pueden combinarse con cualquier facción
- Efectos equilibrados
- Enfoque estratégico flexible

**Color característico**: Gris y plata',
            'order' => 1,
            'is_published' => true,
        ]);

        // Glosario
        ManualSection::create([
            'title' => 'Términos del Juego',
            'category' => 'glosario',
            'content' => '## Glosario de Términos

### A
**Agotar**: Girar una carta 90° para indicar que ha sido usada. Las cartas agotadas no pueden atacar ni usar habilidades de agotamiento.

**Ataque**: Valor numérico que indica cuánto daño inflige un personaje en combate.

### B
**Bloqueador**: Personaje que se interpone para evitar daño al jugador.

### C
**Campo de Batalla**: Zona donde se colocan los personajes en juego.

**Cementerio**: Pila de descarte donde van las cartas destruidas o usadas.

**Coste de Invocación**: Cantidad de recursos necesarios para jugar una carta.

### D
**Defensa**: Valor que indica cuánto daño puede resistir un personaje antes de ser destruido.

**Descarte**: Carta movida desde la mano al cementerio.

### E
**Efecto**: Habilidad especial de una carta que modifica el juego.

**Enderezar**: Devolver una carta agotada a su posición vertical normal.

### H
**Habilidad Pasiva**: Efecto que está siempre activo mientras la carta está en juego.

**Habilidad Activada**: Efecto que requiere una acción específica para usarse.

### I
**Instantáneo**: Hechizo que puede jugarse en cualquier momento, incluso durante el turno del oponente.

### L
**Legendaria**: Carta de rareza máxima, limitada a 1 copia por mazo.

### M
**Mazo**: Conjunto de cartas que un jugador usa en la partida.

**Mulligan**: Opción de devolver la mano inicial y robar nuevas cartas (solo al inicio).

### R
**Recursos**: Energía acumulada que se usa para pagar el coste de las cartas.

**Robar**: Tomar la carta superior de tu mazo y añadirla a tu mano.',
            'order' => 1,
            'is_published' => true,
        ]);

        // Desarrollo
        ManualSection::create([
            'title' => 'Notas de la Versión 1.0',
            'category' => 'desarrollo',
            'content' => '# Historial de Desarrollo

## Versión 1.0 - Edición Fundacional (Enero 2026)

### Contenido Inicial
- **150 cartas únicas** distribuidas en:
  - 60 Personajes
  - 50 Hechizos
  - 20 Ubicaciones
  - 20 Cartas especiales

### Facciones Disponibles
- Luz (40 cartas)
- Oscuridad (40 cartas)
- Neutral (70 cartas)

### Mecánicas Implementadas
✅ Sistema básico de combate
✅ Fases de turno
✅ Habilidades activadas
✅ Habilidades pasivas
✅ Sistema de recursos
✅ Tipos de cartas

### Próximas Expansiones
🔜 Facción Elemental (Q2 2026)
🔜 Mecánica de "Sinergia" (Q2 2026)
🔜 Modo de juego 2v2 (Q3 2026)
🔜 Formato Commander (Q4 2026)

## Feedback Bienvenido

Estamos en fase de pruebas y valoramos tu opinión. 
Reporta bugs o sugerencias en el panel de desarrollo.',
            'order' => 1,
            'is_published' => false,
        ]);
    }
}
