import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Remove from imports
main = main.replace(/  agregarFilaManual,\n  guardarFilaManual,\n/, '');
main = main.replace(/  saveRecord,\n  clearHistory,\n/, '');
main = main.replace(/  cargarRegistros,\n/, '');

// Remove from window bindings
main = main.replace(/window\.saveRecord = saveRecord;\nwindow\.clearHistory = clearHistory;\nwindow\.cargarRegistros = cargarRegistros;\n/, '');
main = main.replace(/window\.agregarFilaManual = agregarFilaManual;\nwindow\.guardarFilaManual = guardarFilaManual;\n/, '');

// Remove from DOMContentLoaded
main = main.replace(/  cargarRegistros\(\);\n/, '');

fs.writeFileSync('main.js', main);
