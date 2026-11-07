// src/feature/inicio/inicio.js
// 🌟 Orquestador Cliente de Feature Inicio: Inicializa los 6 submódulos del Dashboard General

import { initDirectorio } from './secciones/directorio/directorio.js';
import { initDeletreador } from './secciones/deletreador/deletreador.js';
import { initMonedas } from './secciones/monedas/monedas.js';
import { initNumeros } from './secciones/numeros/numeros.js';

export function initInicio() {
  // 1. Inicializar Directorio de Estados
  initDirectorio();

  // 2. Inicializar Deletreador Fonético Multimodo
  initDeletreador();

  // 3. Inicializar Lector de Monedas Formal
  initMonedas();

  // 4. Inicializar Lector de Números
  initNumeros();

  // 5. Soporte de copiado de 1-clic para Direcciones y Unidades
  const copyablePills = document.querySelectorAll('.gen-copyable-pill');
  copyablePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const text = pill.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text);
        const codeEl = pill.querySelector('.gen-pill-code');
        if (codeEl) {
          const original = codeEl.textContent;
          codeEl.textContent = '✓';
          setTimeout(() => {
            codeEl.textContent = original;
          }, 900);
        }
      }
    });
  });
}

// Inicialización automática tanto en carga estática como con ClientRouter
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInicio);
  } else {
    initInicio();
  }
  document.addEventListener('astro:page-load', initInicio);
}

export default { initInicio };
