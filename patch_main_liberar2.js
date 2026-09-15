import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Add imports
main = main.replace(
  '  liberarEquipo,',
  '  liberarEquipo,\n  closeLiberarModal,\n  checkLiberarInput,\n  confirmLiberarEquipo,'
);

// Add window bindings
main = main.replace(
  'window.liberarEquipo = liberarEquipo;',
  'window.liberarEquipo = liberarEquipo;\nwindow.closeLiberarModal = closeLiberarModal;\nwindow.checkLiberarInput = checkLiberarInput;\nwindow.confirmLiberarEquipo = confirmLiberarEquipo;'
);

fs.writeFileSync('main.js', main);
