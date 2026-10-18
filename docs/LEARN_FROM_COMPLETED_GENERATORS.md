# Lecciones de generadores que ya fueron implementados

**Proyecto:** CharacterWord — independiente de WordWaifu  
**Revisado:** 2026-10-18  
**Uso:** investigación técnica; no implica importar código, pesos, imágenes ni datasets.

## Conclusión ejecutiva

Sí: hay que aprender de proyectos ya implementados. Podemos aprovechar ideas, técnicas de entrenamiento, métricas y lecciones de errores sin adoptar un checkpoint preentrenado. Debemos separar cuatro elementos: arquitectura/idea, código fuente, pesos del modelo y material gráfico/datasets. Cada uno tiene condiciones distintas.

Los ejemplos muestran que unas 100 ilustraciones completas serán **un piloto de viabilidad**, no una promesa de variedad y calidad. SpriteGAN informa 4.272 imágenes de personajes seleccionadas de 16.627 sprites; StyleGAN2-ADA describe avances con unos pocos miles de imágenes. No he encontrado evidencia fiable de que 100 cuerpos anime completos basten para aprender anatomía compleja, ropa y poses diversas desde cero. [SpriteGAN](https://github.com/thomasg8/SpriteGAN) · [StyleGAN2-ADA](https://github.com/NVlabs/stylegan2-ada-pytorch).

## 1. SpriteGAN — sprites de personajes a 32×32

Repositorio: https://github.com/thomasg8/SpriteGAN

- Su artículo describe un GAN convencional para sprites de 32×32 RGB.
- El conjunto indicado contiene 4.272 sprites de personajes, seleccionados de 16.627 imágenes CC0 procedentes de 284 colecciones de OpenGameArt.
- Aplicaron detección de casi duplicados por similitud estructural (SSIM) y recorte guiado por bordes antes de reducir las imágenes.
- El código del repositorio figura como Apache-2.0.

**Lección útil:** la curación del dataset —eliminar duplicados, alinear/cortar y normalizar tamaños— es tan importante como la arquitectura. No necesitamos incorporar su código ni su dataset para adoptar ese método; no se ha importado ningún archivo del proyecto.

## 2. Conditional Pokémon Sprite Generator — estabilidad y control

Repositorio: https://github.com/lambders/pokemon-sprite-generator

- El autor presenta una arquitectura híbrida AAE/CAE/AEGAN y controles por categoría.
- El README indica que su entrenamiento desde cero tomó aproximadamente nueve días en una RTX 2080.
- El autor explica que una pérdida de reconstrucción ayudó con la estabilidad y que Conv2D + upsampling redujo artefactos de tablero respecto a convoluciones transpuestas; también señala el valor de paletas y etiquetas.

**Lección útil:** comparar un GAN pequeño con reconstrucción supervisada; usar upsampling explícito si aparecen artefactos de tablero; empezar con controles discretos, no lenguaje natural. El repositorio usa Pokémon y no declara claramente una licencia en la página revisada: no reutilizar su código, pesos, datos ni sprites sin permiso.

## 3. MDIGAN Characters — completar vistas del mismo personaje

Repositorio: https://github.com/fegemo/mdigan-characters/  
Demo: https://fegemo.github.io/mdigan-characters/

Trabajo publicado en SBGames 2024. El método completa vistas de un personaje usando imágenes emparejadas de espalda, izquierda, frente y derecha. Su README describe imágenes de 64×64 con cuatro canales, batch de 4 y pérdidas configurables de reconstrucción L1, dominio y similitud estructural.

**Lección útil:** para completar una pose de un personaje conocido, un modelo condicionado a vistas alineadas puede ser más realista que generar una identidad completa desde ruido. No es un generador libre de personajes; es una tarea de imputación/completado de vistas. No se vio una licencia general explícita en la lista de archivos revisada, de modo que no copiamos código ni datasets.

## 4. Anime Face Generation DCGAN — 64×64

Repositorio: https://github.com/PD-Mera/Anime-Face-Generation-DCGAN

Implementa DCGAN y LSGAN para rostros anime de 64×64, no cuerpos completos. El README informa un FID mínimo de 88,75 para DCGAN en la época 355 y 89,69 para LSGAN en la época 128. Estos datos son una referencia del propio repositorio, no prueba de calidad visual alta ni una comparación que debamos asumir sin reproducir.

**Lección útil:** construir un baseline pequeño y guardar muestras/métricas por época. No usar sus checkpoints como base del generador CharacterWord ni aceptar automáticamente su dataset.

## 5. Tiny Diffusion — anime de baja resolución

Repositorio: https://github.com/imranpollob/tiny-diffusion

Su implementación educativa entrena rostros anime de 64×64; el README recomienda batch 32–64 con 8 GB de VRAM y describe entrenamientos de horas.

**Lección útil:** revisar un ciclo completo de entrenamiento y muestreo; pero sus requisitos publicados no prueban que quepa en nuestro objetivo de inferencia de 2 GB de RAM. No es DMD2 y no será el modelo central de CharacterWord. Es solo referencia técnica.

## 6. StyleGAN2-ADA — problemas con pocos datos

Repositorio: https://github.com/NVlabs/stylegan2-ada-pytorch  
Artículo: https://arxiv.org/abs/2006.06676

Propone el aumento adaptativo del discriminador para limitar su sobreajuste con datasets pequeños. Los autores reportan resultados con unos pocos miles de imágenes; no prometen resultados equivalentes con 100. La implementación tiene una licencia NVIDIA con restricciones de uso a investigación/evaluación no comercial.

**Lección útil:** tratar el sobreajuste como un riesgo principal y probar augmentations de forma controlada. Para CharacterWord consultamos el artículo como referencia conceptual; no copiamos el código ni usamos los pesos preentrenados.

## 7. PyTorch DCGAN — bucle de entrenamiento clásico

Tutorial: https://docs.pytorch.org/tutorials/beginner/dcgan_faces_tutorial.html

Explica generador, discriminador y ciclos de actualización; advierte que las GAN pueden ser inestables y sufrir colapso de modos.

**Lección útil:** guardar cuadrículas de muestras de forma regular, mantener validación independiente, fijar semillas y comprobar si la red repite la misma pose o silueta.

## 8. Mini Image Gen — pipeline diminuto sobre formas sintéticas

Repositorio: https://github.com/awaisshah228/mini-image-gen

Entrena desde cero un modelo de aproximadamente dos millones de parámetros con formas geométricas sintéticas de 16×16 en CPU. Es una buena demostración educativa de un pipeline mínimo, pero no de aprendizaje de anatomía anime, cuerpos ni ropa.

**Lección útil:** validar primero lectura de datos, entrenamiento, checkpoints y muestreo con arte sintético propio. Eso solo prueba la infraestructura.

## Aplicación práctica en CharacterWord

1. **Seguir buscando piezas gráficas primero:** cuerpos, cabello, ropa, brazos y piernas separados, con transparencia y coordenadas compatibles. La biblioteca sigue siendo el objetivo inmediato.
2. **Curar las imágenes:** registrar URL, autor, licencia, permiso de entrenamiento IA, dimensión, alfa, pose, tipo corporal y etiquetas. Acceso público no es permiso automático.
3. **Probar 100 imágenes sin prometer calidad:** generar una primera cuadrícula de muestras, medir repetición y sobreajuste. Si no aprende variedad, conseguir más imágenes autorizadas o estrechar el dominio de salida.
4. **Control de rasgos:** para alternar cabello, ropa y piernas de forma independiente convienen datos por capas, etiquetas de partes o múltiples salidas. Las imágenes completas por sí solas no proporcionan automáticamente ese control.
5. **Memoria medida:** la meta de 2 GB se verifica en el proceso de inferencia real; la memoria de entrenamiento se registra por separado.
6. **No mezclar permisos:** una licencia para usar gráficos en un juego no autoriza necesariamente entrenar IA; una licencia de código tampoco autoriza las imágenes o pesos incluidos en un repo.

## Decisión

Los proyectos existentes sirven como fuentes de aprendizaje, no como sustitutos del generador propio. La ruta más honesta es comenzar con un baseline pequeño, reproducible y limitado; validar el pipeline; y después invertir en una colección de piezas e imágenes de entrenamiento con procedencia y permisos claros. Este informe no declara ningún modelo como entrenado ni ningún paquete como integrado.
