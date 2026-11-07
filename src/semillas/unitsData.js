// src/semillas/unitsData.js
// 💊 Unidades Farmacéuticas y Formas de Dosificación Habituales en EE.UU.
// 100% Limpio de marcas y aseguradoras · Guía informativa rápida para asesores.

export const UNITS_DATA = [
  // 1. Unidades de Medida y Dosis
  { abrv: 'mL', name: 'Milliliter (Mililitro)', en: 'Mil-li-li-ter', tip: 'Líquidos orales y viales (ej: 10 mL)' },
  { abrv: 'mg', name: 'Milligram (Miligramo)', en: 'Mil-li-gram', tip: 'Fuerza común de tabletas (ej: 500 mg)' },
  { abrv: 'mcg', name: 'Microgram (Microgramo)', en: 'My-kroh-gram', tip: 'Dosis micro (ej: 50 mcg, 88 mcg)' },
  { abrv: 'g', name: 'Gram (Gramo)', en: 'Gram', tip: 'Tubos de crema y ungüentos tópicos (ej: 45 g)' },
  { abrv: 'units', name: 'Units (Unidades)', en: 'Yoo-nits', tip: 'Dosis de insulina u hormonas (ej: 20 units)' },
  { abrv: 'mEq', name: 'Milliequivalent', en: 'Mil-lee-ih-kwiv-uh-luhnt', tip: 'Electrolitos (ej: 20 mEq)' },
  { abrv: 'puff', name: 'Inhalation / Puff', en: 'In-huh-lay-shun / Puf', tip: 'Disparos de inhalador (ej: 2 puffs)' },
  { abrv: 'drops', name: 'Drops (Gotas)', en: 'Drops', tip: 'Gotas oftálmicas u óticas' },
  { abrv: 'tsp', name: 'Teaspoon (5 mL)', en: 'Tee-spoon', tip: 'Cucharadita (5 mL de solución líquida)' },
  { abrv: 'tbsp', name: 'Tablespoon (15 mL)', en: 'Tay-buhl-spoon', tip: 'Cucharada sopera (15 mL)' },

  // 2. Formas Farmacéuticas
  { abrv: 'Tab', name: 'Tablet (Tableta)', en: 'Tab-luht', tip: 'Comprimido sólido oral' },
  { abrv: 'Cap', name: 'Capsule (Cápsula)', en: 'Kap-suhl', tip: 'Cápsula de gelatina oral' },
  { abrv: 'Inj', name: 'Injection (Inyección)', en: 'In-jek-shun', tip: 'Solución inyectable o pluma precargada' },
  { abrv: 'Sol', name: 'Solution / Liquid', en: 'Suh-loo-shun', tip: 'Líquido oral o jarabe' },
  { abrv: 'Susp', name: 'Suspension', en: 'Suh-spen-shun', tip: 'Líquido que requiere agitarse' },
  { abrv: 'Oint', name: 'Ointment (Ungüento)', en: 'Oynt-muhnt', tip: 'Preparación tópica base grasa' },
  { abrv: 'Crm', name: 'Cream (Crema)', en: 'Kreem', tip: 'Preparación tópica base agua' },
  { abrv: 'Patch', name: 'Transdermal Patch', en: 'Patch', tip: 'Parche dérmico semanal o diario' },
  { abrv: 'Supp', name: 'Suppository', en: 'Suh-poz-i-tor-ee', tip: 'Supositorio rectal o vaginal' },
  { abrv: 'Pen', name: 'Prefilled Pen', en: 'Pen', tip: 'Pluma precargada autoinyectable' }
];

export default UNITS_DATA;
