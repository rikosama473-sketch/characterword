# Imágenes de CharacterWord

Esta carpeta de la rama `main` guarda imágenes que CharacterWord puede distribuir legalmente: arte propio, imágenes generadas para el proyecto y recursos de terceros cuya licencia permita expresamente redistribuir los archivos en este repositorio público.

## Qué se puede guardar aquí

- Bases de cuerpo anime y poses originales.
- Capas PNG/SVG compatibles: rostro, ojos, cabello, torso, brazos, piernas, ropa y accesorios.
- Fondos simples o estilizados creados para CharacterWord.
- Recursos externos únicamente cuando sus términos permiten subir y redistribuir las imágenes.

## Importante: repositorio público

No subas aquí una imagen solo porque puede verse o descargarse gratis de una web. Antes de añadir arte ajeno, comprueba los permisos de redistribución y registra autor, URL y licencia en `manifest.csv`.

**Permiso para usar una imagen y permiso para entrenar una IA son cosas distintas.** El campo `ai_training_permission` debe quedar como `unknown` hasta que se confirme que el autor o la licencia permiten ese uso. No pongas en esta carpeta referencias privadas, imágenes que no puedan redistribuirse, PSD/KRA de pago ni material excluido de conjuntos de entrenamiento.

## Organización sugerida

Guarda los archivos directamente aquí al principio; cuando el catálogo crezca, puedes separarlos en subcarpetas como `bodies/`, `faces/`, `hair/`, `clothes/`, `limbs/`, `poses/` y `backgrounds/`.

Para el ensamblador, prioriza PNG con transparencia, SVG original y capas alineadas en un mismo lienzo. Conserva la resolución fuente; crea derivados de baja resolución por separado en vez de sobrescribir el original permitido.


## Si GitHub rechaza una imagen por tamaño

La subida desde el navegador tiene un límite de **25 MiB por archivo**. Para archivos mayores, hasta 100 MiB, usa un clon local y haz commit/push con Git. Los archivos de más de 100 MiB requieren Git LFS, pero **Git LFS no sirve para entregar recursos de un sitio GitHub Pages**. Para las imágenes que el editor web necesita mostrar, prepara versiones optimizadas PNG/WebP de menos de 25 MiB.

En Windows, para subir archivos de entre 25 y 100 MiB con Git instalado:

```powershell
git clone https://github.com/rikosama473-sketch/characterword.git
cd characterword
# Copia las imágenes autorizadas a .\assets\images\
git add assets/images
git commit -m "Add approved image assets"
git push origin main
```

Si ya tienes un clon local, omite `git clone` y entra en esa carpeta. No subas a un repositorio público imágenes que solo tengas permiso de usar en privado ni uses Git LFS para imágenes que deban servirse desde GitHub Pages. Para el dataset privado de entrenamiento, es preferible guardar los originales fuera del repositorio y publicar solo arte propio o autorizado para redistribución.
