import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

// Remove from auth.js import
main = main.replace(
  'import {\n  initQrw,\n  qrwNext,\n  qrwPrev,\n  checkQrwInput,\n  checkAuth,\n  cerrarSesion,\n} from "./auth.js";',
  'import {\n  checkAuth,\n  cerrarSesion,\n} from "./auth.js";'
);

// Add to ui.js import
main = main.replace(
  'import {\n  agregarFilaManual,',
  'import {\n  initQrw,\n  qrwNext,\n  qrwPrev,\n  checkQrwInput,\n  agregarFilaManual,'
);

fs.writeFileSync('main.js', main);
