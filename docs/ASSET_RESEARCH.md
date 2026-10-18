# Investigación de recursos gráficos para CharacterWord

**Revisado:** 2026-10-18  
**Objetivo visual:** personaje anime o ilustrado compuesto por capas intercambiables; a largo plazo, permitir seleccionar y mover partes del cuerpo como un muñeco articulado.  
**Estado:** fuentes investigadas; aún no se afirma que ningún paquete se haya integrado o probado dentro de CharacterWord.

## Resultado principal

La mejor dirección es una estrategia de dos fuentes complementarias:

1. **Piezas anime con capas PNG alineadas**, para lograr un aspecto cercano al personaje de una novela visual.
2. **Kits explícitamente modulares y articulados**, para estudiar cómo se separan cuerpo, brazos, piernas, ropa y accesorios, incluso cuando el estilo sea pixel art.

Las capas de ropa, ojos y cabello no garantizan que brazos y piernas sean articulables. En cada paquete hay que comprobar la anatomía y los puntos de unión por separado.

## Candidatos con mejor ajuste

### A. LinXueLian — FBFFFM001 Fullbody Girl 1200px
- Fuente: https://linxuelian.itch.io/customchar-fbfffm001-fullbodyfemale
- Tipo: conjunto de personaje anime femenino de cuerpo completo.
- Formato anunciado: PNG transparente en carpetas numeradas por capas.
- Piezas descritas: base corporal, tonos de piel, cabello, ojos, ropa, accesorios y otras variantes.
- Licencia que muestra la página: **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
- Disponibilidad/estructura confirmada al consultar la página: se presenta como recurso gratuito y ofrece ZIP separados para el cuerpo base (568 kB), cabello, ojos, prendas y accesorios; la página de la autora documenta 124 archivos y carpetas numeradas donde el número inferior se coloca debajo de las demás capas. Es un paquete concreto para empezar a construir el personaje desde piezas reales.
- Ventajas: es la candidata visual más cercana al objetivo; la página indica que sus capas se pueden apilar y combinar con otros paquetes diseñados para la misma base.
- Condiciones: atribuir a la autora y enlazar a la página; conservar el aviso/licencia y revisar las obligaciones ShareAlike antes de publicar modificaciones de las ilustraciones.
- Limitación conocida: todavía no se ha comprobado si brazos, manos, piernas y articulaciones son capas independientes; el énfasis confirmado de la página está en rasgos faciales, tono de piel, cabello, ropa y accesorios. Es excelente candidata para un editor de apariencia anime, pero no se debe prometer todavía marioneta corporal completa.
- Estado: **candidata prioritaria para una prueba local**. No copiar ZIPs ni imágenes al repositorio hasta documentar los términos y comprobar el contenido real.

### B. LinXueLian — HFFF001 Oujousama 700px
- Fuente: https://linxuelian.itch.io/charres-custom-hfff001-ega-ojousama
- Tipo: personaje anime femenino con capas y variaciones, de estética aristocrática.
- Disponibilidad/estructura confirmada: se presenta como recurso gratuito; tiene paquetes ZIP independientes para la base, varias ropas, cabello, blusa y accesorios. La autora indica que los elementos se entregan como PNG transparentes ordenados en carpetas numeradas, y que los paquetes comparten una base diseñada para combinarse cuando visualmente encajan.
- Licencia indicada por la categoría pública de la página: **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**. La página pide enlazar al recurso/autora; conservar atribución y revisar las condiciones ShareAlike antes de publicar versiones modificadas.
- Ventajas: la estructura numérica define el orden de composición; la página indica que las piezas de los paquetes diseñados para la misma base se pueden mezclar si encajan. Es un punto de partida práctico para montar cabeza/cara, cabello y torso con una apariencia anime consistente.
- Condiciones: dar atribución adecuada, enlazar la fuente e indicar cambios cuando corresponda. CC BY 4.0 no es una licencia ShareAlike, a diferencia de la candidata A.
- Limitación: comprobar antes el alcance de cada paquete y que las piezas que se quieran mezclar compartan la misma base.
- Estado: **candidata prioritaria para una segunda prueba**.

### C. LinXueLian — HMLF001 Anime Boy 800px
- Fuente: https://linxuelian.itch.io/customchar-hmlf001-malebust
- Tipo: conjunto de personaje anime masculino para novelas visuales.
- Formato anunciado: PNG en carpetas numeradas por capas; la página describe ropa, cabello, ojos y accesorios combinables entre paquetes de la misma base.
- Licencia que muestra la página: **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
- Ventajas: recurso anime con capas reales y licencia declarada, útil para comprobar si la arquitectura admite varias bases de personajes.
- Limitación: confirmar las proporciones y si la base es busto/medio cuerpo o cuerpo completo, así como la compatibilidad exacta con los conjuntos femeninos. No mezclar piezas entre bases distintas solo porque tengan el mismo estilo.
- Estado: **candidata prioritaria secundaria**.

## Candidatos para la arquitectura, capas y animación

### D. Universal LPC Spritesheet Generator
- Demo: https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
- Repositorio fuente: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator
- Tipo: generador web abierto de personajes pixel art con cuerpo, cabeza, cabello, brazos, torso, piernas, pies, armas y otros slots; permite previsualizar animaciones y exportar spritesheets, piezas y créditos.
- Licencias de arte: mixtas. La herramienta muestra por recurso los autores y las licencias; puede haber OGA-BY, CC-BY-SA, GPL u otras licencias según la pieza.
- Ventajas: referencia técnica muy valiosa para el catálogo de piezas, orden de capas, variantes, animaciones y atribución por archivo.
- Riesgos: no asumir una sola licencia para todas las imágenes. Antes de reutilizar una pieza hay que consultar el crédito exacto de ese recurso. El arte no es anime y el sistema está orientado a sprites pixelados con animaciones por fotogramas.
- Estado: **referencia técnica de alto valor; no copiar todo el paquete de arte como si fuese una unidad CC0**.

### E. LPC Unity Character Creator
- Repositorio: https://github.com/TCLowe1982/LPC-Unity-Character-Creator
- Tipo: implementación de referencia para Unity que construye personajes animados en tiempo de ejecución apilando capas, cambiando equipo y recoloreando paletas.
- Licencia anunciada: el código del paquete es MIT; las ilustraciones LPC siguen sus propias licencias (CC-BY-SA 3.0, GPL 3.0, OGA-BY 3.0 según el archivo) y requieren créditos.
- Ventajas: arquitectura de capas, catálogo/manifiestos, orden de renderizado, animación sincronizada y créditos por archivo.
- Limitación: está hecho para Unity, no es un componente web listo para insertar en CharacterWord. Estudiar patrones o adaptar código solo tras revisar sus licencias y dependencias; no considerar que la licencia MIT del código cambia la licencia del arte.
- Estado: **referencia de implementación y diseño de importador**.

### F. Kenney — Roguelike Characters
- Fuente: https://kenney.nl/assets/roguelike-characters
- Tipo: paquete 2D pixel art; la página declara 450 archivos.
- Licencia que muestra la página: **CC0**.
- Ventajas: condiciones sencillas para reutilización; candidato para validar rápidamente carga de PNG, búsqueda, compositing y el flujo de importación sin una obligación de atribución.
- Limitaciones: estética de pixel art, muy diferente al objetivo anime. La página oficial por sí sola no verifica la anatomía de cada imagen; se debe descargar y comprobar si las piezas disponibles sirven para articulación y qué variantes/orientaciones incluye.
- Estado: **candidato de prueba técnica CC0**, no elegido como estilo principal.

### G. OpenGameArt — Paper Doll Style Sprites
- Fuente: https://opengameart.org/content/paper-doll-style-sprites
- Repositorio relacionado indicado por la página: https://github.com/cmotc/lairart
- Autor indicado: Andrew Friend.
- Tipo: sprites 2D top-down con superposiciones intercambiables para vestir figuras; la página ofrece paquetes separados para figuras, pantalones, zapatos y camisas.
- Licencia que muestra la página: **CC-BY-SA 3.0**.
- Ventajas: está descrito expresamente como un conjunto estilo “paper doll” para superponer prendas de forma intercambiable.
- Limitaciones: arte antiguo, orientado a RPG top-down y no al anime; se debe comprobar el contenido de los ZIP y mantener los créditos y los requisitos ShareAlike.
- Estado: **candidato para validar la idea de ropa por capas**.

## Recursos visualmente próximos, pero con revisión adicional

### H. xG Animation — Student Anime Character, Layered
- Fuente: https://xg-animation.itch.io/student-anime-character
- Tipo: kit de personaje anime, archivo de Illustrator por capas, PNG, seis vistas y formas de boca/expresiones; la página anuncia precio mínimo de USD 3.
- Uso declarado en página: personal y uso comercial limitado.
- Ventaja: varias vistas y capas anatómicas; visualmente más cercano al anime que los kits pixel.
- Condición pendiente: confirmar el texto completo de licencia sobre modificaciones, redistribución, inclusión en aplicaciones y disponibilidad del archivo fuente. No integrar ni redistribuir los archivos de pago mientras eso no esté confirmado.
- Estado: **opción de compra para evaluar; no aprobado para incluir en el repositorio**.

### I. Character Nanka Toka Ki y paquetes BOOTH compatibles
- Ejemplo de herramienta/recursos: https://booth.pm/ja/items/712287
- Tipo: aplicación de composición de piezas para personajes y paquetes de complementos japoneses.
- Ventaja: demuestra que existe un flujo maduro de creación por peinados, ojos, expresiones, vestimenta y accesorios.
- Condición: cada paquete tiene sus propios términos; algunos prohíben la redistribución o la mezcla de sus imágenes en otros personajes. El paquete del enlace es de pago y solicita revisar las condiciones incluidas.
- Estado: **referencia de experiencia de usuario; no tratar las piezas como una biblioteca que se pueda importar libremente**.

## Herramientas auxiliares para conseguir o preparar piezas anime

Estas herramientas no sustituyen la comprobación de licencias del arte de entrada y salida. Se pueden usar para experimentar con imágenes propias o con recursos cuyos términos permitan modificarlos. **No se usarán capturas, ilustraciones o personajes de anime comercial como biblioteca redistribuible sin permiso.**

### O. Anime Image Cutout Studio
- Repositorio: https://github.com/gino07172002/anime-image-cutout-studio
- Licencia del código: **Apache-2.0** según el archivo LICENSE del repositorio.
- Tipo: aplicación de escritorio que separa personajes superpuestos y piezas como cabeza, torso, brazos y piernas; la descripción del proyecto anuncia exportación de PNG transparente, PSD por capas y estructura de esqueleto.
- Utilidad: analizar como herramienta de preparación para ilustraciones propias/licenciadas que estén en una sola imagen.
- Limitación: la licencia del código no autoriza el uso de las imágenes de entrada; revisar por separado licencias de pesos/modelos y dependencias, así como las condiciones de cada obra fuente.
- Estado: **candidato para el flujo de preparación local**, aún no probado en CharacterWord.

### P. Paper Doll Studio
- Repositorio: https://github.com/KhurrumAli1997/paper-doll-studio
- Licencia del código: **Apache-2.0** en el archivo LICENSE del repositorio.
- Tipo: herramienta local para vestir personajes orientada a novelas visuales y juegos narrativos; documenta importación de PSD por capas y segmentación de un PNG para clasificar cabello, rostro, ojos y vestuario, además de exportar activos.
- Utilidad: estudiar cómo transformar una ilustración autorizada en una estructura con ranuras de vestuario.
- Limitación: requiere Python y dependencias/modelos de visión e inpainting de tamaño considerable; no es un widget web ligero y hay que verificar las licencias individuales de modelos/datasets.
- Estado: **herramienta de laboratorio, no dependencia inmediata del editor**.

### Q. SpriteForge
- Repositorio: https://github.com/Wilson-Cheng/SpriteForge
- Licencia del código: **MIT** en LICENSE.
- Tipo: editor en navegador para importar PNG, construir jerarquías de huesos, posar personajes y exportar un paquete Spine JSON. La documentación indica que el trabajo puede hacerse localmente en el navegador.
- Utilidad: referencia técnica para una fase posterior de articulación real, después de que tengamos partes recortadas con pivotes.
- Limitación: no es una biblioteca de arte anime lista para utilizar; revisar el crédito/licencia de cada muestra de arte antes de reutilizarla.
- Estado: **referencia técnica de alto valor**.

### R. Pinkcel — 2D Rigging Online
- Herramienta: https://pinkcel.com/2d-rigging.html
- Tipo: editor de rigging en navegador con huesos, cinemática directa/inversa y deformación de malla; acepta capas separadas o PSD según su página.
- Utilidad: referencia para el tipo de interacción de huesos y poses que podríamos añadir más adelante.
- Limitación: antes de adoptar código, importar arte o depender del servicio, confirmar sus términos de uso y exportación; esta ficha no confirma licencia reutilizable.
- Estado: **referencia funcional solamente**, pendiente de términos.

## Política de incorporación

Antes de incorporar un paquete al repositorio o a una futura versión distribuible:

1. Abrir la página del autor y la licencia; guardar la URL, la fecha de revisión y el nombre exacto del paquete.
2. Verificar la licencia de los archivos gráficos, no solo la del código o del repositorio.
3. Inspeccionar un archivo ZIP localmente: estructura de carpetas, PNG con transparencia, dimensiones, alineación, orden de capas y pivotes.
4. Separar categorías: cuerpo, cabeza, ojos, cejas, boca, cabello trasero/delantero, torso, brazos, manos, piernas, pies, prendas, armas y accesorios.
5. Probar combinaciones para comprobar si los sprites comparten coordenadas y proporciones.
6. Registrar autores, licencia, URL de origen, cambios hechos y aviso de licencia junto a cada paquete. En paquetes con créditos por recurso, conservar el archivo original de créditos y crear un manifiesto acotado con los elementos usados.
7. Mantener los activos comerciales o con licencia incierta fuera del repositorio público hasta tener autorización clara. No basta con enlazar a una descarga gratuita para asumir permiso de redistribución.

### J. OpenGameArt — Free CC0 Modular Animated Vector Characters 2D
- Fuente: https://opengameart.org/content/free-cc0-modular-animated-vector-characters-2d
- Autor indicado: rgsdev.
- Licencia publicada: **CC0**; la página indica que no hace falta crédito.
- Tamaño del ZIP anunciado: 72.7 MB; canvas de sprites de 2048×2048.
- El autor indica que contiene partes corporales separadas y animadas, seis animaciones (idle, walk, roll, jump, hit, death), variantes de cabezas, pelo, ojos, cuernos y bocas, además de alas, armas y personajes precompuestos.
- Ventajas: es la coincidencia más clara encontrada para validar técnicamente la recomposición y animación de piezas con condiciones de uso simples. Las piezas blancas están pensadas para colorearse en el motor.
- Limitación: estilo cartoon/vectorial, no anime. La página afirma que las partes son separadas y animadas, pero aún no comprobamos si cada articulación puede moverse libremente o si las poses disponibles son animaciones predefinidas.
- Estado: **prioridad para una prueba de articulación**, no estilo artístico final.

### K. Kenney — Modular Characters
- Fuente: https://kenney.nl/assets/modular-characters
- Tipo: paquete de personajes 2D; la página oficial anuncia 425 archivos y licencia **CC0**.
- Ventajas: opción de bajo riesgo de licencia para evaluar otro catálogo modular.
- Limitación: la página de resumen no detalla por sí sola los puntos de unión ni qué partes son movibles. Descargar/inspeccionar antes de marcarlo como articulable.
- Estado: **candidato para inspección del paquete**.

## Código de referencia para un editor propio

### L. pjanaya — 2D Character Creator (web)
- Demo: https://pjanaya.github.io/2d-character-creator/
- Repositorio: https://github.com/pjanaya/2d-character-creator
- Licencia de código publicada: MIT.
- Tipo: framework web de configuración de personajes 2D. Usa un catálogo externo de imágenes y configura colores, tipos de piezas y combinaciones en archivos TypeScript.
- Ventajas: es la referencia más directa para un editor de navegador con biblioteca de piezas, opciones de color y variantes.
- Limitaciones: no trae una biblioteca de ilustraciones propia y no demuestra por sí solo un sistema de huesos/articulaciones. Confirmar la versión, dependencias y estado actual antes de adoptar código.
- Estado: **primera referencia para estudiar la interfaz web y el catálogo**.

### M. uglycygnet — Modular Character Prototype
- Repositorio: https://github.com/uglycygnet/character_creator
- Licencia de código publicada: MIT.
- Tipo: prototipo LÖVE2D con esqueleto jerárquico, huesos, uniones, animación idle/walk y controles para rotar hombros y codos.
- Ventajas: explica una tubería de cutout: piezas PNG transparentes conectadas mediante pivotes, con brazos y piernas separados. El README da convenciones prácticas para anclas y tamaños.
- Limitaciones: es una app LÖVE2D/Lua, no una librería web lista para insertar y no aporta una colección de arte final.
- Estado: **referencia conceptual para la articulación**.

### N. rhedak — Anime Character Creator
- Repositorio: https://github.com/rhedak/anime-character-creator
- Licencia del código publicada: MIT.
- Tipo: generador que dibuja personajes anime estilizados mediante formas SVG paramétricas, en lugar de componer piezas artísticas preexistentes.
- Ventajas: alternativa de estudio cuando falten recursos gráficos compatibles; usa anclas proporcionales para mantener coherencia entre cabeza, torso, miembros, pelo y ropa.
- Limitaciones: su propio README declara que la animación está fuera de alcance y su estilo actual es tall-chibi. La licencia del código no debe confundirse con las condiciones aplicables a referencias, imágenes o salidas concretas.
- Estado: **alternativa de generación procedural, no sustituto del kit de piezas**.

## Conclusión provisional

La primera prueba de arte debería usar **FBFFFM001** para evaluar capas anime de cuerpo completo y **HFFF001** para comparar un conjunto con licencia CC BY 4.0. En paralelo, estudiar LPC para la arquitectura de slots y la contabilidad de créditos. Esta combinación prueba tanto la estética como el problema técnico sin confundir capas de ropa con articulaciones reales.

No se han descargado ni incorporado paquetes gráficos en este cambio. El siguiente paso es una prueba local y pequeña para confirmar compatibilidad antes de elegir un estándar de importación.
