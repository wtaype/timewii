// src/semillas/numbersMoneyData.js
// 💵 Funciones Fonéticas y Diccionario de Números & Monedas para Asesores Remotos
// Lectura 100% Formal en Dólares (USD) y Cifras en Inglés · Cero menciones a aseguradoras

const UNIDADES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const DIEZ_A_DIECINUEVE = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const DECENAS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

/**
 * Convierte un número de hasta 99,999,999 a texto en inglés
 */
export function numeroAIngles(num) {
  const n = parseInt(num, 10);
  if (isNaN(n)) return '';
  if (n === 0) return 'Zero';
  if (n < 0) return 'Negative ' + numeroAIngles(Math.abs(n));

  if (n < 10) return UNIDADES[n];
  if (n < 20) return DIEZ_A_DIECINUEVE[n - 10];
  if (n < 100) {
    const dec = Math.floor(n / 10);
    const uni = n % 10;
    return DECENAS[dec] + (uni > 0 ? '-' + UNIDADES[uni] : '');
  }
  if (n < 1000) {
    const cen = Math.floor(n / 100);
    const rem = n % 100;
    return UNIDADES[cen] + ' hundred' + (rem > 0 ? ' ' + numeroAIngles(rem) : '');
  }
  if (n < 1000000) {
    const miles = Math.floor(n / 1000);
    const rem = n % 1000;
    return numeroAIngles(miles) + ' thousand' + (rem > 0 ? ' ' + numeroAIngles(rem) : '');
  }
  if (n < 100000000) {
    const millones = Math.floor(n / 1000000);
    const rem = n % 1000000;
    return numeroAIngles(millones) + ' million' + (rem > 0 ? ', ' + numeroAIngles(rem) : '');
  }
  return n.toLocaleString('en-US');
}

/**
 * Alternativa conversacional en inglés (ej. 2100 -> "Twenty-one hundred")
 */
export function numeroAInglesColoquial(num) {
  const n = parseInt(num, 10);
  if (isNaN(n)) return '';
  if (n >= 1100 && n <= 9900 && n % 100 === 0) {
    const cientos = Math.floor(n / 100);
    return numeroAIngles(cientos) + ' hundred';
  }
  return '';
}

/**
 * Convierte un monto en dólares exclusivamente a pronunciación FORMAL en inglés
 * (Ej: 5.30 -> "$5.30 · Five dollars and thirty cents")
 */
export function monedaAInglesFormal(val) {
  if (val === null || val === undefined || val === '') return null;
  const clean = String(val).replace(/[\$,]/g, '').trim();
  const num = parseFloat(clean);
  if (isNaN(num)) return null;

  const partes = clean.split('.');
  const enteros = parseInt(partes[0] || '0', 10);
  let centavosStr = partes[1] || '00';
  if (centavosStr.length === 1) centavosStr += '0';
  centavosStr = centavosStr.slice(0, 2);
  const centavos = parseInt(centavosStr, 10);

  const dWord = enteros === 1 ? 'dollar' : 'dollars';
  const cWord = centavos === 1 ? 'cent' : 'cents';

  let formal = '';
  if (enteros === 0 && centavos === 0) {
    formal = 'Zero dollars';
  } else if (centavos === 0) {
    formal = `${numeroAIngles(enteros)} ${dWord}`;
  } else if (enteros === 0) {
    formal = `${numeroAIngles(centavos)} ${cWord}`;
  } else {
    formal = `${numeroAIngles(enteros)} ${dWord} and ${numeroAIngles(centavos).toLowerCase()} ${cWord}`;
  }

  return {
    montoFormateado: `$${enteros.toLocaleString('en-US')}.${centavosStr}`,
    formal
  };
}

// 10 Números Clave Más Utilizados en Llamadas
export const NUMEROS_DATA = [
  { num: "0", en: "Zero / Oh", tip: "En códigos y teléfonos se usa 'Zero' u 'Oh'" },
  { num: "1", en: "One", tip: "Uno" },
  { num: "2", en: "Two", tip: "Dos" },
  { num: "3", en: "Three", tip: "Tres" },
  { num: "4", en: "Four", tip: "Cuatro" },
  { num: "5", en: "Five", tip: "Cinco" },
  { num: "10", en: "Ten", tip: "Diez" },
  { num: "12", en: "Twelve", tip: "Doce meses / suministro anual" },
  { num: "24", en: "Twenty-four", tip: "Suministro de 24 horas" },
  { num: "30", en: "Thirty", tip: "Suministro estándar de 30 días" }
];

// 10 Tarifas y Montos Clave Más Utilizados en Llamadas
export const MONEDAS_DATA = [
  { monto: "$0.00", enFormal: "Zero dollars / Free", contexto: "Tarifa estándar básica" },
  { monto: "$1.45", enFormal: "One dollar and forty-five cents", contexto: "Tarifa reducida básica" },
  { monto: "$4.30", enFormal: "Four dollars and thirty cents", contexto: "Tarifa regular básica" },
  { monto: "$5.30", enFormal: "Five dollars and thirty cents", contexto: "Tarifa frecuente habitual" },
  { monto: "$5.60", enFormal: "Five dollars and sixty cents", contexto: "Tarifa con ajuste estándar" },
  { monto: "$9.85", enFormal: "Nine dollars and eighty-five cents", contexto: "Tarifa preferencial" },
  { monto: "$11.20", enFormal: "Eleven dollars and twenty cents", contexto: "Tarifa preferida Nivel 2" },
  { monto: "$35.00", enFormal: "Thirty-five dollars", contexto: "Tope mensual estándar" },
  { monto: "$47.00", enFormal: "Forty-seven dollars", contexto: "Tarifa intermedia Nivel 3" },
  { monto: "$100.00", enFormal: "One hundred dollars", contexto: "Tarifa estándar Nivel 4" }
];

export default {
  NUMEROS_DATA,
  MONEDAS_DATA,
  numeroAIngles,
  numeroAInglesColoquial,
  monedaAInglesFormal
};
