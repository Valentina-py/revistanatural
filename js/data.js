/* ============================================================================
   data.js — Fuente única de datos de la revista.
   Todo el contenido proviene EXCLUSIVAMENTE de los documentos de la carpeta
   "Revista - Romina/Revista Natural" (geografía, biodiversidad, ríos/circuitos,
   catálogo botánico y patrimonio natural). No se añaden datos externos.
   ES6: se exporta como módulos para consumir desde interactivity.js.
   ========================================================================== */

/* ----------------------------------------------------------------------------
   CIRCUITOS TURÍSTICOS
   Fuente: "RIOS DE ORÁN" → "Circuito turístico y natural de los ríos".
   El propio documento propone una clave de color:
     🔴 Aventura Fluvial y Pesca   🟢 Ecoturismo y Selva
   Usamos esas dos familias + "senderismo" para el filtrado interactivo.
---------------------------------------------------------------------------- */
export const CIRCUITOS = [
  {
    id: 'nautico',
    titulo: 'Circuito Náutico y de Aventura',
    rios: 'Río Bermejo · Río Pescado',
    emoji: '🛶',
    img: 'assets/img/kayak.png',
    // categorías por las que se puede filtrar (data-filter)
    categorias: ['aventura', 'pesca'],
    etiqueta: 'Aventura Fluvial y Pesca',
    acento: 'aventura',
    resumen:
      'Travesías guiadas en canoa y kayak que nacen en el río Pescado y continúan ' +
      'por el Bermejo, con acampe agreste en las playas de arena de las islas fluviales.',
    actividades: [
      'Travesías en canoa y kayak con acampe en islas',
      'Pesca deportiva de surubí y dorado (captura y devolución)',
      'Charlas técnicas de seguridad antes de ingresar al agua',
    ],
    nota:
      'El Bermejo es caudaloso y limita con áreas protegidas: la pesca se ' +
      'comercializa obligatoriamente con guías que proveen embarcación, equipo y permisos.',
  },
  {
    id: 'selva',
    titulo: 'Circuito de Selva de Montaña',
    rios: 'Río Blanco',
    emoji: '🚵',
    img: 'assets/img/portada-yungas.png',
    categorias: ['ecoturismo', 'aventura'],
    etiqueta: 'Ecoturismo y Selva',
    acento: 'ecoturismo',
    resumen:
      'Caminos de tierra rojiza que bordean el río Blanco, entre la densa vegetación ' +
      'de la selva pedemontana de las Yungas.',
    actividades: [
      'Ciclismo de montaña (MTB) por tramos exigentes',
      'Observación de aves autóctonas y fotografía de naturaleza',
      'Registro de huellas de fauna mayor',
    ],
    nota:
      'Punto estratégico por la alta biodiversidad de las Yungas; ideal para el ' +
      'avistaje al amanecer y la fotografía.',
  },
  {
    id: 'senderismo',
    titulo: 'Senderismo e Integración Regional',
    rios: 'Reserva Pintascayo · El Oculto · Anta Muerta',
    emoji: '🥾',
    img: 'assets/img/mapa.png',
    categorias: ['senderismo', 'ecoturismo'],
    etiqueta: 'Trekking y Selva',
    acento: 'senderismo',
    resumen:
      'El área oeste de Orán conecta los ríos con quebradas profundas y los ' +
      'alrededores del Parque Provincial Laguna Pintascayo.',
    actividades: [
      'Senderismo de interpretación ambiental',
      'Trekking en quebradas (El Oculto, Anta Muerta)',
      'Antesala al Parque Nacional Baritú',
    ],
    nota:
      'Para ingresar a la zona oeste se requiere acompañamiento de guías de ' +
      'naturaleza locales autorizados por las comunidades o el municipio.',
  },
  {
    id: 'baritu',
    titulo: 'Conexión con el Parque Nacional Baritú',
    rios: 'Yunga salteña · Área protegida',
    emoji: '🌲',
    img: 'assets/img/portada-yungas.png',
    categorias: ['ecoturismo', 'senderismo'],
    etiqueta: 'Ecoturismo de Selva',
    acento: 'ecoturismo',
    resumen:
      'Los ríos y rutas de la zona sirven de antesala para adentrarse en el Parque ' +
      'Nacional Baritú, el área protegida más clásica e intangible de la yunga salteña.',
    actividades: [
      'Interpretación de selva tropical de montaña intangible',
      'Avistaje de fauna mayor de las Yungas',
      'Conexión con el corredor de áreas protegidas',
    ],
    nota:
      'Forma parte del catálogo oficial de Experiencias Turismo Salta; se accede ' +
      'a través de los ríos y rutas de Orán con prestadores habilitados.',
  },
];

/* Etiquetas legibles para los botones de filtro (orden de aparición). */
export const FILTROS = [
  { id: 'todos', nombre: 'Todos los circuitos' },
  { id: 'aventura', nombre: 'Aventura fluvial' },
  { id: 'pesca', nombre: 'Pesca deportiva' },
  { id: 'ecoturismo', nombre: 'Ecoturismo y selva' },
  { id: 'senderismo', nombre: 'Senderismo' },
];

/* ----------------------------------------------------------------------------
   BIODIVERSIDAD (galería editorial)
   Fuente: "Biodiversidad del Departamento de Orán" + "Peces de los ríos de Orán".
   El campo `img` apunta a assets/img/; si la imagen no existe, el CSS muestra
   un degradado de respaldo (no rompe el layout).
---------------------------------------------------------------------------- */
export const FAUNA = [
  {
    grupo: 'Mamíferos', emoji: '🐆',
    nombre: 'Yaguareté',
    cientifico: 'Panthera onca',
    img: 'assets/img/yaguarete.jpg',
    texto:
      'El felino más grande de América. Cazador solitario y nocturno, excelente ' +
      'nadador. En peligro crítico de extinción por la pérdida de hábitat y la caza furtiva.',
    destacado: true,
  },
  {
    grupo: 'Aves', emoji: '🦜',
    nombre: 'Maracaná de cuello dorado',
    cientifico: 'Primolius auricollis',
    img: 'assets/img/maracana.jpg',
    texto:
      'Loro social de plumaje verde vivo y collar dorado. Se alimenta de semillas ' +
      'y frutos de las Yungas.',
    destacado: true,
  },
  {
    grupo: 'Mamíferos', emoji: '🐗',
    nombre: 'Tapir o anta',
    cientifico: 'Tapirus terrestris',
    img: 'assets/img/tapir.jpg',
    texto:
      'El mamífero terrestre más grande de Sudamérica. Herbívoro, de trompa corta ' +
      'y móvil, habita zonas boscosas cercanas al agua.',
  },
  {
    grupo: 'Aves', emoji: '🐦',
    nombre: 'Tucán grande',
    cientifico: 'Ramphastos toco',
    img: 'assets/img/tucan.jpg',
    texto:
      'De pico grande y colorido. Se alimenta de frutos, insectos y pequeños ' +
      'vertebrados en el dosel de la selva.',
  },
  {
    grupo: 'Peces', emoji: '🐟',
    nombre: 'Dorado',
    cientifico: 'Salminus brasiliensis',
    img: 'assets/img/dorado.jpg',
    texto:
      'El “tigre de los ríos”. Depredador de gran porte, muy valorado en la pesca ' +
      'deportiva por su fuerza y saltos acrobáticos.',
    destacado: true,
  },
  {
    grupo: 'Aves', emoji: '🦩',
    nombre: 'Espátula rosada',
    cientifico: 'Platalea ajaja',
    img: 'assets/img/espatula.jpg',
    texto:
      'Plumaje rosado y pico en forma de espátula con el que filtra el alimento en ' +
      'aguas poco profundas. Gregaria.',
  },
  {
    grupo: 'Aves', emoji: '🦆',
    nombre: 'Pato criollo',
    cientifico: 'Cairina moschata',
    img: 'assets/img/pato.jpg',
    texto:
      'Pato de gran tamaño, plumaje oscuro y carúnculas rojas en la cara. Habita ' +
      'ambientes acuáticos.',
  },
  {
    grupo: 'Aves', emoji: '🪶',
    nombre: 'Pava de monte',
    cientifico: 'Penelope bridgesi',
    img: 'assets/img/pava.jpg',
    texto:
      'Ave de tamaño mediano con plumaje oscuro y piel rojiza en la garganta. ' +
      'Habita los bosques de las Yungas.',
  },
  {
    grupo: 'Aves', emoji: '🕊️',
    nombre: 'Garza blanca',
    cientifico: 'Ardea alba',
    img: 'assets/img/garza.jpg',
    texto:
      'Ave zancuda de plumaje blanco, cuello largo y pico puntiagudo. Pesca en ' +
      'aguas poco profundas.',
  },
  {
    grupo: 'Reptiles', emoji: '🐊',
    nombre: 'Yacaré overo',
    cientifico: 'Caiman latirostris',
    img: 'assets/img/yacare.jpg',
    texto:
      'Cocodriliano de hocico ancho. Habita ríos y lagunas; se alimenta de peces, ' +
      'aves y pequeños mamíferos.',
    destacado: true,
  },
];

/* Datos curiosos para el "ticker" animado de la portada (fuente: documentos). */
export const CURIOSIDADES = [
  '🌿 Orán forma parte de la Reserva de Biósfera de las Yungas',
  '🐆 El yaguareté es el felino más grande de América',
  '🐟 El dorado es apodado «el tigre de los ríos»',
  '🛶 Travesías en canoa por el río Pescado y el Bermejo',
  '🏞️ Tres ríos: Blanco, Pescado y Bermejo',
  '🦜 Cientos de especies de aves habitan la región',
  '🌳 El Parque Provincial Laguna Pintascayo protege las Yungas',
  '☀️ Clima subtropical con estación seca',
];

/* ----------------------------------------------------------------------------
   CATÁLOGO BOTÁNICO (selección de árboles emblemáticos)
   Fuente: "Catálogo de Flora Botánica y Usos Frecuentes".
---------------------------------------------------------------------------- */
export const FLORA = [
  { nombre: 'Cedro',         cientifico: 'Cedrela lilloi',                  habito: 'Árbol', emoji: '🌳', img: 'assets/img/arboles/cedro.jpg',  uso: 'Construcción, instrumentos musicales y medicinal (corteza).' },
  { nombre: 'Cebil',         cientifico: 'Anadenanthera colubrina var. cebil', habito: 'Árbol', emoji: '🌲', img: 'assets/img/arboles/cebil.jpg', uso: 'Tintórea, curtiente y medicinal (corteza).' },
  { nombre: 'Nogal',         cientifico: 'Juglans australis',               habito: 'Árbol', emoji: '🌰', img: 'assets/img/arboles/nogal.jpg',  uso: 'Alimenticia, utensilios, telares e instrumentos.' },
  { nombre: 'Pacará',        cientifico: 'Enterolobium contortisiliquum',   habito: 'Árbol', emoji: '🌳', img: 'assets/img/arboles/pacara.jpg', uso: 'Construcción, instrumentos musicales y ornamental.' },
  { nombre: 'Pino del cerro',cientifico: 'Podocarpus parlatorei',           habito: 'Árbol', emoji: '🌲', img: 'assets/img/arboles/pino.jpg',   uso: 'Construcción, alimenticia y tintórea.' },
  { nombre: 'Roble',         cientifico: 'Amburana cearensis',              habito: 'Árbol', emoji: '🍃', img: 'assets/img/arboles/roble.jpg',  uso: 'Medicinal: corteza para afecciones cardíacas y renales.' },
];

/* ----------------------------------------------------------------------------
   ACCIONES DE CONSERVACIÓN (manifiesto / patrimonio)
   Fuente: "Acciones de conservación y concientización".
---------------------------------------------------------------------------- */
export const CONSERVACION = [
  { icono: '🌿', titulo: 'Protege la flora nativa', texto: 'Evitá la tala ilegal y los incendios; reforestá con especies autóctonas.' },
  { icono: '💧', titulo: 'Cuidá los recursos hídricos', texto: 'No arrojes residuos y usá el agua de forma responsable.' },
  { icono: '🐾', titulo: 'Respetá la fauna silvestre', texto: 'Sin caza ni captura: conservar el hábitat sostiene el ecosistema.' },
  { icono: '♻️', titulo: 'Manejá bien los residuos', texto: 'Separá, reciclá y reducí el plástico en ríos y áreas verdes.' },
  { icono: '🥾', titulo: 'Turismo sostenible', texto: 'Respetá los senderos y no dejes rastro de tu paso.' },
  { icono: '📣', titulo: 'Participá y educá', texto: 'Sumate a jornadas de limpieza, plantación y educación ambiental.' },
];

/* ----------------------------------------------------------------------------
   CONTACTO OFICIAL
   Fuente: "RIOS DE ORÁN" → Registro de Prestadores de Turismo de Orán.
---------------------------------------------------------------------------- */
export const CONTACTO = {
  oficina: 'Gerencia de Turismo de Orán',
  direccion: 'Hipólito Yrigoyen 141, San Ramón de la Nueva Orán, Salta',
  email: 'gerenciaturaismooran@gmail.com',
  telefono: '+54 3878 35-8491',
};

/* ===================== ÍNDICE / SUMARIO de la revista ===================== */
/* Cada entrada lista una sección con su número, nombre, micro-descripción y
   ancla. El orden del array es el orden de aparición en el sumario. */
export const SUMARIO = [
  { num: '01', nombre: 'Territorio',            desc: 'Geografía, clima y relieve de Orán.',                ancla: '#geografia' },
  { num: '02', nombre: 'Fauna de las Yungas',   desc: 'Mamíferos, aves, reptiles y peces del monte.',       ancla: '#biodiversidad' },
  { num: '03', nombre: 'Flora botánica',        desc: 'Árboles nativos y sus usos tradicionales.',          ancla: '#flora' },
  { num: '04', nombre: 'Circuitos turísticos',  desc: 'Los ríos en movimiento: aventura y naturaleza.',     ancla: '#circuitos' },
  { num: '05', nombre: 'Información práctica',   desc: 'Crecidas, vedas y datos para tu visita.',            ancla: '#info' },
  { num: '06', nombre: 'Entretenimiento',       desc: 'Curiosidades y juegos para descubrir la selva.',     ancla: '#entretenimiento' },
  { num: '07', nombre: 'Conservación',          desc: 'Cuidar hoy para disfrutar siempre.',                 ancla: '#conservacion' },
];

/* ----------------------------------------------------------------------------
   ENTRETENIMIENTO — Trivia / quiz y curiosidades
   Fuente: documentos de Orán (geografía, fauna, ríos y turismo, conservación).
   QUIZ: cada item tiene pregunta, opciones[], correcta (índice) y explicación.
---------------------------------------------------------------------------- */
export const QUIZ = [
  {
    pregunta: '¿Cuál es el felino más grande de América, presente en las Yungas de Orán?',
    opciones: ['Puma', 'Yaguareté', 'Tapir', 'Ocelote'],
    correcta: 1,
    explicacion: 'El yaguareté (Panthera onca) es el felino más grande de América. ' +
      'Está en peligro crítico por la pérdida de hábitat y la caza furtiva.',
  },
  {
    pregunta: '¿A qué pez de los ríos de Orán se lo apoda «el tigre de los ríos»?',
    opciones: ['Surubí', 'Sábalo', 'Dorado', 'Bagre'],
    correcta: 2,
    explicacion: 'El dorado (Salminus brasiliensis) es apodado «el tigre de los ríos» ' +
      'por su fuerza y sus saltos acrobáticos; es muy valorado en la pesca deportiva.',
  },
  {
    pregunta: '¿A qué distancia aproximada está Orán de la ciudad de Salta?',
    opciones: ['90 km', '270 km', '500 km', '120 km'],
    correcta: 1,
    explicacion: 'San Ramón de la Nueva Orán está a unos 270 km de la ciudad de Salta, ' +
      'en el extremo norte de la provincia, cerca de la frontera con Bolivia.',
  },
  {
    pregunta: '¿Cuáles son los tres ríos que forman el corredor ecológico de Orán?',
    opciones: [
      'Paraná, Bermejo y Pilcomayo',
      'Blanco, Pescado y Bermejo',
      'Blanco, Salado y Juramento',
      'Pescado, Dorado y Pintascayo',
    ],
    correcta: 1,
    explicacion: 'Los ríos Blanco, Pescado y Bermejo forman el corredor ecológico, ' +
      'dentro de la Reserva de Biósfera de las Yungas y la Cuenca Alta del Río Bermejo.',
  },
  {
    pregunta: 'Durante las crecidas estivales, ¿qué ruta nacional se anega cerca de Orán?',
    opciones: ['Ruta Nacional 9', 'Ruta Nacional 34', 'Ruta Nacional 50', 'Ruta Nacional 40'],
    correcta: 2,
    explicacion: 'Con las lluvias tropicales (noviembre–abril), el río Blanco y el ' +
      'Pescado desbordan y anegan la Ruta Nacional 50, que une Orán con Aguas Blancas y Bolivia.',
  },
  {
    pregunta: '¿De qué gran reserva forma parte el territorio de Orán?',
    opciones: [
      'Reserva de Biósfera de las Yungas',
      'Reserva Natural del Iberá',
      'Parque Nacional Iguazú',
      'Reserva de la Biósfera del Delta',
    ],
    correcta: 0,
    explicacion: 'Orán forma parte de la Reserva de Biósfera de las Yungas, la selva ' +
      'de montaña que cubre el sector oeste del departamento.',
  },
  {
    pregunta: '¿Cuál es el área protegida más intangible de la yunga, conectada con Orán?',
    opciones: [
      'Parque Provincial Laguna Pintascayo',
      'Parque Nacional Baritú',
      'Quebrada de Anta Muerta',
      'Sendero El Oculto',
    ],
    correcta: 1,
    explicacion: 'El Parque Nacional Baritú es el área protegida más clásica e ' +
      'intangible de la yunga salteña; los ríos y rutas de Orán sirven de antesala.',
  },
];

/* Bloque "¿Sabías que…?" — curiosidades (fuente: documentos). */
export const SABIAS = [
  {
    emoji: '🐘',
    texto: 'El tapir o anta (Tapirus terrestris) es el mamífero terrestre más grande ' +
      'de Sudamérica y habita los bosques cercanos al agua en Orán.',
  },
  {
    emoji: '🦩',
    texto: 'La espátula rosada debe su nombre a su pico en forma de espátula, con el ' +
      'que filtra el alimento en aguas poco profundas.',
  },
  {
    emoji: '🛶',
    texto: 'Se puede recorrer en canoa y kayak el río Pescado y continuar por el ' +
      'Bermejo, con acampe agreste en las playas de arena de las islas fluviales.',
  },
  {
    emoji: '🎣',
    texto: 'La veda de pesca en la región suele comenzar en septiembre u octubre, y ' +
      'durante las alertas por crecidas se suspenden travesías náuticas, pesca y senderismo.',
  },
];

/* ----------------------------------------------------------------------------
   SOPA DE LETRAS — plantas nativas del catálogo botánico de Orán.
   Fuente: "Catálogo de Flora Botánica y Usos Frecuentes".
   Se muestran con su nombre legible; el juego las normaliza (sin espacios/acentos).
---------------------------------------------------------------------------- */
export const SOPA_PALABRAS = [
  'Achera',
  'Ají ulupica',
  'Albahaca de campo',
  'Amapola',
  'Espinillo',
  'Mil hombres',
  'Tabaco de campo',
  'Muña muña',
  'Ortiguilla',
  'Burrito',
];
