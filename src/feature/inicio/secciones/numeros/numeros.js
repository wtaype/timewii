// src/feature/inicio/secciones/numeros/numeros.js
// 🔢 Controlador de Números & Cifras: Fonética en Vivo y Cifras de Llamada

import { NUMEROS_DATA, numeroAIngles, numeroAInglesColoquial } from '@semillas/numbersMoneyData.js';

export function initNumeros() {
  const input = document.getElementById('genNumberInput');
  const clearBtn = document.getElementById('genNumberClearBtn');
  const liveText = document.getElementById('genNumberLiveText');
  const grid = document.getElementById('genNumGrid');

  if (!input || !liveText || !grid) return;

  function updateNumberReader() {
    const raw = input.value.trim();
    if (!raw) {
      liveText.textContent = 'Escribe una cifra arriba...';
      return;
    }

    const n = parseInt(raw, 10);
    if (isNaN(n)) {
      liveText.textContent = 'Cifra inválida';
      return;
    }

    const principal = numeroAIngles(n);
    liveText.textContent = principal;
  }

  function renderNumbersGrid() {
    grid.innerHTML = '';
    NUMEROS_DATA.forEach(item => {
      const pill = document.createElement('div');
      pill.className = 'gen-pill-item';
      pill.title = `${item.tip} (Clic para cargar)`;
      pill.innerHTML = `
        <span class="gen-pill-code">${item.num}</span>
        <span class="gen-pill-text">${item.en}</span>
      `;
      pill.addEventListener('click', () => {
        input.value = item.num;
        updateNumberReader();
        navigator.clipboard.writeText(`${item.num} - ${item.en}`);
      });
      grid.appendChild(pill);
    });
  }

  // Listeners
  input.addEventListener('input', updateNumberReader);

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    updateNumberReader();
    input.focus();
  });

  // Render inicial
  renderNumbersGrid();
  updateNumberReader();
}

export default { initNumeros };
