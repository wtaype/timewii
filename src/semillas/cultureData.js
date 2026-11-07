// src/semillas/cultureData.js
// 🇵🇪 vs 🇺🇸 Cultura, Feriados y Calendario Laboral Comparativo (EE.UU. vs Perú)
// Diseñado para asesores remotos: conciso, estilo guía de viajero/turista y sin textos excesivos.

// 1. Calendario de Feriados USA vs Perú con Impacto Laboral
export const HOLIDAYS_COMPARISON_DATA = [
  {
    mesNum: 1,
    mesNombre: 'Enero',
    dia: 1,
    fechaDisplay: '01 Ene',
    feriadoUsa: 'New Year’s Day',
    feriadoPeru: 'Año Nuevo',
    seTrabaja: 'ambos_descanso', // 'ambos_descanso' | 'usa_libre' | 'peru_trabaja'
    estadoLaboral: '🔴 Descanso Total',
    impactoDetalle: 'Líneas cerradas en EE.UU. y feriado en Perú. Día libre general.',
    notaTurista: 'Concierto de año nuevo y resoluciones vs uvas y ropa amarilla.'
  },
  {
    mesNum: 1,
    mesNombre: 'Enero',
    dia: 19,
    fechaDisplay: '19 Ene (3er Lun)',
    feriadoUsa: 'Martin Luther King Jr. Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre USA',
    impactoDetalle: 'Líneas en EE.UU. cerradas o volumen mínimo por feriado federal.',
    notaTurista: 'Homenaje a los derechos civiles y voluntariado nacional en EE.UU.'
  },
  {
    mesNum: 2,
    mesNombre: 'Febrero',
    dia: 16,
    fechaDisplay: '16 Feb (3er Lun)',
    feriadoUsa: 'Presidents’ Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre / Bajo Flujo',
    impactoDetalle: 'Bancos y entes federales en EE.UU. cierran; llamadas muy bajas.',
    notaTurista: 'Fin de semana largo con ofertas de compras de invierno.'
  },
  {
    mesNum: 4,
    mesNombre: 'Abril',
    dia: 2,
    fechaDisplay: '02-03 Abr',
    feriadoUsa: 'Días laborables normales',
    feriadoPeru: 'Jueves y Viernes Santo',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'EE.UU. opera con normalidad total. Asesor en Perú labora (pago feriado).',
    notaTurista: 'En Perú viajan a Ayacucho o comen pescado; en EE.UU. es día regular.'
  },
  {
    mesNum: 5,
    mesNombre: 'Mayo',
    dia: 1,
    fechaDisplay: '01 May',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Día del Trabajo',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'En EE.UU. el día del trabajo es en septiembre. Turno habitual.',
    notaTurista: 'EE.UU. no celebra el 1 de mayo; jornada productiva estándar.'
  },
  {
    mesNum: 5,
    mesNombre: 'Mayo',
    dia: 25,
    fechaDisplay: '25 May (Últ Lun)',
    feriadoUsa: 'Memorial Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre USA',
    impactoDetalle: 'Inicio no oficial del verano en EE.UU.; la mayoría de campañas descansan.',
    notaTurista: 'Parrilladas ("cookouts") familiares y apertura de piscinas.'
  },
  {
    mesNum: 6,
    mesNombre: 'Junio',
    dia: 7,
    fechaDisplay: '07 Jun',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Día de la Bandera',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado nacional en Perú. Operaciones hacia EE.UU. activas.',
    notaTurista: 'Ceremonia de juramento a la bandera en Perú; en EE.UU. día común.'
  },
  {
    mesNum: 6,
    mesNombre: 'Junio',
    dia: 19,
    fechaDisplay: '19 Jun',
    feriadoUsa: 'Juneteenth',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre USA',
    impactoDetalle: 'Feriado federal por la emancipación. Cierre bancario e institucional.',
    notaTurista: 'Festivales comunitarios de música, cultura y libertad en EE.UU.'
  },
  {
    mesNum: 6,
    mesNombre: 'Junio',
    dia: 29,
    fechaDisplay: '29 Jun',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'San Pedro y San Pablo',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado costero en Perú; EE.UU. tiene jornada laboral regular.',
    notaTurista: 'Procesión marítima de pescadores en Chorrillos / Callao.'
  },
  {
    mesNum: 7,
    mesNombre: 'Julio',
    dia: 4,
    fechaDisplay: '04 Jul',
    feriadoUsa: 'Independence Day (4th of July)',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre USA',
    impactoDetalle: 'Máxima fiesta nacional en EE.UU.; operaciones remotas cerradas.',
    notaTurista: 'Fuegos artificiales espectaculares, picnics al aire libre y desfiles.'
  },
  {
    mesNum: 7,
    mesNombre: 'Julio',
    dia: 23,
    fechaDisplay: '23 Jul',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Día de la FAP (Quiñones)',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado en Perú; clientes en EE.UU. llaman con normalidad.',
    notaTurista: 'Homenaje al héroe José Abelardo Quiñones en Perú.'
  },
  {
    mesNum: 7,
    mesNombre: 'Julio',
    dia: 28,
    fechaDisplay: '28-29 Jul',
    feriadoUsa: 'Días laborables normales',
    feriadoPeru: 'Fiestas Patrias de Perú',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Días cumbre en Perú. Se trabaja en campañas americanas con pago de feriado.',
    notaTurista: 'Mensaje a la nación, parada militar y comida criolla en Perú.'
  },
  {
    mesNum: 8,
    mesNombre: 'Agosto',
    dia: 6,
    fechaDisplay: '06 Ago',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Batalla de Junín',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado oficial en Perú. Clientes de EE.UU. con flujo normal.',
    notaTurista: 'Conmemoración patriótica de la gesta libertaria de 1824.'
  },
  {
    mesNum: 8,
    mesNombre: 'Agosto',
    dia: 30,
    fechaDisplay: '30 Ago',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Santa Rosa de Lima',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado religioso en Perú; EE.UU. opera en jornada estándar.',
    notaTurista: 'Cartas en el Pozo de los Deseos en el centro de Lima.'
  },
  {
    mesNum: 9,
    mesNombre: 'Septiembre',
    dia: 7,
    fechaDisplay: '07 Sep (1er Lun)',
    feriadoUsa: 'Labor Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre USA',
    impactoDetalle: 'Día del Trabajo oficial en EE.UU. Líneas cerradas.',
    notaTurista: 'Último viaje de verano antes del año escolar americano.'
  },
  {
    mesNum: 10,
    mesNombre: 'Octubre',
    dia: 8,
    fechaDisplay: '08 Oct',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Combate de Angamos',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado en Perú en honor a Miguel Grau. EE.UU. atiende normalmente.',
    notaTurista: 'Homenaje al Caballero de los Mares en la costa peruana.'
  },
  {
    mesNum: 10,
    mesNombre: 'Octubre',
    dia: 12,
    fechaDisplay: '12 Oct (2do Lun)',
    feriadoUsa: 'Columbus Day / Indigenous Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre / Bajo Flujo',
    impactoDetalle: 'Feriado bancario federal en EE.UU.; llamadas reducidas.',
    notaTurista: 'Reconocimiento cultural y fin de semana de compras en EE.UU.'
  },
  {
    mesNum: 10,
    mesNombre: 'Octubre',
    dia: 31,
    fechaDisplay: '31 Oct',
    feriadoUsa: 'Halloween (Festivo)',
    feriadoPeru: 'Canción Criolla (Festivo)',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '⚪ Se trabaja en Ambos',
    impactoDetalle: 'Día laborable en ambos países, pero con ambiente festivo en la noche.',
    notaTurista: 'Dulces y disfraces ("Trick or Treat") vs peñas criollas con cajón y guitarra.'
  },
  {
    mesNum: 11,
    mesNombre: 'Noviembre',
    dia: 1,
    fechaDisplay: '01 Nov',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Día de Todos los Santos',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado tradicional en Perú. En EE.UU. es día hábil común.',
    notaTurista: 'Visitas a cementerios y pan wawa en Perú.'
  },
  {
    mesNum: 11,
    mesNombre: 'Noviembre',
    dia: 11,
    fechaDisplay: '11 Nov',
    feriadoUsa: 'Veterans Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre / Flujo Bajo',
    impactoDetalle: 'Feriado federal para honrar a los veteranos militares en EE.UU.',
    notaTurista: 'Desfiles y minutos de silencio solemnes a las 11:00 AM.'
  },
  {
    mesNum: 11,
    mesNombre: 'Noviembre',
    dia: 26,
    fechaDisplay: '26 Nov (4to Jue)',
    feriadoUsa: 'Thanksgiving Day',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'usa_libre',
    estadoLaboral: '🟢 Día Libre Total USA',
    impactoDetalle: 'La fiesta más grande de EE.UU. Cierre absoluto de operaciones.',
    notaTurista: 'Cena familiar con pavo relleno, pastel de calabaza y fútbol americano.'
  },
  {
    mesNum: 11,
    mesNombre: 'Noviembre',
    dia: 27,
    fechaDisplay: '27 Nov',
    feriadoUsa: 'Black Friday',
    feriadoPeru: 'Día laborable normal',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '⚪ Súper Flujo en EE.UU.',
    impactoDetalle: 'Día de ventas comerciales masivas en EE.UU. Alto flujo de consultas.',
    notaTurista: 'Colas en tiendas desde la madrugada y compras online.'
  },
  {
    mesNum: 12,
    mesNombre: 'Diciembre',
    dia: 8,
    fechaDisplay: '08 Dic',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Inmaculada Concepción',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado religioso en Perú. En EE.UU. continúan compras navideñas.',
    notaTurista: 'Primera comunión en Perú; en EE.UU. temporada alta de envíos.'
  },
  {
    mesNum: 12,
    mesNombre: 'Diciembre',
    dia: 9,
    fechaDisplay: '09 Dic',
    feriadoUsa: 'Día laborable normal',
    feriadoPeru: 'Batalla de Ayacucho',
    seTrabaja: 'peru_trabaja',
    estadoLaboral: '🟡 SÍ se trabaja para EE.UU.',
    impactoDetalle: 'Feriado nacional peruano; EE.UU. opera en jornada completa.',
    notaTurista: 'Homenaje en la Pampa de la Quinua en Ayacucho.'
  },
  {
    mesNum: 12,
    mesNombre: 'Diciembre',
    dia: 25,
    fechaDisplay: '25 Dic',
    feriadoUsa: 'Christmas Day',
    feriadoPeru: 'Navidad',
    seTrabaja: 'ambos_descanso',
    estadoLaboral: '🔴 Descanso Total',
    impactoDetalle: 'Cierre total en ambos países. Día libre universal.',
    notaTurista: 'Regalos bajo el árbol en la mañana vs cena y panetón a medianoche.'
  }
];

// 2. Choque Cultural & Estilo de Vida (USA vs Perú) a nivel Turista
export const CULTURE_COMPARISON_DATA = [
  {
    aspecto: 'Propinas (Tipping)',
    icon: 'fa-receipt',
    usa: '18% a 20% habitual en mesa. Casi obligatorio en servicios personales.',
    peru: '10% voluntario en restaurantes; no se acostumbra en taxis ni cafeterías.',
    diferencia: 'En EE.UU. los meseros dependen de la propina como sueldo base.'
  },
  {
    aspecto: 'Puntualidad',
    icon: 'fa-stopwatch',
    usa: 'Llegar 5 min antes es puntual ("On time is 5 minutes early").',
    peru: 'La famosa "hora peruana": margen de 15 a 30 minutos de tolerancia social.',
    diferencia: 'En EE.UU. "Time is money"; llegar 1 minuto tarde se siente como falta de respeto.'
  },
  {
    aspecto: 'Formato de Fechas',
    icon: 'fa-calendar-days',
    usa: 'Mes / Día / Año (ej. 07/04/2026 es 4 de julio).',
    peru: 'Día / Mes / Año (ej. 04/07/2026).',
    diferencia: '¡Cuidado con los primeros 12 días del mes! 03/05 en USA es 5 de marzo.'
  },
  {
    aspecto: 'Unidades de Medida',
    icon: 'fa-ruler-combined',
    usa: 'Millas (distancia), Libras (peso), Fahrenheit (clima), Galones (gasolina).',
    peru: 'Kilómetros, Kilogramos, Celsius, Litros (Sistema Métrico).',
    diferencia: '75°F es un día templado agradable (~24°C), no calor extremo.'
  },
  {
    aspecto: 'Voltaje y Enchufes',
    icon: 'fa-plug',
    usa: '110V - 120V con dos clavijas planas paralelas (Tipo A/B).',
    peru: '220V que acepta espigas planas y redondas (Tipo A/B/C).',
    diferencia: 'Conectar un artefacto de 110V a 220V de Perú sin transformador lo quema.'
  },
  {
    aspecto: 'Espacio Personal',
    icon: 'fa-people-arrows',
    usa: 'Burbuja de 1 metro. Si te acercas dicen "Excuse me". Saludo con la mano.',
    peru: 'Mayor cercanía física. Saludo común con beso en la mejilla o abrazo.',
    diferencia: 'En EE.UU. valoran mucho su espacio físico y la privacidad corporal.'
  },
  {
    aspecto: 'Forma de Pago',
    icon: 'fa-credit-card',
    usa: 'Tarjeta de crédito o Apple Pay para todo (incluso $1 en un chicle).',
    peru: 'Efectivo en bodegas y transporte; Yape / Plin muy populares.',
    diferencia: 'Muchos locales en EE.UU. son "Cashless" (no reciben billetes en efectivo).'
  },
  {
    aspecto: 'Impuestos en Compras',
    icon: 'fa-percent',
    usa: 'El precio en etiqueta NO incluye impuestos; el Sales Tax se añade en caja.',
    peru: 'El precio en vitrina siempre incluye el IGV (18%).',
    diferencia: 'Si ves un café a $4.00, al cobrarte pagarás $4.35 según el estado.'
  },
  {
    aspecto: 'Café y Comida Rápida',
    icon: 'fa-mug-hot',
    usa: 'Vaso gigante de café para llevar (Takeout) y ordenar desde el carro (Drive-thru).',
    peru: 'Café sentado en la mesa; el tradicional "menú del día" con sopa y segundo.',
    diferencia: 'Los americanos comen mientras caminan o manejan; en Perú se hace sobremesa.'
  }
];

// 3. Modismos de EE.UU. vs Jerga Peruana (Equivalencias directas)
export const IDIOMS_PERU_DATA = [
  {
    slangUsa: 'Piece of cake',
    fonetica: '(pis of keik)',
    jergaPeru: '¡Papayita! / Al toque',
    significado: 'Algo muy fácil de hacer',
    contextoTurista: 'Cuando una tarea o trámite no requiere esfuerzo.'
  },
  {
    slangUsa: 'Under the weather',
    fonetica: '(ánder de uéder)',
    jergaPeru: 'Achantado / Apitufado',
    significado: 'Sentirse mal o resfriado',
    contextoTurista: 'Estar desganado por inicio de gripe o malestar corporal.'
  },
  {
    slangUsa: 'Hit the ground running',
    fonetica: '(jit de graund raning)',
    jergaPeru: 'Arrancar con todo / Estar pilas',
    significado: 'Empezar con máxima energía',
    contextoTurista: 'Llegar a un trabajo o proyecto y avanzar de inmediato.'
  },
  {
    slangUsa: 'Call it a day',
    fonetica: '(kol it ei dei)',
    jergaPeru: 'Chapa tus cosas / Chau turno',
    significado: 'Terminar la jornada laboral',
    contextoTurista: 'Hora de apagar la computadora e irse a descansar.'
  },
  {
    slangUsa: 'Bite the bullet',
    fonetica: '(bait de búlet)',
    jergaPeru: 'Apechugar / Poner el pecho',
    significado: 'Afrontar una situación difícil',
    contextoTurista: 'Tomar valor para hacer algo incómodo pero necesario.'
  },
  {
    slangUsa: 'Rain check',
    fonetica: '(rein chek)',
    jergaPeru: 'Para la próxima / Te la debo',
    significado: 'Posponer una invitación',
    contextoTurista: 'Aceptar la salida pero para otra ocasión más conveniente.'
  },
  {
    slangUsa: 'Break a leg',
    fonetica: '(breik ei leg)',
    jergaPeru: '¡Rómpela! / Buena suerte',
    significado: 'Deseo de éxito en un reto',
    contextoTurista: 'Superstición teatral americana: desear buena suerte diciendo lo contrario.'
  },
  {
    slangUsa: 'Spill the beans',
    fonetica: '(spil de bins)',
    jergaPeru: 'Soltar la sopa / Cantar todo',
    significado: 'Revelar un secreto',
    contextoTurista: 'Contar lo que todos estaban esperando saber.'
  },
  {
    slangUsa: 'Back to square one',
    fonetica: '(bak tu skwer wan)',
    jergaPeru: 'Volver a fojas cero',
    significado: 'Empezar de nuevo desde cero',
    contextoTurista: 'Cuando un plan falló y toca reiniciar el proceso.'
  },
  {
    slangUsa: 'Cost an arm and a leg',
    fonetica: '(kost an arm and a leg)',
    jergaPeru: 'Cuesta un ojo de la cara',
    significado: 'Extremadamente caro',
    contextoTurista: 'Precios inflados en zonas turísticas o productos de lujo.'
  },
  {
    slangUsa: 'Cut corners',
    fonetica: '(kat córners)',
    jergaPeru: 'Hacerlo a la champa',
    significado: 'Hacer las cosas a medias',
    contextoTurista: 'Tomar atajos que terminan perjudicando la calidad.'
  },
  {
    slangUsa: 'On the same page',
    fonetica: '(on de seim peich)',
    jergaPeru: 'En la misma sintonía',
    significado: 'Estar de mutuo acuerdo',
    contextoTurista: 'Sincronizados en una idea sin malentendidos.'
  }
];

// 4. Regiones de EE.UU. comparadas con Ciudades/Regiones del Perú
export const REGIONS_PERU_DATA = [
  {
    regionUsa: 'Noreste (Costa Este)',
    estados: 'NY, NJ, MA, PA, CT, Boston, Filadelfia',
    estiloVida: 'Rápido, ejecutivo, directo y acelerado. Caminan rápido y van al grano.',
    equivalentePeru: 'Lima Ejecutiva (San Isidro / Miraflores / Centro Financiero)',
    detalleTurista: 'Gente siempre con prisa, café grande en mano y cero rodeos en la conversación.'
  },
  {
    regionUsa: 'El Sur (The South)',
    estados: 'TX, FL, GA, NC, SC, TN, Miami, Atlanta, Dallas',
    estiloVida: 'Cálido, hospitalario ("Southern Hospitality"), parrilladas BBQ y trato muy educado.',
    equivalentePeru: 'Norte Peruano (Piura / Chiclayo / Trujillo: cálidos, alegres y hospitalarios)',
    detalleTurista: 'Uso tradicional de "Sir" y "Ma’am"; comen abundante y aprecian la charla amable.'
  },
  {
    regionUsa: 'Medio Oeste (Midwest)',
    estados: 'IL, OH, MI, IN, WI, MN, Chicago, Cleveland',
    estiloVida: 'Gente pacífica, servicial ("Midwest Nice"), campos de maíz, lagos y nieve.',
    equivalentePeru: 'Sierra Central / Arequipa (amables, trabajadores, tono calmado y acogedor)',
    detalleTurista: 'Te saludan en la calle sin conocerte; clima frío en invierno pero gente muy hogareña.'
  },
  {
    regionUsa: 'Costa Oeste (West Coast)',
    estados: 'CA, WA, OR, NV, Los Angeles, San Francisco, Seattle',
    estiloVida: 'Relajado, innovador, amante del café, playa, vida fitness y tecnología.',
    equivalentePeru: 'Barranco Bohemio / Costa Verde / Tarapoto relajado y natural',
    detalleTurista: 'Visten casual incluso para trabajar (jeans y zapatillas); muy ecologistas y open-minded.'
  }
];
