// src/feature/inicio/lib/numerosMonedasData.js
// 🌟 Funciones Fonéticas y Diccionario de Números & Monedas para Asesores Wellcare
// Permite pronunciar números de hasta 8 dígitos y montos en inglés (ej. 615.50 -> "Six hundred fifteen fifty")

const UNIDADES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const DIEZ_A_DIECINUEVE = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const DECENAS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

/**
 * Convierte un número de hasta 99,999,999 (8 dígitos) a texto completo en inglés
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
 * Alternativa conversacional común en inglés (ej. 2100 -> "Twenty-one hundred")
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
 * Convierte un monto en dólares (ej. 5.30, 35, 615.50) a habla rápida directa y formal CMS
 */
export function monedaAIngles(val) {
  if (val === null || val === undefined || val === '') return null;
  // Limpiar signo $ y comas
  const clean = String(val).replace(/[\$,]/g, '').trim();
  const num = parseFloat(clean);
  if (isNaN(num)) return null;

  const partes = clean.split('.');
  const enteros = parseInt(partes[0] || '0', 10);
  let centavosStr = partes[1] || '00';
  if (centavosStr.length === 1) centavosStr += '0';
  centavosStr = centavosStr.slice(0, 2);
  const centavos = parseInt(centavosStr, 10);

  // 1. Habla Rápida directa en llamada (ej. 5.30 -> "Five thirty", 615.50 -> "Six hundred fifteen fifty")
  let rapido = '';
  const coloqEnteros = numeroAInglesColoquial(enteros);
  const baseEnteros = coloqEnteros ? coloqEnteros : numeroAIngles(enteros);

  if (enteros === 0 && centavos === 0) {
    rapido = 'Zero dollars / Free';
  } else if (enteros === 0) {
    rapido = numeroAIngles(centavos) + ' cents';
  } else if (centavos === 0) {
    rapido = baseEnteros + ' dollars';
  } else {
    const centText = centavos < 10 ? `oh-${UNIDADES[centavos].toLowerCase()}` : numeroAIngles(centavos).toLowerCase();
    rapido = `${baseEnteros} ${centText}`;
  }

  // 2. Lectura formal CMS (ej. "Six hundred fifteen dollars and fifty cents")
  let formal = '';
  const dWord = enteros === 1 ? 'dollar' : 'dollars';
  const cWord = centavos === 1 ? 'cent' : 'cents';

  if (enteros === 0 && centavos === 0) {
    formal = '$0 copay (No charge to member)';
  } else if (centavos === 0) {
    formal = `${numeroAIngles(enteros)} ${dWord}`;
  } else if (enteros === 0) {
    formal = `${numeroAIngles(centavos)} ${cWord}`;
  } else {
    formal = `${numeroAIngles(enteros)} ${dWord} and ${numeroAIngles(centavos).toLowerCase()} ${cWord}`;
  }

  return {
    montoFormateado: `$${enteros.toLocaleString('en-US')}.${centavosStr}`,
    rapido,
    formal
  };
}

export const NUMEROS_DATA = [
  { num: "0", en: "Zero / Oh", tip: "En MBI y teléfonos se dice indistintamente 'Zero' u 'Oh'" },
  { num: "1", en: "One", tip: "Uno" },
  { num: "2", en: "Two", tip: "Dos" },
  { num: "3", en: "Three", tip: "Tres" },
  { num: "4", en: "Four", tip: "Cuatro" },
  { num: "5", en: "Five", tip: "Cinco" },
  { num: "6", en: "Six", tip: "Seis" },
  { num: "7", en: "Seven", tip: "Siete" },
  { num: "8", en: "Eight", tip: "Ocho" },
  { num: "9", en: "Nine", tip: "Nueve" },
  { num: "10", en: "Ten", tip: "Diez" },
  { num: "12", en: "Twelve", tip: "Doce meses / suministro anual" },
  { num: "24", en: "Twenty-four", tip: "Suministro de 24 horas" },
  { num: "30", en: "Thirty", tip: "Suministro estándar de 30 días" },
  { num: "48", en: "Forty-eight", tip: "Resolución de apelación urgente (48 hrs)" },
  { num: "60", en: "Sixty", tip: "Suministro de 60 días" },
  { num: "90", en: "Ninety", tip: "Suministro por correo (Mail order 90 days)" },
  { num: "100", en: "One hundred", tip: "Cien unidades / pastillas" },
  { num: "615", en: "Six fifteen", tip: "Código de área o número de calle" },
  { num: "700", en: "Seven hundred", tip: "Setecientos" },
  { num: "2100", en: "Twenty-one hundred", tip: "Direcciones y años" }
];

export const MONEDAS_DATA = [
  { monto: "$0.00", enRapido: "Zero dollars / Free", enFormal: "Zero dollar copay", contexto: "Genéricos Nivel 1 y vacunas Parte D" },
  { monto: "$1.45", enRapido: "One forty-five", enFormal: "One dollar and forty-five cents", contexto: "Copago de subsidio LIS / Extra Help" },
  { monto: "$4.30", enRapido: "Four thirty", enFormal: "Four dollars and thirty cents", contexto: "Copago regular genéricos estándar" },
  { monto: "$5.30", enRapido: "Five thirty", enFormal: "Five dollars and thirty cents", contexto: "Copago común de genéricos" },
  { monto: "$5.60", enRapido: "Five sixty", enFormal: "Five dollars and sixty cents", contexto: "Copago con ajuste de red" },
  { monto: "$9.85", enRapido: "Nine eighty-five", enFormal: "Nine dollars and eighty-five cents", contexto: "Subsidio LIS marca preferida" },
  { monto: "$11.20", enRapido: "Eleven twenty", enFormal: "Eleven dollars and twenty cents", contexto: "Genéricos preferidos Nivel 2" },
  { monto: "$35.00", enRapido: "Thirty-five dollars", enFormal: "Thirty-five dollars per month cap", contexto: "Tope legal de insulina Ley IRA" },
  { monto: "$47.00", enRapido: "Forty-seven dollars", enFormal: "Forty-seven dollar copay", contexto: "Marca preferida Nivel 3" },
  { monto: "$100.00", enRapido: "One hundred dollars", enFormal: "One hundred dollar copay", contexto: "Medicamentos no preferidos Nivel 4" },
  { monto: "$590.00", enRapido: "Five ninety", enFormal: "Five hundred ninety dollars deductible", contexto: "Deducible estándar anual CMS Parte D" },
  { monto: "$2,000.00", enRapido: "Two thousand dollars", enFormal: "Two thousand dollars out-of-pocket cap", contexto: "Tope máximo legal anual Ley IRA" },
  { monto: "$2,100.00", enRapido: "Twenty-one hundred dollars", enFormal: "Two thousand one hundred dollars", contexto: "Tope o límite de beneficio extendido" },
  { monto: "$2,400.00", enRapido: "Twenty-four hundred dollars", enFormal: "Two thousand four hundred dollars", contexto: "Asignación anual de flex card o beneficios" }
];

export default {
  NUMEROS_DATA,
  MONEDAS_DATA,
  numeroAIngles,
  numeroAInglesColoquial,
  monedaAIngles
};
