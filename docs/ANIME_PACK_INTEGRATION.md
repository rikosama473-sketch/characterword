# Recursos gráficos de waifus, femboys andróginos y chibi en CharacterWord

**Revisión de fuentes:** 18 de octubre de 2026  
**Proyecto:** CharacterWord, independiente de WordWaifu  
**Estado:** los ZIP base de FBFFFM001 y HFFF001 fueron descargados e inspeccionados anteriormente. La página oficial de HMLF001 fue revisada y se agregó un perfil de importación para su lienzo anunciado de 600 × 800; sus ZIP aún no se han extraído e inspeccionado localmente. CharacterWord no incorpora ni redistribuye los ZIP de terceros.

## Resultado importante

Ambos paquetes son recursos anime útiles para personalizar un sprite completo, pero **no contienen cabeza, torso y brazos recortados como piezas anatómicas independientes**. Sus imágenes de cuerpo base y los detalles faciales se superponen dentro de un lienzo transparente de dimensiones fijas. Por eso, CharacterWord ahora ofrece un modo de “Base anime / waifu” que conserva la alineación de las capas y lo mantiene separado del modo provisional articulable.

## 1. FBFFFM001 — Customizable Full-body Girl

- Página original: https://linxuelian.itch.io/customchar-fbfffm001-fullbodyfemale
- Autora: LinXueLian
- Licencia indicada en la ficha pública: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
- Atribución solicitada por la autora: enlazar la página del paquete o linxuelian.itch.io.
- ZIP inspeccionado: `FBFFFM001_000_BASE_BODY.zip`, 582,585 bytes (aprox. 568 kB).
- Estructura: 30 entradas ZIP: 27 PNG y `INFO.txt`, organizados en tres carpetas numeradas.
- Formato visual: PNG RGBA con transparencia, todas las imágenes revisadas de 800 × 1200 píxeles.
- Contenido comprobado:
  - `00_BODYBASE`: 9 variaciones — Chocolate, Light y Mocha, cada una en versión plain, Blush y Darken.
  - `01_MOUTHS`: 5 variantes de boca — Blah, Laugh, Smile, Talk y Upturned.
  - `03_BROWS`: 12 variantes de cejas — Angry, Normal y Sad, en Black, Blonde, Brown y Grey.
- El `INFO.txt` confirma el orden de capas: el número de carpeta menor queda debajo de los números mayores.
- **Nota de conteo:** el resumen de inspección reportó 27 PNG en total, pero los recuentos identificados por carpeta suman 26 (9 + 5 + 12). También hay una diferencia de una entrada al sumar el total ZIP reportado. No asigno el PNG restante a ninguna categoría sin revisar su ruta exacta. El importador ZIP en CharacterWord enumera los archivos reales al cargar el archivo.
- **No hay recortes independientes de cabeza, torso, brazo superior o antebrazo** en este ZIP. Es una base de cuerpo completo y expresiones superpuestas.
- El conjunto que aparece en la página también ofrece paquetes separados de cabello, ojos, prendas y accesorios. Cada paquete adicional debe descargarse de la página original y validarse con el importador de dimensiones antes de usarlo.

## 2. HFFF001 — Customizable Oujou Portraits / Oujousama

- Página original: https://linxuelian.itch.io/charres-custom-hfff001-ega-ojousama
- Autora: LinXueLian
- Licencia indicada en la ficha pública: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
- Atribución solicitada por la autora: enlazar la página del paquete o linxuelian.itch.io.
- ZIP inspeccionado: `HFFF001_OJOU_00_BASE_ESSENTIALS.zip`, 349,370 bytes (aprox. 341 kB).
- Estructura: 19 entradas ZIP: 16 PNG y `INFO.txt`, organizados en tres carpetas numeradas.
- Formato visual: PNG RGBA con transparencia, todas las imágenes revisadas de 537 × 700 píxeles.
- Contenido comprobado:
  - `00_BASE_BODY`: 5 variaciones de cuerpo — Damphir, Olive, Peachy, Sunny y Wheat.
  - `01_FACE_AND_MAKEUP`: 2 capas — Blush Deep Pink y Sweatdrop.
  - `02_MOUTH`: 8 capas — variantes Closed, Laugh, Smile y Speaking, incluidas variantes Redlipped.
- El `INFO.txt` confirma el apilado por carpetas numeradas, con número menor debajo.
- **Nota de conteo:** el resumen de inspección reportó 16 PNG en total, pero los recuentos identificados por carpeta suman 15 (5 + 2 + 8). También hay una diferencia de una entrada al sumar el total ZIP reportado. No asigno el PNG restante a ninguna categoría sin revisar su ruta exacta. El importador ZIP en CharacterWord enumera los archivos reales al cargar el archivo.
- **No hay recortes independientes de cabeza, torso o brazos** en este ZIP. El contenido es una base completa con overlays faciales.
- La página ofrece paquetes adicionales de cabello, ropa y accesorios para esa misma base; deben mantenerse separados de FBFFFM001.

## 3. HMLF001 — Customizable Anime Boy (busto masculino)

- Página original: https://linxuelian.itch.io/customchar-hmlf001-malebust
- Autoría: LinXueLian.
- Licencia indicada en la ficha pública: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0); la autora pide enlazar la página del recurso o su perfil.
- Dimensiones anunciadas por la página: 600 × 800 px. Esto se registró desde la descripción publicada, no mediante inspección local de todos los ZIP.
- La página anuncia sprites PNG transparentes en carpetas numeradas; el número de carpeta menor queda debajo del mayor. Indica que algunas piezas de cabello, ropa, ojos y accesorios de los distintos paquetes HMLF001 se pueden combinar cuando encajan visualmente.
- ZIPs que aparecen en la página: `HMLF001_BASE_BODY.zip` (358 kB), `HMLF001_WARLOCK.zip` (3.9 MB), `HMLF001_SHOPKEEPER.zip` (2.3 MB), `HMLF001_HeavyScarf.zip` (1.7 MB), `HMLF001_Kawamuru_Hair.zip` (3.8 MB) y `HMLF001_VAMPIRE_CONFIG.zip` (202 kB). La bitácora de la página describe tres tonos de piel y nueve archivos para la adición de base; no se cuenta aquí como una inspección independiente del ZIP.
- **Alcance visual:** es una base masculina vertical de busto/retrato; no se anuncia ni se ha comprobado que entregue cabeza, torso, brazos y antebrazos como piezas anatómicas independientes. No se debe describir como un cuerpo completo articulado.
- **Estado técnico:** CharacterWord ahora ofrece un perfil HMLF001 separado y exige 600 × 800 píxeles para sus imágenes. Esto es una configuración por metadatos públicos; todavía falta importar en una sesión real el ZIP base, añadir una capa de un segundo ZIP, exportar y volver a abrir un proyecto para comprobar el flujo completo.
- **No mezclar capas HMLF001 con FBFFFM001 (800 × 1200) ni HFFF001 (537 × 700)**. Cada base tiene su propio lienzo y proporciones.

## Uso en CharacterWord

1. Abre https://rikosama473-sketch.github.io/characterword/.
2. En **Base anime / waifu**, selecciona FBFFFM001, HFFF001 o HMLF001 según el ZIP que vas a importar. No mezcles archivos entre conjuntos.
3. Descarga el ZIP base desde la página original y pulsa **Importar ZIP original**; el editor lo abre localmente sin que tengas que extraerlo. El lector ZIP está incluido en CharacterWord y no sube nada al servidor.
4. En la biblioteca, elige **una sola** variante de cuerpo base:
   - FBFFFM001: una opción de `00_BODYBASE`, 800 × 1200.
   - HFFF001: una opción de `00_BASE_BODY`, 537 × 700.
5. En la misma biblioteca, pulsa **Añadir capa** en una boca, ceja o capa facial que quieras. En HMLF001, después de seleccionar la base, puedes importar otros ZIP de HMLF001 uno por uno y añadir las capas que coincidan con 600 × 800. En FBFFFM001/HFFF001, usa solo archivos de la misma base y dimensiones.
5. Las capas importadas aparecen en la lista: puedes ocultarlas, reordenarlas, eliminarlas y conservar el proyecto JSON. La herramienta rechaza imágenes con otras dimensiones para evitar desalinearlas.
6. Para usar cabello, ropa u otros paquetes adicionales que se descarguen de la página original, aplica la misma regla: sólo si sus PNG mantienen el lienzo y las coordenadas de la base seleccionada.

Las imágenes extraídas del ZIP se mantienen en la memoria del navegador mientras exploras la biblioteca; solo el cuerpo base y las capas que eliges pasan al proyecto local. El ZIP original no se sube a un servidor ni se copia al repositorio. El proyecto guardado conserva la composición y una nota de atribución CC BY-SA 4.0.

## Modos separados

- **Muñeca provisional por piezas:** permite mover el dibujo de muestra y experimentar con cabeza, torso, brazos y antebrazos por separado.
- **Base anime / waifu:** combina PNG de lienzo completo o de busto con overlays del mismo modelo. FBFFFM001, HFFF001 y HMLF001 conservan sus capas de apariencia, pero no habilitan movimiento anatómico individual si la fuente no entrega piezas recortadas.

Para conseguir el siguiente nivel de articulación se necesitará un paquete de arte que proporcione extremidades separadas, o un flujo de segmentación/corte local de una ilustración cuya licencia permita realizar esas modificaciones. La segmentación automática no puede considerarse perfecta sin inspección manual.
