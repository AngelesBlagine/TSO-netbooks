import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const editModalHtml = `
    <!-- Modal Editar Equipo -->
    <div id="edit-equipo-modal" class="modal-overlay">
      <div class="modal-content" style="max-width: 450px; text-align: left">
        <h3 style="color: var(--primary-dark); margin-bottom: 1rem;">Editar Equipo</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Modificá el estado y las observaciones de este equipo.
        </p>

        <input type="hidden" id="edit-hidden-id" />
        <input type="hidden" id="edit-hidden-email" />
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 500;">Bloqueada</label>
          <select id="edit-select-bloqueada" class="input-field" style="width: 100%;">
            <option value="NO BLOQUEADA">NO BLOQUEADA</option>
            <option value="BLOQUEADA">BLOQUEADA</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 500;">Batería</label>
          <select id="edit-select-bateria" class="input-field" style="width: 100%;">
            <option value="NO TIENE">NO TIENE</option>
            <option value="TIENE">TIENE</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 500;">Situación Final</label>
          <input type="text" id="edit-input-situacion" class="input-field" style="width: 100%;" placeholder="Ej: Reparada, Pendiente de repuesto..." />
        </div>

        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-weight: 500;">Observaciones</label>
          <textarea id="edit-textarea-observaciones" class="input-field" style="width: 100%; min-height: 80px;" placeholder="Agrega detalles..."></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button
            class="btn btn-secondary"
            style="width: auto"
            onclick="closeEditModal()"
          >
            Cancelar
          </button>
          <button
            id="edit-btn-save"
            class="btn"
            style="width: auto;"
            onclick="saveEditEquipo()"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
`;

// Insert before the last script tag or body closing tag
html = html.replace('    <script type="module" src="main.js"></script>', editModalHtml + '    <script type="module" src="main.js"></script>');

fs.writeFileSync('index.html', html);
