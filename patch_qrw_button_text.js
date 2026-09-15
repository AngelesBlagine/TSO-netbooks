import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// Change the button text in renderQrwStep
ui = ui.replace(
  '      ? "Finalizar y Guardar"',
  '      ? "+ Registrar Equipo"'
);

// We need to check finishQrw to ensure it handles ALREADY_TAKEN correctly and the loading state.
// From previous context, finishQrw already has the ALREADY_TAKEN logic. Let's just update the button text during loading.
ui = ui.replace(
  '  btnNext.textContent = "Guardando...";',
  '  btnNext.innerHTML = `<span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 8px;">⏳</span> Guardando...`;'
);

fs.writeFileSync('ui.js', ui);
