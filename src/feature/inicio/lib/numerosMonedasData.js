// src/feature/inicio/lib/numerosMonedasData.js
// 🌟 Datos Fonéticos y Pronunciación de Números & Monedas para Asesores Wellcare

export const NUMEROS_DATA = [
  { num: "0", en: "Zero / Oh", tip: "En códigos MBI y teléfonos se usa comúnmente 'Zero' o 'Oh'", categoria: "basico" },
  { num: "1", en: "One", tip: "Número uno", categoria: "basico" },
  { num: "2", en: "Two", tip: "Número dos", categoria: "basico" },
  { num: "3", en: "Three", tip: "Pronunciar con sonido suave 'th' (no 'tree')", categoria: "basico" },
  { num: "4", en: "Four", tip: "Número cuatro", categoria: "basico" },
  { num: "5", en: "Five", tip: "Número cinco", categoria: "basico" },
  { num: "6", en: "Six", tip: "Número seis", categoria: "basico" },
  { num: "7", en: "Seven", tip: "Número siete", categoria: "basico" },
  { num: "8", en: "Eight", tip: "Número ocho ('eit')", categoria: "basico" },
  { num: "9", en: "Nine", tip: "Número nueve", categoria: "basico" },
  { num: "10", en: "Ten", tip: "Número diez", categoria: "basico" },
  { num: "24", en: "Twenty-four", tip: "Suministro común de 24 horas o cantidad de dosis", categoria: "comun" },
  { num: "48", en: "Forty-eight", tip: "Tiempo de resolución de apelación expedita (48 hours)", categoria: "comun" },
  { num: "100", en: "One hundred", tip: "Cien unidades", categoria: "comun" },
  { num: "615", en: "Six fifteen (o Six hundred fifteen)", tip: "Prefijo de Tennessee o código numérico", categoria: "grande" },
  { num: "700", en: "Seven hundred", tip: "Setecientos", categoria: "grande" },
  { num: "2100", en: "Twenty-one hundred (o Two thousand one hundred)", tip: "En inglés se agrupa en centenas 'twenty-one hundred'", categoria: "grande" }
];

export const MONEDAS_DATA = [
  {
    monto: "$0.00",
    enRapido: "Zero dollars",
    enFormal: "No copay / Zero dollars",
    contexto: "Copago $0 en medicamentos Tier 1 en farmacias preferidas y vacunas",
    categoria: "copago"
  },
  {
    monto: "$5.30",
    enRapido: "Five thirty",
    enFormal: "Five dollars and thirty cents",
    contexto: "Copago de genéricos comunes o ajuste de suministro",
    categoria: "copago"
  },
  {
    monto: "$5.60",
    enRapido: "Five sixty",
    enFormal: "Five dollars and sixty cents",
    contexto: "Copago regular con ajuste por red estándar",
    categoria: "copago"
  },
  {
    monto: "$11.20",
    enRapido: "Eleven twenty",
    enFormal: "Eleven dollars and twenty cents",
    contexto: "Copago de medicamentos Tier 2 genéricos preferidos",
    categoria: "copago"
  },
  {
    monto: "$35.00",
    enRapido: "Thirty-five dollars",
    enFormal: "Thirty-five dollars per month",
    contexto: "Tope mensual legal regulado por la Ley IRA para todas las insulinas",
    categoria: "copago"
  },
  {
    monto: "$47.00",
    enRapido: "Forty-seven dollars",
    enFormal: "Forty-seven dollars copay",
    contexto: "Copago estándar de marca preferida (Tier 3) en muchos planes PDP",
    categoria: "copago"
  },
  {
    monto: "$590.00",
    enRapido: "Five ninety",
    enFormal: "Five hundred ninety dollars",
    contexto: "Deducible estándar anual establecido por CMS para Medicare Parte D",
    categoria: "deducible"
  },
  {
    monto: "$2,000.00",
    enRapido: "Two thousand dollars",
    enFormal: "Two thousand dollars out-of-pocket cap",
    contexto: "Tope máximo anual de gasto de bolsillo Ley IRA (luego es $0 todo el año)",
    categoria: "tope"
  }
];
