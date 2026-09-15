import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const oldLogic = `    if (!result.success) {
      if (result.errorType === "ALREADY_TAKEN") {
        const ownerEmail = result.owner || "otro usuario";
        alert(
          \`Este equipo ya está asignado a \${ownerEmail}. Te sugerimos buscar otra netbook para reparar.\`,
        );
      } else {
        alert(
          "Error al guardar: " +
            (result.error || "El ID no existe o ocurrió un error desconocido."),
        );
      }
      btnNext.disabled = false;
      btnNext.textContent = "+ Registrar Equipo";
      btnPrev.disabled = false;
      return;
    }`;

const newLogic = `    if (!result.success) {
      const id = qrwState.data.identificacion || "Desconocido";
      btnNext.disabled = false;
      btnNext.textContent = "+ Registrar Equipo";
      btnPrev.disabled = false;

      let alertMsg = "";
      if (result.errorType === "ALREADY_TAKEN" || result.owner) {
        const ownerEmail = result.owner || "otro usuario";
        alertMsg = \`El equipo ID \${id} ya es responsabilidad del usuario \${ownerEmail}. Por favor, busca otra netbook para reparar o consulta con tu docente.\`;
      } else {
        alertMsg = \`El ID ingresado no se encuentra en la planilla pre-cargada. Verifica la etiqueta.\`;
      }
      
      // Mostrar modal estilizada de error
      showCustomAlert(alertMsg);
      return;
    }`;

ui = ui.replace(oldLogic, newLogic);

// Agregamos showCustomAlert al final
const customAlertHTML = `
export function showCustomAlert(message) {
  let alertModal = document.getElementById('custom-alert-modal');
  if (!alertModal) {
    alertModal = document.createElement('div');
    alertModal.id = 'custom-alert-modal';
    alertModal.className = 'modal-overlay';
    alertModal.innerHTML = \`
      <div class="modal-content" style="max-width: 400px; text-align: center;">
        <h3 style="color: var(--error); margin-bottom: 1rem;">Aviso Importante</h3>
        <p id="custom-alert-msg" style="color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.5;"></p>
        <button class="btn" style="width: 100%; background-color: var(--error); border-color: var(--error);" onclick="document.getElementById('custom-alert-modal').classList.remove('active')">Entendido</button>
      </div>
    \`;
    document.body.appendChild(alertModal);
  }
  document.getElementById('custom-alert-msg').textContent = message;
  alertModal.classList.add('active');
}
`;

if (!ui.includes('showCustomAlert')) {
  ui += customAlertHTML;
}

fs.writeFileSync('ui.js', ui);
