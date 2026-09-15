import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Agregar las nuevas funciones globales a main.js
main = main.replace('import {', 'import {\n  agregarFilaManual,\n  guardarFilaManual,');
main = main.replace('window.openSettingsModal = openSettingsModal;', 'window.openSettingsModal = openSettingsModal;\nwindow.agregarFilaManual = agregarFilaManual;\nwindow.guardarFilaManual = guardarFilaManual;');

fs.writeFileSync('main.js', main);
