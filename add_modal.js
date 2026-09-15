import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const modalHtml = `
    <!-- Modal para Liberar Equipo -->
    <div id="liberar-modal" class="modal-overlay">
      <div class="modal-content" style="max-width: 450px; text-align: left">
        <h2 style="color: var(--error); margin-bottom: 1rem;">Liberar Equipo</h2>
        <p style="color: var(--text-main); margin-bottom: 1rem; font-weight: bold;">
          Una vez lo libere, cualquier usuario podrá hacerse responsable de su máquina.
        </p>
        <p style="color: var(--text-muted); margin-bottom: 0.5rem; font-size: 0.9rem;">
          Para continuar, escriba exactamente: <strong>liberar equipo</strong>
        </p>
        <input 
          type="text" 
          id="liberar-input-confirm" 
          placeholder="liberar equipo" 
          style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 1.5rem;"
          oninput="checkLiberarInput()"
        />
        
        <!-- Almacena el ID y Email temporalmente -->
        <input type="hidden" id="liberar-hidden-id" />
        <input type="hidden" id="liberar-hidden-email" />

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="btn btn-secondary" style="width: auto;" onclick="closeLiberarModal()">Cancelar</button>
          <button id="liberar-btn-confirm" class="btn" style="width: auto; background-color: var(--error); border-color: var(--error);" disabled onclick="confirmLiberarEquipo()">Confirmar</button>
        </div>
      </div>
    </div>
    <script type="module" src="main.js"></script>
`;

html = html.replace('<script type="module" src="main.js"></script>', modalHtml);
fs.writeFileSync('index.html', html);
