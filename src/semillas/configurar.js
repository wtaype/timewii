// src/semillas/configurar.js
// 🎛️ Tablero de Control Maestro: TimeWii Workstation Toolkit
// Combina versión inmutable (src/wii.js) + Configuración visual (src/semillas/app.json)

import wii from '../wii.js';
import appConfig from './app.json';

export const configurarSistema = {
  // Identidad generada desde wii.js
  id: wii.id,
  app: wii.app,
  slogan: wii.slogan,
  title: `${wii.app} • ${wii.slogan}`,
  by: wii.by,
  version: wii.version,
  versionNum: wii.version,
  linkweb: wii.linkweb,

  // Metadatos de la aplicación
  nombre: wii.app,
  descripcion: wii.slogan,
  anio: '2026',

  // Configuración de menús desacoplada
  navegacion: appConfig.navegacion || [],
  accionesFooter: appConfig.accionesFooter || [],
  tema: appConfig.tema,

  // Banderas de funcionalidades modulares
  modulos: {
    general: true,
    geography: true,
    metricas: true,
    eeuu: true,
    ruleta: true
  }
};

export default configurarSistema;
