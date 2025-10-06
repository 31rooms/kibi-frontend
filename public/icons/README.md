# PWA Icons

Esta carpeta debe contener los siguientes iconos para que la PWA funcione correctamente:

## Tamaños Requeridos

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels)
- `icon-192x192.png` (192x192 pixels)
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels)

## Cómo Generar los Iconos

### Opción 1: Herramientas Online
Puedes usar herramientas online para generar todos los tamaños automáticamente:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

### Opción 2: Usando un script
Puedes usar ImageMagick o similar para redimensionar desde un icono base (512x512):

```bash
# Instalar ImageMagick
# Linux: sudo apt-get install imagemagick
# Mac: brew install imagemagick

# Generar todos los tamaños
convert icon-base.png -resize 72x72 icon-72x72.png
convert icon-base.png -resize 96x96 icon-96x96.png
convert icon-base.png -resize 128x128 icon-128x128.png
convert icon-base.png -resize 144x144 icon-144x144.png
convert icon-base.png -resize 152x152 icon-152x152.png
convert icon-base.png -resize 192x192 icon-192x192.png
convert icon-base.png -resize 384x384 icon-384x384.png
convert icon-base.png -resize 512x512 icon-512x512.png
```

## Recomendaciones

- Usa un icono cuadrado como base (512x512 pixels recomendado)
- Asegúrate de que el icono tenga buen contraste
- Usa formato PNG con transparencia si es necesario
- El icono debe ser simple y reconocible en tamaños pequeños
