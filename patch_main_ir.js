import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Add import
main = main.replace(
  '  confirmLiberarEquipo,\n} from "./ui.js";',
  '  confirmLiberarEquipo,\n  irARegistroRapido,\n} from "./ui.js";'
);

// Add window binding
main = main.replace(
  'window.confirmLiberarEquipo = confirmLiberarEquipo;',
  'window.confirmLiberarEquipo = confirmLiberarEquipo;\nwindow.irARegistroRapido = irARegistroRapido;'
);

fs.writeFileSync('main.js', main);
