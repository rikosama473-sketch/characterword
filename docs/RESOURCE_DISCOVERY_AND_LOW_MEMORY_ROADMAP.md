# Descubrimiento de recursos gráficos y ruta hacia un generador anime ligero

**Proyecto:** CharacterWord (independiente de WordWaifu)  
**Revisión:** 2026-10-18  
**Prioridad inmediata:** localizar y probar gráficos reutilizables. La IA propia es una etapa posterior.

## Objetivo y límites

CharacterWord debe ensamblar personajes 2D a partir de piezas que encajen: base corporal, cabeza, rostro, ojos, boca, cabello trasero/delantero, torso, mangas, brazos, manos, pelvis, piernas, calzado, prendas y accesorios. Las piezas ideales son PNG transparentes o vectores SVG, con lienzos alineados, nombres claros y pivotes/anchors conocidos.

La meta a largo plazo es entrenar **un generador propio desde inicialización aleatoria**, especializado en cuerpos/personajes anime de baja resolución, con variaciones controladas y salida transparente o con fondo simple. El proyecto no usará como núcleo un checkpoint de generación preentrenado (incluido Haruka v2/SDXL), un LoRA que dependa de un checkpoint ajeno, ni DMD2/destilación de un modelo docente.

Los aproximadamente 100 personajes son un conjunto de datos inicial para un experimento de viabilidad, no un LoRA ni garantía de calidad: el sobreajuste es probable con tan pocas imágenes. La primera prueba comparará una red convolucional pequeña tipo GAN condicional con un VAE convolucional simple, ambos inicializados al azar. El editor y la inferencia buscan un presupuesto medido de **2 GB de RAM del sistema**; el entrenamiento tiene presupuesto separado y no se promete que quepa en esa memoria. Comenzaremos en 64×96 px y solo probaremos 128×192 si calidad y uso de memoria lo justifican.

Para variar cabello, ropa y piernas realmente por separado, la biblioteca necesita partes etiquetadas/alineadas o un generador que produzca capas separadas. Entrenar solo con 100 retratos/composiciones completas no garantiza ese control modular. Ver [OWN_MODEL_FROM_SCRATCH.md](OWN_MODEL_FROM_SCRATCH.md).

## Prioridad de adquisición de activos

### 1. Piezas anime que se puedan combinar

**Modular Character Sprite, Thin Girl — ani mosity**  
Fuente: https://queenofzan.itch.io/modular-character-sprite-thin-girl

La ficha pública indica elementos PNG individuales y PSD, lienzos del mismo tamaño para apilar, recoloreado/reordenamiento y licencia CC BY 4.0 con atribución. La autora declara además que no autoriza el uso de esos activos para datasets de IA generativa. Nuestra regla conservadora: no incluirlos en el conjunto LoRA sin permiso separado explícito. Los archivos descargables fueron obtenidos por el navegador en una sesión previa, pero no están disponibles en el entorno local de esta tarea; por ello, manifest, dimensiones exactas e importación de ida y vuelta siguen **pendientes**, no verificados.

**FBFFFM001 Fullbody Girl — LinXueLian**  
Fuente: https://linxuelian.itch.io/customchar-fbfffm001-fullbodyfemale

El ZIP base ya inspeccionado indica PNG RGBA de 800 × 1200 y licencia CC BY-SA 4.0. Es útil para cuerpo/rasgos y para validar superposición de capas de lienzo completo; el ZIP base examinado no contiene cabeza, torso, brazos y piernas como partes anatómicas independientes. Para publicar modificaciones de ese arte, revisar ShareAlike y mantener atribución/licencia. Paquetes accesorios anunciados en la página requieren inspección por separado.

**HFFF001 Oujousama — LinXueLian**  
Fuente: https://linxuelian.itch.io/charres-custom-hfff001-ega-ojousama

El ZIP base inspeccionado indica PNG RGBA de 537 × 700 y CC BY 4.0. Ayuda a probar caras/overlays y ropa dentro de su lienzo base; no confundir estas capas con un rig de extremidades separadas. Los ZIP accesorios y sus dimensiones aún no han sido probados individualmente.

**Modular Pixel Character Kit — monapdx**  
Fuente: https://monapdx.itch.io/modular-pixel-character-kit

La ficha describe ZIP de 113 kB, PNG transparentes alineados, varios peinados y caras/tonos de piel, con archivos fuente XCF y descarga gratuita con donación opcional. La página revisada no expone claramente una licencia estándar; no habilitarlo para redistribución ni dataset IA hasta revisar el README y términos dentro del archivo.

### 2. Piezas CC0 útiles para la arquitectura

**PSRC Human Mk2 and Ultimate Devkit**  
Fuente: https://opengameart.org/content/psrc-human-mk2-and-ultimate-devkit

La ficha pública indica CC0 y describe partes de torso, extremidades, cabezas, manos, pies, rasgos y plantillas de ropa. Su estilo es pixel art genérico, no el estilo anime objetivo. Es un candidato para estudiar y probar alineación, pivotes, combinación y articulaciones, sujeto a inspección del archivo ZIP. No declarar integración antes de esa prueba.

**Kenney Modular Characters**  
Fuente: https://kenney.nl/assets/modular-characters

La ficha oficial anuncia CC0 y componentes modulares; el acabado es plano/cartoon, no anime. Útil como referencia técnica o como opción secundaria filtrando piezas pertinentes. Su estructura real, pivotes y utilidad visual deben probarse antes de asumir compatibilidad.

**Hordana — Anime Girl / Michona**  
Fuente: https://opengameart.org/content/anime-girl

La ficha OpenGameArt anuncia CC0 y tiras/animaciones PNG de un personaje chibi femenino. Es candidata para animación de muestra, no un conjunto modular de anatomía. Verificar las tiras y la transparencia antes de importar.

## Herramientas de preparación y referencias técnicas

Estas herramientas no equivalen a una biblioteca de sprites y deben permanecer fuera del runtime ligero salvo que una prueba justifique integrarlas.

| Recurso | Qué aporta | Límite o precaución |
|---|---|---|
| [See-through](https://github.com/shitagaki-lab/see-through) | Descomposición de una ilustración anime en hasta 23 capas semánticas y exportación PSD. | Requiere aproximadamente 12–16 GB de VRAM por defecto y alrededor de 8 GB con NF4 cuantizado a 1280 px según su README. No compatible con el objetivo de 2 GB como proceso local del editor. El permiso del código Apache-2.0 no resuelve licencias de pesos, dependencias, dataset ni obra de entrada. |
| [Stretchy Studio](https://github.com/MangoLion/stretchystudio) | Rigging, pivotes, deformación y animación sobre ilustración por capas; código MIT. | No suministra el arte. Memoria/portabilidad sin medir; referencia de etapa posterior. |
| [Anime Avatar](https://github.com/konard/anime-avatar) | Generador SVG procedural con componentes separados para cara, ojos, cabello, cuerpo, piernas y fondo; código Unlicense. | Referencia para elaborar piezas originales de bajo coste, no un pack gráfico. Revisar imágenes de referencia, dependencias y contenido generado por separado. |
| [Anime Character Creator](https://github.com/rhedak/anime-character-creator) | Generación de SVG a partir de parámetros anatómicos y de ropa; MIT según la ficha del repo. | Referencia para rellenar huecos si no existe arte compatible. No es un archivo de ilustraciones; los términos del arte de referencia/salida deben comprobarse por separado. |

## Política de entrenamiento: el LoRA es una fase separada

Un LoRA es un adaptador de un modelo base; no es por sí solo un generador independiente ni una garantía de que el sistema de generación quepa en 2 GB de memoria. Un conjunto de unas 100 imágenes es un punto de partida experimental, no una garantía de calidad. Hay que registrar autor, URL, licencia, restricciones sobre entrenamiento automático/IA, consentimiento cuando corresponda, etiquetas y origen de cada imagen.

Separar dos permisos por activo:
1. **Uso del recurso en el editor/juego:** importar, modificar, recortar, combinar, atribuir y/o redistribuir según licencia.
2. **Uso para entrenamiento o ajuste de IA:** comprobarlo aparte. No inferirlo del permiso de uso comercial, de una descarga gratuita, de la licencia de código o del permiso para modificar un PSD.

No usar Thin Girl para LoRA sin permiso independiente porque su página dice explícitamente que no autoriza datasets de IA generativa. Cuando la licencia de otro paquete no hable del entrenamiento, dejar ese campo como desconocido y mantener la fuente fuera del dataset hasta aclararlo.

## Diseño de bajo consumo

- **Editor núcleo:** composición de SVG/PNG con capas locales, operaciones 2D y guardado local. Nada de descargar pesos al abrir la web.
- **Generación de imagen:** fase aparte. Primero evaluar un modelo base/LoRA pequeño con una prueba real de RAM de sistema y VRAM; si supera el presupuesto, mantener inferencia opcional fuera del editor (offline en otro equipo o servicio remoto) y permitir usar los PNG resultantes.
- **Fondo simple/estilizado:** ofrecer presets de color, gradientes y formas vectoriales; el recorte automático de imágenes es una herramienta de preparación opcional, no un requisito de arranque.
- **Compatibilidad de las piezas:** mismo lienzo o recorte/pivote documentado, transparencia alfa, orden de z, anchors de hombro/codo/muñeca/cadera/rodilla/tobillo cuando haya articulación, pruebas de solapamiento para ropa sobre torso/piernas.
- **Separar referencias y distribución:** descargas y referencias personales fuera del repositorio público; el catálogo y la app pueden almacenar URL, autor, licencia, crédito y estado de verificación. No almacenar bytes o proyectos con píxeles de terceros cuando sus términos prohíban redistribución.

## Puerta de verificación para cada nuevo paquete

1. Abrir la página original y guardar autor, licencia exacta, URL, fecha de revisión y restricciones.
2. Descargar desde el origen; inspeccionar ZIP/PSD/KRA localmente y leer README/licencia del archivo.
3. Registrar nombres y cantidades reales, dimensiones, formato, transparencia, coordenadas de canvas y pivotes; no copiar conteos del marketing como si fueran inventario comprobado.
4. Probar un personaje en CharacterWord: base + cabello + ropa + cara, guardar el proyecto, recargarlo, exportar PNG y revisar que las piezas se alineen.
5. Ejecutar prueba de carga/uso con archivos grandes en equipo de poca memoria; registrar consumo medido, no supuesto.
6. Solo marcar como integrado tras pasar prueba y registrar atribución; mantener los recursos de terceros fuera de GitHub cuando corresponda.

## Criterio de éxito inmediato

No es “tener cientos de enlaces”, sino demostrar una primera combinación visual útil con piezas separadas y términos compatibles. La próxima prueba más valiosa es inspeccionar localmente **ThinGirlSprite.zip** y **PSDFiles.zip**; si no se pueden acceder en el entorno de trabajo, pedir que se adjunten antes de afirmar que el perfil fue probado. Después, probar un kit CC0 modular (PSRC/Kenney) para aprender de pivotes y extremidades sin comprometer el estilo anime final.
