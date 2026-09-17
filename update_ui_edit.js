import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// 1. Update renderSheetsData to include the "Editar" button.
// And we need to pass the row data to the openEditModal.
const oldRenderSheetsData = `    if (isOwner) {
      tableHtml += \`<button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onclick="liberarEquipo('\${identificacion}', '\${userEmail}')">Liberar Equipo</button>\`;
    } else {
      tableHtml += \`-\`;
    }`;

const newRenderSheetsData = `    if (isOwner) {
      // Escape row to JSON string
      const rowJsonStr = encodeURIComponent(JSON.stringify(row));
      tableHtml += \`
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onclick="openEditModal('\${identificacion}', '\${userEmail}', '\${rowJsonStr}')">
            ✏️ Editar
          </button>
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onclick="liberarEquipo('\${identificacion}', '\${userEmail}')">
            Liberar
          </button>
        </div>\`;
    } else {
      tableHtml += \`-\`;
    }`;

ui = ui.replace(oldRenderSheetsData, newRenderSheetsData);

// 2. Add the modal functions
const editFunctionsHtml = `
export function openEditModal(identificacion, userEmail, rowJsonEncoded) {
  const modal = document.getElementById("edit-equipo-modal");
  if (!modal) return;
  
  let rowData = {};
  try {
    rowData = JSON.parse(decodeURIComponent(rowJsonEncoded));
  } catch (e) {
    console.error("Failed to parse row data", e);
  }

  document.getElementById("edit-hidden-id").value = identificacion;
  document.getElementById("edit-hidden-email").value = userEmail;

  // Find corresponding fields (case-insensitive check)
  const getFieldValue = (keyName) => {
    const key = Object.keys(rowData).find(k => k.toLowerCase().includes(keyName));
    return key ? rowData[key] : "";
  };

  const bloqueadaVal = getFieldValue("bloqueada") || "NO BLOQUEADA";
  const bateriaVal = getFieldValue("bateria") || "NO TIENE";
  const situacionVal = getFieldValue("situaci") || getFieldValue("final") || "";
  const obsVal = getFieldValue("observacion") || "";

  // Set the values in the modal
  
  const selectBloqueada = document.getElementById("edit-select-bloqueada");
  if (bloqueadaVal.toUpperCase() === "BLOQUEADA" || bloqueadaVal.toUpperCase() === "SI") {
    selectBloqueada.value = "BLOQUEADA";
  } else {
    selectBloqueada.value = "NO BLOQUEADA";
  }

  const selectBateria = document.getElementById("edit-select-bateria");
  if (bateriaVal.toUpperCase() === "TIENE" || bateriaVal.toUpperCase() === "SI") {
    selectBateria.value = "TIENE";
  } else {
    selectBateria.value = "NO TIENE";
  }

  document.getElementById("edit-input-situacion").value = situacionVal;
  document.getElementById("edit-textarea-observaciones").value = obsVal;

  modal.classList.add("active");
}

export function closeEditModal() {
  const modal = document.getElementById("edit-equipo-modal");
  if (modal) modal.classList.remove("active");
}

export async function saveEditEquipo() {
  const id = document.getElementById("edit-hidden-id").value;
  const userEmail = document.getElementById("edit-hidden-email").value;
  const bloqueada = document.getElementById("edit-select-bloqueada").value;
  const bateria = document.getElementById("edit-select-bateria").value;
  const situacion = document.getElementById("edit-input-situacion").value;
  const observaciones = document.getElementById("edit-textarea-observaciones").value;

  const btnSave = document.getElementById("edit-btn-save");
  
  btnSave.disabled = true;
  btnSave.innerHTML = \`<span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 8px;">⏳</span> Guardando...\`;

  const payload = {
    action: 'update',
    email: userEmail,
    id: String(id),
    data: {
      'Bloqueada': bloqueada,
      'Batería': bateria,
      'Situación Final': situacion,
      'Observaciones': observaciones
    }
  };

  console.log("Payload enviado a Apps Script para update:", payload);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      closeEditModal();
      showCustomAlert("¡Cambios guardados con éxito!");
      await cargarDesdeSheets();
    } else {
      showCustomAlert("Error al actualizar: " + (result.error || "Desconocido"));
    }
  } catch (error) {
    console.error(error);
    showCustomAlert("Error de red al intentar actualizar los datos.");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Guardar Cambios";
  }
}
`;

ui += '\n' + editFunctionsHtml;

fs.writeFileSync('ui.js', ui);
