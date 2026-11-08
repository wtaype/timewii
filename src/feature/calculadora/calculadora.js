// src/feature/calculadora/calculadora.js
// 🧮 Motor de Cálculo de 3 Estaciones (Pro Azul / VIP Clásica / Ultra WiTema) & Historial Unificado
// 100% Cero latencia · Local-First · Soporte de teclado físico · Persistencia en localStorage
import { Mensaje, wiConfirmar } from '../../core/widev/widev.js';

// =============================================================================
// ESTADO GLOBAL: PRO (1), VIP (2) Y ULTRA (3)
// =============================================================================
let proInput = '0';
let proPrev = null;
let proOp = null;
let proWaiting = false;
let proLastExpr = '';

let vipInput = '0';
let vipPrev = null;
let vipOp = null;
let vipWaiting = false;
let vipLastExpr = '';

let ultraInput = '0';
let ultraPrev = null;
let ultraOp = null; // '+', '-', 'desc', 'pct_de', 'to_pen', 'to_usd'
let ultraWaiting = false;
let ultraLastExpr = '';

let ultimaEstacionActiva = 'pro'; // 'pro', 'vip', 'ultra' (Pro primero)

const STORAGE_KEY_HISTORY = 'timewii_calc_history_v4';
const MAX_HISTORY_ITEMS = 30;

// =============================================================================
// 1. CONVERTIDOR DE NÚMEROS A PALABRAS EN INGLÉS (USA SPOKEN ENGLISH)
// =============================================================================
function numeroAIngles(num) {
  if (isNaN(num)) return 'Zero dollars';
  if (num === 0) return 'Zero dollars';

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

  const dollarUnit = intPart === 1 ? 'dollar' : 'dollars';

  if (cents > 0) {
    const centsText = convertGroup(cents).toLowerCase();
    const centUnit = cents === 1 ? 'cent' : 'cents';
    return `${words} ${dollarUnit} and ${centsText} ${centUnit}`;
  }

  return `${words} ${dollarUnit}`;
}

// =============================================================================
// 2. FORMATEADORES NUMÉRICOS & DE MONEDA
// =============================================================================
function formatearNumero(val) {
  if (isNaN(val) || val === '' || val === null) return '0';
  const parts = val.toString().split('.');
  parts[0] = Number(parts[0]).toLocaleString('en-US');
  return parts.join('.');
}

function ahoraFormateado() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// =============================================================================
// 3. INICIALIZADOR PRINCIPAL
// =============================================================================
export function inicializarCalculadora() {
  const container = document.getElementById('calcVipStation') || document.getElementById('calcProStation');
  if (!container) return;

  // Restaurar estado si no está vinculado
  if (container.dataset.bound !== 'true') {
    proInput = '0';
    proPrev = null;
    proOp = null;
    proWaiting = false;
    proLastExpr = '';

    vipInput = '0';
    vipPrev = null;
    vipOp = null;
    vipWaiting = false;
    vipLastExpr = '';

    ultraInput = '0';
    ultraPrev = null;
    ultraOp = null;
    ultraWaiting = false;
    ultraLastExpr = '';
  }

  actualizarProDisplay();
  actualizarVipDisplay();
  actualizarUltraDisplay();

  // Cargar historial persistido
  cargarHistorial();

  // Guarda contra doble vinculación en Astro
  if (container.dataset.bound === 'true') {
    return;
  }
  container.dataset.bound = 'true';

  // Configuración de Estaciones
  configurarProStation();
  configurarVipStation();
  configurarUltraStation();
  configurarFooterUnificado();

  // Atajos de teclado físico
  document.removeEventListener('keydown', manejarTecladoFisico);
  document.addEventListener('keydown', manejarTecladoFisico);
}

// =============================================================================
// 4. ESTACIÓN 1: CALCULADORA PRO (AZUL GOOGLE PRO - 1ERA POSICIÓN)
// =============================================================================
function actualizarProDisplay() {
  const display = document.getElementById('proDisplay');
  const expr = document.getElementById('proExpression');

  if (display) {
    display.textContent = formatearNumero(proInput);
  }
  if (expr) {
    if (proPrev !== null && proOp) {
      const opSign = proOp === '*' ? '×' : proOp === '/' ? '÷' : proOp;
      if (!proWaiting && proInput !== '0') {
        expr.textContent = `${formatearNumero(proPrev)} ${opSign} ${formatearNumero(proInput)}`;
      } else {
        expr.textContent = `${formatearNumero(proPrev)} ${opSign}`;
      }
    } else if (proLastExpr) {
      expr.textContent = proLastExpr;
    } else {
      expr.textContent = '';
    }
  }
}

function proIntroducirDigito(digito) {
  ultimaEstacionActiva = 'pro';
  if (proWaiting) {
    proInput = digito === '.' ? '0.' : digito;
    proWaiting = false;
  } else {
    if (proLastExpr && proPrev === null && !proOp) {
      proInput = digito === '.' ? '0.' : digito;
      proLastExpr = '';
    } else if (digito === '.') {
      if (!proInput.includes('.')) {
        proInput += '.';
      }
    } else {
      proInput = proInput === '0' ? digito : proInput + digito;
    }
  }
  actualizarProDisplay();
}

function proManejarOperador(sigteOperador) {
  ultimaEstacionActiva = 'pro';
  proLastExpr = '';
  const val = parseFloat(proInput);

  if (proOp && proWaiting) {
    proOp = sigteOperador;
    actualizarProDisplay();
    return;
  }

  if (proPrev === null && !isNaN(val)) {
    proPrev = val;
  } else if (proOp) {
    const res = calcularAritmetica(proPrev, val, proOp);
    proInput = `${parseFloat(res.toFixed(7))}`;
    proPrev = res;
  }

  proWaiting = true;
  proOp = sigteOperador;
  actualizarProDisplay();
}

function proEjecutarIgual() {
  ultimaEstacionActiva = 'pro';
  if (proOp === null || proPrev === null) return;

  const curr = parseFloat(proInput);
  const prev = proPrev;
  const op = proOp;
  const res = calcularAritmetica(prev, curr, op);
  const cleanRes = parseFloat(res.toFixed(7));

  const opSign = op === '*' ? '×' : op === '/' ? '÷' : op;
  const exprStr = `${formatearNumero(prev)} ${opSign} ${formatearNumero(curr)}`;
  const opHist = `${exprStr} = ${formatearNumero(cleanRes)}`;

  proInput = `${cleanRes}`;
  proLastExpr = `${exprStr} =`;
  proPrev = null;
  proOp = null;
  proWaiting = false;

  actualizarProDisplay();
  guardarEnHistorial(opHist, cleanRes, 'pro', 'ARITMÉTICA', cleanRes);
}

function proLimpiar() {
  proInput = '0';
  proPrev = null;
  proOp = null;
  proWaiting = false;
  proLastExpr = '';
  actualizarProDisplay();
}

function proBorrarUltimo() {
  if (proWaiting) return;
  if (proInput.length > 1) {
    proInput = proInput.slice(0, -1);
  } else {
    proInput = '0';
  }
  actualizarProDisplay();
}

function configurarProStation() {
  const keypad = document.getElementById('proKeypad');
  if (keypad) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.hasAttribute('data-pro-num')) {
        proIntroducirDigito(btn.getAttribute('data-pro-num'));
      } else if (btn.getAttribute('data-pro-action') === 'op') {
        proManejarOperador(btn.getAttribute('data-op'));
      } else if (btn.getAttribute('data-pro-action') === 'equals') {
        proEjecutarIgual();
      } else if (btn.getAttribute('data-pro-action') === 'clear') {
        proLimpiar();
      } else if (btn.getAttribute('data-pro-action') === 'delete') {
        proBorrarUltimo();
      } else if (btn.getAttribute('data-pro-action') === 'percent') {
        const curr = parseFloat(proInput);
        if (!isNaN(curr)) {
          proInput = `${curr / 100}`;
          actualizarProDisplay();
        }
      } else if (btn.getAttribute('data-pro-action') === 'negate') {
        const val = parseFloat(proInput);
        if (val !== 0 && !isNaN(val)) {
          proInput = `${val * -1}`;
          actualizarProDisplay();
        }
      }
    });
  }

  // Barra de Funciones Científicas Pro
  const sciBtns = document.querySelectorAll('[data-pro-sci]');
  sciBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ultimaEstacionActiva = 'pro';
      const sci = btn.getAttribute('data-pro-sci');
      const val = parseFloat(proInput);
      if (isNaN(val)) return;

      let res = val;
      let label = '';

      switch (sci) {
        case 'sqr':
          res = Math.pow(val, 2);
          label = `(${formatearNumero(val)})²`;
          break;
        case 'sqrt':
          res = val >= 0 ? Math.sqrt(val) : 0;
          label = `√(${formatearNumero(val)})`;
          break;
        case 'inv':
          res = val !== 0 ? 1 / val : 0;
          label = `1/(${formatearNumero(val)})`;
          break;
        case 'pi':
          res = Math.PI;
          label = `Constante π`;
          break;
        case 'round':
          res = Math.round(val * 100) / 100;
          label = `Redondeo .00 (${formatearNumero(val)})`;
          break;
      }

      const resLimpio = parseFloat(res.toFixed(6));
      proInput = `${resLimpio}`;
      proLastExpr = `${label} =`;
      actualizarProDisplay();
      guardarEnHistorial(`${label} = ${resLimpio}`, resLimpio, 'pro', 'CIENTÍFICA', resLimpio);
    });
  });
}

// =============================================================================
// 5. ESTACIÓN 2: CALCULADORA VIP (CLÁSICA DARK & NARANJA - 2DA POSICIÓN)
// =============================================================================
function actualizarVipDisplay() {
  const display = document.getElementById('vipDisplay');
  const expr = document.getElementById('vipExpression');
  const keyAC = document.getElementById('vipKeyAC');

  if (display) {
    display.textContent = formatearNumero(vipInput);
  }
  if (expr) {
    if (vipPrev !== null && vipOp) {
      const opSign = vipOp === '*' ? '×' : vipOp === '/' ? '÷' : vipOp;
      if (!vipWaiting && vipInput !== '0') {
        expr.textContent = `${formatearNumero(vipPrev)} ${opSign} ${formatearNumero(vipInput)}`;
      } else {
        expr.textContent = `${formatearNumero(vipPrev)} ${opSign}`;
      }
    } else if (vipLastExpr) {
      expr.textContent = vipLastExpr;
    } else {
      expr.textContent = '';
    }
  }
  if (keyAC) {
    keyAC.textContent = (vipInput !== '0' || vipPrev !== null || vipLastExpr !== '') ? 'C' : 'AC';
  }
}

function vipIntroducirDigito(digito) {
  ultimaEstacionActiva = 'vip';
  if (vipWaiting) {
    vipInput = digito === '.' ? '0.' : digito;
    vipWaiting = false;
  } else {
    if (vipLastExpr && vipPrev === null && !vipOp) {
      vipInput = digito === '.' ? '0.' : digito;
      vipLastExpr = '';
    } else if (digito === '.') {
      if (!vipInput.includes('.')) {
        vipInput += '.';
      }
    } else {
      vipInput = vipInput === '0' ? digito : vipInput + digito;
    }
  }
  actualizarVipDisplay();
}

function vipManejarOperador(sigteOperador) {
  ultimaEstacionActiva = 'vip';
  vipLastExpr = '';
  const val = parseFloat(vipInput);

  if (vipOp && vipWaiting) {
    vipOp = sigteOperador;
    actualizarVipDisplay();
    return;
  }

  if (vipPrev === null && !isNaN(val)) {
    vipPrev = val;
  } else if (vipOp) {
    const res = calcularAritmetica(vipPrev, val, vipOp);
    vipInput = `${parseFloat(res.toFixed(7))}`;
    vipPrev = res;
  }

  vipWaiting = true;
  vipOp = sigteOperador;
  actualizarVipDisplay();
}

function vipEjecutarIgual() {
  ultimaEstacionActiva = 'vip';
  if (vipOp === null || vipPrev === null) return;

  const curr = parseFloat(vipInput);
  const prev = vipPrev;
  const op = vipOp;
  const res = calcularAritmetica(prev, curr, op);
  const cleanRes = parseFloat(res.toFixed(7));

  const opSign = op === '*' ? '×' : op === '/' ? '÷' : op;
  const exprStr = `${formatearNumero(prev)} ${opSign} ${formatearNumero(curr)}`;
  const opHist = `${exprStr} = ${formatearNumero(cleanRes)}`;

  vipInput = `${cleanRes}`;
  vipLastExpr = `${exprStr} =`;
  vipPrev = null;
  vipOp = null;
  vipWaiting = false;

  actualizarVipDisplay();
  guardarEnHistorial(opHist, cleanRes, 'vip', 'ARITMÉTICA', cleanRes);
}

function vipLimpiar() {
  vipInput = '0';
  vipPrev = null;
  vipOp = null;
  vipWaiting = false;
  vipLastExpr = '';
  actualizarVipDisplay();
}

function vipBorrarUltimo() {
  if (vipWaiting) return;
  if (vipInput.length > 1) {
    vipInput = vipInput.slice(0, -1);
  } else {
    vipInput = '0';
  }
  actualizarVipDisplay();
}

function vipPorcentaje() {
  const curr = parseFloat(vipInput);
  if (isNaN(curr)) return;

  if (vipPrev !== null && (vipOp === '+' || vipOp === '-')) {
    const pctVal = (vipPrev * curr) / 100;
    vipInput = `${pctVal}`;
  } else {
    vipInput = `${curr / 100}`;
  }
  actualizarVipDisplay();
}

function vipCambiarSigno() {
  const val = parseFloat(vipInput);
  if (val !== 0 && !isNaN(val)) {
    vipInput = `${val * -1}`;
    actualizarVipDisplay();
  }
}

function configurarVipStation() {
  const keypad = document.getElementById('vipKeypad');
  if (keypad) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.hasAttribute('data-vip-num')) {
        vipIntroducirDigito(btn.getAttribute('data-vip-num'));
      } else if (btn.getAttribute('data-vip-action') === 'op') {
        vipManejarOperador(btn.getAttribute('data-op'));
      } else if (btn.getAttribute('data-vip-action') === 'equals') {
        vipEjecutarIgual();
      } else if (btn.getAttribute('data-vip-action') === 'clear') {
        vipLimpiar();
      } else if (btn.getAttribute('data-vip-action') === 'delete') {
        vipBorrarUltimo();
      } else if (btn.getAttribute('data-vip-action') === 'percent') {
        vipPorcentaje();
      } else if (btn.getAttribute('data-vip-action') === 'negate') {
        vipCambiarSigno();
      }
    });
  }
}

// =============================================================================
// 6. ESTACIÓN 3: CALCULADORA ULTRA (TECLADO TÁCTIL, DESCUENTOS & DIVISAS)
// =============================================================================
function obtenerUltraTC() {
  const inRate = document.getElementById('ultraExchangeRate');
  let tc = parseFloat(inRate?.value || '3.45');
  if (isNaN(tc) || tc <= 0) tc = 3.45;
  return tc;
}

function actualizarUltraDisplay() {
  const display = document.getElementById('ultraDisplay');
  const expr = document.getElementById('ultraExpression');
  const keyC = document.getElementById('ultraKeyC');

  if (display) {
    display.textContent = formatearNumero(ultraInput);
  }
  if (expr) {
    if (ultraPrev !== null && ultraOp) {
      const tc = obtenerUltraTC();
      if (ultraOp === 'desc') {
        expr.textContent = `${formatearNumero(ultraPrev)}% dscto ${ultraWaiting ? '...' : formatearNumero(ultraInput)}`;
      } else if (ultraOp === 'pct_de') {
        expr.textContent = `${formatearNumero(ultraPrev)}% de ${ultraWaiting ? '...' : formatearNumero(ultraInput)}`;
      } else if (ultraOp === 'to_pen') {
        expr.textContent = `$ ${formatearNumero(ultraPrev)} a s/ Soles es =`;
      } else if (ultraOp === 'to_usd') {
        expr.textContent = `S/ ${formatearNumero(ultraPrev)} a $ Dólares es =`;
      } else {
        const opSign = ultraOp === '*' ? '×' : ultraOp === '/' ? '÷' : ultraOp;
        if (!ultraWaiting && ultraInput !== '0') {
          expr.textContent = `${formatearNumero(ultraPrev)} ${opSign} ${formatearNumero(ultraInput)}`;
        } else {
          expr.textContent = `${formatearNumero(ultraPrev)} ${opSign}`;
        }
      }
    } else if (ultraLastExpr) {
      expr.textContent = ultraLastExpr;
    } else {
      expr.textContent = '';
    }
  }
  if (keyC) {
    keyC.textContent = (ultraInput !== '0' || ultraPrev !== null || ultraLastExpr !== '') ? 'C' : 'AC';
  }
}

function ultraIntroducirDigito(digito) {
  ultimaEstacionActiva = 'ultra';
  if (ultraWaiting) {
    ultraInput = digito === '.' ? '0.' : digito;
    ultraWaiting = false;
  } else {
    if (ultraLastExpr && ultraPrev === null && !ultraOp) {
      ultraInput = digito === '.' ? '0.' : digito;
      ultraLastExpr = '';
    } else if (digito === '.') {
      if (!ultraInput.includes('.')) {
        ultraInput += '.';
      }
    } else {
      ultraInput = ultraInput === '0' ? digito : ultraInput + digito;
    }
  }
  actualizarUltraDisplay();
}

function ultraManejarOperador(op) {
  ultimaEstacionActiva = 'ultra';
  ultraLastExpr = '';
  const val = parseFloat(ultraInput);

  if (ultraOp && ultraWaiting) {
    ultraOp = op;
    actualizarUltraDisplay();
    return;
  }

  if (ultraPrev === null && !isNaN(val)) {
    ultraPrev = val;
  } else if (ultraOp) {
    const res = calcularAritmetica(ultraPrev, val, ultraOp);
    ultraInput = `${parseFloat(res.toFixed(7))}`;
    ultraPrev = res;
  }

  ultraWaiting = true;
  ultraOp = op;
  actualizarUltraDisplay();
}

function ultraManejarEspecial(accion) {
  ultimaEstacionActiva = 'ultra';
  ultraLastExpr = '';
  const val = parseFloat(ultraInput) || 0;

  if (accion === 'pct_de') {
    // Ejemplo: 20 -> "xx% de xx" -> 100 -> "=" => 20% de 100 es 20
    ultraPrev = val;
    ultraOp = 'pct_de';
    ultraWaiting = true;
    actualizarUltraDisplay();
  } else if (accion === 'desc') {
    // Ejemplo: 69.90 -> "xx% dsct xx" -> 20 -> "=" => 69.90 dscto 20% es 55.92 (Ahorro: 13.98)
    ultraPrev = val;
    ultraOp = 'desc';
    ultraWaiting = true;
    actualizarUltraDisplay();
  } else if (accion === 'to_pen') {
    // Ejemplo: 10 -> "$ a S/" -> "=" => 10 Dólares son 34.50 Soles (T.C. 3.45)
    // No emite Mensaje() invasivo y no cambia display hasta presionar '='
    ultraPrev = val;
    ultraOp = 'to_pen';
    ultraWaiting = true;
    actualizarUltraDisplay();
  } else if (accion === 'to_usd') {
    // Ejemplo: 34.50 -> "S/ a $" -> "=" => 34.50 Soles son 10.00 Dólares (T.C. 3.45)
    // No emite Mensaje() invasivo y no cambia display hasta presionar '='
    ultraPrev = val;
    ultraOp = 'to_usd';
    ultraWaiting = true;
    actualizarUltraDisplay();
  }
}

function ultraEjecutarIgual() {
  ultimaEstacionActiva = 'ultra';
  if (ultraOp === null || ultraPrev === null) return;

  const curr = parseFloat(ultraInput) || 0;
  const prev = ultraPrev;
  const op = ultraOp;
  const tc = obtenerUltraTC();

  let res = 0;
  let operacionHist = '';
  let customSpoken = '';
  let tipoHist = 'ULTRA';

  if (op === 'desc') {
    const pct = prev;
    const precio = curr;
    const ahorro = parseFloat(((precio * pct) / 100).toFixed(2));
    const pagas = parseFloat(Math.max(0, precio - ahorro).toFixed(2));

    res = ahorro;
    operacionHist = `${formatearNumero(pct)}% dscto ${formatearNumero(precio)} es ${ahorro} (pagar: ${pagas})`;
    customSpoken = `${numeroAIngles(ahorro)}`;
    tipoHist = 'DESCUENTO';
    ultraLastExpr = `${formatearNumero(pct)}% dscto ${formatearNumero(precio)} =`;
    Mensaje(`Descuento: $${ahorro} | Total a pagar: $${pagas}`, 'exito');
  } else if (op === 'pct_de') {
    const pct = prev;
    const base = curr;
    const calc = parseFloat(((pct * base) / 100).toFixed(4));

    res = calc;
    operacionHist = `${formatearNumero(pct)}% de ${formatearNumero(base)} es ${calc}`;
    customSpoken = `${numeroAIngles(calc)}`;
    tipoHist = 'PORCENTAJE';
    ultraLastExpr = `${formatearNumero(pct)}% de ${formatearNumero(base)} =`;
    Mensaje(`${pct}% de ${base} es ${calc}`, 'info');
  } else if (op === 'to_pen') {
    const usd = prev;
    const penStr = (usd * tc).toFixed(2);
    const penNum = parseFloat(penStr);

    res = penStr;
    operacionHist = `$ ${formatearNumero(usd)} a s/ Soles es = ${penStr}`;
    customSpoken = `${numeroAIngles(penNum).replace(' dollars', ' soles').replace(' dollar', ' sol')}`;
    tipoHist = 'DIVISAS';
    ultraLastExpr = `$ ${formatearNumero(usd)} a s/ Soles es =`;
    Mensaje(`$ ${formatearNumero(usd)} = S/ ${penStr} Soles`, 'exito');
  } else if (op === 'to_usd') {
    const pen = prev;
    const usdStr = (pen / tc).toFixed(2);
    const usdNum = parseFloat(usdStr);

    res = usdStr;
    operacionHist = `S/ ${formatearNumero(pen)} a $ Dólares es = ${usdStr}`;
    customSpoken = `${numeroAIngles(usdNum)}`;
    tipoHist = 'DIVISAS';
    ultraLastExpr = `S/ ${formatearNumero(pen)} a $ Dólares es =`;
    Mensaje(`S/ ${formatearNumero(pen)} = $ ${usdStr} Dólares`, 'exito');
  } else {
    res = parseFloat(calcularAritmetica(prev, curr, op).toFixed(7));
    const opSign = op === '*' ? '×' : op === '/' ? '÷' : op;
    const exprStr = `${formatearNumero(prev)} ${opSign} ${formatearNumero(curr)}`;
    operacionHist = `${exprStr} = ${res}`;
    customSpoken = `${numeroAIngles(res)}`;
    ultraLastExpr = `${exprStr} =`;
  }

  ultraInput = `${res}`;
  ultraPrev = null;
  ultraOp = null;
  ultraWaiting = false;

  actualizarUltraDisplay();
  // GUARDAR EN HISTORIAL SOLO AL PRESIONAR '='
  guardarEnHistorial(operacionHist, res, 'ultra', tipoHist, res, customSpoken);
}

function ultraLimpiar() {
  ultraInput = '0';
  ultraPrev = null;
  ultraOp = null;
  ultraWaiting = false;
  ultraLastExpr = '';
  actualizarUltraDisplay();
}

function ultraBorrarUltimo() {
  if (ultraWaiting) return;
  if (ultraInput.length > 1) {
    ultraInput = ultraInput.slice(0, -1);
  } else {
    ultraInput = '0';
  }
  actualizarUltraDisplay();
}

function configurarUltraStation() {
  const keypad = document.getElementById('ultraKeypad');
  if (keypad) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.hasAttribute('data-ultra-num')) {
        ultraIntroducirDigito(btn.getAttribute('data-ultra-num'));
      } else if (btn.getAttribute('data-ultra-action') === 'op') {
        ultraManejarOperador(btn.getAttribute('data-op'));
      } else if (btn.getAttribute('data-ultra-action') === 'equals') {
        ultraEjecutarIgual();
      } else if (btn.getAttribute('data-ultra-action') === 'clear') {
        ultraLimpiar();
      } else if (btn.getAttribute('data-ultra-action') === 'delete') {
        ultraBorrarUltimo();
      } else if (btn.getAttribute('data-ultra-action') === 'focus_tc') {
        const tcInput = document.getElementById('ultraExchangeRate');
        if (tcInput) {
          tcInput.focus();
          tcInput.select();
        }
      } else if (['pct_de', 'desc', 'to_pen', 'to_usd'].includes(btn.getAttribute('data-ultra-action'))) {
        ultraManejarEspecial(btn.getAttribute('data-ultra-action'));
      }
    });
  }

  // Chips Rápidos de % de Descuento (10%, 15%, 20%, 25%, 50%)
  const quickChips = document.querySelectorAll('[data-ultra-quick-desc]');
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      ultimaEstacionActiva = 'ultra';
      const pct = parseFloat(chip.getAttribute('data-ultra-quick-desc') || '10');
      const val = parseFloat(ultraInput) || 0;

      if (val === 0 && ultraPrev === null) {
        Mensaje('Ingresa primero el precio del producto y luego presiona el chip de descuento', 'alerta');
        return;
      }

      if (ultraPrev === null) {
        ultraPrev = val;
      }
      ultraOp = 'desc';
      ultraInput = `${pct}`;
      ultraWaiting = false;
      actualizarUltraDisplay();
      Mensaje(`Descuento de ${pct}% seleccionado. Presiona '=' para calcular y guardar.`, 'info');
    });
  });

  // Tasa de cambio input
  const tcInput = document.getElementById('ultraExchangeRate');
  if (tcInput) {
    tcInput.addEventListener('change', () => {
      const tc = obtenerUltraTC();
      Mensaje(`Tasa preferencial de dólar fijada en S/ ${tc.toFixed(2)}`, 'info');
    });
  }
}

// =============================================================================
// 7. MOTOR MATEMÁTICO COMPARTIDO
// =============================================================================
function calcularAritmetica(prev, curr, op) {
  switch (op) {
    case '+': return prev + curr;
    case '-': return prev - curr;
    case '*': return prev * curr;
    case '/': return curr !== 0 ? prev / curr : 0;
    default: return curr;
  }
}

// =============================================================================
// 8. FOOTER UNIFICADO: CONFIGURACIÓN
// =============================================================================
function configurarFooterUnificado() {
  const btnClearHist = document.getElementById('btnClearHistory');
  if (btnClearHist) {
    btnClearHist.addEventListener('click', async () => {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
      if (list.length === 0) {
        Mensaje('El historial ya está vacío', 'info');
        return;
      }

      const confirmado = await wiConfirmar('¿Estás seguro de que deseas vaciar todos los registros del historial?', {
        titulo: 'Vaciar Historial',
        tipo: 'danger',
        siTexto: 'Sí, vaciar',
        noTexto: 'Cancelar'
      });

      if (confirmado) {
        localStorage.removeItem(STORAGE_KEY_HISTORY);
        renderizarHistorial([]);
        Mensaje('Historial vaciado correctamente', 'info');
      }
    });
  }
}

// =============================================================================
// 9. HISTORIAL UNIFICADO CON PRONUNCIACIÓN ("CÓMO SE DICE") & LOCALSTORAGE
// =============================================================================
function guardarEnHistorial(expresion, resultado, origen, tipo, numVal = null, customSpoken = null) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');

    let comoSeDice = '';
    if (customSpoken) {
      comoSeDice = customSpoken;
    } else {
      const rawNum = typeof numVal === 'number' ? numVal : parseFloat(resultado);
      comoSeDice = numeroAIngles(rawNum);
    }

    const nuevoRegistro = {
      id: Date.now(),
      expresion: expresion || `${resultado}`,
      resultado: `${resultado}`,
      comoSeDice,
      origen: origen || 'pro',
      tipo: tipo || 'ARITMÉTICA',
      hora: ahoraFormateado(),
      val: numVal !== null ? numVal : resultado
    };

    // Orden descendente (el más reciente siempre primero arriba)
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
  const wrapper = document.getElementById('calcHistoryWrapper');
  const counter = document.getElementById('historyCounterBadge');

  if (!container || !empty) return;

  if (counter) {
    counter.textContent = `${list.length} REGISTRO${list.length === 1 ? '' : 'S'}`;
  }

  if (list.length === 0) {
    container.innerHTML = '';
    empty.classList.remove('wii-hidden');
    if (wrapper) wrapper.classList.add('wii-hidden');
    return;
  }

  empty.classList.add('wii-hidden');
  if (wrapper) wrapper.classList.remove('wii-hidden');

  container.innerHTML = list.map((item, index) => {
    const numCorrelativo = list.length - index;
    const correlativo = `#${String(numCorrelativo).padStart(3, '0')}`;
    let originBadge = '';

    if (item.origen === 'vip') {
      originBadge = `<span class="wii-badge-origin vip"><i class="fa-solid fa-crown"></i> VIP</span>`;
    } else if (item.origen === 'pro') {
      originBadge = `<span class="wii-badge-origin pro"><i class="fa-solid fa-star"></i> Pro</span>`;
    } else {
      originBadge = `<span class="wii-badge-origin ultra"><i class="fa-solid fa-bolt"></i> Ultra</span>`;
    }

    return `
      <tr class="wii-hist-row" data-id="${item.id}">
        <td class="wii-td-num"><span class="wii-hist-num">${correlativo}</span></td>
        <td class="wii-td-origin">${originBadge}</td>
        <td class="wii-td-time"><span class="wii-hist-time">${item.hora}</span></td>
        <td class="wii-td-op"><strong class="wii-hist-op-text">${item.expresion}</strong></td>
        <td class="wii-td-spoken"><span class="wii-hist-spoken-text">${item.comoSeDice || ''}</span></td>
        <td class="wii-td-actions">
          <div class="wii-hist-action-btns">
            <button type="button" class="wii-btn-hist-edit" data-action="edit" title="Cargar y reutilizar en Calculadora ${item.origen.toUpperCase()}">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button type="button" class="wii-btn-hist-del" data-action="delete" title="Eliminar este cálculo">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Delegación de eventos en tabla de historial (Eliminar & Reutilizar con lápiz ✏️)
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const row = btn.closest('tr.wii-hist-row');
    if (!row) return;

    const id = parseInt(row.getAttribute('data-id') || '0', 10);
    const item = list.find(it => it.id === id);
    if (!item) return;

    const action = btn.getAttribute('data-action');

    if (action === 'delete') {
      const filtrado = list.filter(it => it.id !== id);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtrado));
      renderizarHistorial(filtrado);
      Mensaje('Cálculo eliminado del historial', 'info');
    } else if (action === 'edit') {
      // Reutilizar y cargar el valor en la calculadora correspondiente
      const origen = item.origen || 'pro';
      const numStr = `${item.val}`;

      if (origen === 'vip') {
        ultimaEstacionActiva = 'vip';
        vipInput = numStr;
        vipPrev = null;
        vipOp = null;
        vipWaiting = false;
        vipLastExpr = item.expresion;
        actualizarVipDisplay();
        Mensaje(`Cálculo cargado en Calculadora VIP (${item.val})`, 'exito');
      } else if (origen === 'ultra') {
        ultimaEstacionActiva = 'ultra';
        ultraInput = numStr;
        ultraPrev = null;
        ultraOp = null;
        ultraWaiting = false;
        ultraLastExpr = item.expresion;
        actualizarUltraDisplay();
        Mensaje(`Cálculo cargado en Calculadora Ultra (${item.val})`, 'exito');
      } else {
        ultimaEstacionActiva = 'pro';
        proInput = numStr;
        proPrev = null;
        proOp = null;
        proWaiting = false;
        proLastExpr = item.expresion;
        actualizarProDisplay();
        Mensaje(`Cálculo cargado en Calculadora Pro (${item.val})`, 'exito');
      }
    }
  };
}

// =============================================================================
// 10. MANEJO DE TECLADO FÍSICO
// =============================================================================
function manejarTecladoFisico(e) {
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
    return;
  }

  const key = e.key;
  const isVip = ultimaEstacionActiva === 'vip';
  const isUltra = ultimaEstacionActiva === 'ultra';

  if (/^[0-9]$/.test(key)) {
    e.preventDefault();
    if (isUltra) ultraIntroducirDigito(key);
    else if (isVip) vipIntroducirDigito(key);
    else proIntroducirDigito(key);
  } else if (key === '.') {
    e.preventDefault();
    if (isUltra) ultraIntroducirDigito('.');
    else if (isVip) vipIntroducirDigito('.');
    else proIntroducirDigito('.');
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    e.preventDefault();
    if (isUltra) {
      if (key === '+' || key === '-') ultraManejarOperador(key);
    } else if (isVip) {
      vipManejarOperador(key);
    } else {
      proManejarOperador(key);
    }
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    if (isUltra) ultraEjecutarIgual();
    else if (isVip) vipEjecutarIgual();
    else proEjecutarIgual();
  } else if (key === 'Backspace') {
    e.preventDefault();
    if (isUltra) ultraBorrarUltimo();
    else if (isVip) vipBorrarUltimo();
    else proBorrarUltimo();
  } else if (key === 'Escape') {
    e.preventDefault();
    if (isUltra) ultraLimpiar();
    else if (isVip) vipLimpiar();
    else proLimpiar();
  }
}
