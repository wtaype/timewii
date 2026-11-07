// src/feature/ruleta/ruleta.js
// 🎯 Motor Físico de Super Smart Ruleta Grupal & Sistema de Sorteos para Equipos
// Carga desde Excel, autoeliminación de ganadores, orden de exposición y podio de resultados
// 100% Local-First con persistencia en LocalStorage (timewii_smart_wheel)

const STORAGE_KEY = 'timewii_smart_wheel';

const PALETA_COLORES = [
  '#e54554', '#00d2ff', '#3ab057', '#f0c547', '#a855f7',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
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
  modo: 'exponer', // 'exponer' | 'premio' | 'turno'
  velocidad: 4, // segundos
  historialGanadores: []
};

let currentRotation = 0;
let isSpinning = false;

// Cargar estado persistente
function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      estado = {
        participantes: Array.isArray(parsed.participantes) && parsed.participantes.length > 0 ? parsed.participantes : [...EQUIPO_EJEMPLO],
        autoEliminar: parsed.autoEliminar !== undefined ? !!parsed.autoEliminar : true,
        modo: parsed.modo || 'exponer',
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

  // Caso: Ruleta vacía
  if (numSlices === 0) {
    ctx.beginPath();
    ctx.fillStyle = '#222533';
    ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#9e9e9e';
    ctx.font = 'bold 14px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡Agrega participantes para girar!', radius, radius);
    return;
  }

  // Caso: 1 solo participante
  if (numSlices === 1) {
    ctx.beginPath();
    ctx.fillStyle = PALETA_COLORES[0];
    ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(items[0], radius, radius);
    return;
  }

  const arc = (2 * Math.PI) / numSlices;

  items.forEach((nombre, i) => {
    const angle = i * arc;
    const color = PALETA_COLORES[i % PALETA_COLORES.length];

    // Sector
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 4, angle, angle + arc);
    ctx.lineTo(radius, radius);
    ctx.fill();

    // Línea divisoria
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto del Nombre
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    // Ajuste de tamaño de fuente según cantidad de participantes
    let fontSize = 13;
    if (numSlices > 18) fontSize = 10;
    else if (numSlices > 12) fontSize = 11;
    else if (numSlices > 8) fontSize = 12;

    ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;

    const maxChars = numSlices > 15 ? 14 : 20;
    const displayNombre = nombre.length > maxChars ? nombre.slice(0, maxChars - 2) + '..' : nombre;

    ctx.fillText(displayNombre, radius - 24, 0);
    ctx.restore();
  });

  // Anillo exterior decorativo
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Núcleo central
  ctx.beginPath();
  ctx.fillStyle = '#171923';
  ctx.arc(radius, radius, 36, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#e54554';
  ctx.lineWidth = 3;
  ctx.stroke();
}

// 2. Renderizado del Podio / Historial de Ganadores
function renderizarTablaGanadores() {
  const tbody = document.getElementById('tbodyGanadores');
  if (!tbody) return;

  if (estado.historialGanadores.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--tx3); padding: 2vh;">
          <i class="fa-solid fa-trophy" style="margin-right: 6px;"></i> Aún no se han realizado sorteos. Pulsa <strong>GIRAR</strong> para comenzar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = estado.historialGanadores.map((item, idx) => {
    let modeBadge = '<span class="wii-tbl-pill pill-ok"><i class="fa-solid fa-microphone"></i> Exposición</span>';
    if (item.modo === 'premio') {
      modeBadge = '<span class="wii-tbl-pill pill-warning"><i class="fa-solid fa-trophy"></i> Premio</span>';
    } else if (item.modo === 'turno') {
      modeBadge = '<span class="wii-tbl-pill pill-neutral"><i class="fa-solid fa-dice"></i> Turno</span>';
    }

    const statusPill = item.autoEliminado
      ? '<span class="wii-tbl-pill pill-danger"><i class="fa-solid fa-user-minus"></i> Autoeliminado</span>'
      : '<span class="wii-tbl-pill pill-neutral"><i class="fa-solid fa-user-check"></i> En Ruleta</span>';

    const orderNum = item.num || (idx + 1);

    return `
      <tr>
        <td><strong>#${orderNum}°</strong></td>
        <td><span class="wii-log-time">${item.hora}</span></td>
        <td>
          <span class="wii-winner-cell-name">
            <i class="fa-solid fa-crown" style="color: #f0c547;"></i>
            <strong>${item.nombre}</strong>
          </span>
        </td>
        <td>${modeBadge}</td>
        <td>${statusPill}</td>
        <td>
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

    if (estado.participantes.length === 0) {
      alert('¡La ruleta está vacía! Pega o escribe nombres en el panel de la derecha.');
      return;
    }

    isSpinning = true;
    btnSpin.disabled = true;
    if (banner) banner.style.display = 'none';

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

      // Mostrar anuncio del ganador
      mostrarAnuncioGanador(winner, estado.autoEliminar);

      // Autoeliminar de la ruleta si la opción está activa
      if (estado.autoEliminar) {
        estado.participantes.splice(winningIndex, 1);
        actualizarTextareaDesdeArray();
        dibujarRuleta();
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
      if (banner) banner.style.display = 'none';
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

  if (estado.modo === 'exponer') {
    if (winnerTag) winnerTag.textContent = '🎤 ¡LE TOCA EXPONER / PRESENTAR!';
    if (winnerIcon) winnerIcon.className = 'fa-solid fa-microphone';
    if (winnerActionDesc) {
      winnerActionDesc.textContent = autoEliminado
        ? 'Ha sido seleccionado para exponer y retirado de la ruleta para el siguiente turno.'
        : 'Ha sido seleccionado para exponer ante el equipo.';
    }
  } else if (estado.modo === 'premio') {
    if (winnerTag) winnerTag.textContent = '🏆 ¡GANADOR DEL PREMIO / DINÁMICA!';
    if (winnerIcon) winnerIcon.className = 'fa-solid fa-trophy';
    if (winnerActionDesc) {
      winnerActionDesc.textContent = autoEliminado
        ? '¡Felicidades! Se ha registrado su victoria y retirado de la lista para no repetir.'
        : '¡Felicidades! Ganador de la dinámica de equipo.';
    }
  } else {
    if (winnerTag) winnerTag.textContent = '🎲 ¡TURNO ASIGNADO!';
    if (winnerIcon) winnerIcon.className = 'fa-solid fa-dice';
    if (winnerActionDesc) {
      winnerActionDesc.textContent = autoEliminado
        ? 'Turno asignado con éxito y retirado de la ruleta.'
        : 'Turno asignado con éxito.';
    }
  }

  banner.style.display = 'flex';
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
    });
  }

  if (btnSample) {
    btnSample.addEventListener('click', () => {
      estado.participantes = [...EQUIPO_EJEMPLO];
      actualizarTextareaDesdeArray();
      guardarEstado();
      actualizarContadorParticipantes();
      dibujarRuleta();
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar la lista de participantes?')) {
        estado.participantes = [];
        actualizarTextareaDesdeArray();
        guardarEstado();
        actualizarContadorParticipantes();
        dibujarRuleta();
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
      if (modo === 'exponer') modeBadge.textContent = 'MODO: EXPOSICIÓN';
      else if (modo === 'premio') modeBadge.textContent = 'MODO: PREMIO';
      else modeBadge.textContent = 'MODO: TURNO';
    }

    if (wheelSub) {
      if (modo === 'exponer') wheelSub.textContent = 'Sortea quién expone o presenta el trabajo ante el equipo';
      else if (modo === 'premio') wheelSub.textContent = 'Selecciona al ganador de dinámicas o reconocimientos de turno';
      else wheelSub.textContent = 'Asignación aleatoria de tareas, descansos o turnos';
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
          estado.participantes.push(nombre);
          actualizarTextareaDesdeArray();
          actualizarContadorParticipantes();
          dibujarRuleta();
          guardarEstado();
          alert(`¡${nombre} ha sido reincorporado a la ruleta!`);
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
