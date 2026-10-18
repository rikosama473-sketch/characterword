# CharacterWord

Proyecto independiente para crear personajes 2D ensamblando piezas gráficas, como muñecos de papel. **No forma parte de WordWaifu** y no importa código ni datos desde ese repositorio.

## Objetivo inicial

Construir un editor visual donde se puedan combinar y guardar capas compatibles: cuerpo, rostro, ojos, boca, cabello, ropa, accesorios y, en una etapa posterior, partes articuladas y poses.

La prioridad inicial no es inventar arte desde cero: es localizar recursos disponibles en la web, revisar sus licencias y formatos, probar qué combinaciones son realmente compatibles y registrar su procedencia.

## Meta ampliada: generador anime propio y ligero

El objetivo a largo plazo es entrenar **un generador propio desde inicialización aleatoria**, limitado a cuerpos/personajes anime pequeños, con variaciones controladas de silueta, cabello, ropa y piernas y salida con transparencia o fondo simple. No queremos basarlo en un checkpoint ajeno como Haruka v2/SDXL, ni utilizar DMD2/destilación de un modelo docente ni un LoRA dependiente de un modelo base.

**Los ~100 personajes son un primer conjunto de datos experimental, no un LoRA.** Con 100 imágenes existe riesgo serio de sobreajuste y baja diversidad; esa fase solo determinará si el enfoque estrecho y de baja resolución aprende algo útil. La primera comparación técnica se hará con modelos convolucionales pequeños entrenados desde cero (por ejemplo, un GAN condicional pequeño y un VAE convolucional de referencia), empezando en 64×96 y evaluando hasta 128×192 solo si pasan pruebas de calidad y memoria.

**Presupuesto:** el editor/compositor y el objetivo de inferencia apuntan a unos 2 GB de RAM del sistema, medidos en un prototipo real. El entrenamiento tiene un presupuesto separado y puede necesitar más memoria o ejecutarse en una máquina de entrenamiento; no afirmamos que entrenar desde cero quepa en 2 GB. Para cambiar partes de forma independiente, necesitamos imágenes con capas/piezas etiquetadas y alineadas o una salida de varias capas: un modelo entrenado solo con imágenes completas no garantiza piezas separadas.

La prioridad inmediata sigue siendo **conseguir, inspeccionar y probar piezas gráficas compatibles**. Cada activo y cada imagen de entrenamiento deben tener procedencia y autorización separada. Descargar un recurso gratis o poder modificar su PSD no lo autoriza automáticamente para entrenar IA. Por ejemplo, Thin Girl queda excluido del dataset porque su autora declara que no autoriza usarlo en conjuntos de datos de IA generativa, a menos que exista permiso independiente explícito.

El informe [de descubrimiento de recursos y arquitectura ligera](docs/RESOURCE_DISCOVERY_AND_LOW_MEMORY_ROADMAP.md) y la [especificación del modelo propio](docs/OWN_MODEL_FROM_SCRATCH.md) describen fuentes, límites de memoria, criterios de licencia y pruebas antes de considerar una pieza o un modelo como listo.

## Enfoque por etapas

1. **Investigar y verificar recursos:** buscar paquetes, repositorios, herramientas y aplicaciones que ofrezcan piezas separadas.
2. **Crear un catálogo de procedencia:** registrar enlace, autor, licencia, atribución requerida, formatos, compatibilidad y restricciones por recurso.
3. **Probar un paquete piloto:** comprobar dimensiones, transparencia, orden de capas, coincidencia de coordenadas y si las extremidades son editables por separado.
4. **Construir el editor 2D:** capas intercambiables, orden visual, recoloración cuando sea viable, selección/movimiento, poses y guardado local.
5. **Ampliar la biblioteca:** incorporar nuevos paquetes solo después de comprobar las licencias y la compatibilidad.

## Prototipo ejecutable

El editor ya está publicado en [CharacterWord Studio](https://rikosama473-sketch.github.io/characterword/) y también puede abrirse localmente desde `index.html`. El workflow `.github/workflows/pages.yml` vuelve a desplegar la versión estática cada vez que se actualiza `main` y permite ejecución manual.

- Ensambla una muñeca anime provisional con cabeza, torso, brazos superiores y antebrazos separados.
- Selecciona y arrastra las piezas; ajusta rotación, escala, posición y visibilidad.
- Apila varias capas PNG/WebP transparentes dentro de cabeza, torso, brazo superior o antebrazo; oculta, reordena y elimina capas por separado.
- Alterna entre capas recortadas y láminas de lienzo alineado; mueve/gira/escalas las capas como una sola pieza anatómica.
- Importa los ZIP originales verificados de FBFFFM001/HFFF001 y también capas PNG exportadas desde PSD/KRA de modelos femeninos compatibles. Cada perfil bloquea las dimensiones del lienzo para evitar mezclar bases incompatibles; los archivos de terceros no están incluidos en el repositorio.
- Prueba paletas y poses, exporta a PNG y guarda/carga proyectos JSON.
- Los ZIP e imágenes se leen localmente en el navegador mediante JSZip (MIT); no hay backend ni envío automático de imágenes a un servidor. El proyecto conserva las capas elegidas y metadatos de atribución.
- El dibujo vectorial incorporado es solo una base de prueba para el modo articulable. FBFFFM001 y HFFF001 combinan sprites completos con overlays; sus ZIP base inspeccionados no incluyen piezas anatómicas independientes. Dorathy y Pung Lone Wolf ofrecen PSD/KRA por capas, pero deben exportarse a PNG transparentes conservando el lienzo. Sus perfiles están configurados; la prueba de importación completa de esas fuentes sigue pendiente.

## Validación del código

Un flujo de GitHub Actions ejecuta `node --check app.js`, `node --check vendor/jszip.min.js` y `node scripts/validate-project.mjs` para verificar sintaxis, controles del importador, archivos vendorizados, dimensiones de los dos paquetes y el catálogo de licencias. La licencia de JSZip se conserva en `vendor/JSZIP-LICENSE.markdown`.

## Recursos anime integrados

La prioridad de búsqueda más reciente es [Modular Character Sprite, Thin Girl](https://queenofzan.itch.io/modular-character-sprite-thin-girl): ya se descargaron sus ZIP gratuitos, pero falta verificar tamaños y contenido antes de habilitar el perfil en el editor. Se añadieron además fuentes femeninas/chibi de investigación al [catálogo de procedencia](data/asset-sources.json); los candidatos sin archivos o licencia verificados no se presentan como compatibles.

- [Informe de inspección e instrucciones FBFFFM001 / HFFF001](docs/ANIME_PACK_INTEGRATION.md)
- [Catálogo de fuentes y licencias](data/asset-sources.json)

El modo **Base anime / waifu** permite importar un PNG de cuerpo base y capas de expresión alineadas de cualquiera de los dos conjuntos. El modo provisional articulable sigue separado: ninguno de los dos ZIP base inspeccionados trae brazos, torso y cabeza independientes.

## Investigación actual

- [Catálogo de recursos y licencias](docs/ASSET_RESEARCH.md)
- [Inventario legible por máquina](data/asset-sources.json)

## Regla importante

Un recurso descargable no es automáticamente de dominio público. El código, cada paquete de ilustraciones y las modificaciones de esas ilustraciones se deben tratar por separado. No se incorporarán archivos gráficos de terceros al repositorio público hasta confirmar su licencia y conservar los créditos/procedencia necesarios.

## Estado

Investigación inicial en curso. Las fuentes registradas se han revisado en sus páginas públicas el 2026-10-18; esto no significa que todos los archivos se hayan descargado, inspeccionado o integrado todavía.
