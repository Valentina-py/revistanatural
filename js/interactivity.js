/*! Diseño y desarrollo web © 2026 Nahara Baudino. Todos los derechos reservados.
    Prohibida la copia, distribución o reutilización del código sin autorización. */
/* ============================================================================
   interactivity.js — Orquestador modular (ES6) de la revista.
   Responsabilidades:
     · Renderizar contenido desde data.js (fauna, flora, circuitos, etc.)
     · Filtrado interactivo de circuitos turísticos
     · Animaciones scroll-driven EFICIENTES (IntersectionObserver + rAF),
       evitando layout thrashing (solo se animan transform/opacity).
   Cada bloque es una función init* independiente → fácil de mantener/extender.
   ========================================================================== */

import {
  CIRCUITOS, FILTROS, FAUNA, FLORA, CONSERVACION, CURIOSIDADES,
  SUMARIO, QUIZ, SABIAS, SOPA_PALABRAS,
} from './data.js';

/* Pequeño helper para crear elementos con propiedades + hijos. */
const el = (tag, props = {}, children = []) => {
  const node = Object.assign(document.createElement(tag), props);
  for (const child of [].concat(children)) {
    if (child != null) node.append(child);
  }
  return node;
};

/* ============================ 0. ÍNDICE / SUMARIO ============================ */
function initSumario() {
  const cont = document.getElementById('lista-sumario');
  if (!cont) return;

  const frag = document.createDocumentFragment();
  for (const s of SUMARIO) {
    const link = el('a', { className: 'sumario__link', href: s.ancla }, [
      el('span', { className: 'sumario__num', textContent: s.num, 'aria-hidden': 'true' }),
      el('span', { className: 'sumario__body' }, [
        el('h3', { className: 'sumario__name', textContent: s.nombre }),
        el('p', { className: 'sumario__desc', textContent: s.desc }),
      ]),
      el('span', { className: 'sumario__arrow', textContent: '→', 'aria-hidden': 'true' }),
    ]);

    const item = el('li', { className: 'sumario__item' }, [link]);
    item.setAttribute('data-reveal', '');
    frag.append(item);
  }
  cont.append(frag);
}

/* ============================ 1. GALERÍA DE FAUNA ============================ */
function initFauna() {
  const cont = document.getElementById('galeria-fauna');
  if (!cont) return;

  const frag = document.createDocumentFragment();
  for (const f of FAUNA) {
    const card = el('figure', {
      className: 'fauna-card' + (f.destacado ? ' fauna-card--destacado' : ''),
    });

    // Imagen con lazy loading nativo (rendimiento). Si falla, queda el degradado CSS.
    const img = el('img', {
      className: 'fauna-card__img',
      src: f.img,
      alt: `${f.nombre} (${f.cientifico})`,
      loading: 'lazy',
      decoding: 'async',
    });
    img.addEventListener('error', () => img.remove(), { once: true });
    // Encuadre personalizado (p. ej. fotos verticales que deben mostrar la cabeza)
    if (f.posicion) img.style.objectPosition = f.posicion;

    const badge = el('span', {
      className: 'fauna-card__badge',
      textContent: f.grupo,
    });

    const body = el('figcaption', { className: 'fauna-card__body' }, [
      el('h3', { className: 'fauna-card__name', textContent: f.nombre }),
      el('span', { className: 'fauna-card__sci', textContent: f.cientifico }),
      el('p', { className: 'fauna-card__text', textContent: f.texto }),
    ]);

    card.append(img, badge, body);
    card.setAttribute('data-reveal', '');
    frag.append(card);
  }
  cont.append(frag);
}

/* ============================ 2. LISTA DE FLORA ============================ */
function initFlora() {
  const cont = document.getElementById('lista-flora');
  if (!cont) return;

  const frag = document.createDocumentFragment();
  FLORA.forEach((planta, i) => {
    // Cabecera con FOTO real del árbol + emoji y etiqueta superpuestos.
    const lamina = el('div', { className: 'flora-item__lamina' }, [
      el('span', { className: 'flora-item__habito', textContent: planta.habito }),
    ]);
    lamina.dataset.acento = String(i % 4); // color de respaldo si falta la foto

    if (planta.img) {
      const foto = el('img', {
        className: 'flora-item__foto',
        src: planta.img,
        alt: `${planta.nombre} (${planta.cientifico})`,
        loading: 'lazy',
        decoding: 'async',
      });
      foto.addEventListener('error', () => foto.remove(), { once: true });
      lamina.prepend(foto);
    }

    const ficha = el('div', { className: 'flora-item__ficha' }, [
      el('h3', { textContent: planta.nombre }),
      el('span', { className: 'sci', textContent: planta.cientifico }),
      el('p', { textContent: planta.uso }),
    ]);

    const item = el('li', { className: 'flora-item' }, [lamina, ficha]);
    item.setAttribute('data-reveal', '');
    frag.append(item);
  });
  cont.append(frag);
}

/* ===================== 3. CIRCUITOS TURÍSTICOS + FILTRADO ===================== */
function initCircuitos() {
  const filtrosCont = document.getElementById('filtros-circuitos');
  const listaCont = document.getElementById('lista-circuitos');
  if (!filtrosCont || !listaCont) return;

  // --- 3a. Render de las tarjetas de circuito ---
  const tarjetas = CIRCUITOS.map((c) => {
    const card = el('article', { className: 'circuito-card' });
    card.dataset.acento = c.acento;
    // Guardamos las categorías para filtrar sin volver a tocar el DOM/data.
    card.dataset.cats = c.categorias.join(' ');

    // Imagen de cabecera con lazy loading; si falla, queda el color de acento.
    const foto = el('div', { className: 'circuito-card__foto' });
    if (c.img) {
      const cimg = el('img', {
        src: c.img, alt: c.titulo, loading: 'lazy', decoding: 'async',
      });
      cimg.addEventListener('error', () => cimg.remove(), { once: true });
      foto.append(cimg);
    }

    const top = el('header', { className: 'circuito-card__top' }, [
      el('span', { className: 'circuito-card__etiqueta', textContent: c.etiqueta }),
      el('h3', { className: 'circuito-card__titulo', textContent: c.titulo }),
      el('p', { className: 'circuito-card__rios', textContent: c.rios }),
    ]);

    const acts = el('ul', { className: 'circuito-card__acts' },
      c.actividades.map((a) => el('li', { textContent: a })));

    const body = el('div', { className: 'circuito-card__body' }, [
      el('p', { className: 'circuito-card__resumen', textContent: c.resumen }),
      acts,
      el('p', { className: 'circuito-card__nota', textContent: c.nota }),
    ]);

    card.append(foto, top, body);
    card.setAttribute('data-reveal', '');
    listaCont.append(card);
    return card;
  });

  // Mensaje para resultados vacíos (oculto por defecto).
  const vacio = el('p', {
    className: 'circuitos__vacio',
    textContent: 'No hay circuitos para este filtro.',
    hidden: true,
  });
  listaCont.append(vacio);

  // --- 3b. Lógica de filtrado ---
  let activo = 'todos';

  const aplicarFiltro = (filtro) => {
    activo = filtro;
    let visibles = 0;

    tarjetas.forEach((card) => {
      const cats = card.dataset.cats.split(' ');
      const coincide = filtro === 'todos' || cats.includes(filtro);

      if (coincide) {
        // Fade-in escalonado: mostramos y, en el siguiente frame, animamos.
        card.classList.remove('is-hidden');
        card.classList.add('is-filtering');
        requestAnimationFrame(() => card.classList.remove('is-filtering'));
        visibles++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    vacio.hidden = visibles > 0;
  };

  // --- 3c. Render de los botones de filtro ---
  FILTROS.forEach((f, i) => {
    const btn = el('button', {
      className: 'filtro-btn',
      type: 'button',
      textContent: f.nombre,
    });
    btn.setAttribute('aria-pressed', String(i === 0)); // "Todos" activo al inicio

    btn.addEventListener('click', () => {
      filtrosCont.querySelectorAll('.filtro-btn')
        .forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      aplicarFiltro(f.id);
    });

    filtrosCont.append(btn);
  });
}

/* ===================== 4. MANIFIESTO DE CONSERVACIÓN ===================== */
function initConservacion() {
  const cont = document.getElementById('lista-conservacion');
  if (!cont) return;

  const frag = document.createDocumentFragment();
  for (const accion of CONSERVACION) {
    const item = el('article', { className: 'manifiesto-item' }, [
      el('h3', { textContent: accion.titulo }),
      el('p', { textContent: accion.texto }),
    ]);
    item.setAttribute('data-reveal', '');
    frag.append(item);
  }
  cont.append(frag);
}

/* ============================ 5b. TICKER DE CURIOSIDADES ============================ */
function initTicker() {
  const track = document.getElementById('ticker');
  if (!track) return;
  // Si la página trae sus propios ítems en el HTML, se usan esos (tema propio);
  // si no, se usan las curiosidades del catálogo natural.
  let base = Array.from(track.querySelectorAll('.ticker__item')).map((n) => n.textContent.trim());
  if (base.length === 0) base = CURIOSIDADES;
  track.innerHTML = '';
  // Duplicamos la lista para un loop continuo sin cortes.
  for (const txt of [...base, ...base]) {
    track.append(el('span', { className: 'ticker__item', textContent: txt }));
  }
}

/* ============================ 5c. CONTADOR ANIMADO ============================ */
function initCountUp() {
  const nums = document.querySelectorAll('[data-countup]');
  if (!nums.length || !('IntersectionObserver' in window)) return;

  const animar = (node) => {
    const fin = Number(node.dataset.countup) || 0;
    const dur = 1200;
    let inicio = null;
    const paso = (t) => {
      if (inicio === null) inicio = t;
      const p = Math.min((t - inicio) / dur, 1);
      // easeOutCubic
      const val = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      node.textContent = val;
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) { animar(e.target); obs.unobserve(e.target); }
    }
  }, { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));
}

/* ============================ 5e. TRIVIA / QUIZ ============================ */
function initQuiz() {
  const cont = document.getElementById('quiz');
  if (!cont) return;

  const bodyEl     = document.getElementById('quiz-body');
  const scoreEl    = document.getElementById('quiz-score');
  const progressEl = document.getElementById('quiz-progress');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn    = document.getElementById('quiz-next');
  const restartBtn = document.getElementById('quiz-restart');
  if (!bodyEl || !scoreEl || !nextBtn || !restartBtn) return;

  const total = QUIZ.length;
  let indice = 0;       // pregunta actual
  let aciertos = 0;     // puntaje
  let respondida = false;

  const actualizarMarcador = () => {
    scoreEl.textContent = `${aciertos} / ${total}`;
    const ratio = total > 0 ? (indice / total) : 0;
    if (progressEl) progressEl.style.transform = `scaleX(${ratio})`;
  };

  // Renderiza la pregunta `indice`.
  const pintarPregunta = () => {
    respondida = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz__feedback';
    nextBtn.hidden = true;
    restartBtn.hidden = true;

    const q = QUIZ[indice];
    bodyEl.textContent = '';

    const cabecera = el('p', {
      className: 'quiz__count',
      textContent: `Pregunta ${indice + 1} de ${total}`,
    });
    const pregunta = el('h3', { className: 'quiz__question', textContent: q.pregunta });

    const lista = el('div', { className: 'quiz__options', role: 'group' });
    lista.setAttribute('aria-label', q.pregunta);

    q.opciones.forEach((texto, i) => {
      const btn = el('button', {
        type: 'button',
        className: 'quiz__option',
        textContent: texto,
      });
      btn.addEventListener('click', () => elegir(i, lista));
      lista.append(btn);
    });

    bodyEl.append(cabecera, pregunta, lista);
    actualizarMarcador();
  };

  // Maneja la elección de una opción.
  const elegir = (i, lista) => {
    if (respondida) return;      // una sola respuesta por pregunta
    respondida = true;

    const q = QUIZ[indice];
    const botones = [...lista.querySelectorAll('.quiz__option')];
    const acierto = i === q.correcta;
    if (acierto) aciertos++;

    botones.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.correcta) b.classList.add('is-correct');
      else if (idx === i) b.classList.add('is-wrong');
    });

    feedbackEl.classList.add(acierto ? 'is-ok' : 'is-bad');
    feedbackEl.textContent = acierto
      ? `¡Correcto! ${q.explicacion}`
      : `Casi… ${q.explicacion}`;

    actualizarMarcador();

    const ultima = indice === total - 1;
    nextBtn.hidden = ultima;
    restartBtn.hidden = !ultima;
    if (ultima) {
      const cierre = aciertos === total
        ? '¡Sabés todo sobre Orán! 🌿'
        : `Terminaste con ${aciertos} de ${total}. ¡Volvé a intentarlo!`;
      feedbackEl.textContent += ` ${cierre}`;
      restartBtn.focus();
    } else {
      nextBtn.focus();
    }
  };

  nextBtn.addEventListener('click', () => {
    if (indice < total - 1) { indice++; pintarPregunta(); }
  });

  restartBtn.addEventListener('click', () => {
    indice = 0;
    aciertos = 0;
    pintarPregunta();
  });

  // ¿Sabías que…?
  const sabiasCont = document.getElementById('sabias-list');
  if (sabiasCont && Array.isArray(SABIAS)) {
    const frag = document.createDocumentFragment();
    for (const dato of SABIAS) {
      const li = el('li', { className: 'sabias__item' }, [
        el('p', { className: 'sabias__text', textContent: dato.texto }),
      ]);
      li.setAttribute('data-reveal', '');
      frag.append(li);
    }
    sabiasCont.append(frag);
  }

  pintarPregunta();
}

/* ============================ 5d. IMPRIMIR REVISTA ============================ */
function initPrint() {
  const btn = document.getElementById('btn-print');
  if (!btn) return;
  btn.addEventListener('click', () => {
    // Aseguramos que todo el contenido esté revelado antes de imprimir
    // (por si el usuario imprime sin haber hecho scroll).
    document.querySelectorAll('[data-reveal]')
      .forEach((n) => n.classList.add('is-visible'));
    window.print();
  });
}

/* ============== 6. SCROLL REVEAL (IntersectionObserver, sin reflow) ============== */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  // Fallback: si no hay soporte, mostramos todo.
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // una sola vez → menos trabajo
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  targets.forEach((t) => io.observe(t));
}

/* ============== 7. PARALLAX HERO + BARRA DE PROGRESO (rAF, GPU only) ============== */
function initScrollEffects() {
  const media = document.querySelector('[data-parallax]');
  const progress = document.getElementById('progress');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;

  const onScroll = () => {
    // rAF agrupa lecturas/escrituras en un único frame → evita layout thrashing.
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY;

      // Barra de progreso: escala horizontal (no toca el layout).
      if (progress) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const ratio = max > 0 ? y / max : 0;
        progress.style.transform = `scaleX(${ratio})`;
      }

      // Parallax del hero: solo translateY (compositor de GPU).
      if (media && !reducido && y < window.innerHeight) {
        media.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
      }

      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}

/* ============================ 7b. SOPA DE LETRAS ============================ */
function initSopa() {
  const gridEl = document.getElementById('sopa-grid');
  const wordsEl = document.getElementById('sopa-words');
  if (!gridEl || !wordsEl || !Array.isArray(SOPA_PALABRAS)) return;

  const SIZE = 16;
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ';
  const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
  const rnd = (n) => Math.floor(Math.random() * n);

  // Normaliza para el tablero: mayúsculas, sin espacios ni acentos (conserva la Ñ).
  const norm = (s) => s.toUpperCase()
    .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I')
    .replace(/Ó/g, 'O').replace(/Ú/g, 'U').replace(/Ü/g, 'U')
    .replace(/[^A-ZÑ]/g, '');

  const palabras = SOPA_PALABRAS.map((p) => ({ display: p, norm: norm(p) }));
  const encontradas = new Set();
  const foundEl = document.getElementById('sopa-found');
  const totalEl = document.getElementById('sopa-total');
  const winEl = document.getElementById('sopa-win');
  if (totalEl) totalEl.textContent = palabras.length;

  let grid;

  // --- Generación: coloca las palabras (las largas primero) con reintentos ---
  function generar() {
    for (let intento = 0; intento < 80; intento++) {
      grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
      const ordenadas = [...palabras].sort((a, b) => b.norm.length - a.norm.length);
      let fallo = false;

      for (const w of ordenadas) {
        let ok = false;
        for (let t = 0; t < 600 && !ok; t++) {
          const d = DIRS[rnd(DIRS.length)];
          const len = w.norm.length;
          const r = rnd(SIZE), c = rnd(SIZE);
          const er = r + d[0] * (len - 1), ec = c + d[1] * (len - 1);
          if (er < 0 || er >= SIZE || ec < 0 || ec >= SIZE) continue;

          let cabe = true; const celdas = [];
          for (let i = 0; i < len; i++) {
            const rr = r + d[0] * i, cc = c + d[1] * i, cur = grid[rr][cc];
            if (cur && cur !== w.norm[i]) { cabe = false; break; } // choca con otra letra
            celdas.push([rr, cc]);
          }
          if (!cabe) continue;

          celdas.forEach(([rr, cc], i) => { grid[rr][cc] = w.norm[i]; });
          ok = true;
        }
        if (!ok) { fallo = true; break; }
      }
      if (!fallo) return true; // todas colocadas
    }
    return false;
  }

  const celdaDe = (r, c) =>
    gridEl.querySelector(`.sopa__cell[data-r="${r}"][data-c="${c}"]`);

  // --- Render del tablero y la lista ---
  function render() {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (!grid[r][c]) grid[r][c] = ALPHABET[rnd(ALPHABET.length)]; // relleno

    gridEl.style.setProperty('--sopa-cols', SIZE);
    gridEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = el('button', { className: 'sopa__cell', type: 'button', textContent: grid[r][c] });
        cell.dataset.r = r; cell.dataset.c = c;
        gridEl.append(cell);
      }
    }

    wordsEl.innerHTML = '';
    palabras.forEach((w) => {
      const li = el('li', { className: 'sopa__word', textContent: w.display });
      li.dataset.norm = w.norm;
      wordsEl.append(li);
    });

    encontradas.clear();
    progreso();
  }

  function progreso() {
    if (foundEl) foundEl.textContent = encontradas.size;
    if (winEl) winEl.hidden = encontradas.size < palabras.length;
  }

  // --- Selección por arrastre (líneas rectas en 8 direcciones) ---
  let inicio = null, seleccion = [];
  const limpiar = () => { seleccion.forEach((x) => x.classList.remove('is-sel')); seleccion = []; };

  function camino(r0, c0, r1, c1) {
    const dr = r1 - r0, dc = c1 - c0;
    const recto = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (!recto) return null;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    const sr = Math.sign(dr), sc = Math.sign(dc);
    const celdas = [];
    for (let i = 0; i <= len; i++) celdas.push([r0 + sr * i, c0 + sc * i]);
    return celdas;
  }

  function pintar(celdas) {
    limpiar();
    celdas.forEach(([r, c]) => {
      const cel = celdaDe(r, c);
      if (cel) { cel.classList.add('is-sel'); seleccion.push(cel); }
    });
  }

  function evaluar(celdas) {
    const letras = celdas.map(([r, c]) => grid[r][c]).join('');
    const rev = [...letras].reverse().join('');
    for (const w of palabras) {
      if (encontradas.has(w.norm)) continue;
      if (w.norm === letras || w.norm === rev) {
        encontradas.add(w.norm);
        celdas.forEach(([r, c]) => celdaDe(r, c)?.classList.add('is-found'));
        wordsEl.querySelector(`.sopa__word[data-norm="${w.norm}"]`)?.classList.add('is-found');
        progreso();
        return;
      }
    }
  }

  const celdaEnPunto = (x, y) => {
    const t = document.elementFromPoint(x, y);
    return t && t.classList.contains('sopa__cell') ? t : null;
  };

  gridEl.addEventListener('pointerdown', (e) => {
    const cell = e.target.closest('.sopa__cell');
    if (!cell) return;
    e.preventDefault();
    inicio = [+cell.dataset.r, +cell.dataset.c];
    pintar([inicio]);
  });
  gridEl.addEventListener('pointermove', (e) => {
    if (!inicio) return;
    const cell = celdaEnPunto(e.clientX, e.clientY);
    if (!cell) return;
    const ruta = camino(inicio[0], inicio[1], +cell.dataset.r, +cell.dataset.c);
    if (ruta) pintar(ruta);
  });
  const terminar = (e) => {
    if (!inicio) return;
    const cell = celdaEnPunto(e.clientX, e.clientY);
    if (cell) {
      const ruta = camino(inicio[0], inicio[1], +cell.dataset.r, +cell.dataset.c);
      if (ruta) evaluar(ruta);
    }
    limpiar();
    inicio = null;
  };
  gridEl.addEventListener('pointerup', terminar);
  gridEl.addEventListener('pointercancel', () => { limpiar(); inicio = null; });

  const reset = document.getElementById('sopa-reset');
  if (reset) reset.addEventListener('click', () => { if (generar()) render(); });

  if (generar()) render();
  else gridEl.textContent = 'No se pudo generar la sopa; recargá la página.';
}

/* ============================ 7c. MENÚ MÓVIL (hamburguesa) ============================ */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  // Cerrar al elegir un enlace
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  // Cerrar al volver a escritorio (evita estado “abierto” pegado)
  window.matchMedia('(min-width: 901px)').addEventListener('change', (ev) => {
    if (ev.matches) setOpen(false);
  });
}

/* ============ 9. JUEGO: COLOREAR (pincel sobre la lámina, canvas) ============ */
function initColorear() {
  const stage = document.getElementById('paint-stage');
  const canvas = document.getElementById('paint-canvas');
  const line = document.getElementById('paint-line');
  const palette = document.getElementById('paint-palette');
  if (!stage || !canvas || !line || !palette) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let color = '#e11d48';
  let size = 22;
  let tool = 'fill';            // 'fill' | 'brush' | 'erase'
  let blocked = null;           // máscara: 1 = línea del dibujo (no se pinta encima)
  const undo = [];              // pila de estados para "deshacer"

  // Dimensiona el lienzo a la resolución de la lámina (tope 1000px) y calcula la
  // máscara de líneas leyendo qué píxeles son oscuros.
  const setup = () => {
    const w = line.naturalWidth || 900, h = line.naturalHeight || 650;
    const scale = Math.min(1, 1000 / w);
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);   // fondo blanco (el dibujo va arriba con multiply)
    try {
      const off = document.createElement('canvas');
      off.width = canvas.width; off.height = canvas.height;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(line, 0, 0, canvas.width, canvas.height);
      const d = octx.getImageData(0, 0, canvas.width, canvas.height).data;
      blocked = new Uint8Array(canvas.width * canvas.height);
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        blocked[p] = lum < 120 ? 1 : 0;                // línea oscura → tope del relleno
      }
    } catch (e) { blocked = null; }                    // si no se puede leer, el balde se desactiva suave
  };
  if (line.complete && line.naturalWidth) setup();
  else line.addEventListener('load', setup, { once: true });

  const pushUndo = () => {
    try { undo.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); if (undo.length > 12) undo.shift(); }
    catch (e) {}
  };
  const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };

  // Coordenadas de píxel del lienzo a partir del evento de puntero.
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - r.left) * (canvas.width / r.width)),
      y: Math.round((e.clientY - r.top) * (canvas.height / r.height)),
    };
  };

  // Relleno por difusión (scanline) que respeta las líneas del dibujo.
  const floodFill = (sx, sy) => {
    const W = canvas.width, H = canvas.height;
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
    const start = sy * W + sx;
    if (blocked && blocked[start]) return;             // no rellenar sobre una línea
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    const [fr, fg, fb] = (tool === 'erase') ? [255, 255, 255] : hexRgb(color);
    const si = start * 4, tr = d[si], tg = d[si + 1], tb = d[si + 2];
    if (tr === fr && tg === fg && tb === fb) return;
    const match = (p) => {
      if (blocked && blocked[p]) return false;
      const k = p * 4;
      return Math.abs(d[k] - tr) < 28 && Math.abs(d[k + 1] - tg) < 28 && Math.abs(d[k + 2] - tb) < 28;
    };
    const stack = [start];
    while (stack.length) {
      const p = stack.pop();
      const y = (p / W) | 0;
      let x = p - y * W;
      while (x >= 0 && match(y * W + x)) x--;
      x++;
      let up = false, down = false;
      for (; x < W && match(y * W + x); x++) {
        const k = (y * W + x) * 4; d[k] = fr; d[k + 1] = fg; d[k + 2] = fb; d[k + 3] = 255;
        if (y > 0) { const u = (y - 1) * W + x; if (match(u)) { if (!up) { stack.push(u); up = true; } } else up = false; }
        if (y < H - 1) { const dn = (y + 1) * W + x; if (match(dn)) { if (!down) { stack.push(dn); down = true; } } else down = false; }
      }
    }
    ctx.putImageData(img, 0, 0);
  };

  // Trazo del pincel.
  let drawing = false, lastX = 0, lastY = 0;
  const stroke = (x, y) => {
    ctx.strokeStyle = (tool === 'erase') ? '#ffffff' : color;
    ctx.lineWidth = size * (canvas.width / (canvas.clientWidth || canvas.width));
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
    lastX = x; lastY = y;
  };

  // --- Barra: colores y herramientas ---
  const colors = palette.querySelectorAll('.paint__color');
  const tools = palette.querySelectorAll('.paint__tool');
  palette.addEventListener('click', (e) => {
    const c = e.target.closest('.paint__color');
    if (c) {
      color = c.dataset.color;
      colors.forEach((b) => b.classList.toggle('is-active', b === c));
      if (tool === 'erase') { tool = 'fill'; tools.forEach((t) => t.classList.toggle('is-active', t.dataset.tool === 'fill')); }
      return;
    }
    const t = e.target.closest('.paint__tool');
    if (t) { tool = t.dataset.tool; tools.forEach((b) => b.classList.toggle('is-active', b === t)); }
  });
  const sizeInput = document.getElementById('paint-size');
  if (sizeInput) sizeInput.addEventListener('input', () => { size = Number(sizeInput.value); });
  const clearBtn = document.getElementById('paint-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    pushUndo(); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
  const undoBtn = document.getElementById('paint-undo');
  if (undoBtn) undoBtn.addEventListener('click', () => { const s = undo.pop(); if (s) ctx.putImageData(s, 0, 0); });

  // --- Interacción en el lienzo ---
  canvas.addEventListener('pointerdown', (e) => {
    const p = pos(e); pushUndo();
    if (tool === 'fill') { floodFill(p.x, p.y); return; }
    drawing = true; lastX = p.x; lastY = p.y; stroke(p.x + 0.01, p.y + 0.01);
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => { if (drawing) { const p = pos(e); stroke(p.x, p.y); } });
  const stop = () => { drawing = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
}

/* ========== 10. JUEGO: BUSCAR LAS DIFERENCIAS (hotspots sobre foto) ========== */
function initDiferencias() {
  const cont = document.getElementById('diferencias');
  const marcador = document.getElementById('dif-contador');
  if (!cont || !marcador) return;

  const hotspots = cont.querySelectorAll('.dif-hot');
  const total = hotspots.length;
  let encontradas = 0;
  const ok = document.getElementById('dif-ok');

  hotspots.forEach((h) => {
    h.addEventListener('click', () => {
      if (h.classList.contains('found')) return;
      h.classList.add('found');
      encontradas += 1;
      marcador.textContent = `${encontradas} / ${total}`;
      if (encontradas === total && ok) ok.hidden = false;
    });
  });
}

/* ============== 11. JUEGO: BOTANIGRAMA (crucigrama botánico) ============== */
function initBotanigrama() {
  const grid = document.getElementById('botani-grid');
  if (!grid) return;

  const SPINE = 'SUSTENTABILIDAD';
  // row = posición (1-based) en SUSTENTABILIDAD donde cruza; idx = índice de la letra cruzada en la palabra
  const ACROSS = [
    { n: 1,  a: 'YUNGAS',       row: 2,  idx: 1 },
    { n: 2,  a: 'NATIVAS',      row: 4,  idx: 2 },
    { n: 3,  a: 'NATIVOS',      row: 7,  idx: 2 },
    { n: 4,  a: 'ETNOBOTANICA', row: 9,  idx: 4 },
    { n: 5,  a: 'ORAN',         row: 6,  idx: 3 },
    { n: 6,  a: 'PACARA',       row: 8,  idx: 1 },
    { n: 7,  a: 'BATATA',       row: 14, idx: 1 },
    { n: 8,  a: 'CEDRO',        row: 5,  idx: 1 },
    { n: 9,  a: 'PETERIBI',     row: 10, idx: 5 },
    { n: 10, a: 'NATURALEZA',   row: 11, idx: 6 },
  ];
  const spineCol = Math.max(...ACROSS.map((w) => w.idx)) + 1;
  const maxRight = Math.max(...ACROSS.map((w) => w.a.length - 1 - w.idx));
  const COLS = spineCol + maxRight;
  const ROWS = SPINE.length;

  // Mapa de celdas
  const cells = {};
  for (let r = 1; r <= ROWS; r++) cells[`${r},${spineCol}`] = { letter: SPINE[r - 1], spine: true };
  for (const w of ACROSS) {
    const startCol = spineCol - w.idx;
    for (let k = 0; k < w.a.length; k++) {
      const c = startCol + k, key = `${w.row},${c}`;
      if (!cells[key]) cells[key] = {};
      cells[key].letter = w.a[k];
      if (c === spineCol) cells[key].spine = true; else cells[key].input = true;
      if (k === 0) cells[key].num = w.n;
    }
  }

  grid.style.setProperty('--cols', COLS);
  grid.innerHTML = '';
  const inputs = [];
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      const cell = cells[`${r},${c}`];
      const div = el('div', { className: 'botani__cell' });
      if (!cell) { div.classList.add('is-empty'); grid.append(div); continue; }
      if (cell.num) div.append(el('span', { className: 'botani__num', textContent: String(cell.num) }));
      if (cell.spine) {
        div.classList.add('is-spine');
        div.append(el('span', { className: 'botani__letter', textContent: cell.letter }));
      } else if (cell.input) {
        const inp = el('input', { className: 'botani__input', maxLength: 1 });
        inp.dataset.sol = cell.letter;
        inp.addEventListener('input', () => {
          inp.value = inp.value.toUpperCase().replace(/[^A-ZÑ]/g, '');
          inp.classList.remove('is-bad', 'is-good');
        });
        div.append(inp); inputs.push(inp);
      }
      grid.append(div);
    }
  }

  const msg = document.getElementById('botani-msg');
  const setMsg = (t) => { if (msg) msg.textContent = t; };
  document.getElementById('botani-check')?.addEventListener('click', () => {
    let ok = 0;
    inputs.forEach((i) => {
      const good = (i.value || '') === i.dataset.sol;
      i.classList.toggle('is-good', good && i.value !== '');
      i.classList.toggle('is-bad', !good && i.value !== '');
      if (good) ok++;
    });
    setMsg(ok === inputs.length ? '🎉 ¡Completaste el botanigrama!' : `Llevás ${ok}/${inputs.length} casillas correctas.`);
  });
  document.getElementById('botani-solve')?.addEventListener('click', () => {
    inputs.forEach((i) => { i.value = i.dataset.sol; i.classList.add('is-good'); i.classList.remove('is-bad'); });
    setMsg('Solución completa.');
  });
  document.getElementById('botani-clear')?.addEventListener('click', () => {
    inputs.forEach((i) => { i.value = ''; i.classList.remove('is-good', 'is-bad'); });
    setMsg('');
  });
}

/* ===================== 12. BOTÓN "VOLVER ARRIBA" ===================== */
function initBackToTop() {
  const btn = document.getElementById('to-top');
  if (!btn) return;
  const toggle = () => btn.classList.toggle('is-visible', window.scrollY > 600);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  btn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
}

/* ===================== 13. REPRODUCTOR DE MÚSICA (botones por tema) ===================== */
function initReproductor() {
  const audio = document.getElementById('audio-player');
  const temas = Array.from(document.querySelectorAll('.tema'));
  if (!audio || temas.length === 0) return;

  let actual = null;
  const icono = (t) => t.querySelector('.tema__icono');
  const reset = () => temas.forEach((t) => { t.classList.remove('is-playing'); icono(t).textContent = '▶'; });

  temas.forEach((t) => {
    t.addEventListener('click', () => {
      // Mismo tema sonando → pausa; mismo tema pausado → reanuda
      if (actual === t) {
        if (audio.paused) { audio.play().catch(() => {}); t.classList.add('is-playing'); icono(t).textContent = '⏸'; }
        else { audio.pause(); t.classList.remove('is-playing'); icono(t).textContent = '▶'; }
        return;
      }
      // Tema nuevo → reemplaza al anterior
      reset();
      audio.src = t.dataset.src;
      audio.play().catch(() => {});
      actual = t;
      t.classList.add('is-playing');
      icono(t).textContent = '⏸';
    });
  });

  audio.addEventListener('ended', () => { reset(); actual = null; });
}

/* ===================== 14. CARRUSEL DE FOTOS (galería deslizable) ===================== */
function initCarrusel() {
  const carruseles = document.querySelectorAll('.carrusel');
  if (carruseles.length === 0) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carruseles.forEach((car) => {
    const track = car.querySelector('.carrusel__track');
    const slides = Array.from(car.querySelectorAll('.carrusel__slide'));
    const dotsWrap = car.querySelector('.carrusel__dots');
    if (!track || slides.length === 0) return;

    let i = 0, timer = null;
    const dots = slides.map((_, k) => {
      const d = el('button', { type: 'button', className: 'carrusel__dot' });
      d.setAttribute('aria-label', `Ir a la foto ${k + 1}`);
      d.addEventListener('click', () => { go(k); restart(); });
      if (dotsWrap) dotsWrap.append(d);
      return d;
    });

    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    };
    const restart = () => {
      if (reduce) return;
      clearInterval(timer);
      timer = setInterval(() => go(i + 1), 5000);
    };

    car.querySelector('.carrusel__prev')?.addEventListener('click', () => { go(i - 1); restart(); });
    car.querySelector('.carrusel__next')?.addEventListener('click', () => { go(i + 1); restart(); });

    // Deslizar con el dedo / mouse
    let x0 = null;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    track.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      if (dx > 40) { go(i - 1); restart(); } else if (dx < -40) { go(i + 1); restart(); }
      x0 = null;
    });

    car.addEventListener('mouseenter', () => clearInterval(timer));
    car.addEventListener('mouseleave', restart);

    go(0); restart();
  });
}

/* ============ 15. GALERÍA POR CHIPS (tocar un chip muestra su foto) ============ */
function initGaleriaChips() {
  document.querySelectorAll('.galeria-chips').forEach((g) => {
    const chips = Array.from(g.querySelectorAll('.gchip'));
    const img = g.querySelector('.gchip-img');
    const cap = g.querySelector('.gchip-cap');
    if (chips.length === 0 || !img) return;
    chips.forEach((c) => {
      c.addEventListener('click', () => {
        chips.forEach((x) => x.classList.toggle('is-active', x === c));
        img.src = c.dataset.img;
        img.alt = c.dataset.cap || '';
        if (cap) cap.textContent = c.dataset.cap || '';
      });
    });
  });
}

/* ============================ ARRANQUE ============================ */
function init() {
  initSumario();
  initFauna();
  initFlora();
  initCircuitos();
  initConservacion();
  initTicker();
  initCountUp();
  initQuiz();
  initSopa();
  initColorear();
  initDiferencias();
  initBotanigrama();
  initReproductor();
  initCarrusel();
  initGaleriaChips();
  initNav();
  initBackToTop();
  initPrint();
  // Los efectos de scroll se enganchan tras poblar el DOM.
  initScrollReveal();
  initScrollEffects();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
