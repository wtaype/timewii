// src/feature/inicio/secciones/directorio/directorio.js
// 🗺️ Controlador del Directorio de Estados: Búsqueda reactiva & Tickers de hora local
// 🎯 Siglas en negrita grande SIN acción de copia (lectura ergonómica de 1 vistazo)

import { STATES_DATA, ZONAS_HORARIAS } from '@semillas/statesData.js';

let clockInterval = null;

function getLocalTime(tzName, abbr) {
  const iana = abbr === 'AZ' ? 'America/Phoenix' : ZONAS_HORARIAS[tzName];
  if (!iana) return '--:--:--';
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: iana,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date());
  } catch (e) {
    return '--:--:--';
  }
}

export function initDirectorio() {
  const input = document.getElementById('genStateSearchInput');
  const clearBtn = document.getElementById('genStateClearBtn');
  const tbody = document.getElementById('genStatesTableBody');
  const counter = document.getElementById('genStateCounter');

  if (!tbody) return;

  function renderTable(filterQuery = '') {
    const q = filterQuery.toLowerCase().trim();
    tbody.innerHTML = '';

    const filtered = STATES_DATA.filter(st => {
      if (!q) return true;
      return (
        st.abbr.toLowerCase().includes(q) ||
        st.name.toLowerCase().includes(q) ||
        st.cities.toLowerCase().includes(q) ||
        st.cap.toLowerCase().includes(q) ||
        st.codes.toLowerCase().includes(q) ||
        st.zip.toLowerCase().includes(q) ||
        st.zone.toLowerCase().includes(q)
      );
    });

    if (counter) {
      counter.textContent = `${filtered.length} estados`;
    }

    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="9" style="text-align: center; padding: 2vh; color: var(--tx3); font-style: italic;">No se encontraron estados para "${filterQuery}"</td>`;
      tbody.appendChild(tr);
      return;
    }

    filtered.forEach(st => {
      const tr = document.createElement('tr');
      tr.className = 'gen-state-row';
      tr.innerHTML = `
        <td><span class="gen-state-abbr">${st.abbr}</span></td>
        <td><strong class="gen-state-name">${st.name}</strong></td>
        <td><span class="gen-state-zip">${st.zip}</span></td>
        <td>${st.cities}</td>
        <td>${st.codes}</td>
        <td><span class="gen-time-ticker" data-zone="${st.zone}" data-abbr="${st.abbr}">${getLocalTime(st.zone, st.abbr)}</span></td>
        <td><span class="gen-badge-zone">${st.zone}</span></td>
        <td>${st.weather}</td>
        <td>${st.cap}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Ticker dinámico de hora local
  function updateClocks() {
    const tickers = tbody.querySelectorAll('.gen-time-ticker');
    tickers.forEach(t => {
      const zone = t.getAttribute('data-zone');
      const abbr = t.getAttribute('data-abbr');
      if (zone) {
        t.textContent = getLocalTime(zone, abbr);
      }
    });
  }

  // Listeners
  input?.addEventListener('input', (e) => {
    renderTable(e.target.value);
  });

  clearBtn?.addEventListener('click', () => {
    if (input) {
      input.value = '';
      renderTable('');
      input.focus();
    }
  });

  // Render inicial
  renderTable('');

  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClocks, 1000);
}

export default { initDirectorio };
