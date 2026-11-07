// src/feature/geography/geography.js
// 🌐 Motor de Tiempo, Interactividad SVG y Filtros para /geography
// 100% Cero latencia, interactividad sobre cada uno de los 50 estados SVG
import { STATES_DATA, ZONAS_HORARIAS } from '@semillas/statesData.js';

let timerId = null;
let use24Hours = false;

// Mapeo rápido de siglas para tooltips instantáneos
const stateLookup = new Map();
STATES_DATA.forEach(st => stateLookup.set(st.abbr.toUpperCase(), st));

// Formateador de tiempo según huso IANA
function formatearHora(date, timeZone, is24h, short = false) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: short ? undefined : '2-digit',
      hour12: !is24h,
      timeZone: timeZone || 'America/New_York'
    }).format(date);
  } catch (e) {
    return date.toLocaleTimeString();
  }
}

function obtenerIanaPorEstado(abbr) {
  if (abbr === 'AZ') return 'America/Phoenix';
  const st = stateLookup.get(abbr.toUpperCase());
  if (st && st.zone && ZONAS_HORARIAS[st.zone]) {
    return ZONAS_HORARIAS[st.zone];
  }
  return 'America/New_York';
}

// Actualizar todos los relojes de la estación
function actualizarRelojes() {
  const now = new Date();

  // 1. Reloj del Dispositivo del Asesor
  const clockDevice = document.getElementById('clockDevice');
  if (clockDevice) {
    clockDevice.textContent = formatearHora(now, undefined, use24Hours);
  }

  // Fecha y Huso del Dispositivo
  const dateTxt = document.getElementById('geoDeviceDate');
  const zoneTxt = document.getElementById('geoDeviceZone');
  if (dateTxt) {
    const dStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    dateTxt.textContent = `Hoy: ${dStr}`;
  }
  if (zoneTxt) {
    try {
      const resolvedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      zoneTxt.textContent = resolvedTz;
    } catch (e) {}
  }

  // 2. Relojes de las 4 Zonas Principales CONUS
  const pst = document.getElementById('clockPST');
  const mst = document.getElementById('clockMST');
  const cst = document.getElementById('clockCST');
  const est = document.getElementById('clockEST');
  if (pst) pst.textContent = formatearHora(now, 'America/Los_Angeles', use24Hours);
  if (mst) mst.textContent = formatearHora(now, 'America/Denver', use24Hours);
  if (cst) cst.textContent = formatearHora(now, 'America/Chicago', use24Hours);
  if (est) est.textContent = formatearHora(now, 'America/New_York', use24Hours);

  // 3. Relojes Especiales y de Insets
  const akst = document.getElementById('clockAKST');
  const hst  = document.getElementById('clockHST');
  const ast  = document.getElementById('clockAST');
  const insetAK = document.getElementById('insetClockAK');
  const insetHI = document.getElementById('insetClockHI');

  if (akst) akst.textContent = formatearHora(now, 'America/Anchorage', use24Hours, true);
  if (hst)  hst.textContent  = formatearHora(now, 'Pacific/Honolulu', use24Hours, true);
  if (ast)  ast.textContent  = formatearHora(now, 'America/Puerto_Rico', use24Hours, true);
  if (insetAK) insetAK.textContent = formatearHora(now, 'America/Anchorage', use24Hours, true);
  if (insetHI) insetHI.textContent = formatearHora(now, 'Pacific/Honolulu', use24Hours, true);

  // 4. Relojes en la Tabla de 50 Estados
  const rowClocks = document.querySelectorAll('.wii-row-clock[data-tz]');
  rowClocks.forEach((el) => {
    const tz = el.getAttribute('data-tz');
    el.textContent = formatearHora(now, tz, use24Hours);
  });
}

// Inicialización de la Lógica de la Página
export function inicializarGeography() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  // Cargar preferencia de 24h
  try {
    use24Hours = localStorage.getItem('timewii_geo_format') === '24h';
    actualizarBotonFormato();
  } catch (e) {}

  // Ticker de 1 segundo
  actualizarRelojes();
  timerId = setInterval(actualizarRelojes, 1000);

  // Toggle de Formato 12h / 24h
  const btn24h = document.getElementById('btnToggle24h');
  if (btn24h) {
    btn24h.addEventListener('click', () => {
      use24Hours = !use24Hours;
      try {
        localStorage.setItem('timewii_geo_format', use24Hours ? '24h' : '12h');
      } catch (e) {}
      actualizarBotonFormato();
      actualizarRelojes();
    });
  }

  // Configuración de Filtros y Búsqueda
  configurarBuscadorYFiltros();

  // Interactividad con el Mapa SVG Propio (Hover en cada estado)
  configurarEventosMapa();
}

function actualizarBotonFormato() {
  const lbl = document.getElementById('txtFormatLabel');
  if (lbl) {
    lbl.textContent = use24Hours ? '24H' : '12H';
  }
}

// Búsqueda y Filtros de la Tabla
function configurarBuscadorYFiltros() {
  const searchInput = document.getElementById('geoSearchInput');
  const clearBtn = document.getElementById('btnClearGeoSearch');
  const filterTabs = document.querySelectorAll('#geoFilterTabs .wii-filter-tab');
  const legendPills = document.querySelectorAll('.wii-leg-btn[data-zone-filter]');
  const tzCards = document.querySelectorAll('.wii-tz-card[data-zone-filter], .wii-special-chip[data-zone-filter]');
  const counter = document.getElementById('geoStateCounter');
  const emptyState = document.getElementById('geoEmptyState');
  const rows = document.querySelectorAll('.wii-geo-row');

  let activeFilter = 'Todos';

  function filtrarTabla() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    let visibles = 0;

    if (clearBtn) {
      clearBtn.style.display = q.length > 0 ? 'inline-block' : 'none';
    }

    rows.forEach(row => {
      const rowZone = row.getAttribute('data-zone') || '';
      const rowSearch = row.getAttribute('data-search') || '';

      const coincideZona = activeFilter === 'Todos' || rowZone.toLowerCase() === activeFilter.toLowerCase();
      const coincideTexto = !q || rowSearch.includes(q);

      if (coincideZona && coincideTexto) {
        row.style.display = '';
        visibles++;
      } else {
        row.style.display = 'none';
      }
    });

    if (counter) {
      counter.textContent = `${visibles} ESTADO${visibles === 1 ? '' : 'S'}`;
    }

    if (emptyState) {
      emptyState.style.display = visibles === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filtrarTabla);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      filtrarTabla();
    });
  }

  function activarFiltroZona(zona) {
    activeFilter = zona;

    filterTabs.forEach(t => {
      const match = t.getAttribute('data-filter')?.toLowerCase() === zona.toLowerCase();
      t.classList.toggle('active', match);
    });

    legendPills.forEach(p => {
      const match = p.getAttribute('data-zone-filter')?.toLowerCase() === zona.toLowerCase();
      p.classList.toggle('active', match);
    });

    tzCards.forEach(c => {
      const match = c.getAttribute('data-zone-filter')?.toLowerCase() === zona.toLowerCase();
      c.classList.toggle('active', match);
    });

    filtrarTabla();
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const f = tab.getAttribute('data-filter') || 'Todos';
      activarFiltroZona(f);
    });
  });

  legendPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const f = pill.getAttribute('data-zone-filter') || 'Todos';
      activarFiltroZona(f);
    });
  });

  tzCards.forEach(card => {
    card.addEventListener('click', () => {
      const f = card.getAttribute('data-zone-filter') || 'Todos';
      activarFiltroZona(f);
      document.getElementById('geoRapportSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const btnReset = document.getElementById('btnResetGeoFilter');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      activarFiltroZona('Todos');
    });
  }
}

// Configuración de Eventos del Mapa SVG y Tooltips con Cada Estado
function configurarEventosMapa() {
  const stage = document.getElementById('usaMapStage');
  const svg = document.getElementById('usaSvgCanvas');
  const tooltip = document.getElementById('geoTooltip');
  if (!stage || !svg || !tooltip) return;

  const ttAbbr = document.getElementById('ttAbbr');
  const ttName = document.getElementById('ttName');
  const ttTime = document.getElementById('ttTime');
  const ttCap  = document.getElementById('ttCap');
  const ttCities = document.getElementById('ttCities');
  const ttPop  = document.getElementById('ttPop');
  const ttZip  = document.getElementById('ttZip');
  const ttCurio = document.getElementById('ttCurio');

  svg.addEventListener('mousemove', (e) => {
    const target = e.target;
    // Si estamos sobre un path de estado o etiqueta
    const statePath = target.closest('.wii-geo-state-path') || (target.classList?.contains('wii-geo-state-label') ? document.getElementById(`state-path-${target.getAttribute('data-abbr')}`) : null);

    if (statePath) {
      const abbr = statePath.getAttribute('data-abbr') || '';
      const name = statePath.getAttribute('data-state') || '';
      const cap  = statePath.getAttribute('data-cap') || '';
      const cities = statePath.getAttribute('data-cities') || '';
      const zone = statePath.getAttribute('data-zone') || '';
      const zip  = statePath.getAttribute('data-zip') || '';
      const pop  = statePath.getAttribute('data-pop') || '';
      const curio = statePath.getAttribute('data-curio') || '';

      const iana = obtenerIanaPorEstado(abbr);
      const horaStr = formatearHora(new Date(), iana, use24Hours);

      // Posicionamiento flotante del tooltip
      tooltip.style.display = 'block';
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left + 16;
      const y = e.clientY - rect.top + 16;
      tooltip.style.left = `${Math.min(x, rect.width - 250)}px`;
      tooltip.style.top = `${Math.max(10, Math.min(y, rect.height - 220))}px`;

      if (ttAbbr) ttAbbr.textContent = abbr;
      if (ttName) ttName.textContent = name;
      if (ttTime) ttTime.textContent = `${horaStr} (${zone})`;
      if (ttCap)  ttCap.textContent  = cap;
      if (ttCities) ttCities.textContent = cities;
      if (ttPop)  ttPop.textContent  = pop;
      if (ttZip)  ttZip.textContent  = zip;
      if (ttCurio) ttCurio.textContent = curio;
    } else {
      tooltip.style.display = 'none';
    }
  });

  svg.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  // Al hacer clic en un estado del mapa, filtrar la tabla directamente
  svg.addEventListener('click', (e) => {
    const target = e.target;
    const statePath = target.closest('.wii-geo-state-path') || (target.classList?.contains('wii-geo-state-label') ? document.getElementById(`state-path-${target.getAttribute('data-abbr')}`) : null);

    if (statePath) {
      const abbr = statePath.getAttribute('data-abbr');
      const searchInput = document.getElementById('geoSearchInput');
      if (searchInput && abbr) {
        searchInput.value = abbr;
        searchInput.dispatchEvent(new Event('input'));
        document.getElementById('geoRapportSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}
