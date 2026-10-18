# CharacterWord

Proyecto independiente para crear personajes 2D ensamblando piezas gráficas, como muñecos de papel. **No forma parte de WordWaifu** y no importa código ni datos desde ese repositorio.

## Objetivo inicial

Construir un editor visual donde se puedan combinar y guardar capas compatibles: cuerpo, rostro, ojos, boca, cabello, ropa, accesorios y, en una etapa posterior, partes articuladas y poses.

La prioridad inicial no es inventar arte desde cero: es localizar recursos disponibles en la web, revisar sus licencias y formatos, probar qué combinaciones son realmente compatibles y registrar su procedencia.

## Enfoque por etapas

1. **Investigar y verificar recursos:** buscar paquetes, repositorios, herramientas y aplicaciones que ofrezcan piezas separadas.
2. **Crear un catálogo de procedencia:** registrar enlace, autor, licencia, atribución requerida, formatos, compatibilidad y restricciones por recurso.
3. **Probar un paquete piloto:** comprobar dimensiones, transparencia, orden de capas, coincidencia de coordenadas y si las extremidades son editables por separado.
4. **Construir el editor 2D:** capas intercambiables, orden visual, recoloración cuando sea viable, selección/movimiento, poses y guardado local.
5. **Ampliar la biblioteca:** incorporar nuevos paquetes solo después de comprobar las licencias y la compatibilidad.

## Prototipo ejecutable

El primer editor está disponible como página estática: abre `index.html` directamente en el navegador o publícala con GitHub Pages.

- Ensambla una muñeca anime provisional con cabeza, torso, brazos superiores y antebrazos separados.
- Selecciona y arrastra las piezas; ajusta rotación, escala, posición y visibilidad.
- Apila varias capas PNG/WebP transparentes dentro de cabeza, torso, brazo superior o antebrazo; oculta, reordena y elimina capas por separado.
- Alterna entre capas recortadas y láminas de lienzo alineado; mueve/gira/escalas las capas como una sola pieza anatómica.
- Prueba paletas y poses, exporta a PNG y guarda/carga proyectos JSON.
- Los archivos importados permanecen en el navegador. No hay backend ni envío de imágenes a un servidor.
- El dibujo vectorial incorporado es solo una base de prueba; el catálogo de fuentes registra qué paquetes externos podrían sustituirlo. Las piezas anatómicas siguen moviéndose de forma independiente: todavía no hay un esqueleto continuo hombro-codo-muñeca ni una biblioteca anime externa integrada.

## Validación del código

Un flujo de GitHub Actions ejecuta `node --check app.js` y `node scripts/validate-project.mjs` para verificar sintaxis, rutas de recursos, identificadores y el catálogo de licencias.

## Investigación actual

- [Catálogo de recursos y licencias](docs/ASSET_RESEARCH.md)
- [Inventario legible por máquina](data/asset-sources.json)

## Regla importante

Un recurso descargable no es automáticamente de dominio público. El código, cada paquete de ilustraciones y las modificaciones de esas ilustraciones se deben tratar por separado. No se incorporarán archivos gráficos de terceros al repositorio público hasta confirmar su licencia y conservar los créditos/procedencia necesarios.

## Estado

Investigación inicial en curso. Las fuentes registradas se han revisado en sus páginas públicas el 2026-10-18; esto no significa que todos los archivos se hayan descargado, inspeccionado o integrado todavía.
