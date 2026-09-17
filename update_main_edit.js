import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// We need to add the new functions to the import from ui.js
// current imports look like:
// import { initTheme, initNavigation, cargarDesdeSheets, confirmarAsignacion, closeModal, confirmarLiberarEquipo, liberarEquipo, startWizard, qrwNext, qrwPrev, finishQrw, initQrw, irARegistroRapido, showCustomAlert } from './ui.js';

// A more robust way is to just replace the whole import block if we can find it, but we can also use regex
main = main.replace(
  'showCustomAlert',
  'showCustomAlert, openEditModal, closeEditModal, saveEditEquipo'
);

main = main.replace(
  'window.showCustomAlert = showCustomAlert;',
  'window.showCustomAlert = showCustomAlert;\nwindow.openEditModal = openEditModal;\nwindow.closeEditModal = closeEditModal;\nwindow.saveEditEquipo = saveEditEquipo;'
);

fs.writeFileSync('main.js', main);
