// src/feature/eeuu/eeuu.js
// 🇺🇸 vs 🇵🇪 Lógica del Calendario Anual 6x6, Modal Interactivo y Filtros Laborales
// 100% Cero latencia · Local-First · Idempotente y compatible con Astro ClientRouter

import { HOLIDAYS_COMPARISON_DATA } from '@semillas/cultureData.js';

// Base de Datos Detallada de Feriados para el Modal Interactivo (2026)
const DETALLES_FERIADOS = {
  '01-01': {
    dateDisplay: 'Jueves, 1 de Enero de 2026',
    country: 'both',
    countryLabel: 'Ambos Países (EE.UU. y Perú)',
    countryFlag: '🇺🇸 ⟷ 🇵🇪',
    title: 'New Year’s Day / Año Nuevo',
    why: 'Celebración universal del inicio del nuevo año calendario con resoluciones personales, reuniones y celebraciones familiares.',
    workImpact: '🟢 Descanso Total General',
    workDetail: 'Líneas de atención cerradas en EE.UU. y feriado no laborable en Perú. Descanso absoluto para todos los equipos.'
  },
  '01-19': {
    dateDisplay: 'Lunes, 19 de Enero de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Martin Luther King Jr. Day',
    why: 'Homenaje al líder histórico de los derechos civiles en EE.UU., promotor de la igualdad, la justicia racial y el servicio comunitario.',
    workImpact: '🔵 Día Libre Campaña USA',
    workDetail: 'Feriado federal en EE.UU. Bancos, bolsa y oficinas gubernamentales cerradas. Líneas de atención cerradas o volumen mínimo.'
  },
  '02-16': {
    dateDisplay: 'Lunes, 16 de Febrero de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Presidents’ Day (Washington’s Birthday)',
    why: 'Conmemoración del natalicio de George Washington y Abraham Lincoln, celebrando el legado democrático de los líderes de EE.UU.',
    workImpact: '🔵 Día Libre / Bajo Flujo USA',
    workDetail: 'Feriado federal en EE.UU. Operaciones comerciales operan con personal mínimo o descanso de campaña.'
  },
  '04-02': {
    dateDisplay: 'Jueves, 2 de Abril de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Jueves Santo',
    why: 'Conmemoración cristiana solemne de la Última Cena y el lavado de pies. Tradición de recogimiento y viaje a provincias en Perú.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'En EE.UU. es día hábil regular. El asesor en Perú labora su turno habitual (con pago doble/feriado según legislación peruana).'
  },
  '04-03': {
    dateDisplay: 'Viernes, 3 de Abril de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Viernes Santo',
    why: 'Conmemoración de la crucifixión de Jesús. Tradición popular en Perú de recorrer las 7 iglesias y comer pescado.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Campañas americanas continúan operando con normalidad total. Asesores remotos atienden en su jornada estándar con pago de feriado.'
  },
  '05-01': {
    dateDisplay: 'Viernes, 1 de Mayo de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Día Internacional de los Trabajadores',
    why: 'Conmemoración mundial de las reivindicaciones laborales y la jornada de 8 horas (en EE.UU. el día del trabajo se celebra en septiembre).',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'EE.UU. no observa feriado el 1 de mayo. Clientes llaman habitualmente; se abona el recargo legal correspondiente.'
  },
  '05-25': {
    dateDisplay: 'Lunes, 25 de Mayo de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Memorial Day (Día de los Caídos)',
    why: 'Homenaje solemne a los militares que dieron su vida por EE.UU. Marca el inicio festivo del verano americano con parrilladas familiares.',
    workImpact: '🔵 Día Libre Total USA',
    workDetail: 'Cierre total de operaciones en EE.UU. La gran mayoría de campañas de soporte y ventas descansan.'
  },
  '06-07': {
    dateDisplay: 'Domingo, 7 de Junio de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Día de la Bandera y Batalla de Arica',
    why: 'Conmemoración del heroísmo de Francisco Bolognesi y Alfonso Ugarte en la defensa patriótica de Arica en 1880.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Feriado nacional en el Perú. Si el asesor tiene turno dominical programado, labora con la compensación de feriado.'
  },
  '06-19': {
    dateDisplay: 'Viernes, 19 de Junio de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Juneteenth National Independence Day',
    why: 'Celebración de la emancipación de los esclavos afroamericanos en Texas (1865). Feriado federal de libertad y cultura comunitaria.',
    workImpact: '🔵 Día Libre Campaña USA',
    workDetail: 'Feriado federal oficial en EE.UU. Bancos e instituciones cerradas; líneas telefónicas con tráfico mínimo o cerradas.'
  },
  '06-29': {
    dateDisplay: 'Lunes, 29 de Junio de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Día de San Pedro y San Pablo',
    why: 'Festividad patronal de los apóstoles y día del pescador en Perú; tradición de procesión marítima en los muelles de Chorrillos y el Callao.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'En EE.UU. es día regular sin restricciones. Asesor en Perú labora con el beneficio salarial de feriado.'
  },
  '07-04': {
    dateDisplay: 'Sábado, 4 de Julio de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Independence Day (4th of July)',
    why: 'Máxima fiesta nacional de EE.UU.; proclamación de la Independencia en 1776 celebrada con picnics, parrilladas y espectáculos pirotécnicos.',
    workImpact: '🔵 Día Libre Campaña USA',
    workDetail: 'Cierre total de operaciones en EE.UU. Sin servicio de llamadas en campañas americanas.'
  },
  '07-23': {
    dateDisplay: 'Jueves, 23 de Julio de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Día de la Fuerza Aérea del Perú (FAP)',
    why: 'Homenaje a la inmolación del héroe nacional José Abelardo Quiñones en la batalla de Quebrada Seca (1941).',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Feriado en Perú pero jornada hábil completa en EE.UU. Tráfico de llamadas estándar.'
  },
  '07-28': {
    dateDisplay: 'Martes, 28 de Julio de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Fiestas Patrias del Perú (Independencia)',
    why: 'Celebración cumbre de la Independencia proclamada por Don José de San Martín en 1821; mensaje a la nación y comidas típicas criollas.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'En EE.UU. es día laborable normal. Campañas remotas continúan activas y se paga feriado oficial según legislación peruana.'
  },
  '07-29': {
    dateDisplay: 'Miércoles, 29 de Julio de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Fiestas Patrias del Perú (Gran Parada Militar)',
    why: 'Segundo día de Fiestas Patrias en honor a las Fuerzas Armadas y Policía Nacional con el tradicional desfile militar en Lima.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Jornada comercial estándar en EE.UU. Operación activa con remuneración de feriado.'
  },
  '08-06': {
    dateDisplay: 'Jueves, 6 de Agosto de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Batalla de Junín',
    why: 'Conmemoración del triunfo de las fuerzas patriotas en 1824 que aceleró la independencia de América del Sur.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Feriado en Perú; en EE.UU. día normal de atención.'
  },
  '08-30': {
    dateDisplay: 'Domingo, 30 de Agosto de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Santa Rosa de Lima',
    why: 'Festividad de la primera santa de América y patrona de la Policía Nacional; cartas de devoción en el Pozo de los Deseos.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Feriado religioso en Perú; turnos dominicales hacia EE.UU. operan con normalidad.'
  },
  '09-07': {
    dateDisplay: 'Lunes, 7 de Septiembre de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Labor Day (Día del Trabajo en EE.UU.)',
    why: 'Reconocimiento nacional a la fuerza laboral de EE.UU. Marca el final de la temporada estival americana y el retorno escolar.',
    workImpact: '🔵 Día Libre Campaña USA',
    workDetail: 'Cierre total de operaciones y atención telefónica en EE.UU. Descanso para campañas de servicio al cliente.'
  },
  '10-08': {
    dateDisplay: 'Jueves, 8 de Octubre de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Combate de Angamos',
    why: 'Homenaje al Gran Almirante Miguel Grau Seminario y la tripulación del Huáscar por su patriotismo y caballerosidad en 1879.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'En EE.UU. es día hábil ordinario. Asesor remoto labora con la compensación de feriado de ley.'
  },
  '10-12': {
    dateDisplay: 'Lunes, 12 de Octubre de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Columbus Day / Indigenous Peoples’ Day',
    why: 'Feriado federal en EE.UU. que conmemora el arribo de Colón a América y honra la cultura y resiliencia de los pueblos indígenas.',
    workImpact: '🔵 Bajo Flujo / Día Libre USA',
    workDetail: 'Cierres bancarios e institucionales en EE.UU. Llamadas moderadas a bajas; muchas campañas descansan.'
  },
  '10-31': {
    dateDisplay: 'Sábado, 31 de Octubre de 2026',
    country: 'both',
    countryLabel: 'Festividad en Ambos Países',
    countryFlag: '🇺🇸 ⟷ 🇵🇪',
    title: 'Halloween & Día de la Canción Criolla',
    why: 'Noche de dulces y disfraces ("Trick or Treat") en EE.UU. y homenaje a la música criolla con guitarra y cajón en peñas del Perú.',
    workImpact: '⚪ Día Laborable Festivo',
    workDetail: 'Ambos países laboran sus horarios normales; ambiente festivo durante la tarde y noche.'
  },
  '11-01': {
    dateDisplay: 'Domingo, 1 de Noviembre de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Día de Todos los Santos',
    why: 'Tradición solemne en honor a los difuntos; visitas masivas a los camposantos y consumo de la tradicional tanta wawa en Perú.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'En EE.UU. es día ordinario; turnos de soporte operan con normalidad.'
  },
  '11-11': {
    dateDisplay: 'Miércoles, 11 de Noviembre de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Veterans Day (Día de los Veteranos)',
    why: 'Homenaje solemne a los veteranos militares vivos de las Fuerzas Armadas de EE.UU. Minuto de silencio oficial a las 11:00 AM.',
    workImpact: '🔵 Día Libre / Bajo Flujo USA',
    workDetail: 'Feriado federal en EE.UU. Bancos y correo postal cerrados; volumen de llamadas reducido.'
  },
  '11-26': {
    dateDisplay: 'Jueves, 26 de Noviembre de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Thanksgiving Day (Acción de Gracias)',
    why: 'La fiesta familiar más emblemática de EE.UU.; reunión con pavo al horno, gratitud y partidos de fútbol americano de la NFL.',
    workImpact: '🔵 Día Libre Total USA',
    workDetail: 'Cierre total de operaciones en EE.UU. Ninguna campaña opera; día libre absoluto.'
  },
  '11-27': {
    dateDisplay: 'Viernes, 27 de Noviembre de 2026',
    country: 'usa',
    countryLabel: 'Estados Unidos (EE.UU.)',
    countryFlag: '🇺🇸',
    title: 'Black Friday (Viernes Negro)',
    why: 'El día de descuentos comerciales más intenso del año en EE.UU., dando inicio a las compras navideñas masivas.',
    workImpact: '⚪ Alto Flujo en Campañas USA',
    workDetail: 'Día laboral de máxima demanda en cuentas de retail, envíos y pagos en EE.UU.'
  },
  '12-08': {
    dateDisplay: 'Martes, 8 de Diciembre de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Inmaculada Concepción',
    why: 'Festividad católica tradicional en Perú dedicada a la Virgen María y temporada de primeras comuniones.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'En EE.UU. es temporada alta de comercio navideño. Asesor atiende con pago de feriado de ley.'
  },
  '12-09': {
    dateDisplay: 'Miércoles, 9 de Diciembre de 2026',
    country: 'peru',
    countryLabel: 'Perú',
    countryFlag: '🇵🇪',
    title: 'Batalla de Ayacucho',
    why: 'Conmemoración de la victoria libertaria en la Pampa de la Quinua (1824) comandada por Antonio José de Sucre que selló la independencia sudamericana.',
    workImpact: '🔴 SÍ se trabaja para EE.UU.',
    workDetail: 'Feriado oficial en Perú. EE.UU. opera en jornada estándar.'
  },
  '12-25': {
    dateDisplay: 'Viernes, 25 de Diciembre de 2026',
    country: 'both',
    countryLabel: 'Ambos Países (EE.UU. y Perú)',
    countryFlag: '🇺🇸 ⟷ 🇵🇪',
    title: 'Christmas Day / Navidad',
    why: 'Celebración universal del nacimiento de Jesús con regalos, cena navideña y unión familiar en todo el mundo.',
    workImpact: '🟢 Descanso Total General',
    workDetail: 'Cierre total de operaciones en EE.UU. y feriado no laborable en Perú. Descanso absoluto para todos los trabajadores.'
  }
};

const NOMBRES_MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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

// 2. Calendario Anual 6x6 e Interactividad al Clic
function configurarCalendarioAnual() {
  const grid = document.getElementById('annualCalendarGrid');
  const backdrop = document.getElementById('holidayModalBackdrop');
  const card = document.getElementById('holidayModalCard');
  const btnClose = document.getElementById('btnModalClose');
  const btnOk = document.getElementById('btnModalOk');

  if (!grid || !backdrop) return;

  function abrirModalFeriado(fechaKey, mes, dia) {
    const data = DETALLES_FERIADOS[fechaKey];

    const flagEl = document.getElementById('modalCountryFlag');
    const tagEl = document.getElementById('modalCountryTag');
    const dateEl = document.getElementById('modalDateTitle');
    const titleEl = document.getElementById('modalHolidayTitle');
    const whyEl = document.getElementById('modalHolidayWhy');
    const statusEl = document.getElementById('modalWorkStatusBadge');
    const detailEl = document.getElementById('modalWorkDetail');

    if (data) {
      if (flagEl) flagEl.textContent = data.countryFlag;
      if (tagEl) {
        tagEl.textContent = data.countryLabel;
        tagEl.className = `wii-hm-country-tag tag-${data.country}`;
      }
      if (dateEl) dateEl.textContent = data.dateDisplay;
      if (titleEl) titleEl.textContent = data.title;
      if (whyEl) whyEl.textContent = data.why;
      if (statusEl) {
        statusEl.textContent = data.workImpact;
        statusEl.className = `wii-hm-status-badge badge-${data.country}`;
      }
      if (detailEl) detailEl.textContent = data.workDetail;
    } else {
      // Día regular sin feriado
      const nombreMes = NOMBRES_MESES[mes] || '';
      if (flagEl) flagEl.textContent = '📅';
      if (tagEl) {
        tagEl.textContent = 'Día Laboral Regular';
        tagEl.className = 'wii-hm-country-tag tag-regular';
      }
      if (dateEl) dateEl.textContent = `${dia} de ${nombreMes} de 2026`;
      if (titleEl) titleEl.textContent = 'Jornada Laboral Regular';
      if (whyEl) whyEl.textContent = `No hay feriado oficial registrado en EE.UU. ni en Perú para el ${dia} de ${nombreMes}.`;
      if (statusEl) {
        statusEl.textContent = '⚪ Turno Normal';
        statusEl.className = 'wii-hm-status-badge badge-regular';
      }
      if (detailEl) detailEl.textContent = 'Operaciones y líneas de atención en horario comercial habitual en ambos países.';
    }

    backdrop.style.display = 'flex';
  }

  function cerrarModal() {
    backdrop.style.display = 'none';
  }

  // Delegación de clic en las celdas de días
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.wii-mm-day:not(.is-empty)');
    if (!btn) return;

    const key = btn.getAttribute('data-holiday-key') || '';
    const mes = parseInt(btn.getAttribute('data-month') || '1', 10);
    const dia = parseInt(btn.getAttribute('data-day') || '1', 10);
    const fechaKey = key || `${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    abrirModalFeriado(fechaKey, mes, dia);
  });

  // Eventos de cierre
  if (btnClose) btnClose.addEventListener('click', cerrarModal);
  if (btnOk) btnOk.addEventListener('click', cerrarModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      cerrarModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.style.display === 'flex') {
      cerrarModal();
    }
  });
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
