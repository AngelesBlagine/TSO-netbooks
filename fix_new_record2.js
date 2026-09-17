import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(
  '      id: Date.now().toString(),\n      fecha,\n      horario,\n      duracion,\n      trabajo,\n    };\n    data.push(newRecord);',
  '      id: Date.now().toString(),\n      fecha,\n      horarioDesde,\n      horarioHasta,\n      duracion,\n      trabajo,\n    };\n    data.push(newRecord);'
);

fs.writeFileSync('ui.js', ui);
