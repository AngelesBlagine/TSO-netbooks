import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const oldConfigRegex = /const qrwStepsConfig = \[[\s\S]*?\];/;
const newConfig = `const qrwStepsConfig = [
  {
    id: "identificacion",
    title: "Identificación de la Netbook",
    desc: "Corresponde al valor que aparece escrito con fibra sobre la cinta de papel.",
    type: "text",
    placeholder: "Ej: A-12",
    required: true,
  },
  {
    id: "marca",
    title: "Marca del Equipo",
    desc: "Seleccioná la marca de la netbook.",
    type: "chips",
    options: ["EXO", "SAMSUNG", "POSITIVO BGH", "BANGHÓ", "CDR", "DEPOT", "HUNYRA", "NEWTRONIC", "NOVATECH", "NOBLEX", "EDUTEC", "OTRO"],
    footerInfo: "En caso de ser otra marca, escribirla en observaciones",
  },
  {
    id: "n_serie",
    title: "Número de Serie",
    desc: "Identificador único de fábrica del equipo.",
    type: "text",
    placeholder: "Ej: NT2018...",
  },
  {
    id: "generacion",
    title: "Generación",
    desc: "Generación a la que pertenece la netbook.",
    type: "select",
    options: ["", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"],
  },
  {
    id: "bloqueada",
    title: "¿El equipo está bloqueado?",
    desc: "Indicá si la netbook presenta pantalla de bloqueo de hardware.",
    type: "select",
    options: ["", "NO BLOQUEADO", "BLOQUEADO"],
  },
  {
    id: "bateria",
    title: "Estado de Batería",
    desc: "Indicá si el equipo posee batería o no.",
    type: "select",
    options: ["", "NO TIENE", "TIENE"],
  },
  {
    id: "observaciones",
    title: "Observaciones",
    desc: "Detalles adicionales sobre el estado del equipo.",
    type: "textarea",
    placeholder: "Falta tecla A, pantalla rayada...",
  },
  {
    id: "situacion_final",
    title: "Situación Final",
    desc: "Estado actual tras tu intervención.",
    type: "text",
    placeholder: "Ej: Pendiente de repuesto, Reparada...",
  },
];`;

ui = ui.replace(oldConfigRegex, newConfig);

fs.writeFileSync('ui.js', ui);
