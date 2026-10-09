// src/feature/inicio/lib/wellcareData.js
// Base de conocimiento para asesores de Centene / Wellcare Medicare Part D (PDP)
// Cobertura de medicamentos, Ley IRA 2025/2026, Probing Questions, Active Listening y Manejo de Frustración

export const IRA_MEDICARE_RULES = [
  {
    title: 'Tope Máximo de Gasto Anual: $2,000 OOP Cap',
    badge: 'Ley IRA 2025/2026',
    desc: 'Los miembros de Medicare Parte D ya no tienen "Donut Hole" (fase de brecha de cobertura). Una vez que alcanzan $2,000 en gastos de bolsillo en medicamentos cubiertos, su costo es $0 por el resto del año calendario.',
    scriptEn: 'Under current Medicare Part D improvements, once your out-of-pocket prescription expenses reach $2,000 in a calendar year, you will pay $0 for your covered drugs for the remainder of that year.'
  },
  {
    title: 'Ahorro en Insulina: $35 Monthly Cap',
    badge: 'Insulin Savings',
    desc: 'La insulina cubierta por el formulario tiene un copago regulado de máximo $35 por suministro de un mes, sin importar en qué fase del deducible se encuentre el miembro.',
    scriptEn: 'All covered insulin products have a capped copay of no more than $35 for a 30-day supply, even before you meet your annual deductible.'
  },
  {
    title: 'Vacunas Preventivas a Costo $0',
    badge: 'Vaccine Benefit',
    desc: 'Las vacunas para adultos recomendadas por el ACIP (incluyendo culebrilla / Shingrix, tétanos, neumococo) tienen $0 de copago y deducible exonerado.',
    scriptEn: 'Adult vaccines recommended by the Advisory Committee, including the Shingles vaccine (Shingrix), are 100% covered with a $0 copay.'
  },
  {
    title: 'Plan de Pago Fraccionado (M3P)',
    badge: 'Medicare Prescription Payment Plan',
    desc: 'Permite a los miembros distribuir los costos de bolsillo de sus medicamentos a lo largo del año calendario en cuotas mensuales predecibles en lugar de pagar una suma grande de golpe.',
    scriptEn: 'You also have the option to opt into the Medicare Prescription Payment Plan, which allows you to spread your drug costs evenly across monthly payments throughout the year.'
  }
];

export const PROBING_ACTIVE_LISTENING = [
  {
    title: 'Clarificar Medicamento y Presentación',
    type: 'Probing Question',
    questionEn: 'To ensure I check the exact price, could you please provide the exact brand or generic name, the dosage in milligrams, and whether it is a tablet, capsule, or liquid?',
    reasonEs: 'Previene cotizaciones erróneas por diferencias de miligramos (ej. 20mg vs 40mg) o formulación de liberación extendida (XR/ER).'
  },
  {
    title: 'Identificar la Farmacia de Preferencia',
    type: 'Probing Question',
    questionEn: 'Which pharmacy do you normally visit or pick this up from? Let me verify if it is in our Preferred Network, as that offers the lowest copays.',
    reasonEs: 'Las farmacias de red preferida (ej. Walgreens/CVS según el plan) reducen drásticamente el copago del miembro comparado con red estándar.'
  },
  {
    title: 'Active Listening & Parafraseo',
    type: 'Active Listening',
    questionEn: 'I completely hear your concern, Mr./Ms. [Last Name]. If I understand correctly, the pharmacy told you the medication was $[Amount] and you want to confirm if your deductible applies or if a lower-cost generic exists?',
    reasonEs: 'Valida la emoción del cliente senior, reduce la ansiedad y asegura que ambas partes estén sincronizadas.'
  },
  {
    title: 'Empatía ante Precios Altos (Price Shock)',
    type: 'Manejo de Objeción',
    questionEn: 'I understand this price is higher than you expected, and I know how vital this prescription is for you. Let us look together at mail-order options, tier exceptions, or copay assistance programs that can help lower this cost.',
    reasonEs: 'Muestra apoyo como aliado en lugar de sonar como un burócrata frío.'
  },
  {
    title: 'Calma ante Congelamiento del Sistema (System Lag)',
    type: 'Situación Técnica',
    questionEn: 'Thank you so much for your patience while my system updates this record. I am right here with you and want to ensure every detail is checked properly.',
    reasonEs: 'Mantiene contacto verbal continuo sin necesidad de mandar al cliente a Hold innecesario.'
  }
];

export const TERMINOS_WELLCARE = [
  {
    id: 'copay',
    en: 'Co-pay (Copayment)',
    es: 'Copago',
    icon: 'fa-circle-dollar-to-slot',
    descEn: 'A fixed flat dollar amount the member pays for a covered healthcare service or prescription medication.',
    descEs: 'Cantidad fija en dólares que el miembro paga al momento de retirar medicamentos (ej. $0 genérico Tier 1, $47 marca Tier 3).'
  },
  {
    id: 'coinsurance',
    en: 'Co-insurance',
    es: 'Coseguro',
    icon: 'fa-percent',
    descEn: 'The percentage of the total drug cost the member pays, typical for Tier 4 and Tier 5 medications.',
    descEs: 'Porcentaje del costo total del fármaco que paga el miembro (ej. 25% o 33% en medicamentos de especialidad Tier 5).'
  },
  {
    id: 'deductible',
    en: 'Part D Deductible',
    es: 'Deducible Parte D',
    icon: 'fa-shield',
    descEn: 'The annual amount the member must pay out of pocket before the plan begins paying for non-exempt tiers.',
    descEs: 'Monto inicial que paga el cliente antes de que aplique la cobertura completa. Generalmente Tier 1 y Tier 2 están exentos de deducible en muchos planes.'
  },
  {
    id: 'prior_auth',
    en: 'Prior Authorization (PA)',
    es: 'Autorización Previa',
    icon: 'fa-file-signature',
    descEn: 'Clinical criteria required from the prescriber before Wellcare approves coverage for specific high-cost drugs.',
    descEs: 'El médico debe enviar un formulario clínico explicando por qué este fármaco es indispensable antes de que Wellcare lo apruebe.'
  },
  {
    id: 'step_therapy',
    en: 'Step Therapy (ST)',
    es: 'Terapia Escalonada',
    icon: 'fa-shoe-prints',
    descEn: 'Requires the member to try an effective lower-cost alternative before the plan approves a more expensive medication.',
    descEs: 'El miembro debe intentar primero una medicina genérica de primera línea antes de que se autorice la de marca costosa.'
  },
  {
    id: 'quantity_limit',
    en: 'Quantity Limit (QL)',
    es: 'Límite de Cantidad',
    icon: 'fa-boxes-stacked',
    descEn: 'Restricts the amount of medication dispensed within a specific number of days for safety and FDA dosing guidelines.',
    descEs: 'Restricción en la cantidad de pastillas o dosis permitidas por 30 o 90 días por seguridad médica.'
  }
];

export const CHECKLIST_LLAMADA = [
  { id: 'c1', label: '1. Saludo oficial de Wellcare + Nombre del asesor + Grabación' },
  { id: 'c2', label: '2. Verificación HIPAA: Full Name, DOB, Member ID, Address/Zip Code' },
  { id: 'c3', label: '3. Escucha activa y formulación de Probing Questions' },
  { id: 'c4', label: '4. Explicación clara de beneficios (Copago, Deducible, Red Preferida, IRA $35)' },
  { id: 'c5', label: '5. Permiso antes de Hold (máx 2 min) + Agradecer al regresar' },
  { id: 'c6', label: '6. Documentación concisa en el CRM (Plantilla de notas)' },
  { id: 'c7', label: '7. Cierre con número de caso/referencia y despedida empática' }
];

export default {
  IRA_MEDICARE_RULES,
  PROBING_ACTIVE_LISTENING,
  TERMINOS_WELLCARE,
  CHECKLIST_LLAMADA
};
