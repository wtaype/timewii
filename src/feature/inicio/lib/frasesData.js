// src/feature/inicio/lib/frasesData.js
// Frases de atención al cliente en inglés (Wellcare Call Center) con apoyo formativo en español

export const FRASES_DATA = [
  {
    id: 'f1',
    cat: 'opening',
    catLabel: 'Apertura',
    badgeClass: '',
    en: 'Thank you for calling Wellcare Medicare Advantage. My name is [Your Name], how may I assist you today?',
    es: 'Gracias por llamar a Wellcare Medicare Advantage. Mi nombre es [Tu Nombre], ¿cómo puedo ayudarle hoy?',
    tip: 'Saludo corporativo estándar. Habla claro, tono empático y pausado.'
  },
  {
    id: 'f2',
    cat: 'opening',
    catLabel: 'Llamada Grabada',
    badgeClass: '',
    en: 'For quality and training purposes, this call may be recorded or monitored.',
    es: 'Por motivos de calidad y entrenamiento, esta llamada puede ser grabada o monitoreada.',
    tip: 'Divulgación legal obligatoria en la apertura si el sistema IVR no lo mencionó.'
  },
  {
    id: 'f3',
    cat: 'hipaa',
    catLabel: 'HIPAA Verification',
    badgeClass: 'hipaa',
    en: 'To protect your health privacy, may I please verify your full name, date of birth, and Member ID number?',
    es: 'Para proteger su privacidad de salud, ¿podría verificar su nombre completo, fecha de nacimiento y número de Member ID?',
    tip: 'Autenticación de 3 puntos obligatoria antes de revelar cualquier beneficio o reclamo.'
  },
  {
    id: 'f4',
    cat: 'hipaa',
    catLabel: 'HIPAA Address',
    badgeClass: 'hipaa',
    en: 'Could you also please confirm your current residential address including the zip code?',
    es: '¿Podría también confirmar su dirección de residencia actual incluyendo el código postal?',
    tip: 'Punto secundario de verificación en caso de duda o cambio de domicilio.'
  },
  {
    id: 'f5',
    cat: 'hold',
    catLabel: 'Permiso de Espera',
    badgeClass: 'hold',
    en: 'May I place you on a brief hold for 2 to 3 minutes while I review your account details?',
    es: '¿Puedo ponerlo en una breve espera de 2 a 3 minutos mientras reviso los detalles de su cuenta?',
    tip: 'Siempre solicita permiso antes del hold y especifica el tiempo estimado (máximo 2 a 3 min).'
  },
  {
    id: 'f6',
    cat: 'hold',
    catLabel: 'Retomar Llamada',
    badgeClass: 'hold',
    en: 'Thank you so much for your patience while holding. I have that information ready for you.',
    es: 'Muchas gracias por su paciencia en la espera. Ya tengo esa información lista para usted.',
    tip: 'Agradece siempre la paciencia del miembro inmediatamente al quitar el mute/hold.'
  },
  {
    id: 'f7',
    cat: 'empathy',
    catLabel: 'Empatía',
    badgeClass: 'empathy',
    en: 'I completely understand how frustrating this situation can be, and I am here to help you get this resolved.',
    es: 'Entiendo perfectamente lo frustrante que puede ser esta situación, y estoy aquí para ayudarle a resolverlo.',
    tip: 'Usa esta frase cuando el miembro esté molesto por una denegación de reclamo o medicamento.'
  },
  {
    id: 'f8',
    cat: 'empathy',
    catLabel: 'Aclaración de Beneficios',
    badgeClass: 'empathy',
    en: 'I will personally look into your benefits to ensure you get the exact coverage you are entitled to.',
    es: 'Revisaré personalmente sus beneficios para asegurarme de que obtenga la cobertura exacta que le corresponde.',
    tip: 'Genera tranquilidad y sentido de propiedad personal del caso.'
  },
  {
    id: 'f9',
    cat: 'transfer',
    catLabel: 'Transferencia Asistida',
    badgeClass: '',
    en: 'I will connect you directly with our Pharmacy Care team. Please stay on the line while I introduce your case.',
    es: 'Le comunicaré directamente con nuestro equipo de farmacia. Por favor manténgase en la línea mientras presento su caso.',
    tip: 'Warm Transfer: explícale al miembro que no colgará y que hablarás primero con el otro departamento.'
  },
  {
    id: 'f10',
    cat: 'closing',
    catLabel: 'Cierre de Llamada',
    badgeClass: '',
    en: 'Is there anything else I can assist you with regarding your Wellcare benefits today?',
    es: '¿Hay algo más en lo que pueda ayudarle con respecto a sus beneficios de Wellcare hoy?',
    tip: 'Pregunta de cierre obligatoria antes de despedirse.'
  },
  {
    id: 'f11',
    cat: 'closing',
    catLabel: 'Despedida Formal',
    badgeClass: '',
    en: 'Thank you for choosing Wellcare. Your reference number for this call is [Ref#]. Have a wonderful rest of your day!',
    es: 'Gracias por elegir Wellcare. Su número de referencia para esta llamada es [Ref#]. ¡Que tenga un maravilloso día!',
    tip: 'Brinda el número de interacción/caso antes de finalizar la llamada.'
  }
];

export default { FRASES_DATA };
