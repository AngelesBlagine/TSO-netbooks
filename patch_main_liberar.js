import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Add import
main = main.replace(
  '  cargarDesdeSheets,',
  '  cargarDesdeSheets,\n  liberarEquipo,'
);

// Add window binding
main = main.replace(
  'window.cargarDesdeSheets = cargarDesdeSheets;',
  'window.cargarDesdeSheets = cargarDesdeSheets;\nwindow.liberarEquipo = liberarEquipo;'
);

fs.writeFileSync('main.js', main);
