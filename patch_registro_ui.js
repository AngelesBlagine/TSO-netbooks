import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const updatedFuncs = `
export async function cargarRegistros() {
  const tbody = document.getElementById("history-tbody");
  if (!tbody) return;

  tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--text-muted);">Cargando registros...</td></tr>\`;

  if (!supabase) {
    tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--error);">Supabase no está configurado.</td></tr>\`;
    return;
  }

  const { data, error } = await supabase
    .from("registro_reparaciones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--error);">Error al cargar: \${error.message}</td></tr>\`;
    return;
  }

  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--text-muted);">No hay equipos registrados.</td></tr>\`;
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = \`
      <td>\${item.identificacion || "-"}</td>
      <td>\${item.marca || "-"}</td>
      <td>\${item.n_serie || "-"}</td>
      <td><strong>\${item.generacion || "-"}</strong></td>
      <td>\${item.bloqueada || "-"}</td>
      <td>\${item.bateria || "-"}</td>
      <td>\${item.observaciones || "-"}</td>
      <td>\${item.situacion_final || "-"}</td>
      <td>\${item.responsable || "-"}</td>
      <td>
          <!-- Espacio para acciones futuras -->
      </td>
    \`;
    tbody.appendChild(tr);
  });
}

export async function agregarFilaManual() {
  const tbody = document.getElementById("history-tbody");
  if (!tbody) return;

  // Si dice "No hay equipos", lo quitamos
  if (tbody.innerHTML.includes("No hay equipos registrados")) {
    tbody.innerHTML = "";
  }

  const { getUserProfile } = await import("./auth.js");
  const profile = await getUserProfile();
  const currentUserEmail = profile ? profile.email : "desconocido@email.com";

  const tr = document.createElement("tr");
  tr.id = "new-row-manual";
  tr.style.backgroundColor = "var(--bg-main)";

  tr.innerHTML = \`
    <td><input type="text" id="new-identificacion" placeholder="ID corto" style="width:100px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-marca" placeholder="Marca" style="width:100px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-n_serie" placeholder="N° Serie" style="width:100px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-generacion" placeholder="G1, G2..." style="width:80px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td>
        <select id="new-bloqueada" style="padding:0.4rem; border:1px solid var(--border); border-radius:4px;">
            <option value="No">No</option>
            <option value="Sí">Sí</option>
        </select>
    </td>
    <td><input type="text" id="new-bateria" placeholder="Estado Batería" style="width:120px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-observaciones" placeholder="Obs..." style="width:150px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td>
        <select id="new-situacion" style="padding:0.4rem; border:1px solid var(--border); border-radius:4px;">
            <option value="Reparada">Reparada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="No reparable">No reparable</option>
        </select>
    </td>
    <td><input type="text" id="new-responsable" value="\${currentUserEmail}" readonly style="width:150px; padding:0.4rem; border:1px solid var(--border); border-radius:4px; background-color:var(--bg-main); color:var(--text-muted); cursor:not-allowed;"></td>
    <td>
        <button class="btn" style="padding:0.4rem 0.6rem; font-size:0.8rem;" onclick="guardarFilaManual(this)">Guardar</button>
        <button class="btn btn-secondary" style="padding:0.4rem 0.6rem; font-size:0.8rem;" onclick="this.closest('tr').remove()">X</button>
    </td>
  \`;

  tbody.insertBefore(tr, tbody.firstChild);
}

export async function guardarFilaManual(btn) {
  const tr = btn.closest('tr');
  const identificacion = tr.querySelector('#new-identificacion').value;
  const marca = tr.querySelector('#new-marca').value;
  const n_serie = tr.querySelector('#new-n_serie').value;
  const generacion = tr.querySelector('#new-generacion').value;
  const bloqueada = tr.querySelector('#new-bloqueada').value;
  const bateria = tr.querySelector('#new-bateria').value;
  const observaciones = tr.querySelector('#new-observaciones').value;
  const situacion_final = tr.querySelector('#new-situacion').value;
  const responsable = tr.querySelector('#new-responsable').value;

  btn.disabled = true;
  btn.textContent = "...";

  const { error } = await supabase.from("registro_reparaciones").insert([
    {
      identificacion,
      marca,
      n_serie,
      generacion,
      bloqueada,
      bateria,
      observaciones,
      situacion_final,
      responsable
    },
  ]);

  if (error) {
    alert("Error al guardar en Supabase: " + error.message);
    btn.disabled = false;
    btn.textContent = "Guardar";
    return;
  }

  await cargarRegistros();
}
`;

// Replace cargarRegistros
const regexCargar = /export async function cargarRegistros\(\) \{[\s\S]*?\n\nexport function clearHistory\(\) \{/m;
ui = ui.replace(regexCargar, updatedFuncs + '\n\nexport function clearHistory() {');

// Update openRegisterModal and saveRecord to match new schema
const oldModal = /export function openRegisterModal\(\) \{[\s\S]*?overlay\.classList\.add\("active"\);\n\}/m;

const newModal = `export async function openRegisterModal() {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");
  
  const { getUserProfile } = await import("./auth.js");
  const profile = await getUserProfile();
  const currentUserEmail = profile ? profile.email : "desconocido@email.com";

  content.className = "modal-content";
  content.innerHTML = \`
                <h3>Registrar Equipo Intervenido</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Guarda la intervención de este equipo en la base de datos.</p>
                
                <div style="display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
                    <label style="font-size:0.85rem; font-weight:bold;">Identificación
                        <input type="text" id="reg-input-id" placeholder="ID corto" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Marca
                        <input type="text" id="reg-input-marca" value="\${activeProcedureGen ? activeProcedureGen.marcas[0] : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">N° de Serie
                        <input type="text" id="reg-input-nserie" placeholder="N° Serie" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Generación
                        <input type="text" id="reg-input-gen" value="\${activeProcedureGen ? activeProcedureGen.id : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Bloqueada
                        <select id="reg-input-bloqueada" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                        </select>
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Batería
                        <input type="text" id="reg-input-bateria" placeholder="Estado Batería" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Observaciones
                        <textarea id="reg-input-obs" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;"></textarea>
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Situación Final
                        <select id="reg-input-situacion" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                            <option value="Reparada">Reparada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="No reparable">No reparable</option>
                        </select>
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Responsable
                        <input type="text" id="reg-input-responsable" value="\${currentUserEmail}" readonly style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px; background-color:var(--bg-main); color:var(--text-muted); cursor:not-allowed;">
                    </label>
                </div>

                <div style="display:flex; gap:0.5rem; margin-top:1.5rem;">
                    <button class="btn" id="btn-save-record" onclick="saveRecord()">Guardar</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                </div>
            \`;

  overlay.classList.add("active");
}`;

ui = ui.replace(oldModal, newModal);

const oldSaveRecord = /export async function saveRecord\(\) \{[\s\S]*?await cargarRegistros\(\);\n\}/m;
const newSaveRecord = `export async function saveRecord() {
  const btn = document.getElementById("btn-save-record");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Guardando...";
  }

  const identificacion = document.getElementById("reg-input-id")?.value || "";
  const marca = document.getElementById("reg-input-marca")?.value || "";
  const n_serie = document.getElementById("reg-input-nserie")?.value || "";
  const generacion = document.getElementById("reg-input-gen")?.value || "";
  const bloqueada = document.getElementById("reg-input-bloqueada")?.value || "No";
  const bateria = document.getElementById("reg-input-bateria")?.value || "";
  const observaciones = document.getElementById("reg-input-obs")?.value || "";
  const situacion_final = document.getElementById("reg-input-situacion")?.value || "Pendiente";
  const responsable = document.getElementById("reg-input-responsable")?.value || "";

  if (!supabase) {
    alert("Error: Supabase no está configurado.");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Guardar";
    }
    return;
  }

  const { error } = await supabase.from("registro_reparaciones").insert([
    {
      identificacion,
      marca,
      n_serie,
      generacion,
      bloqueada,
      bateria,
      observaciones,
      situacion_final,
      responsable
    },
  ]);

  if (error) {
    alert("Error al guardar en Supabase: " + error.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Guardar";
    }
    return;
  }

  closeModal();
  await cargarRegistros();
}`;

ui = ui.replace(oldSaveRecord, newSaveRecord);

fs.writeFileSync('ui.js', ui);

