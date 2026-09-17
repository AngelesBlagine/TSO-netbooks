import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

main = main.replace(
  'closeSettingsModal,\n} from "./ui.js";',
  'closeSettingsModal,\n  renderBitacora,\n  addBitacoraRecord,\n  editBitacoraRecord,\n  cancelBitacoraEdit,\n  deleteBitacoraRecord\n} from "./ui.js";'
);

main = main.replace(
  'window.saveEditEquipo = saveEditEquipo;',
  'window.saveEditEquipo = saveEditEquipo;\nwindow.renderBitacora = renderBitacora;\nwindow.addBitacoraRecord = addBitacoraRecord;\nwindow.editBitacoraRecord = editBitacoraRecord;\nwindow.cancelBitacoraEdit = cancelBitacoraEdit;\nwindow.deleteBitacoraRecord = deleteBitacoraRecord;'
);

fs.writeFileSync('main.js', main);
