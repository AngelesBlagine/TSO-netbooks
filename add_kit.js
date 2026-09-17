import fs from 'fs';

// 1. UPDATE index.html
let html = fs.readFileSync('index.html', 'utf8');

// Add the card to the quick-access-grid
const newCard = `          <div class="quick-card" onclick="openKitModal()">
            <h3>🧰 Kit de Reparación</h3>
            <p>
              Materiales necesarios y precauciones para la reparación y desmontaje.
            </p>
          </div>
`;
// Insert before the end of the quick-access-grid
html = html.replace(
  '          </div>\n        </div>\n        <div class="card" id="quick-register-wizard"',
  '          </div>\n' + newCard + '        </div>\n        <div class="card" id="quick-register-wizard"'
);

// Add the kit modal at the end before <script type="module" src="main.js"></script>
const kitModal = `
    <!-- Kit de Reparación Modal -->
    <div id="kit-modal" class="modal-overlay">
      <div class="modal-content" style="max-width: 600px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem">
          <h2 style="margin: 0;">Kit de Reparación y Precauciones</h2>
          <button class="btn btn-secondary" style="width: auto; padding: 0.5rem; line-height: 1;" onclick="closeKitModal()">✕</button>
        </div>
        
        <h3 style="margin-bottom: 0.5rem; color: var(--text-main); font-size: 1.1rem;">🛠️ Materiales Necesarios</h3>
        <ul style="margin-bottom: 1.5rem; padding-left: 1.2rem; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
          <li><strong>Destornilladores</strong> (plano y Phillips).</li>
          <li><strong>Soldador de estaño</strong> y alambre de estaño.</li>
          <li><strong>Flux para soldar</strong> (Nota: colocar sobre el integrado antes de soldar).</li>
          <li><strong>WD-40</strong> (para lubricar las bisagras).</li>
          <li><strong>Guantes anti-estática</strong>.</li>
          <li><strong>Recipientes o bandejas</strong> (para acomodar los tornillos y piezas que se desmontan sin perderlos).</li>
          <li><strong>Púa de plástico</strong> (para desencastrar las carcasas de las netbooks sin dejar marcas).</li>
          <li><strong>Pendrive</strong> (preparado con el sistema operativo y paquete Office 2007).</li>
        </ul>

        <h3 style="margin-bottom: 0.5rem; color: var(--text-main); font-size: 1.1rem;">⚠️ Precauciones</h3>
        <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--error); padding: 1rem; border-radius: 4px;">
          <p style="color: var(--text-main); font-size: 0.95rem; margin: 0; line-height: 1.5;">
            <strong>Estática:</strong> No se recomienda el uso de destornilladores imantados ni imanes cerca de los componentes integrados, ya que pueden generar descargas de estática y dañar la placa.
          </p>
        </div>
      </div>
    </div>
`;
html = html.replace('    <script type="module" src="main.js"></script>', kitModal + '    <script type="module" src="main.js"></script>');
fs.writeFileSync('index.html', html);

// 2. UPDATE ui.js
let ui = fs.readFileSync('ui.js', 'utf8');
const kitLogic = `
export function openKitModal() {
  const modal = document.getElementById("kit-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

export function closeKitModal() {
  const modal = document.getElementById("kit-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}
`;
ui = ui + '\n' + kitLogic;
fs.writeFileSync('ui.js', ui);

// 3. UPDATE main.js
let main = fs.readFileSync('main.js', 'utf8');

// Add imports
main = main.replace(
  'deleteBitacoraRecord\n} from "./ui.js";',
  'deleteBitacoraRecord,\n  openKitModal,\n  closeKitModal\n} from "./ui.js";'
);

// Add window exports
main = main.replace(
  'window.deleteBitacoraRecord = deleteBitacoraRecord;',
  'window.deleteBitacoraRecord = deleteBitacoraRecord;\nwindow.openKitModal = openKitModal;\nwindow.closeKitModal = closeKitModal;'
);

fs.writeFileSync('main.js', main);
console.log('Kit successfully added!');
