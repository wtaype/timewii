// src/feature/inicio/secciones/monedas/monedas.js
// 💵 Controlador de Monedas & Tarifas: Pronunciación 100% Formal en Dólares (USD)

import { MONEDAS_DATA, monedaAInglesFormal } from '@semillas/numbersMoneyData.js';

export function initMonedas() {
  const input = document.getElementById('genMoneyInput');
  const clearBtn = document.getElementById('genMoneyClearBtn');
  const liveFormal = document.getElementById('genMoneyLiveFormal');
  const grid = document.getElementById('genMonedaGrid');

  if (!input || !liveFormal || !grid) return;

  function updateMoneyReader() {
    const raw = input.value.trim();
    if (!raw) {
      liveFormal.textContent = 'Escribe un monto arriba...';
      return;
    }

    const res = monedaAInglesFormal(raw);
    if (res) {
      liveFormal.textContent = `${res.montoFormateado} · ${res.formal}`;
    } else {
      liveFormal.textContent = 'Monto no válido';
    }
  }

  function renderTarifasGrid() {
    grid.innerHTML = '';
    MONEDAS_DATA.forEach(item => {
      const pill = document.createElement('div');
      pill.className = 'gen-pill-item';
      pill.title = `${item.contexto} (Clic para cargar)`;
      pill.innerHTML = `
        <span class="gen-pill-money">${item.monto}</span>
        <span class="gen-pill-desc">${item.enFormal}</span>
      `;
      pill.addEventListener('click', () => {
        input.value = item.monto.replace('$', '');
        updateMoneyReader();
      });
      grid.appendChild(pill);
    });
  }

  // Listeners
  input.addEventListener('input', updateMoneyReader);

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    updateMoneyReader();
    input.focus();
  });

  // Render inicial
  renderTarifasGrid();
  updateMoneyReader();
}

export default { initMonedas };
