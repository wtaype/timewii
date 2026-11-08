// src/feature/ruleta/ruleta.js
// 🎯 Motor Físico de Super Smart Ruleta Grupal & Sistema de Sorteos para Equipos
// Carga desde Excel, autoeliminación de ganadores, orden de exposición y podio de resultados
// 100% Local-First con persistencia en LocalStorage (timewii_smart_wheel)
import { Mensaje } from '../../core/widev/widev.js';

const STORAGE_KEY = 'timewii_smart_wheel';

const PALETA_COLORES = [
  '#FF7675', // Coral pastel cálido
  '#74B9FF', // Azul cielo suave
  '#55EFC4', // Menta pastel
  '#FFEAA7', // Amarillo sol pastel
  '#A29BFE', // Lavanda suave
  '#FAB1A0', // Durazno suave
  '#81ECEC', // Turquesa pastel
  '#FDCB6E'  // Mostaza pastel cálido
];

const EQUIPO_EJEMPLO = [
  'Carlos Quispe',
  'Andrea Morales',
  'Wilder Mendoza',
  'Sofía Castro',
  'Diego Ramos',
  'Luciana Vega',
  'Mateo Torres',
  'Valeria Silva'
];

// Estado
let estado = {
  participantes: [...EQUIPO_EJEMPLO],
  autoEliminar: true,
  modo: 'premio', // 'premio' (default) | 'tarea' | 'exponer'
  velocidad: 4, // segundos
  historialGanadores: []
};

let currentRotation = 0;
let isSpinning = false;
let ganadorPendienteEliminar = null; // Autoeliminación diferida: se retira en el siguiente giro

// Cargar estado persistente
function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      let modoGuardado = parsed.modo || 'premio';
      if (modoGuardado === 'turno') modoGuardado = 'tarea';

      estado = {
        participantes: Array.isArray(parsed.participantes) && parsed.participantes.length > 0 ? parsed.participantes : [...EQUIPO_EJEMPLO],
        autoEliminar: parsed.autoEliminar !== undefined ? !!parsed.autoEliminar : true,
        modo: modoGuardado,
        velocidad: Number(parsed.velocidad) || 4,
        historialGanadores: Array.isArray(parsed.historialGanadores) ? parsed.historialGanadores : []
      };
    }
  } catch (e) {
    estado.participantes = [...EQUIPO_EJEMPLO];
  }
}

// Guardar estado persistente
function guardarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {}
}

function obtenerHoraActual() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// 1. Dibujar Ruleta Dinámica en Canvas
export function dibujarRuleta() {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const items = estado.participantes;
  const numSlices = items.length;
  const radius = canvas.width / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grosor blanco idéntico y uniforme (3px) para divisorias, aro exterior y aro de GIRAR
  const strokeWhite = 3;
  const outerRadius = radius - strokeWhite; // 217px
  const centerBtnRadius = 41; // Botón central de 82px

  // Caso: Ruleta vacía
  if (numSlices === 0) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(229, 69, 84, 0.08)';
    ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#e54554';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#e54554';
    ctx.font = 'bold 15px Poppins, sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Agrega participantes para girar!', radius, radius);
    return;
  }

  // Caso: 1 solo participante
  if (numSlices === 1) {
    ctx.beginPath();
    ctx.fillStyle = PALETA_COLORES[0];
    ctx.arc(radius, radius, outerRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Aro blanco exterior del mismo grosor (3px)
    ctx.beginPath();
    ctx.arc(radius, radius, outerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = strokeWhite;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.font = '700 18px Poppins, sans-serif';
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(items[0].trim(), radius, radius - 60);
    return;
  }

  const arc = (2 * Math.PI) / numSlices;

  // 1. Dibujar sectores con colores pastel desde el centro hasta outerRadius
  items.forEach((_, i) => {
    const angle = i * arc;
    const color = PALETA_COLORES[i % PALETA_COLORES.length];

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, outerRadius, angle, angle + arc);
    ctx.lineTo(radius, radius);
    ctx.fill();

    // Línea divisoria blanca idéntica (3px)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = strokeWhite;
    ctx.stroke();
  });

  // 2. Aro exterior blanco uniforme de 3px (mismo blanco que separa los sectores)
  ctx.beginPath();
  ctx.arc(radius, radius, outerRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = strokeWhite;
  ctx.stroke();

  // 3. Estrellitas / Pines decorativos sutiles en la punta de cada división
  items.forEach((_, i) => {
    const angle = i * arc;
    const pinX = radius + (outerRadius - 1) * Math.cos(angle);
    const pinY = radius + (outerRadius - 1) * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(pinX, pinY, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // 4. Texto del Nombre en cada sector (aprovechando todo el espacio de color)
  items.forEach((nombre, i) => {
    const angle = i * arc;

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1e293b';

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    let fontSize = 13;
    if (numSlices > 24) fontSize = 9.5;
    else if (numSlices > 18) fontSize = 10.5;
    else if (numSlices > 12) fontSize = 11.5;
    else if (numSlices > 8) fontSize = 12.5;
    else fontSize = 13.5;

    ctx.font = `700 ${fontSize}px Poppins, sans-serif`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';

    const nombreLimpio = nombre.trim();
    const maxChars = numSlices > 20 ? 12 : numSlices > 14 ? 15 : 20;
    const displayNombre = nombreLimpio.length > maxChars 
      ? nombreLimpio.slice(0, maxChars - 2) + '..' 
      : nombreLimpio;

    ctx.fillText(displayNombre, outerRadius - 14, 0);
    ctx.restore();
  });

  // 5. Núcleo central blanco: exactamente del mismo tamaño del botón para que el borde blanco de 3px sea uniforme
  ctx.beginPath();
  ctx.arc(radius, radius, centerBtnRadius + 1, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = strokeWhite;
  ctx.stroke();
}

// 2. Renderizado del Podio / Historial de Ganadores
function renderizarTablaGanadores() {
  const tbody = document.getElementById('tbodyGanadores');
  if (!tbody) return;

  if (estado.historialGanadores.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="wii-tbl-empty-state">
          <i class="fa-solid fa-trophy"></i> Aún no se han realizado sorteos. Pulsa <strong>GIRAR</strong> para comenzar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = estado.historialGanadores.map((item, idx) => {
    let modeBadge = '<span class="wii-tbl-pill pill-warning"><i class="fa-solid fa-trophy"></i> Ganador Premio</span>';
    if (item.modo === 'tarea' || item.modo === 'turno') {
      modeBadge = '<span class="wii-tbl-pill pill-ok"><i class="fa-solid fa-list-check"></i> Asignación Tarea</span>';
    } else if (item.modo === 'exponer') {
      modeBadge = '<span class="wii-tbl-pill pill-neutral"><i class="fa-solid fa-chalkboard-user"></i> Quién Expone</span>';
    }

    const statusPill = item.autoEliminado
      ? '<span class="wii-tbl-pill pill-danger"><i class="fa-solid fa-user-minus"></i> Autoeliminado</span>'
      : '<span class="wii-tbl-pill pill-neutral"><i class="fa-solid fa-user-check"></i> En Ruleta</span>';

    const orderNum = item.num || (estado.historialGanadores.length - idx);

    return `
      <tr>
        <td class="wii-cell-center"><strong class="wii-tbl-num">#${String(orderNum).padStart(2, '0')}</strong></td>
        <td><span class="wii-log-time">${item.hora}</span></td>
        <td>
          <span class="wii-winner-cell-name">
            <i class="fa-solid fa-crown wii-winner-crown-ico"></i>
            <strong>${item.nombre}</strong>
          </span>
        </td>
        <td>${modeBadge}</td>
        <td>${statusPill}</td>
        <td class="wii-cell-center">
          <div class="wii-tbl-actions-group">
            ${item.autoEliminado ? `
              <button type="button" class="wii-tbl-action-btn btn-readd-participant" data-name="${item.nombre}" title="Reincorporar a la ruleta">
                <i class="fa-solid fa-user-plus"></i> Reincorporar
              </button>
            ` : ''}
            <button type="button" class="wii-tbl-action-btn btn-delete-winner-row" data-idx="${idx}" title="Eliminar del podio">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Giro Físico y Selección Aleatoria
function configurarGiroRuleta() {
  const disc = document.getElementById('wheelDisc');
  const btnSpin = document.getElementById('btnSpinWheel');
  const btnAgain = document.getElementById('btnSpinAgain');
  const btnDismiss = document.getElementById('btnDismissWinner');
  const banner = document.getElementById('winnerAnnouncement');

  if (!disc || !btnSpin) return;

  function girar() {
    if (isSpinning) return;

    // Autoeliminación diferida: retiramos al ganador del tiro anterior justo antes de iniciar el nuevo giro
    if (ganadorPendienteEliminar && estado.autoEliminar) {
      const idx = estado.participantes.indexOf(ganadorPendienteEliminar);
      if (idx !== -1) {
        estado.participantes.splice(idx, 1);
        actualizarTextareaDesdeArray();
        actualizarContadorParticipantes();
        dibujarRuleta();
        guardarEstado();
      }
      ganadorPendienteEliminar = null;
    }

    if (estado.participantes.length === 0) {
      Mensaje('¡La ruleta está vacía! Pega o escribe nombres en el panel de supervisor.', 'warning');
      return;
    }

    isSpinning = true;
    btnSpin.disabled = true;
    if (banner) banner.classList.add('wii-hidden');

    const numSlices = estado.participantes.length;
    const duracion = estado.velocidad || 4;

    // Configurar aceleración y desaceleración fluida
    disc.style.transition = `transform ${duracion}s cubic-bezier(0.15, 0.9, 0.2, 1)`;

    // Giro aleatorio: 5 a 8 vueltas completas más ángulo libre
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpins = 5 + Math.floor(Math.random() * 4);
    const spinDegrees = totalSpins * 360 + extraDegrees;

    currentRotation += spinDegrees;
    disc.style.transform = `rotate(${currentRotation}deg)`;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Fin de animación
    setTimeout(() => {
      isSpinning = false;
      btnSpin.disabled = false;

      // Calcular ganador (el puntero está en la parte superior a 270 grados)
      const sliceDeg = 360 / numSlices;
      const normalized = (currentRotation % 360 + 360) % 360;
      const pointerAngle = (270 - normalized + 360) % 360;
      const winningIndex = Math.floor(pointerAngle / sliceDeg) % numSlices;
      const winner = estado.participantes[winningIndex] || estado.participantes[0];

      // Registrar en el historial de ganadores
      const nuevoRegistro = {
        id: Date.now(),
        num: estado.historialGanadores.length + 1,
        hora: obtenerHoraActual(),
        nombre: winner,
        modo: estado.modo,
        autoEliminado: estado.autoEliminar
      };
      estado.historialGanadores.unshift(nuevoRegistro);

      // Mostrar anuncio del ganador (Andrea Morales sigue visible en su sector en el canvas)
      mostrarAnuncioGanador(winner, estado.autoEliminar);

      // Autoeliminación diferida: queda pendiente para ser retirada en el siguiente giro
      if (estado.autoEliminar) {
        ganadorPendienteEliminar = winner;
      } else {
        ganadorPendienteEliminar = null;
      }

      guardarEstado();
      renderizarTablaGanadores();
      actualizarContadorParticipantes();
    }, duracion * 1000);
  }

  btnSpin.addEventListener('click', girar);
  if (btnAgain) btnAgain.addEventListener('click', girar);
  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      if (banner) banner.classList.add('wii-hidden');
    });
  }
}

// 4. Mostrar Anuncio del Ganador
function mostrarAnuncioGanador(nombre, autoEliminado) {
  const banner = document.getElementById('winnerAnnouncement');
  const winnerName = document.getElementById('winnerName');
  const winnerTag = document.getElementById('winnerTag');
  const winnerActionDesc = document.getElementById('winnerActionDesc');
  const winnerIcon = document.getElementById('winnerIcon');

  if (!banner || !winnerName) return;

  winnerName.textContent = nombre;

  if (estado.modo === 'premio') {
    if (winnerTag) winnerTag.textContent = '🏆 ¡GANADOR DEL PREMIO / DINÁMICA!';
    if (winnerIcon) winnerIcon.className = 'fa-solid fa-trophy';
    if (winnerActionDesc) {
      winnerActionDesc.textContent = autoEliminado
        ? '¡Felicidades! Se ha registrado su victoria y retirado de la lista para no repetir.'
        : '¡Felicidades! Ganador de la dinámica de equipo.';
    }
  } else if (estado.modo === 'tarea') {
    if (winnerTag) winnerTag.textContent = '📋 ¡ASIGNACIÓN DE TAREA!';
    if (winnerIcon) winnerIcon.className = 'fa-solid fa-list-check';
    if (winnerActionDesc) {
      winnerActionDesc.textContent = autoEliminado
        ? 'Tarea asignada con éxito y retirado de la ruleta para el siguiente sorteo.'
        : 'Tarea asignada con éxito al participante.';
    }
  } else {
    if (winnerTag) winnerTag.textContent = '🗣️ ¡LE TOCA EXPONER!';
    if (winnerIcon) winnerIcon.className = 'fa-solid fa-chalkboard-user';
    if (winnerActionDesc) {
      winnerActionDesc.textContent = autoEliminado
        ? 'Ha sido seleccionado para exponer y retirado de la ruleta para el siguiente turno.'
        : 'Ha sido seleccionado para exponer el tema ante el equipo.';
    }
  }

  banner.classList.remove('wii-hidden');
}

// 5. Sincronización del Textarea de Participantes (Excel / Saltos de línea)
function actualizarTextareaDesdeArray() {
  const textarea = document.getElementById('participantsTextarea');
  if (textarea) {
    textarea.value = estado.participantes.join('\n');
  }
}

function actualizarContadorParticipantes() {
  const cnt = document.getElementById('participantsCount');
  if (cnt) cnt.textContent = `${estado.participantes.length}`;
}

function configurarTextareaParticipantes() {
  const textarea = document.getElementById('participantsTextarea');
  if (!textarea) return;

  function procesarTexto() {
    const raw = textarea.value;
    // Divide por saltos de línea o tabulaciones de Excel o comas
    const lineas = raw.split(/[\r\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    estado.participantes = lineas;
    ganadorPendienteEliminar = null;
    guardarEstado();
    actualizarContadorParticipantes();
    dibujarRuleta();
  }

  textarea.addEventListener('input', procesarTexto);
  textarea.addEventListener('paste', () => {
    setTimeout(procesarTexto, 10);
  });
}

// 6. Botones de Control de Lista (Mezclar, Ejemplo, Limpiar)
function configurarBotonesLista() {
  const btnShuffle = document.getElementById('btnShuffleParticipants');
  const btnSample = document.getElementById('btnLoadSampleParticipants');
  const btnClear = document.getElementById('btnClearParticipants');

  if (btnShuffle) {
    btnShuffle.addEventListener('click', () => {
      // Fisher-Yates shuffle
      for (let i = estado.participantes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [estado.participantes[i], estado.participantes[j]] = [estado.participantes[j], estado.participantes[i]];
      }
      actualizarTextareaDesdeArray();
      guardarEstado();
      dibujarRuleta();
      Mensaje('Lista de participantes mezclada aleatoriamente', 'info');
    });
  }

  if (btnSample) {
    btnSample.addEventListener('click', () => {
      estado.participantes = [...EQUIPO_EJEMPLO];
      ganadorPendienteEliminar = null;
      actualizarTextareaDesdeArray();
      guardarEstado();
      actualizarContadorParticipantes();
      dibujarRuleta();
      Mensaje('Equipo de ejemplo cargado', 'success');
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar la lista de participantes?')) {
        estado.participantes = [];
        ganadorPendienteEliminar = null;
        actualizarTextareaDesdeArray();
        guardarEstado();
        actualizarContadorParticipantes();
        dibujarRuleta();
        Mensaje('Lista de participantes vaciada', 'warning');
      }
    });
  }
}

// 7. Opciones de Autoeliminación, Modo y Velocidad
function configurarOpcionesSorteo() {
  const chkAuto = document.getElementById('chkAutoRemoveWinner');
  if (chkAuto) {
    chkAuto.checked = estado.autoEliminar;
    chkAuto.addEventListener('change', () => {
      estado.autoEliminar = chkAuto.checked;
      guardarEstado();
    });
  }

  // Modos de Sorteo
  const modeChips = document.querySelectorAll('#modeSelectorChips .wii-mode-chip');
  const modeBadge = document.getElementById('wheelModeBadge');
  const wheelSub = document.getElementById('wheelSubtitle');

  function actualizarVisualModo(modo) {
    modeChips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-mode') === modo);
    });

    if (modeBadge) {
      if (modo === 'premio') modeBadge.textContent = 'MODO: GANADOR PREMIO';
      else if (modo === 'tarea') modeBadge.textContent = 'MODO: ASIGNACIÓN DE TAREA';
      else modeBadge.textContent = 'MODO: QUIÉN EXPONE';
    }

    if (wheelSub) {
      if (modo === 'premio') wheelSub.textContent = 'Selecciona al ganador de dinámicas o reconocimientos de turno';
      else if (modo === 'tarea') wheelSub.textContent = 'Asignación aleatoria de tareas y responsabilidades del equipo';
      else wheelSub.textContent = 'Sortea quién expone el tema ante el equipo';
    }
  }

  actualizarVisualModo(estado.modo);

  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const m = chip.getAttribute('data-mode');
      if (m) {
        estado.modo = m;
        actualizarVisualModo(m);
        guardarEstado();
      }
    });
  });

  // Selector de Velocidad
  const speedChips = document.querySelectorAll('#speedSelectorChips .wii-mode-chip');
  speedChips.forEach(chip => {
    chip.classList.toggle('active', Number(chip.getAttribute('data-speed')) === estado.velocidad);
    chip.addEventListener('click', () => {
      const s = Number(chip.getAttribute('data-speed'));
      if (s) {
        estado.velocidad = s;
        speedChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        guardarEstado();
      }
    });
  });
}

// 8. Acciones de la Tabla de Ganadores (Reincorporar, Limpiar)
function configurarAccionesTabla() {
  const tbody = document.getElementById('tbodyGanadores');
  const btnClearPodium = document.getElementById('btnClearWinnersPodium');

  if (tbody) {
    tbody.addEventListener('click', (e) => {
      // Reincorporar participante a la ruleta
      const btnReadd = e.target.closest('.btn-readd-participant');
      if (btnReadd) {
        const nombre = btnReadd.getAttribute('data-name');
        if (nombre && !estado.participantes.includes(nombre)) {
          if (ganadorPendienteEliminar === nombre) {
            ganadorPendienteEliminar = null;
          }
          estado.participantes.push(nombre);
          actualizarTextareaDesdeArray();
          actualizarContadorParticipantes();
          dibujarRuleta();
          guardarEstado();
          Mensaje(`¡<strong>${nombre}</strong> ha sido reincorporado a la ruleta!`, 'success');
        } else if (nombre) {
          Mensaje(`<strong>${nombre}</strong> ya se encuentra en la ruleta`, 'info');
        }
        return;
      }

      // Eliminar fila individual del podio
      const btnDel = e.target.closest('.btn-delete-winner-row');
      if (btnDel) {
        const idx = Number(btnDel.getAttribute('data-idx'));
        if (!isNaN(idx) && idx >= 0 && idx < estado.historialGanadores.length) {
          estado.historialGanadores.splice(idx, 1);
          guardarEstado();
          renderizarTablaGanadores();
        }
      }
    });
  }

  if (btnClearPodium) {
    btnClearPodium.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar el podio de ganadores a cero?')) {
        estado.historialGanadores = [];
        guardarEstado();
        renderizarTablaGanadores();
        Mensaje('Podio de ganadores reiniciado con éxito', 'success');
      }
    });
  }
}

// Inicialización Maestra
export function inicializarRuleta() {
  const container = document.getElementById('ruletaContainer');
  if (!container) return;

  cargarEstado();
  actualizarTextareaDesdeArray();
  actualizarContadorParticipantes();
  dibujarRuleta();
  renderizarTablaGanadores();

  // Evitar vincular listeners duplicados con Astro ClientRouter
  if (container.dataset.bound === 'true') {
    return;
  }
  container.dataset.bound = 'true';

  configurarGiroRuleta();
  configurarTextareaParticipantes();
  configurarBotonesLista();
  configurarOpcionesSorteo();
  configurarAccionesTabla();
}
