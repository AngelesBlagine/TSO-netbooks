import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// 1. Remove saveRecord and clearHistory
const saveRecordRegex = /export async function saveRecord\(\) \{[\s\S]*?\}\nexport function clearHistory\(\) \{[\s\S]*?\}\n/m;
ui = ui.replace(saveRecordRegex, '');

// 2. Remove cargarRegistros, agregarFilaManual, guardarFilaManual
const tableFuncsRegex = /export async function cargarRegistros\(\) \{[\s\S]*?export async function agregarFilaManual\(\) \{[\s\S]*?export async function guardarFilaManual\(btn\) \{[\s\S]*?await cargarRegistros\(\);\n\}\n/m;
ui = ui.replace(tableFuncsRegex, '');

// 3. Remove await cargarRegistros() in finishQrw
ui = ui.replace('  // Refresh tables\n  await cargarRegistros();\n', '');

fs.writeFileSync('ui.js', ui);
