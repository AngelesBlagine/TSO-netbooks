import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(
  '      fecha,\n      horario,\n      duracion,\n      trabajo\n    };\n    data.push(newRecord);',
  '      fecha,\n      horarioDesde,\n      horarioHasta,\n      duracion,\n      trabajo\n    };\n    data.push(newRecord);'
);

// Actually, prettier reformatted it before I replaced it? No, wait, I already ran prettier.
fs.writeFileSync('ui.js', ui);
