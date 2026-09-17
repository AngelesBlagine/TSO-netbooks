import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

const anchor = '  renderGeneracionesCatalog();';
main = main.replace(anchor, anchor + '\n  renderBitacora();');

fs.writeFileSync('main.js', main);
