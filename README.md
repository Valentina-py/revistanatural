# Orán Natural — Revista interactiva de las Yungas salteñas

Revista digital editorial sobre **San Ramón de la Nueva Orán** (Salta, Argentina).
Todo el contenido proviene de los documentos de `Revista - Romina/Revista Natural/`.

## Stack
- HTML5 semántico
- CSS3 (variables, CSS Grid asimétrico, `clamp()` fluido, `color-mix`)
- JavaScript Vanilla modular (ES6 `import`/`export`)

## Arquitectura de archivos
```
sitio-web/
├── index.html              # Maquetación base / portada
├── css/
│   └── main.css            # Variables de color + grilla editorial + animaciones
├── js/
│   ├── data.js             # Datos extraídos de los PDFs (única fuente de verdad)
│   └── interactivity.js    # Render + filtrado de circuitos + scroll-driven FX
└── assets/
    └── img/                # Imágenes (ver mapeo abajo)
```

## Rendimiento
- `loading="lazy"` + `decoding="async"` en todas las imágenes.
- Scroll reveal con **IntersectionObserver** (`unobserve` tras revelar).
- Parallax y barra de progreso con **requestAnimationFrame**, animando **solo
  `transform`/`opacity`** → compositor de GPU, sin *layout thrashing*.
- Respeta `prefers-reduced-motion`.

## Cómo ejecutar
Usa módulos ES6, así que requiere servidor (no abrir con `file://`):
```bash
cd sitio-web
python -m http.server 8000     # o: npx serve
# abrir http://localhost:8000
```

## Imágenes
Las imágenes se **extrajeron automáticamente de los PDFs** con `extract_images.py`
(PyMuPDF) y ya están en `assets/img/`. Mapeo:

| Archivo               | Foto original                         |
|-----------------------|---------------------------------------|
| `portada-yungas.png`  | Camino de tierra roja en la selva (hero / Río Blanco) |
| `yaguarete.png`       | Yaguareté                             |
| `maracana.png`        | Maracaná de cuello dorado             |
| `tapir.png`           | Tapir                                 |
| `tucan.png`           | Tucán                                 |
| `dorado.png`          | Dorado (pez)                          |
| `espatula.png`        | Espátula rosada                       |
| `pato.png`            | Pato criollo                          |
| `pava.png`            | Pava de monte                         |
| `garza.png`           | Garza blanca                          |
| `yacare.png`          | Yacaré overo                          |
| `ranita.png`          | Ranita marsupial                      |
| `kayak.png` / `kayak2.png` | Travesías en kayak (Río Bermejo) |
| `mapa.png`            | Mapa de la región                     |

Para regenerarlas: `python extract_images.py`

## Edición impresa (revista en papel / PDF)
`css/print.css` (cargado con `media="print"`) convierte la web en una **revista A4
paginada**: portada a página completa, cada sección en su hoja, colores e imágenes
preservados, numeración de página y sin elementos de interfaz. Botón flotante
**🖨️ Imprimir revista** o `Ctrl+P` → *Guardar como PDF*.

## Circuitos turísticos (4)
Náutico (Bermejo/Pescado) · Selva de Montaña (Río Blanco) · Senderismo (Pintascayo)
· Conexión con el Parque Nacional Baritú. Filtrables por aventura, pesca,
ecoturismo y senderismo.

## Flora
Los documentos **no incluyen fotos de cada árbol**, así que cada especie se muestra
como **lámina ilustrada** (icono botánico + color) y la sección abre con un banner
real de la **selva de Yungas** (`selva-cascada.png`).

## Toques interactivos / "divertidos"
- Portada con **imagen real**, título con **degradado animado**, **emojis flotantes**
  y un **ticker** de curiosidades en bucle.
- **Contador animado** (270 km) al entrar en pantalla.
- Galería de fauna con **badges de emoji**, hover *lift* y zoom.
- Tarjetas de circuito con **foto de cabecera** y emoji.
- Iconos de conservación que reaccionan al hover.
