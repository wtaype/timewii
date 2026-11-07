// src/feature/inicio/secciones/deletreador/deletreador.js
// 🔤 Controlador del Deletreador: Botones Directos & Pronunciación Fonética (dabliu as in...)

import { PHONETIC_THINGS } from '@semillas/phoneticThings.js';
import { PHONETIC_NAMES } from '@semillas/phoneticNames.js';
import { PHONETIC_MILITARY } from '@semillas/phoneticMilitary.js';

export function initDeletreador() {
  const input = document.getElementById('genSpellerInput');
  const clearBtn = document.getElementById('genSpellerClearBtn');
  const output = document.getElementById('genSpellerOutput');
  const hint = document.getElementById('genSpellerCountHint');
  const modeButtons = document.querySelectorAll('.gen-mode-btn');

  if (!input || !output) return;

  // Restaurar modo guardado en localStorage
  let currentMode = localStorage.getItem('timewii_speller_mode') || 'things';
  modeButtons.forEach(btn => {
    if (btn.getAttribute('data-mode') === currentMode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  function getActiveDictionary() {
    if (currentMode === 'names') return PHONETIC_NAMES;
    if (currentMode === 'military') return PHONETIC_MILITARY;
    return PHONETIC_THINGS;
  }

  function updateSpeller() {
    const val = input.value.toUpperCase();
    const cleanVal = val.trim();
    output.innerHTML = '';

    if (!cleanVal) {
      output.innerHTML = '<span class="gen-empty-state-text">Escribe en la caja de arriba para ver el desglose fonético en tiempo real...</span>';
      if (hint) hint.textContent = 'Ingresa letras o números arriba para ver el desglose fonético';
      return;
    }

    if (hint) {
      hint.textContent = `${cleanVal.length} caracteres listos para lectura directa`;
    }

    const dict = getActiveDictionary();

    for (let i = 0; i < val.length; i++) {
      const char = val[i];

      if (char === ' ') {
        const space = document.createElement('div');
        space.style.width = '14px';
        space.style.display = 'inline-block';
        output.appendChild(space);
        continue;
      }

      const match = dict[char];
      const card = document.createElement('div');
      card.className = 'gen-spell-card';

      if (match) {
        card.innerHTML = `
          <span class="gen-spell-char">${char}</span>
          <span class="gen-spell-word">${match.word}</span>
          <span class="gen-spell-phrase">${match.example}</span>
        `;
      } else {
        card.innerHTML = `
          <span class="gen-spell-char">${char}</span>
          <span class="gen-spell-word">Símbolo</span>
          <span class="gen-spell-phrase">Carácter "${char}"</span>
        `;
      }

      output.appendChild(card);
    }
  }

  // Listeners
  input.addEventListener('input', updateSpeller);

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    updateSpeller();
    input.focus();
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode') || 'things';
      localStorage.setItem('timewii_speller_mode', currentMode);
      updateSpeller();
    });
  });

  // Render inicial
  updateSpeller();
}

export default { initDeletreador };
