import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Insert irARegistroRapido into the imports from ui.js
main = main.replace(
  '  confirmLiberarEquipo,',
  '  confirmLiberarEquipo,\n  irARegistroRapido,'
);

fs.writeFileSync('main.js', main);
