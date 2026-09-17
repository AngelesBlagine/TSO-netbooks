import fs from 'fs';
let main = fs.readFileSync('main.js', 'utf8');

main = main.replace(
  '  deleteBitacoraRecord,\n} from "./ui.js";',
  '  deleteBitacoraRecord,\n  openKitModal,\n  closeKitModal,\n} from "./ui.js";'
);

fs.writeFileSync('main.js', main);
