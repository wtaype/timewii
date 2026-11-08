// src/feature/metricas/metricas.js
// 📊 Motor de Cálculo CSAT Visual e Interactivo (Inspirado exactamente en la Imagen 1)
// Soporta Escala Likert Normalizada (1-5★ = 79.17%), Top 2 Box, Velocímetro SVG y Tabla de Leyenda

const STORAGE_KEY = 'timewii_csat_v4_data';

// Estado por defecto (Ejemplo de 5 encuestas 5★ Very satisfied = 100%, Meta 92%)
const estadoDefecto = {
  v1: 0, // Very dissatisfied (1★)
  v2: 0, // Dissatisfied (2★)
  v3: 0, // Neutral (3★)
  v4: 0, // Satisfied (4★)
  v5: 5, // Very satisfied (5★)
  meta: 92, // Meta CSAT en porcentaje por defecto (Objetivo 92%)
  formula: 'likert' // 'likert' o 'top2'
};

let estado = { ...estadoDefecto };

// Cargar estado desde LocalStorage
function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      estado = {
        v1: Math.max(0, Number(p.v1) || 0),
        v2: Math.max(0, Number(p.v2) || 0),
        v3: Math.max(0, Number(p.v3) || 0),
        v4: Math.max(0, Number(p.v4) || 0),
        v5: Math.max(0, Number(p.v5) || 0),
        meta: Math.min(100, Math.max(50, Number(p.meta) || 92)),
        formula: p.formula === 'top2' ? 'top2' : 'likert'
      };
      return;
    }
  } catch (e) {}
  estado = { ...estadoDefecto };
}

// Guardar estado en LocalStorage
function guardarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {}
}

// =============================================================================
// CÁLCULOS MATEMÁTICOS PRINCIPALES
// =============================================================================
function calcularMetricas() {
  const { v1, v2, v3, v4, v5, meta, formula } = estado;
  const total = v1 + v2 + v3 + v4 + v5;

  if (total === 0) {
    return {
      total: 0,
      sumPts: 0,
      avgRating: 0,
      pct1: 0, pct2: 0, pct3: 0, pct4: 0, pct5: 0,
      activeScore: 0,
      needed: 0,
      tolerance: 0,
      gap: 0
    };
  }

  const sumPts = (v1 * 1) + (v2 * 2) + (v3 * 3) + (v4 * 4) + (v5 * 5);
  const avgRating = sumPts / total;

  const pct1 = (v1 / total) * 100;
  const pct2 = (v2 / total) * 100;
  const pct3 = (v3 / total) * 100;
  const pct4 = (v4 / total) * 100;
  const pct5 = (v5 / total) * 100;

  // 1. Escala Likert Normalizada (Fórmula de la Imagen 1 = 79.17%)
  const likertScore = ((sumPts - total) / (total * 4)) * 100;

  // 2. Escala Top 2 Box (% de 4★ y 5★ = 83.33%)
  const top2Score = ((v4 + v5) / total) * 100;

  const rawScore = formula === 'likert' ? likertScore : top2Score;
  const activeScore = Math.max(0, Math.min(100, rawScore));

  const t = meta / 100;
  let needed = 0;
  let tolerance = 0;

  if (activeScore < meta) {
    if (formula === 'likert') {
      if (t < 1) {
        const num = (4 * t * total) - (sumPts - total);
        const den = 4 * (1 - t);
        needed = Math.ceil(Math.max(0, num / den));
      }
    } else {
      if (t < 1) {
        const num = (t * total) - (v4 + v5);
        const den = 1 - t;
        needed = Math.ceil(Math.max(0, num / den));
      }
    }
  } else {
    // Tolerancia ante detonadores (1★)
    if (formula === 'likert') {
      if (t > 0) {
        const num = (sumPts - total) - (4 * t * total);
        const den = 4 * t;
        tolerance = Math.floor(Math.max(0, num / den));
      }
    } else {
      if (t > 0) {
        const num = (v4 + v5) - (t * total);
        tolerance = Math.floor(Math.max(0, num / t));
      }
    }
  }

  const gap = activeScore - meta;

  return {
    total,
    sumPts,
    avgRating,
    pct1, pct2, pct3, pct4, pct5,
    activeScore,
    needed,
    tolerance,
    gap
  };
}

// =============================================================================
// ACTUALIZACIÓN VISUAL DEL DOM
// =============================================================================
function actualizarInterfaz() {
  const m = calcularMetricas();
  const { v1, v2, v3, v4, v5, meta, formula } = estado;

  // 1. Cajas Superiores de Entrada (Inputs, Sliders, Pct, Pts)
  ['1', '2', '3', '4', '5'].forEach((k) => {
    const val = estado[`v${k}`];
    const pct = m[`pct${k}`];
    const pts = val * Number(k);

    const input = document.getElementById(`inputV${k}`);
    const range = document.getElementById(`rangeV${k}`);
    const pctEl = document.getElementById(`pctV${k}`);
    const ptsEl = document.getElementById(`ptsV${k}`);

    if (input && document.activeElement !== input) input.value = val;
    if (range) range.value = Math.min(30, val);
    if (pctEl) pctEl.textContent = `${pct.toFixed(2)}%`;
    if (ptsEl) ptsEl.textContent = `${pts} pts`;
  });

  // 2. Velocímetro SVG & Aguja Dinámica
  const needle = document.getElementById('gaugeNeedleGroup');
  const arcFill = document.getElementById('gaugeArcFill');
  const scoreDisplay = document.getElementById('csatScoreDisplay');
  const scoreBadge = document.getElementById('csatScoreBadge');

  // Ángulo de la aguja: de -90° (0 de score) a +90° (100 de score)
  // En score 79.17: -90 + 0.7917 * 180 = 52.5°
  const needleAngle = -90 + (m.activeScore / 100) * 180;
  if (needle) {
    needle.setAttribute('transform', `translate(150, 150) rotate(${needleAngle.toFixed(1)})`);
  }

  // Desplazamiento del arco de color (longitud del semicírculo ~345.5px)
  if (arcFill) {
    const dashoffset = 345.5 * (1 - m.activeScore / 100);
    arcFill.setAttribute('stroke-dashoffset', `${dashoffset.toFixed(1)}`);
  }

  if (scoreDisplay) {
    scoreDisplay.textContent = m.total > 0 ? m.activeScore.toFixed(2) : '0.00';
  }

  if (scoreBadge) {
    if (m.total === 0) {
      scoreBadge.textContent = 'SIN DATOS';
      scoreBadge.className = 'wii-score-badge';
    } else if (m.activeScore >= meta) {
      scoreBadge.textContent = `OBJETIVO CUMPLIDO (${m.activeScore.toFixed(1)}%)`;
      scoreBadge.className = 'wii-score-badge badge-good';
    } else if (m.activeScore >= meta - 5) {
      scoreBadge.textContent = `EN RANGO DE ALCANCE (${m.activeScore.toFixed(1)}%)`;
      scoreBadge.className = 'wii-score-badge badge-warn';
    } else {
      scoreBadge.textContent = `EN RIESGO (${m.activeScore.toFixed(1)}%)`;
      scoreBadge.className = 'wii-score-badge badge-danger';
    }
  }

  // 3. Barra de Distribución Segmentada Horizontal (Imagen 1)
  ['1', '2', '3', '4', '5'].forEach((k) => {
    const barSeg = document.getElementById(`segBarV${k}`);
    const pct = m[`pct${k}`];
    if (barSeg) {
      barSeg.style.width = `${pct}%`;
    }
  });

  // Leyenda de Puntos de Color
  const names = ['', 'Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'];
  ['1', '2', '3', '4', '5'].forEach((k) => {
    const legTxt = document.getElementById(`legTxtV${k}`);
    if (legTxt) {
      legTxt.textContent = `${m[`pct${k}`].toFixed(2)}% ${names[k]}`;
    }
  });

  // 4. Panel de Control de Meta & Diagnóstico
  const metaBadge = document.getElementById('txtCurrentMetaBadge');
  const goalRange = document.getElementById('goalRangeSlider');
  const inputMeta = document.getElementById('inputMetaDirect');

  if (metaBadge) metaBadge.textContent = `Meta: ${meta.toFixed(1)}%`;
  if (goalRange && document.activeElement !== goalRange) goalRange.value = meta;
  if (inputMeta && document.activeElement !== inputMeta) inputMeta.value = meta;

  // Presets de Meta Activos
  document.querySelectorAll('.wii-preset-chip[data-goal]').forEach((chip) => {
    const g = Number(chip.getAttribute('data-goal'));
    chip.classList.toggle('active', g === meta);
  });

  // Hero Banner de Diagnóstico y Mensaje Motivacional
  const heroBanner = document.getElementById('diagHeroBanner');
  const heroIcon = document.getElementById('diagHeroIcon');
  const heroHeadline = document.getElementById('diagHeroHeadline');
  const heroSub = document.getElementById('diagHeroSub');
  const heroStatNum = document.getElementById('diagHeroStatNum');
  const heroStatLbl = document.getElementById('diagHeroStatLbl');
  const diagMsg = document.getElementById('diagMessageText');
  const diagTotSurveys = document.getElementById('diagTotalSurveys');
  const diagTotPoints = document.getElementById('diagTotalPoints');
  const diagTol = document.getElementById('diagTolerance');

  if (diagTotSurveys) diagTotSurveys.textContent = `${m.total}`;
  if (diagTotPoints) diagTotPoints.textContent = `${m.sumPts} / ${m.total * 5} pts`;
  if (diagTol) diagTol.textContent = `${m.tolerance} adicional${m.tolerance === 1 ? '' : 'es'}`;

  if (heroBanner && diagMsg) {
    if (m.total === 0) {
      heroBanner.className = 'wii-diag-hero-banner banner-waiting';
      if (heroIcon) heroIcon.innerHTML = '<i class="fa-solid fa-sparkles"></i>';
      if (heroHeadline) heroHeadline.innerHTML = '✨ Esperando Primeras Encuestas';
      if (heroSub) heroSub.textContent = `Meta configurada en ${meta.toFixed(1)}%`;
      if (heroStatNum) heroStatNum.textContent = '0';
      if (heroStatLbl) heroStatLbl.textContent = 'Encuestas';
      diagMsg.innerHTML = `Ingresa las calificaciones de tu turno para proyectar tu CSAT Score hacia la meta de <strong>${meta}%</strong>. ¡Mucho éxito en tu jornada! 🚀`;
    } else if (m.activeScore >= meta) {
      heroBanner.className = 'wii-diag-hero-banner banner-achieved';
      if (heroIcon) heroIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
      if (heroStatNum) heroStatNum.textContent = `${m.activeScore.toFixed(1)}%`;
      if (heroStatLbl) heroStatLbl.textContent = '¡Superado!';

      if (m.activeScore === 100) {
        if (heroHeadline) heroHeadline.innerHTML = '¡Puntaje Perfecto 100%! 🎉';
        if (heroSub) heroSub.textContent = `+${m.gap.toFixed(2)}% sobre tu meta de ${meta.toFixed(1)}%`;
        diagMsg.innerHTML = `🎉 ¡Increíble desempeño! Tienes un CSAT impecable de <strong>100.00%</strong>. Tus clientes están fascinados con tu atención. 🛡️ Tienes colchón para recibir hasta <strong>${m.tolerance} encuesta(s) detonadora(s)</strong> sin caer de tu meta de ${meta}%. ¡A seguir brillando! ✨`;
      } else {
        if (heroHeadline) heroHeadline.innerHTML = '¡Objetivo Cumplido con Éxito! 🎉';
        if (heroSub) heroSub.textContent = `+${m.gap.toFixed(2)}% sobre tu meta de ${meta.toFixed(1)}%`;
        diagMsg.innerHTML = `👏 ¡Excelente trabajo! Tu CSAT actual es de <strong>${m.activeScore.toFixed(2)}%</strong>, superando con creces tu meta del ${meta}%. 🛡️ Puedes recibir hasta <strong>${m.tolerance} encuesta(s) menor(es)</strong> manteniendo tu objetivo seguro. ¡A seguir con todo! 🚀`;
      }
    } else {
      heroBanner.className = 'wii-diag-hero-banner banner-pending';
      if (heroIcon) heroIcon.innerHTML = '<i class="fa-solid fa-bullseye"></i>';
      if (heroHeadline) {
        heroHeadline.innerHTML = `🎯 Te faltan <strong>${m.needed}</strong> encuesta${m.needed === 1 ? '' : 's'} de 5★`;
      }
      if (heroSub) heroSub.textContent = `${m.gap.toFixed(2)}% para alcanzar tu meta de ${meta.toFixed(1)}%`;
      if (heroStatNum) heroStatNum.textContent = `${m.needed}`;
      if (heroStatLbl) heroStatLbl.textContent = '5★ Necesarias';

      if (m.needed <= 2) {
        diagMsg.innerHTML = `🔥 ¡Estás a un pasito de lograrlo! Solo necesitas <strong>${m.needed} encuesta${m.needed === 1 ? '' : 's'} consecutiva${m.needed === 1 ? '' : 's'} de 5★</strong> para asegurar tu meta de ${meta.toFixed(1)}%. ¡A dar el 100% en tu próxima llamada y lo conquistas! 💪⭐`;
      } else {
        diagMsg.innerHTML = `💪 ¡Ánimo que cada llamada es una oportunidad de oro! Necesitas <strong>${m.needed} encuestas consecutivas de 5★</strong> para alcanzar o superar tu meta de ${meta.toFixed(1)}%. ¡Conecta con el cliente, brinda tu mejor atención y sumamos ese 5★! ⭐🚀`;
      }
    }
  }

  // 5. Tabla de Leyenda & Desglose
  ['1', '2', '3', '4', '5'].forEach((k) => {
    const val = estado[`v${k}`];
    const pct = m[`pct${k}`];
    const pts = val * Number(k);

    const tblVal = document.getElementById(`tblValV${k}`);
    const tblPct = document.getElementById(`tblPctV${k}`);
    const tblPts = document.getElementById(`tblPtsV${k}`);
    const tblFill = document.getElementById(`tblFillV${k}`);

    if (tblVal) tblVal.textContent = val;
    if (tblPct) tblPct.textContent = `${pct.toFixed(2)}%`;
    if (tblPts) tblPts.textContent = `${val} × ${k}★ = ${pts} pts`;
    if (tblFill) tblFill.style.width = `${pct}%`;
  });

  const tblTotSurveys = document.getElementById('tblTotalSurveys');
  const tblTotPoints = document.getElementById('tblTotalPoints');
  const tblAvgRating = document.getElementById('tblAvgRating');
  const tblFinalCsat = document.getElementById('tblFinalCsatScore');
  const lthBadge = document.getElementById('lthTotalBadge');

  if (tblTotSurveys) tblTotSurveys.textContent = `${m.total}`;
  if (tblTotPoints) tblTotPoints.textContent = `${m.sumPts} / ${m.total * 5} pts`;
  if (tblAvgRating) tblAvgRating.textContent = `${m.avgRating.toFixed(2)}★`;
  if (tblFinalCsat) tblFinalCsat.textContent = `${m.activeScore.toFixed(2)}%`;
  if (lthBadge) lthBadge.textContent = `${m.total} ENCUESTA${m.total === 1 ? '' : 'S'} REGISTRADA${m.total === 1 ? '' : 'S'}`;

  // Botones de fórmula
  document.querySelectorAll('.wii-formula-btn[data-formula]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-formula') === formula);
  });

  // Guardar en almacenamiento local
  guardarEstado();
}

// =============================================================================
// INICIALIZACIÓN DE EVENTOS CON GUARDA DE CICLO DE VIDA (0 FUGAS DE MEMORIA)
// =============================================================================
export function inicializarMetricas() {
  const container = document.getElementById('metricasContainer');
  if (!container) return;

  cargarEstado();
  actualizarInterfaz();

  // Guarda estricta: Si ya está enlazado en este ciclo de vida del DOM, no duplicar listeners
  if (container.dataset.bound === 'true') {
    return;
  }
  container.dataset.bound = 'true';

  // 1. Delegación de Eventos para Steppers (+ y - en Cajas Superiores y Tabla de Leyenda)
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.wii-rc-btn-step, .wii-tbl-step-btn');
    if (!btn) return;

    e.preventDefault();
    const target = btn.getAttribute('data-target');
    const step = Number(btn.getAttribute('data-step') || '1');

    if (target && estado[target] !== undefined) {
      estado[target] = Math.max(0, estado[target] + step);
      actualizarInterfaz();
    }
  });

  // Inputs numéricos directos y sliders
  ['1', '2', '3', '4', '5'].forEach((k) => {
    const input = document.getElementById(`inputV${k}`);
    if (input) {
      input.addEventListener('input', () => {
        const val = Math.max(0, parseInt(input.value || '0', 10));
        estado[`v${k}`] = val;
        actualizarInterfaz();
      });
    }

    const range = document.getElementById(`rangeV${k}`);
    if (range) {
      range.addEventListener('input', () => {
        const val = Number(range.value || '0');
        estado[`v${k}`] = val;
        actualizarInterfaz();
      });
    }
  });

  // 2. Control de Meta (Slider, Steppers, Input Directo y Chips)
  const goalSlider = document.getElementById('goalRangeSlider');
  if (goalSlider) {
    goalSlider.addEventListener('input', () => {
      estado.meta = Number(goalSlider.value);
      actualizarInterfaz();
    });
  }

  const inputMeta = document.getElementById('inputMetaDirect');
  if (inputMeta) {
    inputMeta.addEventListener('input', () => {
      const val = Math.min(100, Math.max(50, Number(inputMeta.value) || 50));
      estado.meta = val;
      actualizarInterfaz();
    });
    inputMeta.addEventListener('blur', () => {
      inputMeta.value = estado.meta;
    });
  }

  const btnMetaDec = document.getElementById('btnMetaDec');
  if (btnMetaDec) {
    btnMetaDec.addEventListener('click', () => {
      estado.meta = Math.max(50, estado.meta - 1);
      actualizarInterfaz();
    });
  }

  const btnMetaInc = document.getElementById('btnMetaInc');
  if (btnMetaInc) {
    btnMetaInc.addEventListener('click', () => {
      estado.meta = Math.min(100, estado.meta + 1);
      actualizarInterfaz();
    });
  }

  container.querySelectorAll('.wii-preset-chip[data-goal]').forEach((chip) => {
    chip.addEventListener('click', () => {
      estado.meta = Number(chip.getAttribute('data-goal'));
      actualizarInterfaz();
    });
  });

  // 3. Selector de Fórmula (Likert 1-5 vs Top 2 Box)
  container.querySelectorAll('.wii-formula-btn[data-formula]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.formula = btn.getAttribute('data-formula') === 'top2' ? 'top2' : 'likert';
      actualizarInterfaz();
    });
  });

  // 4. Botones de Acción (Ejemplo 5 Encuestas 5★ & Reset)
  const btnExample = document.getElementById('btnLoadExample');
  if (btnExample) {
    btnExample.addEventListener('click', () => {
      estado.v1 = 0;
      estado.v2 = 0;
      estado.v3 = 0;
      estado.v4 = 0;
      estado.v5 = 5;
      estado.meta = 92;
      estado.formula = 'likert';
      actualizarInterfaz();
    });
  }

  const btnReset = document.getElementById('btnResetRatings');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      estado.v1 = 0;
      estado.v2 = 0;
      estado.v3 = 0;
      estado.v4 = 0;
      estado.v5 = 0;
      actualizarInterfaz();
    });
  }
}
