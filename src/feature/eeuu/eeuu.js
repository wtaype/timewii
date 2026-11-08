// src/feature/eeuu/eeuu.js
// 🇺🇸 vs 🇵🇪 Lógica del Calendario Anual 6x6 Perpetuo y Dinámico, Tooltip Flotante y Filtros Laborales
// 100% Cero latencia · Local-First · Idempotente y compatible con Astro ClientRouter

import { HOLIDAYS_COMPARISON_DATA } from '@semillas/cultureData.js';

const NOMBRES_MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA_NOMBRES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// =============================================================================
// ALGORITMOS MATEMÁTICOS PERPETUOS DE CALENDARIO & DÍAS MÓVILES
// =============================================================================

function pad2(n) {
  return String(n).padStart(2, '0');
}

// N-ésimo día de la semana de un mes (ej. 3er lunes = n=3, dayOfWeek=1)
function getNthDayOfMonth(year, month, dayOfWeek, n) {
  let date = new Date(year, month - 1, 1);
  let count = 0;
  while (date.getMonth() === month - 1) {
    if (date.getDay() === dayOfWeek) {
      count++;
      if (count === n) return date.getDate();
    }
    date.setDate(date.getDate() + 1);
  }
  return 1;
}

// Último día de la semana de un mes (ej. último lunes de mayo)
function getLastDayOfWeekOfMonth(year, month, dayOfWeek) {
  let date = new Date(year, month, 0);
  while (date.getDay() !== dayOfWeek) {
    date.setDate(date.getDate() - 1);
  }
  return date.getDate();
}

// Algoritmo Canónico de Pascua (Meeus/Jones/Butcher) para Jueves y Viernes Santo de cualquier año
function calcularSemanaSanta(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  const domingoPascua = new Date(year, mes - 1, dia);
  const juevesSanto = new Date(domingoPascua);
  juevesSanto.setDate(domingoPascua.getDate() - 3);
  const viernesSanto = new Date(domingoPascua);
  viernesSanto.setDate(domingoPascua.getDate() - 2);

  return {
    jueves: { mes: juevesSanto.getMonth() + 1, dia: juevesSanto.getDate() },
    viernes: { mes: viernesSanto.getMonth() + 1, dia: viernesSanto.getDate() }
  };
}

function formatearFechaEspanol(year, mes, dia) {
  const fecha = new Date(year, mes - 1, dia);
  const nombreDia = DIAS_SEMANA_NOMBRES[fecha.getDay()];
  const nombreMes = NOMBRES_MESES[mes];
  return `${nombreDia}, ${dia} de ${nombreMes} de ${year}`;
}

// Generador Perpetuo de la Base de Datos de Feriados para cualquier Año
function generarDetallesFeriados(year) {
  const feriados = {};

  function agregar(mes, dia, country, countryLabel, countryFlag, title, why, workImpact, workDetail) {
    const key = `${pad2(mes)}-${pad2(dia)}`;
    feriados[key] = {
      dateDisplay: formatearFechaEspanol(year, mes, dia),
      country,
      countryLabel,
      countryFlag,
      title,
      why,
      workImpact,
      workDetail
    };
  }

  // --- 1. FERIADOS FIJOS (Universal anual) ---
  agregar(1, 1, 'both', 'Ambos Países (EE.UU. y Perú)', '🇺🇸 ⟷ 🇵🇪',
    'New Year’s Day / Año Nuevo',
    'Celebración universal del inicio del nuevo año calendario con resoluciones personales y reuniones familiares.',
    '🟢 Descanso Total General',
    'Líneas de atención cerradas en EE.UU. y feriado no laborable en Perú. Descanso absoluto para todos los equipos.');

  agregar(5, 1, 'peru', 'Perú', '🇵🇪',
    'Día Internacional de los Trabajadores',
    'Conmemoración mundial de las reivindicaciones laborales y la jornada de 8 horas (en EE.UU. se celebra en septiembre).',
    '🔴 SÍ se trabaja para EE.UU.',
    'EE.UU. no observa feriado el 1 de mayo. Clientes llaman habitualmente; se abona el recargo legal correspondiente.');

  agregar(6, 7, 'peru', 'Perú', '🇵🇪',
    'Día de la Bandera y Batalla de Arica',
    'Homenaje patriótico al heroísmo de Francisco Bolognesi y Alfonso Ugarte en 1880.',
    '🔴 SÍ se trabaja para EE.UU.',
    'Feriado nacional en el Perú. Turnos remotos hacia campañas americanas laboran con pago de ley.');

  agregar(6, 19, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Juneteenth National Independence Day',
    'Celebración de la emancipación de los esclavos afroamericanos en Texas (1865). Feriado federal de libertad y comunidad.',
    '🔵 Día Libre Campaña USA',
    'Feriado federal oficial en EE.UU. Bancos e instituciones cerradas; líneas con tráfico mínimo o cerradas.');

  agregar(6, 29, 'peru', 'Perú', '🇵🇪',
    'Día de San Pedro y San Pablo',
    'Festividad patronal de los apóstoles y día del pescador en Perú; tradición de procesión marítima.',
    '🔴 SÍ se trabaja para EE.UU.',
    'En EE.UU. es día regular sin restricciones. Asesor en Perú labora con el beneficio salarial de feriado.');

  agregar(7, 4, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Independence Day (4th of July)',
    'Máxima fiesta nacional de EE.UU.; proclamación de la Independencia en 1776 con parrilladas y fuegos artificiales.',
    '🔵 Día Libre Campaña USA',
    'Cierre total de operaciones en EE.UU. Sin servicio de llamadas en campañas americanas.');

  agregar(7, 23, 'peru', 'Perú', '🇵🇪',
    'Día de la Fuerza Aérea del Perú (FAP)',
    'Homenaje a la inmolación del héroe nacional José Abelardo Quiñones en la batalla de Quebrada Seca (1941).',
    '🔴 SÍ se trabaja para EE.UU.',
    'Feriado en Perú pero jornada hábil completa en EE.UU. Tráfico de llamadas estándar.');

  agregar(7, 28, 'peru', 'Perú', '🇵🇪',
    'Fiestas Patrias del Perú (Independencia)',
    'Celebración cumbre de la Independencia proclamada por Don José de San Martín en 1821.',
    '🔴 SÍ se trabaja para EE.UU.',
    'En EE.UU. es día laborable normal. Campañas remotas continúan activas y se paga feriado de ley.');

  agregar(7, 29, 'peru', 'Perú', '🇵🇪',
    'Fiestas Patrias del Perú (Gran Parada Militar)',
    'Segundo día de Fiestas Patrias en honor a las Fuerzas Armadas y Policía Nacional con desfile en Lima.',
    '🔴 SÍ se trabaja para EE.UU.',
    'Jornada comercial estándar en EE.UU. Operación activa con remuneración de feriado.');

  agregar(8, 6, 'peru', 'Perú', '🇵🇪',
    'Batalla de Junín',
    'Conmemoración del triunfo de las fuerzas patriotas en 1824 que aceleró la independencia de América del Sur.',
    '🔴 SÍ se trabaja para EE.UU.',
    'Feriado en Perú; en EE.UU. día normal de atención.');

  agregar(8, 30, 'peru', 'Perú', '🇵🇪',
    'Santa Rosa de Lima',
    'Festividad de la primera santa de América y patrona de la Policía Nacional; cartas en el Pozo de los Deseos.',
    '🔴 SÍ se trabaja para EE.UU.',
    'Feriado religioso en Perú; turnos hacia EE.UU. operan con normalidad.');

  agregar(10, 8, 'peru', 'Perú', '🇵🇪',
    'Combate de Angamos',
    'Homenaje al heroísmo del Gran Almirante Miguel Grau y la tripulación del monitor Huáscar en 1879.',
    '🔴 SÍ se trabaja para EE.UU.',
    'En EE.UU. es día laboral regular. El asesor atiende con compensación salarial de feriado.');

  agregar(10, 31, 'both', 'Ambos Países (EE.UU. y Perú)', '🇺🇸 ⟷ 🇵🇪',
    'Halloween / Día de la Canción Criolla',
    'Día festivo dual: disfraces y dulces en EE.UU. combinados con música criolla y marinera en el Perú.',
    '⚪ Jornada Regular con Alta Vibra',
    'No es feriado oficial bancario pero tiene alto dinamismo en interacciones y preguntas con clientes.');

  agregar(11, 1, 'peru', 'Perú', '🇵🇪',
    'Día de Todos los Santos',
    'Tradición familiar de visitar cementerios, colocar flores y compartir tantawawas en provincias peruanas.',
    '🔴 SÍ se trabaja para EE.UU.',
    'En EE.UU. la banca y comercio operan en su jornada normal. Se remunera feriado de ley.');

  agregar(11, 11, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Veterans Day (Día de los Veteranos)',
    'Homenaje solemne a los veteranos militares vivos de las Fuerzas Armadas de EE.UU. con minuto de silencio oficial.',
    '🔵 Día Libre / Bajo Flujo USA',
    'Feriado federal en EE.UU. Bancos y correo postal cerrados; volumen de llamadas reducido.');

  agregar(12, 8, 'peru', 'Perú', '🇵🇪',
    'Inmaculada Concepción',
    'Festividad católica tradicional en Perú dedicada a la Virgen María y temporada de primeras comuniones.',
    '🔴 SÍ se trabaja para EE.UU.',
    'En EE.UU. es temporada alta de comercio navideño. Asesor atiende con pago de feriado de ley.');

  agregar(12, 9, 'peru', 'Perú', '🇵🇪',
    'Batalla de Ayacucho',
    'Conmemoración de la victoria libertaria en la Pampa de la Quinua (1824) comandada por Antonio José de Sucre.',
    '🔴 SÍ se trabaja para EE.UU.',
    'Feriado oficial en Perú. EE.UU. opera en jornada estándar.');

  agregar(12, 25, 'both', 'Ambos Países (EE.UU. y Perú)', '🇺🇸 ⟷ 🇵🇪',
    'Christmas Day / Navidad',
    'Celebración universal del nacimiento de Jesús con regalos, cena navideña y unión familiar.',
    '🟢 Descanso Total General',
    'Cierre total de operaciones en EE.UU. y feriado no laborable en Perú. Descanso absoluto general.');

  // --- 2. FERIADOS MÓVILES (Calculados matemáticamente según el año) ---
  // A. Martin Luther King Jr. Day (3er lunes de Enero)
  const diaMlk = getNthDayOfMonth(year, 1, 1, 3);
  agregar(1, diaMlk, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Martin Luther King Jr. Day',
    'Homenaje al líder histórico de los derechos civiles en EE.UU., promotor de la igualdad y la justicia social.',
    '🔵 Día Libre Campaña USA',
    'Feriado federal en EE.UU. Bancos, bolsa y entes públicos cerrados. Líneas de atención cerradas o volumen mínimo.');

  // B. Presidents’ Day (3er lunes de Febrero)
  const diaPres = getNthDayOfMonth(year, 2, 1, 3);
  agregar(2, diaPres, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Presidents’ Day (Washington’s Birthday)',
    'Conmemoración del natalicio de George Washington y Abraham Lincoln, celebrando la democracia de EE.UU.',
    '🔵 Día Libre / Bajo Flujo USA',
    'Feriado federal en EE.UU. Operaciones comerciales operan con personal mínimo o descanso de campaña.');

  // C. Semana Santa en Perú (Jueves y Viernes Santo)
  const { jueves, viernes } = calcularSemanaSanta(year);
  agregar(jueves.mes, jueves.dia, 'peru', 'Perú', '🇵🇪',
    'Jueves Santo',
    'Conmemoración solemne de la Última Cena y el lavado de pies. Tradición de viaje y recogimiento en Perú.',
    '🔴 SÍ se trabaja para EE.UU.',
    'En EE.UU. es día hábil regular. El asesor en Perú labora su turno habitual (con pago de feriado de ley).');

  agregar(viernes.mes, viernes.dia, 'peru', 'Perú', '🇵🇪',
    'Viernes Santo',
    'Conmemoración de la crucifixión de Jesús. Tradición popular en Perú de recorrer las 7 iglesias y comer pescado.',
    '🔴 SÍ se trabaja para EE.UU.',
    'Campañas americanas continúan operando con normalidad total. Asesores remotos atienden con pago de feriado.');

  // D. Memorial Day (Último lunes de Mayo)
  const diaMem = getLastDayOfWeekOfMonth(year, 5, 1);
  agregar(5, diaMem, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Memorial Day (Día de los Caídos)',
    'Homenaje solemne a los militares caídos de EE.UU. Marca el inicio festivo del verano americano.',
    '🔵 Día Libre Total USA',
    'Cierre total de operaciones en EE.UU. La gran mayoría de campañas de soporte y ventas descansan.');

  // E. Labor Day EE.UU. (1er lunes de Septiembre)
  const diaLabor = getNthDayOfMonth(year, 9, 1, 1);
  agregar(9, diaLabor, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Labor Day (Día del Trabajo en EE.UU.)',
    'Reconocimiento nacional a la fuerza laboral de EE.UU. Marca el final del verano americano y el retorno escolar.',
    '🔵 Día Libre Campaña USA',
    'Cierre total de operaciones y atención telefónica en EE.UU. Descanso para campañas de servicio al cliente.');

  // F. Columbus Day / Indigenous Peoples’ Day (2do lunes de Octubre)
  const diaCol = getNthDayOfMonth(year, 10, 1, 2);
  agregar(10, diaCol, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Columbus Day / Indigenous Peoples’ Day',
    'Feriado federal en EE.UU. que honra la historia americana y la cultura de los pueblos indígenas.',
    '🔵 Bajo Flujo / Día Libre USA',
    'Cierres bancarios e institucionales en EE.UU. Llamadas moderadas a bajas; muchas campañas descansan.');

  // G. Thanksgiving Day (4to jueves de Noviembre)
  const diaThx = getNthDayOfMonth(year, 11, 4, 4);
  agregar(11, diaThx, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Thanksgiving Day (Acción de Gracias)',
    'La fiesta familiar más emblemática de EE.UU.; reunión con pavo al horno, gratitud y partidos de la NFL.',
    '🔵 Día Libre Total USA',
    'Cierre total de operaciones en EE.UU. Ninguna campaña opera; día libre absoluto.');

  // H. Black Friday (Viernes siguiente a Thanksgiving)
  const diaBf = diaThx + 1;
  agregar(11, diaBf, 'usa', 'Estados Unidos (EE.UU.)', '🇺🇸',
    'Black Friday (Viernes Negro)',
    'El día de descuentos comerciales más intenso del año en EE.UU., dando inicio a las compras navideñas masivas.',
    '⚪ Alto Flujo en Campañas USA',
    'Día laboral de máxima demanda en cuentas de retail, envíos y pagos en EE.UU.');

  return feriados;
}

// =============================================================================
// ESTADO Y RENDERIZADO DEL CALENDARIO DINÁMICO
// =============================================================================

let anioActivo = 2026;
let feriadosActivos = generarDetallesFeriados(anioActivo);

export function inicializarEeuu() {
  const container = document.getElementById('eeuuContainer');
  if (!container) return;

  if (container.dataset.bound === 'true') return;
  container.dataset.bound = 'true';

  configurarTabsCategorias();
  configurarCalendarioAnual();
  configurarFiltroFeriados();
  configurarBuscadorModismos();
}

// 1. Navegación por Categorías de Tablas
function configurarTabsCategorias() {
  const tabs = document.querySelectorAll('#eeuuTabSelector .wii-eeuu-tab-btn');
  const cards = {
    holidays: document.querySelector('.wii-card-holidays'),
    etiquette: document.querySelector('.wii-card-etiquette'),
    idioms: document.querySelector('.wii-card-idioms'),
    regions: document.querySelector('.wii-card-regions')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-category');

      Object.keys(cards).forEach(key => {
        const card = cards[key];
        if (!card) return;

        if (cat === 'all' || cat === key) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 2. Calendario Anual Perpetuo & Tooltip en Hover
function configurarCalendarioAnual() {
  const calBox = document.getElementById('annualCalendarBox') || document.querySelector('.wii-annual-calendar-box');
  const grid = document.getElementById('annualCalendarGrid');
  const tooltip = document.getElementById('holidayHoverTooltip');

  if (!calBox || !grid || !tooltip) return;

  const titleYear = document.getElementById('calTitleYear');
  const lblYear = document.getElementById('lblCalCurrentYear');
  const btnPrev = document.getElementById('btnCalPrevYear');
  const btnNext = document.getElementById('btnCalNextYear');
  const quickChips = document.querySelectorAll('.wii-year-chip[data-year]');

  const countryPill = document.getElementById('httCountryPill');
  const flagEl = document.getElementById('httCountryFlag');
  const tagEl = document.getElementById('httCountryTag');
  const dateEl = document.getElementById('httDateDisplay');
  const badgeEl = document.getElementById('httWorkBadge');
  const titleEl = document.getElementById('httHolidayTitle');
  const whyEl = document.getElementById('httHolidayWhy');
  const detailEl = document.getElementById('httWorkDetail');

  function ocultarTooltip() {
    tooltip.style.display = 'none';
  }

  // Renderizar la cuadrícula completa de los 12 meses matemáticamente
  function renderizarCuadriculaAnual(year) {
    anioActivo = year;
    feriadosActivos = generarDetallesFeriados(year);

    if (titleYear) titleYear.textContent = year;
    if (lblYear) lblYear.textContent = year;

    quickChips.forEach(chip => {
      chip.classList.toggle('active', Number(chip.getAttribute('data-year')) === year);
    });

    let html = '';

    for (let m = 1; m <= 12; m++) {
      const mesPad = pad2(m);
      const nombreMes = NOMBRES_MESES[m];
      const totalDias = new Date(year, m, 0).getDate();
      // Lunes = 0, Domingo = 6
      const diaSemana1 = new Date(year, m - 1, 1).getDay();
      const offset = (diaSemana1 + 6) % 7;

      // Contar feriados en este mes
      const feriadosDelMes = Object.keys(feriadosActivos).filter(k => k.startsWith(mesPad));
      const totalFeriados = feriadosDelMes.length;

      html += `
        <div class="wii-month-mini-card" data-month-num="${m}">
          <div class="wii-mm-header">
            <span class="wii-mm-name">${nombreMes}</span>
            ${totalFeriados > 0 ? `<span class="wii-mm-badge">${totalFeriados} feriado${totalFeriados === 1 ? '' : 's'}</span>` : ''}
          </div>

          <div class="wii-mm-weekdays">
            <span>L</span>
            <span>M</span>
            <span>M</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          <div class="wii-mm-days">
      `;

      // Celdas vacías
      for (let o = 0; o < offset; o++) {
        html += `<div class="wii-mm-day is-empty"></div>`;
      }

      // Días del mes
      for (let d = 1; d <= totalDias; d++) {
        const diaPad = pad2(d);
        const key = `${mesPad}-${diaPad}`;
        const feriado = feriadosActivos[key];

        if (feriado) {
          html += `
            <button
              type="button"
              class="wii-mm-day has-holiday holiday-${feriado.country}"
              data-date="${year}-${key}"
              data-month="${m}"
              data-day="${d}"
              data-holiday-key="${key}"
              aria-label="${d} de ${nombreMes}: ${feriado.title}"
            >
              <span class="wii-day-num">${d}</span>
              <span class="wii-cal-dot dot-${feriado.country}"></span>
            </button>
          `;
        } else {
          html += `
            <button
              type="button"
              class="wii-mm-day"
              data-date="${year}-${key}"
              data-month="${m}"
              data-day="${d}"
              aria-label="${d} de ${nombreMes}"
            >
              <span class="wii-day-num">${d}</span>
            </button>
          `;
        }
      }

      html += `
          </div>
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  // Controles de Cambio de Año
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      renderizarCuadriculaAnual(anioActivo - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      renderizarCuadriculaAnual(anioActivo + 1);
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetYear = Number(chip.getAttribute('data-year'));
      if (targetYear && targetYear !== anioActivo) {
        renderizarCuadriculaAnual(targetYear);
      }
    });
  });

  // Seguimiento del cursor sobre el calendario para Tooltip Hover
  grid.addEventListener('mousemove', (e) => {
    const dayBtn = e.target.closest('.wii-mm-day.has-holiday, .wii-mm-day[data-holiday-key]');

    if (dayBtn) {
      const key = dayBtn.getAttribute('data-holiday-key') || '';
      const data = feriadosActivos[key];

      if (data) {
        if (flagEl) flagEl.textContent = data.countryFlag;
        if (tagEl) tagEl.textContent = data.countryLabel;
        if (countryPill) {
          countryPill.className = `wii-htt-country-pill pill-${data.country}`;
        }
        if (badgeEl) {
          badgeEl.textContent = data.workImpact;
          badgeEl.className = `wii-htt-badge badge-${data.country}`;
        }
        if (titleEl) titleEl.textContent = data.title;
        if (dateEl) dateEl.textContent = data.dateDisplay;
        if (whyEl) whyEl.textContent = data.why;
        if (detailEl) detailEl.textContent = data.workDetail;

        // Mostrar y posicionar el tooltip
        tooltip.style.display = 'flex';

        const rect = calBox.getBoundingClientRect();
        const ttWidth = 320;
        const ttHeight = 160;

        let x = e.clientX - rect.left + 14;
        let y = e.clientY - rect.top + 14;

        if (x + ttWidth > rect.width) {
          x = e.clientX - rect.left - ttWidth - 12;
        }
        if (y + ttHeight > rect.height) {
          y = e.clientY - rect.top - ttHeight - 12;
        }

        tooltip.style.left = `${Math.max(8, x)}px`;
        tooltip.style.top = `${Math.max(8, y)}px`;
        return;
      }
    }

    ocultarTooltip();
  });

  grid.addEventListener('mouseleave', ocultarTooltip);
  calBox.addEventListener('mouseleave', ocultarTooltip);

  // Inicialización: aseguramos que el calendario esté renderizado para el año activo
  renderizarCuadriculaAnual(anioActivo);
}

// 3. Filtro de Feriados en la Tabla Inferior
function configurarFiltroFeriados() {
  const chips = document.querySelectorAll('#holidaysFilterChips .wii-chip-btn');
  const rows = document.querySelectorAll('#tbodyFeriados tr');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');

      rows.forEach(row => {
        const workType = row.getAttribute('data-work-type');
        if (filter === 'all' || workType === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

// 4. Buscador en Tiempo Real de Modismos / Slang
function configurarBuscadorModismos() {
  const input = document.getElementById('idiomSearchInput');
  const clearBtn = document.getElementById('btnClearIdiomSearch');
  const countBadge = document.getElementById('idiomCountBadge');
  const rows = document.querySelectorAll('#tbodyModismos .wii-idiom-row');

  if (!input || !rows.length) return;

  function filtrarModismos() {
    const query = input.value.trim().toLowerCase();
    let visibles = 0;

    if (clearBtn) {
      clearBtn.style.display = query ? 'flex' : 'none';
    }

    rows.forEach(row => {
      const searchData = row.getAttribute('data-search') || '';
      if (!query || searchData.includes(query)) {
        row.style.display = '';
        visibles++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = query ? `${visibles} RESULTADO${visibles === 1 ? '' : 'S'}` : `${rows.length} MODISMOS`;
    }
  }

  input.addEventListener('input', filtrarModismos);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      filtrarModismos();
      input.focus();
    });
  }
}
