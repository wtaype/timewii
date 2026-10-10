// src/feature/inicio/lib/unidadesMedData.js
// 💊 Unidades Farmacéuticas, Formas de Dosificación & Abreviaciones Médicas para Asesores Wellcare
// Catálogo completo de unidades de medida y formas habituales en llamadas sobre medicamentos.

export const UNIDADES_MED_DATA = [
  // 1. Unidades de Medida y Dosis
  { abrv: "mL", name: "Milliliter (Mililitro)", en: "Mil-li-li-ter", tip: "Líquidos orales y frascos de insulina (ej: 10 mL vial)" },
  { abrv: "mg", name: "Milligram (Miligramo)", en: "Mil-li-gram", tip: "Fuerza común de tabletas/cápsulas (ej: 500 mg Metformina)" },
  { abrv: "mcg / µg", name: "Microgram (Microgramo)", en: "My-kroh-gram", tip: "Dosis micro como Levotiroxina (ej: 50 mcg, 88 mcg)" },
  { abrv: "g / gm", name: "Gram (Gramo)", en: "Gram", tip: "Tubos de crema y ungüentos tópicos (ej: 45 g tubo)" },
  { abrv: "units / u", name: "Units (Unidades)", en: "Yoo-nits", tip: "Dosis de insulina (ej: 20 units subcutáneas al día)" },
  { abrv: "mEq", name: "Milliequivalent", en: "Mil-lee-ih-kwiv-uh-luhnt", tip: "Electrolitos como Cloruro de Potasio (ej: 20 mEq)" },
  { abrv: "puff / inh", name: "Inhalation / Puff", en: "In-huh-lay-shun / Puf", tip: "Disparos de inhalador para asma/EPOC (ej: 2 puffs BID)" },
  { abrv: "gtt / drops", name: "Drops (Gotas)", en: "Drops", tip: "Gotas oftálmicas u óticas (ej: 1 drop each eye)" },
  { abrv: "tsp", name: "Teaspoon (5 mL)", en: "Tee-spoon", tip: "Cucharadita equivalente a 5 mL de solución líquida" },
  { abrv: "tbsp", name: "Tablespoon (15 mL)", en: "Tay-buhl-spoon", tip: "Cucharada sopera equivalente a 15 mL" },

  // 2. Formas Farmacéuticas (Cómo vienen los medicamentos)
  { abrv: "Tab", name: "Tablet (Tableta)", en: "Tab-luht", tip: "Comprimido sólido por vía oral" },
  { abrv: "Cap", name: "Capsule (Cápsula)", en: "Kap-suhl", tip: "Cápsula de gelatina dura o blanda" },
  { abrv: "Inj", name: "Injection (Inyección)", en: "In-jek-shun", tip: "Solución inyectable, autoinyector o pluma (pen)" },
  { abrv: "Sol / Liq", name: "Solution / Liquid", en: "Suh-loo-shun", tip: "Líquido oral, gotas o jarabe medicinal" },
  { abrv: "Susp", name: "Suspension", en: "Suh-spen-shun", tip: "Líquido que debe agitarse antes de usar" },
  { abrv: "Oint", name: "Ointment (Ungüento)", en: "Oynt-muhnt", tip: "Preparación tópica base grasa/petróleo" },
  { abrv: "Crm", name: "Cream (Crema)", en: "Kreem", tip: "Preparación tópica base agua" },
  { abrv: "Patch", name: "Transdermal Patch", en: "Patch", tip: "Parche dérmico semanal/diario (ej: Fentanilo, Nicotina)" },
  { abrv: "Supp", name: "Suppository", en: "Suh-poz-i-tor-ee", tip: "Supositorio rectal o vaginal" },
  { abrv: "Pen", name: "Prefilled Pen", en: "Pen", tip: "Pluma precargada de insulina o biológico (Ozempic/Trulicity)" }
];

export default UNIDADES_MED_DATA;
