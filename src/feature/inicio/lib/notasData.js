// src/feature/inicio/lib/notasData.js
// Plantillas oficiales para documentación de llamadas en CRM (Teleperformance / Centene Wellcare)
// Listas para copiar con 1 solo clic

export const CRM_TEMPLATES = [
  {
    id: 'ghost_call',
    title: 'Ghost Call / Audio Drop',
    category: 'Protocolo de Red',
    description: 'Cuando entra la llamada y no se escucha al miembro tras 3 verificaciones.',
    content: `CALL TYPE: Inbound - Ghost Call / Silent Call
STEPS TAKEN:
- Performed mandatory 3-step verbal check ("Hello, this is [Advisor] with Wellcare, can you hear me?").
- Waited 15 seconds between prompts. No audio response received from caller.
- Checked audio devices and mute status: Working properly.
OUTCOME: Disconnected call following standard ghost call protocol.
DISPOSITION: Inbound / Audio Issue / Ghost Call`
  },
  {
    id: 'warm_transfer',
    title: 'Warm Transfer (Clinical / Pharmacy Tech / Tier 2)',
    category: 'Transferencia',
    description: 'Documentación al pasar la llamada a la farmacia especializada o enfermería.',
    content: `CALL TYPE: Inbound - Member Assistance
REASON FOR CALL: Member inquiry requiring specialized department assistance.
MEMBER VERIFIED: Name, DOB, Member ID, and Zip Code authenticated under HIPAA guidelines.
DEPARTMENT TRANSFERRED TO: [Pharmacy Help Desk / Clinical Review / Appeals]
AGENT NAME & ID: [Rep Name / ID]
INFORMATION CONVEYED:
- Member Name & ID verified.
- Medication: [Drug Name, Dosage].
- Reason: Prior Authorization / Rejection Override.
OUTCOME: Warm transfer completed successfully. Call handed off.`
  },
  {
    id: 'non_member',
    title: 'Non-Member / HIPAA Block',
    category: 'Cumplimiento HIPAA',
    description: 'Cuando llama un familiar o tercero sin formulario AOR o autorización registrada.',
    content: `CALL TYPE: Inbound - Third Party Inquiry
CALLER: Caller identified as [Spouse / Son / Daughter / Caregiver].
HIPAA STATUS: Non-Authorized Caller.
- Searched system for Appointment of Representative (AOR) or verbal authorization on file: NONE FOUND.
- Advised caller of CMS and HIPAA privacy policies; unable to disclose PHI/claims without member authorization.
ACTION TAKEN: Offered to send AOR form by mail or advised how member can grant one-time verbal permission.
OUTCOME: Caller acknowledged. Call closed without PHI disclosure.`
  },
  {
    id: 'rx_inquiry',
    title: 'Rx Coverage & Formulary Inquiry (Part D)',
    category: 'Consulta Cobertura PDP',
    description: 'Consulta sobre costo de medicamento, copago, etapa del deducible o IRA.',
    content: `CALL TYPE: Inbound - Prescription Drug Plan (PDP) Inquiry
MEMBER VERIFIED: Full HIPAA authentication completed.
MEDICATION CHECKED: [Drug Name] [Dosage / Quantity]
FORMULARY STATUS: [Tier 1 / Tier 2 / Tier 3 / Tier 4 / Tier 5] - [Preferred / Standard Pharmacy]
REQUIREMENTS: [None / Prior Authorization (PA) / Step Therapy (ST) / Quantity Limit (QL)]
COST SHARE EXPLAINED:
- Estimated copay/coinsurance: $[0.00] at Preferred Pharmacy.
- Insulin Savings Program / IRA Cap: Explained $35 monthly cap (if applicable).
- 2025/2026 CMS Out-of-Pocket Cap ($2,000 threshold) explained to member.
OUTCOME: Member understood benefit structure. No further questions.`
  },
  {
    id: 'payment',
    title: 'Premium Payment Assistance',
    category: 'Facturación y Pagos',
    description: 'Ayuda para pago de prima mensual o configuración de retención de Social Security.',
    content: `CALL TYPE: Inbound - Billing & Premium Payment
MEMBER VERIFIED: Full HIPAA verification passed.
BALANCE DUE: $[Amount] for coverage period [Month/Year].
PAYMENT METHOD: [Debit/Credit Card / EFT Electronic Check / SSA Deduction Set Up].
CONFIRMATION NUMBER: [Confirmation #]
AUTOMATION / AUTO-PAY: Offered member recurring auto-deduction option.
OUTCOME: Payment submitted successfully. Member given confirmation number and thanked for choosing Wellcare.`
  }
];

export default { CRM_TEMPLATES };
