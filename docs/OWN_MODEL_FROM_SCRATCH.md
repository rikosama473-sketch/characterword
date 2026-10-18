# Especificación inicial: generador anime propio desde cero

**Proyecto:** CharacterWord, independiente de WordWaifu  
**Estado:** especificación de I+D, todavía no es un modelo entrenado  
**Objetivo:** un generador pequeño y especializado que cree cuerpos/personajes anime de baja resolución; no un checkpoint general de terceros.

## Decisión de producto

No usar como modelo base Haruka v2, SDXL, Stable Diffusion ni otro checkpoint de generación preentrenado. No usar DMD2 ni destilación desde un modelo docente para definir el generador central. No tratar un LoRA como modelo autónomo: un LoRA son pesos adaptadores para una arquitectura/modelo base compatible y no cumple el requisito de generador independiente.

Las 100 imágenes que el usuario espera reunir serán **datos para entrenar desde inicialización aleatoria**, no un LoRA. Serán un piloto de investigación, no garantía de calidad ni diversidad.

## Salida prevista

- Dominio restringido: cuerpos/personajes anime, sin escenas generales ni composición arbitraria.
- Primer tamaño: 64×96 píxeles; expansión experimental a 128×192 solo si el prototipo conserva coherencia y pasa el presupuesto de memoria.
- Canal de salida: RGBA/alpha cuando la arquitectura lo permita; alternativa inicial con fondo plano sencillo y proceso separado de máscara si producir alpha directamente sale mal.
- Variaciones objetivo: silueta/proporción, pose limitada, cabello, prendas, piernas/calzado y paleta.
- Interfaz: opciones/presets y semilla reproducible; no se exige comprensión de lenguaje natural en la primera versión.
- Publicación del motor: pequeño, local y centrado en bajo consumo, independiente de cualquier servicio de inferencia externo.

## Arquitectura inicial que vamos a comprobar

No se decide calidad sin entrenar un prototipo. Comparar dos modelos modestos, ambos inicializados al azar:

1. **GAN convolucional condicional pequeño:** propone generar una imagen de cuerpo de baja resolución a partir de un vector latente y controles discretos etiquetados (p. ej., pose/tipo de cuerpo/paleta). Ventaja: generación rápida tras entrenar. Riesgo: inestabilidad, colapso de modos y dificultad para aprender mucha variedad con solo 100 ejemplos.
2. **VAE convolucional pequeño:** baseline más sencillo que puede aprender una representación latente y generar muestras. Ventaja: entrenamiento relativamente directo; riesgo: resultados borrosos o demasiado promedio.

No son modelos ya entrenados ni checkpoints descargados. Código de entrenamiento propio y librerías generales pueden emplearse, pero pesos de modelo de terceros no son el fundamento del generador. Se elegirá solo después de comparar: coherencia anatómica, diversidad real, memoria pico y tiempo por imagen.

### Límite de los datos

100 imágenes completas pueden ayudar a comprobar el flujo de entrenamiento, pero son pocas para aprender de manera robusta un espacio anime flexible. Hay riesgo de memorizar ejemplos, repetir poses y deformar manos, articulaciones o prendas. Aumentaciones simples (espejo si la imagen lo permite, cambios leves de escala, desplazamiento y color) no sustituyen ejemplos nuevos ni arreglan errores anatómicos.

Para entrenar control modular de cabello/ropa/piernas, la mejor evidencia de datos será una colección de capas PNG/SVG alineadas con etiquetas de pieza, pose y punto de anclaje. Si solo se dispone de personajes completos, se debe presentar el primer modelo como generador de imágenes completas, no como generador de piezas intercambiables.

## Memoria y hardware

El objetivo de 2 GB es un requisito a medir en la versión de inferencia/ejecución, no una garantía previa. Medir por separado:
- RAM máxima del proceso al iniciar/cargar pesos;
- RAM pico por generación;
- memoria gráfica/VRAM si hay GPU;
- tiempo por muestra en CPU y GPU;
- tamaño del modelo almacenado;
- consumo de la interfaz web por separado del proceso de inferencia.

La fase de entrenamiento usa otro presupuesto. Se puede entrenar en una máquina distinta y luego exportar un modelo pequeño cuantizado, pero la versión final solo se acepta tras probarla con el hardware objetivo. No se debe declarar “funciona con 2 GB” basándose solo en el tamaño del archivo del modelo.

## Papel de la biblioteca gráfica (prioridad actual)

Antes de entrenar, conseguir imágenes y piezas reutilizables con licencias/permiso claros. Registrar fuente, autor, URL, licencia, fecha, restricción de modificaciones, redistribución y entrenamiento IA en campos separados. Un recurso aprobado para un editor o videojuego no queda automáticamente aprobado para entrenamiento.

Prioridad de investigación:
1. piezas transparentes anime con capas y lienzo alineado;
2. bases de cuerpo/pose reutilizables y partes anatómicas independientes;
3. ropa, cabello, extremidades y accesorios específicos para esas bases;
4. permiso específico para uso de aprendizaje automático cuando la fuente no lo autoriza claramente;
5. prueba de ensamblaje local de cada paquete antes de declararlo integrado.

**Thin Girl:** no añadirlo al dataset de entrenamiento. La autora declara que esos gráficos no están autorizados para conjuntos de datos de IA. Solo considerar los usos de capas que permita la licencia pública y respetando atribución, o pedir permiso independiente.

## Puertas de aceptación para el primer modelo

- El dataset tiene archivos con licencia/permiso de entrenamiento registrado y etiquetas básicas; ninguna imagen sin procedencia.
- Existe división de entrenamiento/validación y un conjunto de pruebas que no se utiliza durante el entrenamiento.
- Se publica el conjunto de muestras generado de forma interna para inspección visual, sin afirmar calidad basándose en un único resultado.
- Se evalúan memorizar/copiar ejemplos, diversidad de poses, anatomía, errores de silueta y obediencia a controles.
- El modelo puede generar más de una composición plausible; no se aceptan solo variaciones de color de las mismas siluetas.
- Memoria y latencia se miden en hardware especificado.
- El archivo de pesos final no depende de la carga de un checkpoint ajeno para producir imágenes.

## Próximo paso concreto

No entrenar todavía. Primero completar la adquisición y prueba de piezas gráficas y verificar las 100 imágenes candidatas para saber si representan cuerpos completos, capas separadas y suficientes variaciones. Después construir el pequeño pipeline de datos y un test reproducible de entrenamiento; el primer resultado es una prueba de viabilidad, no una promesa de ilustración profesional.
