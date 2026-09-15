import fs from "fs";
let content = fs.readFileSync("ui.js", "utf8");

const oldModal = `export function openRegisterModal() {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  content.className = "modal-content";
  content.innerHTML = \`
                <h3>Registrar Equipo Intervenido</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Guardá el registro en la memoria local del dispositivo.</p>
                
                <div style="display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
                    <label style="font-size:0.85rem; font-weight:bold;">Generación
                        <input type="text" id="reg-input-gen" value="\${activeProcedureGen ? activeProcedureGen.id : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Marca
                        <input type="text" id="reg-input-marca" value="\${activeProcedureGen ? activeProcedureGen.marcas[0] : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Observaciones
                        <textarea id="reg-input-obs" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;"></textarea>
                    </label>
                </div>

                <div style="display:flex; gap:0.5rem; margin-top:1.5rem;">
                    <button class="btn" onclick="saveRecord()">Guardar Localmente</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                </div>
            \`;

  overlay.classList.add("active");
}`;

const newModal = `export function openRegisterModal() {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  content.className = "modal-content";
  content.innerHTML = \`
    <h3>Registrar Equipo Intervenido</h3>
    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Guardá el registro en la base de datos.</p>
    
    <div style="display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
        <label style="font-size:0.85rem; font-weight:bold;">Generación
            <input type="text" id="reg-input-gen" value="\${activeProcedureGen ? activeProcedureGen.id : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
        </label>
        <label style="font-size:0.85rem; font-weight:bold;">Marca
            <input type="text" id="reg-input-marca" value="\${activeProcedureGen ? activeProcedureGen.marcas[0] : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
        </label>
        <label style="font-size:0.85rem; font-weight:bold;">Estado de la netbook
            <select id="reg-input-estado" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
              <option value="Reparada">Reparada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="No reparable">No reparable</option>
            </select>
        </label>
        <label style="font-size:0.85rem; font-weight:bold;">Detalles
            <textarea id="reg-input-detalles" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;"></textarea>
        </label>
    </div>

    <div style="display:flex; gap:0.5rem; margin-top:1.5rem;">
        <button class="btn" id="btn-save-record" onclick="saveRecord()">Guardar Registro</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    </div>
  \`;

  overlay.classList.add("active");
}`;

content = content.replace(oldModal, newModal);
fs.writeFileSync("ui.js", content);
