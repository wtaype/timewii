// src/feature/inicio/lib/phoneticData.js
// Alfabeto Fonético adaptado a EE.UU. (Estados y Ciudades familiares para Miembros Senior)
// + Reglas de Validación MBI (Medicare Beneficiary Identifier) y Driver's License

export const US_STATE_PHONETICS = {
  'A': { word: 'America', alt: 'Arizona', example: 'A as in America' },
  'B': { word: 'Boston', alt: 'Baltimore', example: 'B as in Boston' },
  'C': { word: 'California', alt: 'Chicago', example: 'C as in California' },
  'D': { word: 'Dallas', alt: 'Denver', example: 'D as in Dallas' },
  'E': { word: 'Echo', alt: 'El Paso', example: 'E as in Echo' },
  'F': { word: 'Florida', alt: 'Franklin', example: 'F as in Florida' },
  'G': { word: 'Georgia', alt: 'Georgia', example: 'G as in Georgia' },
  'H': { word: 'Houston', alt: 'Hawaii', example: 'H as in Houston' },
  'I': { word: 'Indiana', alt: 'Iowa', example: 'I as in Indiana' },
  'J': { word: 'Jackson', alt: 'Jacksonville', example: 'J as in Jackson' },
  'K': { word: 'Kansas', alt: 'Kentucky', example: 'K as in Kansas' },
  'L': { word: 'Lincoln', alt: 'Louisiana', example: 'L as in Lincoln' },
  'M': { word: 'Miami', alt: 'Michigan', example: 'M as in Miami' },
  'N': { word: 'New York', alt: 'Nevada', example: 'N as in New York' },
  'O': { word: 'Ohio', alt: 'Orlando', example: 'O as in Ohio' },
  'P': { word: 'Pennsylvania', alt: 'Phoenix', example: 'P as in Pennsylvania' },
  'Q': { word: 'Queen', alt: 'Quebec', example: 'Q as in Queen' },
  'R': { word: 'Richmond', alt: 'Rhode Island', example: 'R as in Richmond' },
  'S': { word: 'Seattle', alt: 'San Antonio', example: 'S as in Seattle' },
  'T': { word: 'Texas', alt: 'Tennessee', example: 'T as in Texas' },
  'U': { word: 'Utah', alt: 'Union', example: 'U as in Utah' },
  'V': { word: 'Virginia', alt: 'Vermont', example: 'V as in Virginia' },
  'W': { word: 'Washington', alt: 'Wisconsin', example: 'W as in Washington' },
  'X': { word: 'X-ray', alt: 'X-ray', example: 'X as in X-ray' },
  'Y': { word: 'Yellowstone', alt: 'York', example: 'Y as in Yellowstone' },
  'Z': { word: 'Zebra', alt: 'Zero', example: 'Z as in Zebra' },
  '0': { word: 'Zero', alt: 'Number 0', example: 'Number Zero' },
  '1': { word: 'One', alt: 'Number 1', example: 'Number One' },
  '2': { word: 'Two', alt: 'Number 2', example: 'Number Two' },
  '3': { word: 'Three', alt: 'Number 3', example: 'Number Three' },
  '4': { word: 'Four', alt: 'Number 4', example: 'Number Four' },
  '5': { word: 'Five', alt: 'Number 5', example: 'Number Five' },
  '6': { word: 'Six', alt: 'Number 6', example: 'Number Six' },
  '7': { word: 'Seven', alt: 'Number 7', example: 'Number Seven' },
  '8': { word: 'Eight', alt: 'Number 8', example: 'Number Eight' },
  '9': { word: 'Nine', alt: 'Number 9', example: 'Number Nine' }
};

// Validación de Identificaciones en Teleperformance / Wellcare
export const ID_VALIDATION_RULES = {
  mbi: {
    name: 'Medicare Beneficiary Identifier (MBI)',
    length: 11,
    pattern: '1EG4-TE5-MK72 (C-A-AN-N-A-AN-N-A-A-N-N)',
    excludedLetters: ['S', 'L', 'O', 'I', 'B', 'Z'],
    reason: 'CMS excluye deliberadamente las letras S, L, O, I, B, Z para evitar confusiones con 5, 1, 0, 8, 2.',
    keyRule: '¡Si el miembro te dice "S de Sam" o "B de Boy", indícale que en la tarjeta roja, blanca y azul de Medicare esas letras no existen!'
  },
  dl: {
    name: "Driver's License (DL)",
    tip: 'Vía de autenticación secundaria para HIPAA. Cada estado tiene longitud y prefijos propios (ej. TX = 8 dígitos numéricos, FL = 1 letra + 12 dígitos, CA = 1 letra + 7 dígitos).',
    recommendation: 'Pide siempre que te deletreen la letra inicial con nombre de estado (ej: "C as in California", "T as in Texas").'
  },
  address: {
    name: 'USPS Dirección Estándar',
    abbreviations: [
      { term: 'Avenue', abbr: 'AVE' },
      { term: 'Boulevard', abbr: 'BLVD' },
      { term: 'Circle', abbr: 'CIR' },
      { term: 'Court', abbr: 'CT' },
      { term: 'Drive', abbr: 'DR' },
      { term: 'Lane', abbr: 'LN' },
      { term: 'Parkway', abbr: 'PKWY' },
      { term: 'Place', abbr: 'PL' },
      { term: 'Road', abbr: 'RD' },
      { term: 'Street', abbr: 'ST' },
      { term: 'Apartment', abbr: 'APT' },
      { term: 'Suite', abbr: 'STE' },
      { term: 'Highway', abbr: 'HWY' },
      { term: 'North / South', abbr: 'N / S' },
      { term: 'East / West', abbr: 'E / W' }
    ]
  }
};

export default {
  US_STATE_PHONETICS,
  ID_VALIDATION_RULES
};
