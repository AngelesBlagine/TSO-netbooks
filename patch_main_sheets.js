import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

main = main.replace('  openExternalRegister,', '  cargarDesdeSheets,');
main = main.replace('window.openExternalRegister = openExternalRegister;', 'window.cargarDesdeSheets = cargarDesdeSheets;');

fs.writeFileSync('main.js', main);
