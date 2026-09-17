import fs from 'fs';
let main = fs.readFileSync('main.js', 'utf8');

main = main.replace(
  'closeKitModal,\n} from "./ui.js";',
  'closeKitModal,\n  openScannerModal,\n  closeScannerModal,\n} from "./ui.js";'
);

main = main.replace(
  'window.closeKitModal = closeKitModal;',
  'window.closeKitModal = closeKitModal;\nwindow.openScannerModal = openScannerModal;\nwindow.closeScannerModal = closeScannerModal;'
);

fs.writeFileSync('main.js', main);
