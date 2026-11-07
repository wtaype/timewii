// src/feature/calculadora/calculadora.js
// 🧮 Motor de Cálculo Aritmético, Conversión de Inglés Hablado y Horas de Turno
// 100% Cero latencia · Local-First · Soporte de teclado físico · Persistencia en localStorage

let currentInput = '0';
let previousInput = null;
let activeOperator = null;
let waitingForSecondOperand = false;
let activeResultVal = 0;
let activeResultType = 'ARITMÉTICA';

const STORAGE_KEY_HISTORY = 'timewii_calc_history';
const MAX_HISTORY_ITEMS = 15;

// =============================================================================
// 1. CONVERTIDOR DE NÚMEROS A PALABRAS EN INGLÉS (USA SPOKEN ENGLISH)
// =============================================================================
function numeroAIngles(num) {
  if (isNaN(num)) return 'Zero';
  if (num === 0) return 'Zero';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

  function convertGroup(n) {
    let groupStr = '';
    const h = Math.floor(n / 100);
    const t = n % 100;
    if (h > 0) {
      groupStr += ones[h] + ' Hundred';
      if (t > 0) groupStr += ' ';
    }
    if (t > 0) {
      if (t < 20) {
        groupStr += ones[t];
      } else {
        const d = Math.floor(t / 10);
        const u = t % 10;
        groupStr += tens[d];
        if (u > 0) groupStr += '-' + ones[u];
      }
    }
    return groupStr;
  }

  const isNeg = num < 0;
  const absNum = Math.abs(num);
  const intPart = Math.floor(absNum);
  const cents = Math.round((absNum - intPart) * 100);

  if (intPart === 0 && cents > 0) {
    return `${isNeg ? 'Minus ' : ''}${cents}/100`;
  }

  let words = '';
  let temp = intPart;
  let scaleIndex = 0;

  while (temp > 0 && scaleIndex < scales.length) {
    const chunk = temp % 1000;
    if (chunk > 0) {
      const chunkStr = convertGroup(chunk);
      const scaleStr = scales[scaleIndex];
      words = chunkStr + (scaleStr ? ' ' + scaleStr : '') + (words ? ' ' + words : '');
    }
    temp = Math.floor(temp / 1000);
    scaleIndex++;
  }

  if (!words) words = 'Zero';
  if (isNeg) words = 'Minus ' + words;

  if (cents > 0) {
    words += ` and ${cents}/100`;
  }

  return words;
}

// =============================================================================
// 2. FORMATEADORES NUMÉRICOS & DE MONEDA
// =============================================================================
function formatearNumero(val) {
  if (isNaN(val)) return '0';
  const parts = val.toString().split('.');
  parts[0] = Number(parts[0]).toLocaleString('en-US');
  return parts.join('.');
}

function formatearMoneda(val) {
  if (isNaN(val)) return '$0.00 USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val) + ' USD';
}

function ahoraFormateado() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// =============================================================================
// 3. INICIALIZADOR PRINCIPAL DE LA CALCULADORA
// =============================================================================
export function inicializarCalculadora() {
  const display = document.getElementById('calcDisplay');
  const expr = document.getElementById('calcExpression');
  if (!display) return;

  // Restaurar estado inicial si no estaba vinculado
  if (!display.dataset.bound) {
    currentInput = '0';
    previousInput = null;
    activeOperator = null;
    waitingForSecondOperand = false;
  }
  actualizarDisplay();

  // Cargar historial persistido
  cargarHistorial();

  // Evitar vincular múltiples veces los event listeners en el DOM (previene dígitos duplicados como '99')
  if (display.dataset.bound === 'true') {
    return;
  }
  display.dataset.bound = 'true';

  // Configurar tabs de modo
  configurarModoTabs();

  // Configurar botones del teclado numérico
  configurarKeypad();

  // Configurar chips rápidos
  configurarQuickChips();

  // Configurar eventos de cálculo de Horas y Tiempos
  configurarCalculadoraTiempos();

  // Configurar reuso de resultado y limpieza de historial
  configurarAccionesResultado();

  // Atajos de teclado físico
  document.removeEventListener('keydown', manejarTecladoFisico);
  document.addEventListener('keydown', manejarTecladoFisico);
}

// =============================================================================
// 4. MODO TABS: ARITMÉTICA VS HORAS & TIEMPOS
// =============================================================================
function configurarModoTabs() {
  const tabArit = document.getElementById('tabAritmetica');
  const tabTiempos = document.getElementById('tabTiempos');
  const viewArit = document.getElementById('viewAritmetica');
  const viewTiempos = document.getElementById('viewTiempos');
  const dgArit = document.getElementById('desgloseAritmetico');
  const dgTiempo = document.getElementById('desgloseTiempo');

  if (!tabArit || !tabTiempos || !viewArit || !viewTiempos) return;

  tabArit.addEventListener('click', () => {
    tabArit.classList.add('active');
    tabTiempos.classList.remove('active');
    viewArit.style.display = 'block';
    viewTiempos.style.display = 'none';

    if (activeResultType === 'ARITMÉTICA') {
      if (dgArit) dgArit.style.display = 'block';
      if (dgTiempo) dgTiempo.style.display = 'none';
    }
  });

  tabTiempos.addEventListener('click', () => {
    tabTiempos.classList.add('active');
    tabArit.classList.remove('active');
    viewTiempos.style.display = 'block';
    viewArit.style.display = 'none';

    if (activeResultType !== 'ARITMÉTICA') {
      if (dgArit) dgArit.style.display = 'none';
      if (dgTiempo) dgTiempo.style.display = 'block';
    }
  });
}

// =============================================================================
// 5. TECLADO NUMÉRICO & OPERACIONES ARITMÉTICAS
// =============================================================================
function actualizarDisplay() {
  const display = document.getElementById('calcDisplay');
  const expr = document.getElementById('calcExpression');
  if (display) {
    display.textContent = formatearNumero(currentInput);
  }
  if (expr) {
    if (previousInput !== null && activeOperator) {
      const opSign = activeOperator === '*' ? '×' : activeOperator === '/' ? '÷' : activeOperator;
      expr.textContent = `${formatearNumero(previousInput)} ${opSign}`;
    } else {
      expr.textContent = '';
    }
  }
}

function introducirDigito(digito) {
  if (waitingForSecondOperand) {
    currentInput = digito === '.' ? '0.' : digito;
    waitingForSecondOperand = false;
  } else {
    if (digito === '.') {
      if (!currentInput.includes('.')) {
        currentInput += '.';
      }
    } else {
      currentInput = currentInput === '0' ? digito : currentInput + digito;
    }
  }
  actualizarDisplay();
}

function manejarOperador(sigteOperador) {
  const inputValue = parseFloat(currentInput);

  if (activeOperator && waitingForSecondOperand) {
    activeOperator = sigteOperador;
    actualizarDisplay();
    return;
  }

  if (previousInput === null && !isNaN(inputValue)) {
    previousInput = inputValue;
  } else if (activeOperator) {
    const result = realizarOperacion(previousInput, inputValue, activeOperator);
    currentInput = `${parseFloat(result.toFixed(7))}`;
    previousInput = result;
    sincronizarResultadoAritmetico(result);
  }

  waitingForSecondOperand = true;
  activeOperator = sigteOperador;
  actualizarDisplay();
}

function realizarOperacion(prev, curr, op) {
  switch (op) {
    case '+': return prev + curr;
    case '-': return prev - curr;
    case '*': return prev * curr;
    case '/': return curr !== 0 ? prev / curr : 0;
    default: return curr;
  }
}

function ejecutarIgual() {
  if (activeOperator === null || previousInput === null) return;

  const curr = parseFloat(currentInput);
  const prev = previousInput;
  const op = activeOperator;
  const result = realizarOperacion(prev, curr, op);
  const cleanResult = parseFloat(result.toFixed(7));

  const opSign = op === '*' ? '×' : op === '/' ? '÷' : op;
  const expressionStr = `${formatearNumero(prev)} ${opSign} ${formatearNumero(curr)}`;

  currentInput = `${cleanResult}`;
  previousInput = null;
  activeOperator = null;
  waitingForSecondOperand = false;

  actualizarDisplay();
  sincronizarResultadoAritmetico(cleanResult, expressionStr);
  guardarEnHistorial(expressionStr, cleanResult, 'ARITMÉTICA');
}

function limpiarTodo() {
  currentInput = '0';
  previousInput = null;
  activeOperator = null;
  waitingForSecondOperand = false;
  actualizarDisplay();
}

function borrarUltimo() {
  if (waitingForSecondOperand) return;
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  actualizarDisplay();
}

function aplicarPorcentaje() {
  const curr = parseFloat(currentInput);
  if (isNaN(curr)) return;

  if (previousInput !== null && (activeOperator === '+' || activeOperator === '-')) {
    // e.g. 100 + 10% = 10 (10% de 100)
    const pctVal = (previousInput * curr) / 100;
    currentInput = `${pctVal}`;
  } else {
    currentInput = `${curr / 100}`;
  }
  actualizarDisplay();
}

function cambiarSigno() {
  const val = parseFloat(currentInput);
  if (val !== 0 && !isNaN(val)) {
    currentInput = `${val * -1}`;
    actualizarDisplay();
  }
}

function configurarKeypad() {
  const keypad = document.getElementById('calcKeypad');
  if (!keypad || keypad.dataset.bound === 'true') return;
  keypad.dataset.bound = 'true';

  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.hasAttribute('data-num')) {
      introducirDigito(btn.getAttribute('data-num'));
    } else if (btn.getAttribute('data-action') === 'op') {
      manejarOperador(btn.getAttribute('data-op'));
    } else if (btn.getAttribute('data-action') === 'equals') {
      ejecutarIgual();
    } else if (btn.getAttribute('data-action') === 'clear') {
      limpiarTodo();
    } else if (btn.getAttribute('data-action') === 'delete') {
      borrarUltimo();
    } else if (btn.getAttribute('data-action') === 'percent') {
      aplicarPorcentaje();
    } else if (btn.getAttribute('data-action') === 'negate') {
      cambiarSigno();
    }
  });
}

// Chips rápidos (+10%, +15%, +20%, etc.)
function configurarQuickChips() {
  const chips = document.querySelectorAll('.wii-chip-btn[data-quick]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-quick');
      const val = parseFloat(currentInput);
      if (isNaN(val)) return;

      let nuevoVal = val;
      let labelOp = '';

      switch (q) {
        case '+10%': nuevoVal = val * 1.10; labelOp = `${formatearNumero(val)} + 10%`; break;
        case '+15%': nuevoVal = val * 1.15; labelOp = `${formatearNumero(val)} + 15%`; break;
        case '+20%': nuevoVal = val * 1.20; labelOp = `${formatearNumero(val)} + 20%`; break;
        case '-10%': nuevoVal = val * 0.90; labelOp = `${formatearNumero(val)} − 10%`; break;
        case '-15%': nuevoVal = val * 0.85; labelOp = `${formatearNumero(val)} − 15%`; break;
        case 'round': nuevoVal = Math.round(val * 100) / 100; labelOp = `Redondeo (${formatearNumero(val)})`; break;
        case 'int': nuevoVal = Math.round(val); labelOp = `Entero (${formatearNumero(val)})`; break;
      }

      const resLimpio = parseFloat(nuevoVal.toFixed(4));
      currentInput = `${resLimpio}`;
      actualizarDisplay();
      sincronizarResultadoAritmetico(resLimpio, labelOp);
      guardarEnHistorial(labelOp, resLimpio, 'ARITMÉTICA');
    });
  });
}

// Atajos de Teclado Físico
function manejarTecladoFisico(e) {
  // Ignorar si el foco está en un input de texto o tiempo
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
    return;
  }

  const key = e.key;
  if (/^[0-9]$/.test(key)) {
    e.preventDefault();
    introducirDigito(key);
  } else if (key === '.') {
    e.preventDefault();
    introducirDigito('.');
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    e.preventDefault();
    manejarOperador(key);
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    ejecutarIgual();
  } else if (key === 'Backspace') {
    e.preventDefault();
    borrarUltimo();
  } else if (key === 'Escape') {
    e.preventDefault();
    limpiarTodo();
  }
}

// =============================================================================
// 6. SINCRONIZACIÓN DE RESULTADOS & ANÁLISIS EN PANEL DERECHO
// =============================================================================
function sincronizarResultadoAritmetico(num, exprStr = '') {
  activeResultVal = num;
  activeResultType = 'ARITMÉTICA';

  const pill = document.getElementById('resTypePill');
  const hero = document.getElementById('resHeroVal');
  const ts = document.getElementById('resTimestamp');
  const dgArit = document.getElementById('desgloseAritmetico');
  const dgTiempo = document.getElementById('desgloseTiempo');

  if (pill) pill.textContent = 'ARITMÉTICA';
  if (hero) hero.textContent = formatearNumero(num);
  if (ts) ts.textContent = `Calculado a las ${ahoraFormateado()}`;

  // Mostrar desglose aritmético
  if (dgArit) dgArit.style.display = 'block';
  if (dgTiempo) dgTiempo.style.display = 'none';

  // Desglose Moneda
  const txtMoneda = document.getElementById('txtResMoneda');
  if (txtMoneda) txtMoneda.textContent = formatearMoneda(num);

  // Desglose Inglés Hablado
  const txtIngles = document.getElementById('txtResIngles');
  if (txtIngles) txtIngles.textContent = numeroAIngles(num);

  // Desglose Propinas / Recargos (+10%, +15%, +20%)
  const d10 = num * 0.10;
  const d15 = num * 0.15;
  const d20 = num * 0.20;

  const t10d = document.getElementById('txtTip10Delta');
  const t10t = document.getElementById('txtTip10Total');
  const t15d = document.getElementById('txtTip15Delta');
  const t15t = document.getElementById('txtTip15Total');
  const t20d = document.getElementById('txtTip20Delta');
  const t20t = document.getElementById('txtTip20Total');

  if (t10d) t10d.textContent = `+${formatearMoneda(d10).replace(' USD', '')}`;
  if (t10t) t10t.textContent = formatearMoneda(num + d10);

  if (t15d) t15d.textContent = `+${formatearMoneda(d15).replace(' USD', '')}`;
  if (t15t) t15t.textContent = formatearMoneda(num + d15);

  if (t20d) t20d.textContent = `+${formatearMoneda(d20).replace(' USD', '')}`;
  if (t20t) t20t.textContent = formatearMoneda(num + d20);
}

function sincronizarResultadoTiempo(horas, minutos, totalMinutos, tituloTipo = 'TIEMPO DE TURNO') {
  activeResultVal = totalMinutos;
  activeResultType = tituloTipo;

  const pill = document.getElementById('resTypePill');
  const hero = document.getElementById('resHeroVal');
  const ts = document.getElementById('resTimestamp');
  const dgArit = document.getElementById('desgloseAritmetico');
  const dgTiempo = document.getElementById('desgloseTiempo');

  if (pill) pill.textContent = tituloTipo;
  if (hero) hero.textContent = `${horas}h ${minutos < 10 ? '0' : ''}${minutos}m`;
  if (ts) ts.textContent = `Calculado a las ${ahoraFormateado()}`;

  // Mostrar desglose de tiempo
  if (dgArit) dgArit.style.display = 'none';
  if (dgTiempo) dgTiempo.style.display = 'block';

  const decimalVal = (totalMinutos / 60).toFixed(2);

  const txtHm = document.getElementById('txtTimeHm');
  const txtDec = document.getElementById('txtTimeDecimal');
  const txtMin = document.getElementById('txtTimeMinutos');

  if (txtHm) txtHm.textContent = `${horas}h ${minutos < 10 ? '0' : ''}${minutos}m`;
  if (txtDec) txtDec.textContent = `${decimalVal} hrs`;
  if (txtMin) txtMin.textContent = `${totalMinutos.toLocaleString('en-US')} mins`;

  // Progreso de jornada estándar de 8 horas (480 minutos)
  const baseJornadaMin = 480;
  const pctJornada = Math.round((totalMinutos / baseJornadaMin) * 100);
  const fillWidth = Math.min(100, Math.max(0, pctJornada));

  const shiftPct = document.getElementById('txtShiftPct');
  const shiftFill = document.getElementById('shiftProgFill');
  const shiftMeta = document.getElementById('txtShiftMeta');

  if (shiftPct) shiftPct.textContent = `${pctJornada}%`;
  if (shiftFill) shiftFill.style.width = `${fillWidth}%`;

  if (shiftMeta) {
    if (totalMinutos >= baseJornadaMin) {
      const extraMin = totalMinutos - baseJornadaMin;
      const extraH = Math.floor(extraMin / 60);
      const extraM = extraMin % 60;
      shiftMeta.textContent = `✅ Jornada completa de 8h cumplida (+${extraH}h ${extraM}m overtime)`;
    } else {
      const faltanMin = baseJornadaMin - totalMinutos;
      const faltanH = Math.floor(faltanMin / 60);
      const faltanM = faltanMin % 60;
      shiftMeta.textContent = `Faltan ${faltanH}h ${faltanM}m para completar las 8 horas reglamentarias`;
    }
  }
}

// =============================================================================
// 7. CALCULADORA DE HORAS & TIEMPOS DE TURNO
// =============================================================================
function configurarCalculadoraTiempos() {
  // A. Duración neta entre horas (Turno)
  const btnDiff = document.getElementById('btnCalcTimeDiff');
  if (btnDiff) {
    btnDiff.addEventListener('click', () => {
      const startStr = document.getElementById('timeDiffStart')?.value || '08:30';
      const endStr   = document.getElementById('timeDiffEnd')?.value || '17:15';
      const breakMin = parseInt(document.getElementById('timeDiffBreak')?.value || '60', 10);

      const [sh, sm] = startStr.split(':').map(Number);
      const [eh, em] = endStr.split(':').map(Number);

      let startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;

      // Si termina al día siguiente (turno nocturno)
      if (endMin < startMin) {
        endMin += 24 * 60;
      }

      let diffNetMin = (endMin - startMin) - breakMin;
      if (diffNetMin < 0) diffNetMin = 0;

      const h = Math.floor(diffNetMin / 60);
      const m = diffNetMin % 60;

      const exprStr = `Turno: ${startStr} a ${endStr} (−${breakMin}m break)`;
      sincronizarResultadoTiempo(h, m, diffNetMin, 'DURACIÓN TURNO');
      guardarEnHistorial(exprStr, `${h}h ${m < 10 ? '0' : ''}${m}m`, 'TIEMPO TURNO', diffNetMin);
    });
  }

  // B. Sumar o restar bloques de tiempo
  const btnBlocks = document.getElementById('btnCalcTimeBlocks');
  if (btnBlocks) {
    btnBlocks.addEventListener('click', () => {
      const ah = parseInt(document.getElementById('blockAh')?.value || '0', 10);
      const am = parseInt(document.getElementById('blockAm')?.value || '0', 10);
      const bh = parseInt(document.getElementById('blockBh')?.value || '0', 10);
      const bm = parseInt(document.getElementById('blockBm')?.value || '0', 10);
      const op = document.getElementById('blockOperator')?.value || 'add';

      const minA = ah * 60 + am;
      const minB = bh * 60 + bm;

      let totMin = op === 'add' ? (minA + minB) : (minA - minB);
      if (totMin < 0) totMin = 0;

      const h = Math.floor(totMin / 60);
      const m = totMin % 60;

      const opSign = op === 'add' ? '+' : '−';
      const exprStr = `${ah}h ${am}m ${opSign} ${bh}h ${bm}m`;

      sincronizarResultadoTiempo(h, m, totMin, 'SUMA DE TIEMPOS');
      guardarEnHistorial(exprStr, `${h}h ${m < 10 ? '0' : ''}${m}m`, 'SUMA TIEMPOS', totMin);
    });
  }

  // C. Convertidor Decimal a Horas:Minutos
  const btnDecToHm = document.getElementById('btnConvDecimalToHm');
  if (btnDecToHm) {
    btnDecToHm.addEventListener('click', () => {
      const dec = parseFloat(document.getElementById('convDecimalInput')?.value || '0');
      const totMin = Math.round(dec * 60);
      const h = Math.floor(totMin / 60);
      const m = totMin % 60;

      const inH = document.getElementById('convHInput');
      const inM = document.getElementById('convMInput');
      if (inH) inH.value = h;
      if (inM) inM.value = m;

      const exprStr = `Conversión: ${dec} hrs decimales`;
      sincronizarResultadoTiempo(h, m, totMin, 'CONVERSIÓN TIEMPO');
      guardarEnHistorial(exprStr, `${h}h ${m < 10 ? '0' : ''}${m}m`, 'CONVERSIÓN', totMin);
    });
  }

  // C. Convertidor Horas:Minutos a Decimal
  const btnHmToDec = document.getElementById('btnConvHmToDecimal');
  if (btnHmToDec) {
    btnHmToDec.addEventListener('click', () => {
      const h = parseInt(document.getElementById('convHInput')?.value || '0', 10);
      const m = parseInt(document.getElementById('convMInput')?.value || '0', 10);
      const totMin = h * 60 + m;
      const dec = parseFloat((totMin / 60).toFixed(2));

      const inDec = document.getElementById('convDecimalInput');
      if (inDec) inDec.value = dec;

      const exprStr = `Conversión: ${h}h ${m}m`;
      sincronizarResultadoTiempo(h, m, totMin, 'CONVERSIÓN TIEMPO');
      guardarEnHistorial(exprStr, `${dec} hrs`, 'CONVERSIÓN', totMin);
    });
  }

  // Presets de Turnos (7.5h, 8.0h, 8.5h)
  const presets = document.querySelectorAll('.wii-preset-chip[data-decimal]');
  presets.forEach(p => {
    p.addEventListener('click', () => {
      const dec = parseFloat(p.getAttribute('data-decimal') || '8.0');
      const inDec = document.getElementById('convDecimalInput');
      if (inDec) {
        inDec.value = dec;
        btnDecToHm?.click();
      }
    });
  });
}

// =============================================================================
// 8. ACCIONES DE RESULTADO (REUSAR EN PANTALLA) & HISTORIAL
// =============================================================================
function configurarAccionesResultado() {
  const btnReuse = document.getElementById('btnReuseResult');
  if (btnReuse) {
    btnReuse.addEventListener('click', () => {
      if (activeResultType === 'ARITMÉTICA') {
        currentInput = `${activeResultVal}`;
        actualizarDisplay();
      } else {
        // En tiempo, cargar horas en el display aritmético
        const hoursDecimal = (activeResultVal / 60).toFixed(2);
        currentInput = `${parseFloat(hoursDecimal)}`;
        actualizarDisplay();
      }
      // Cambiar al tab de aritmética
      document.getElementById('tabAritmetica')?.click();
    });
  }

  const btnClearHist = document.getElementById('btnClearHistory');
  if (btnClearHist) {
    btnClearHist.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      renderizarHistorial([]);
    });
  }
}

function guardarEnHistorial(expresion, resultado, tipo, numVal = null) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
    const nuevoRegistro = {
      id: Date.now(),
      expresion: expresion || `${resultado}`,
      resultado: `${resultado}`,
      tipo,
      hora: ahoraFormateado(),
      val: numVal !== null ? numVal : resultado
    };

    list.unshift(nuevoRegistro);
    if (list.length > MAX_HISTORY_ITEMS) {
      list.pop();
    }

    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(list));
    renderizarHistorial(list);
  } catch (e) {}
}

function cargarHistorial() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
    renderizarHistorial(list);
  } catch (e) {
    renderizarHistorial([]);
  }
}

function renderizarHistorial(list) {
  const container = document.getElementById('calcHistoryList');
  const empty = document.getElementById('calcHistoryEmpty');
  const counter = document.getElementById('historyCounterBadge');

  if (!container || !empty) return;

  if (counter) {
    counter.textContent = `${list.length} REGISTRO${list.length === 1 ? '' : 'S'}`;
  }

  if (list.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  container.innerHTML = list.map(item => `
    <div class="wii-hist-item" data-id="${item.id}" data-val="${item.val}">
      <div class="wii-hist-meta">
        <span class="wii-hist-type">${item.tipo}</span>
        <span class="wii-hist-time">${item.hora}</span>
      </div>
      <div class="wii-hist-body">
        <div class="wii-hist-expr">${item.expresion}</div>
        <div class="wii-hist-res">= ${item.resultado}</div>
      </div>
      <div class="wii-hist-actions">
        <button type="button" class="wii-hist-btn-load" data-action="load" title="Cargar este resultado">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <button type="button" class="wii-hist-btn-del" data-action="delete" title="Eliminar registro">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `).join('');

  // Eventos de delegación en la lista
  container.onclick = (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const row = btn.closest('.wii-hist-item');
    if (!row) return;

    const id = parseInt(row.getAttribute('data-id') || '0', 10);
    const val = row.getAttribute('data-val');

    if (btn.getAttribute('data-action') === 'load') {
      currentInput = val || '0';
      actualizarDisplay();
      document.getElementById('tabAritmetica')?.click();
    } else if (btn.getAttribute('data-action') === 'delete') {
      const filtrado = list.filter(it => it.id !== id);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtrado));
      renderizarHistorial(filtrado);
    }
  };
}
