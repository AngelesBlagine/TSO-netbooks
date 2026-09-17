import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const logic = `
// BITACORA LOGIC (Local Storage)
export async function getBitacoraKey() {
  try {
    const { getUserProfile } = await import("./auth.js");
    const profile = await getUserProfile();
    if (profile && profile.email) {
      return \`bitacora_\${profile.email}\`;
    }
  } catch (e) {
    console.error("Error fetching user email for bitacora", e);
  }
  return "bitacora_guest";
}

export async function renderBitacora() {
  const tbody = document.getElementById("bitacora-tbody");
  if (!tbody) return;
  
  const key = await getBitacoraKey();
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 1rem; color: var(--text-muted);">Aún no tienes registros de horas.</td></tr>';
    return;
  }
  
  let html = "";
  // Sort descending by id or date, let's keep it simple (as they are entered or reverse)
  data.reverse().forEach(record => {
    // encode record to pass to edit function
    const recordJsonStr = encodeURIComponent(JSON.stringify(record));
    html += \`
      <tr>
        <td>\${record.fecha || "-"}</td>
        <td>\${record.horario || "-"}</td>
        <td>\${record.duracion || "-"}</td>
        <td>\${record.trabajo || "-"}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; width: auto;" onclick="editBitacoraRecord('\${recordJsonStr}')">✏️ Editar</button>
            <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; width: auto; color: var(--error);" onclick="deleteBitacoraRecord('\${record.id}')">🗑️ Eliminar</button>
          </div>
        </td>
      </tr>
    \`;
  });
  
  tbody.innerHTML = html;
}

export async function addBitacoraRecord() {
  const fecha = document.getElementById("bitacora-fecha").value;
  const horario = document.getElementById("bitacora-horario").value;
  const duracion = document.getElementById("bitacora-duracion").value;
  const trabajo = document.getElementById("bitacora-trabajo").value;
  const editId = document.getElementById("bitacora-edit-id").value;
  
  if (!fecha || !duracion || !trabajo) {
    showCustomAlert("Por favor, completa al menos Fecha, Duración y Trabajo Realizado.");
    return;
  }

  const key = await getBitacoraKey();
  let data = JSON.parse(localStorage.getItem(key) || "[]");
  
  if (editId) {
    // Update existing
    const idx = data.findIndex(r => r.id === editId);
    if (idx !== -1) {
      data[idx] = { ...data[idx], fecha, horario, duracion, trabajo };
    }
  } else {
    // Create new
    const newRecord = {
      id: Date.now().toString(),
      fecha,
      horario,
      duracion,
      trabajo
    };
    data.push(newRecord);
  }
  
  localStorage.setItem(key, JSON.stringify(data));
  cancelBitacoraEdit(); // reset form
  await renderBitacora();
}

export function editBitacoraRecord(recordEncoded) {
  try {
    const record = JSON.parse(decodeURIComponent(recordEncoded));
    document.getElementById("bitacora-edit-id").value = record.id;
    document.getElementById("bitacora-fecha").value = record.fecha;
    document.getElementById("bitacora-horario").value = record.horario;
    document.getElementById("bitacora-duracion").value = record.duracion;
    document.getElementById("bitacora-trabajo").value = record.trabajo;
    
    document.getElementById("bitacora-btn-add").textContent = "Actualizar";
    document.getElementById("bitacora-btn-cancel").style.display = "block";
    
    // Scroll to the form
    document.getElementById("bitacora-fecha").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    console.error("Error parsing bitacora record", e);
  }
}

export function cancelBitacoraEdit() {
  document.getElementById("bitacora-edit-id").value = "";
  document.getElementById("bitacora-fecha").value = "";
  document.getElementById("bitacora-horario").value = "";
  document.getElementById("bitacora-duracion").value = "";
  document.getElementById("bitacora-trabajo").value = "";
  
  document.getElementById("bitacora-btn-add").textContent = "Añadir";
  document.getElementById("bitacora-btn-cancel").style.display = "none";
}

export async function deleteBitacoraRecord(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este registro de horas?")) {
    const key = await getBitacoraKey();
    let data = JSON.parse(localStorage.getItem(key) || "[]");
    data = data.filter(r => r.id !== id);
    localStorage.setItem(key, JSON.stringify(data));
    await renderBitacora();
  }
}
`;

ui += '\n' + logic;
fs.writeFileSync('ui.js', ui);

let main = fs.readFileSync('main.js', 'utf8');

// Export globally
main = main.replace(
  'window.saveEditEquipo = saveEditEquipo;',
  `window.saveEditEquipo = saveEditEquipo;
window.renderBitacora = renderBitacora;
window.addBitacoraRecord = addBitacoraRecord;
window.editBitacoraRecord = editBitacoraRecord;
window.cancelBitacoraEdit = cancelBitacoraEdit;
window.deleteBitacoraRecord = deleteBitacoraRecord;`
);

// Add imports
main = main.replace(
  'showCustomAlert, openEditModal, closeEditModal, saveEditEquipo',
  'showCustomAlert, openEditModal, closeEditModal, saveEditEquipo, renderBitacora, addBitacoraRecord, editBitacoraRecord, cancelBitacoraEdit, deleteBitacoraRecord'
);

// Call renderBitacora on startup if we are logged in, or right after rendering sheets data, 
// but wait, we need to make sure the profile is ready.
// In main.js, what is the sequence?
