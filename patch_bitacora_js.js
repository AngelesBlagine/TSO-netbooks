import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// 1. renderBitacora
ui = ui.replace(
  '<td>${record.horario || "-"}</td>',
  '<td>${record.horarioDesde ? record.horarioDesde + " - " + (record.horarioHasta || "") : record.horario || "-"}</td>'
);

// 2. addBitacoraRecord
ui = ui.replace(
  'const horario = document.getElementById("bitacora-horario").value;',
  'const horarioDesde = document.getElementById("bitacora-horario-desde").value;\n  const horarioHasta = document.getElementById("bitacora-horario-hasta").value;'
);

ui = ui.replace(
  'if (idx !== -1) {\n      data[idx] = { ...data[idx], fecha, horario, duracion, trabajo };\n    }',
  'if (idx !== -1) {\n      data[idx] = { ...data[idx], fecha, horarioDesde, horarioHasta, duracion, trabajo };\n      delete data[idx].horario;\n    }'
);

ui = ui.replace(
  '      fecha,\n      horario,\n      duracion,\n      trabajo\n    };\n    data.push(newRecord);',
  '      fecha,\n      horarioDesde,\n      horarioHasta,\n      duracion,\n      trabajo\n    };\n    data.push(newRecord);'
);

// 3. editBitacoraRecord
ui = ui.replace(
  'document.getElementById("bitacora-horario").value = record.horario;',
  'document.getElementById("bitacora-horario-desde").value = record.horarioDesde || record.horario || "";\n    document.getElementById("bitacora-horario-hasta").value = record.horarioHasta || "";'
);

// 4. cancelBitacoraEdit
ui = ui.replace(
  'document.getElementById("bitacora-horario").value = "";',
  'document.getElementById("bitacora-horario-desde").value = "";\n  document.getElementById("bitacora-horario-hasta").value = "";'
);

fs.writeFileSync('ui.js', ui);
