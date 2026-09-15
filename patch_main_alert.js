import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Insert showCustomAlert into the imports from ui.js
if (!main.includes('showCustomAlert')) {
  main = main.replace(
    '  irARegistroRapido,',
    '  irARegistroRapido,\n  showCustomAlert,'
  );
  main = main.replace(
    'window.irARegistroRapido = irARegistroRapido;',
    'window.irARegistroRapido = irARegistroRapido;\nwindow.showCustomAlert = showCustomAlert;'
  );
}

fs.writeFileSync('main.js', main);
