import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// Change the reset text in the finishQrw catch block from "Finalizar y Guardar" to "+ Registrar Equipo"
ui = ui.replace(
  '      btnNext.textContent = "Finalizar y Guardar";',
  '      btnNext.textContent = "+ Registrar Equipo";'
);

fs.writeFileSync('ui.js', ui);
