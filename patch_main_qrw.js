import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

main = main.replace('import {', 'import {\\n  initQrw,\\n  qrwNext,\\n  qrwPrev,\\n  checkQrwInput,');
main = main.replace('window.guardarFilaManual = guardarFilaManual;', 'window.guardarFilaManual = guardarFilaManual;\\nwindow.initQrw = initQrw;\\nwindow.qrwNext = qrwNext;\\nwindow.qrwPrev = qrwPrev;\\nwindow.checkQrwInput = checkQrwInput;');

main = main.replace('renderGeneracionesCatalog();', 'renderGeneracionesCatalog();\\n  initQrw();');

fs.writeFileSync('main.js', main);

