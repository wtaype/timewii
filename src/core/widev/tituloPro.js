// src/core/widev/tituloPro.js
// ⏰ Ticker del Reloj Dinámico en el <title> del Navegador (ej: "11:16:28 PM · TimeWii")
// Sincronizado automáticamente con wii.js (app) para máxima portabilidad y reusabilidad entre proyectos.
// Diseñado para alta precisión, 0 fugas de memoria y soporte nativo con Astro ClientRouter.

import { app } from '../../wii.js';

let appNombreActual = app || 'App';

/**
 * Inicia o actualiza el reloj en el <title> del documento con el nombre de la app desde wii.js
 * @param {string} [nombreApp] - Nombre opcional de la aplicación; por defecto usa `app` de wii.js
 */
export function tituloPro(nombreApp = app) {
  if (typeof window === 'undefined') return;

  if (nombreApp) {
    appNombreActual = nombreApp;
  }

  function actualizarTitulo() {
    try {
      const ahora = new Date();
      const horaStr = ahora.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      // Formato: 11:16:28 PM · [NombreApp]
      document.title = `${horaStr} · ${appNombreActual}`;
    } catch (e) {}
  }

  // Prevenir duplicidad de intervalos globales
  if (window.__wiTituloProTimer || window.__wiTitleClockTimer) {
    clearInterval(window.__wiTituloProTimer || window.__wiTitleClockTimer);
    window.__wiTituloProTimer = null;
    window.__wiTitleClockTimer = null;
  }

  actualizarTitulo();
  window.__wiTituloProTimer = setInterval(actualizarTitulo, 1000);
}

// Alias para máxima compatibilidad
export const iniciarRelojTitulo = tituloPro;
export const iniciarTituloPro = tituloPro;
export default tituloPro;

// Re-sincronizar inmediatamente al volver a la pestaña activa sin desfase
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.__wiTituloProTimer) {
      try {
        const ahora = new Date();
        const horaStr = ahora.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        document.title = `${horaStr} · ${appNombreActual}`;
      } catch (e) {}
    }
  });
}
