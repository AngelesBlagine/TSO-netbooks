import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// The block to remove starts from the theme button '<li>' to the closing '</ul>'
const navEndRegex = /<li>\s*<button\s*id="theme-toggle"[\s\S]*?title="Alternar tema"[\s\S]*?<\/button>\s*<\/li>\s*<li>\s*<button[\s\S]*?title="Cerrar sesión"[\s\S]*?<\/button>\s*<\/li>\s*<\/ul>/;

const newNavEnd = `<li>
              <button
                class="btn btn-secondary"
                style="
                  padding: 0.4rem;
                  border-radius: 50%;
                  width: 36px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-left: 0.5rem;
                  background-color: transparent;
                  border: 1px solid var(--border);
                  color: var(--text-main);
                "
                onclick="openSettingsModal()"
                title="Ajustes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
            </li>
          </ul>`;

html = html.replace(navEndRegex, newNavEnd);

const modalHTML = `
    <!-- MODAL GENERAL / VISOR DE IMAGEN AMPLIABLE -->
    <div id="modal-overlay" class="modal-overlay">
      <div class="modal-content" id="modal-content"></div>
    </div>

    <!-- MODAL DE AJUSTES -->
    <div id="settings-modal" class="modal-overlay">
      <div class="modal-content" style="max-width: 400px; text-align: left;">
        <button
          onclick="closeSettingsModal()"
          class="btn btn-secondary"
          style="position: absolute; top: 1rem; right: 1rem; width: auto; padding: 0.25rem 0.5rem; font-size: 0.8rem;"
        >
          ✕
        </button>
        <h2 style="color: var(--primary-dark); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Ajustes
        </h2>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background-color: var(--bg-main); border-radius: 8px; border: 1px solid var(--border);">
          <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-main);">Perfil</h3>
          <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong style="color: var(--text-main);">Email:</strong> <span id="settings-email" style="color: var(--text-muted);">Cargando...</span></p>
          <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong style="color: var(--text-main);">Rol:</strong> <span id="settings-rol" style="color: var(--text-muted);">Cargando...</span></p>
          <p style="font-size: 0.9rem;"><strong style="color: var(--text-main);">Proyecto:</strong> <span id="settings-proyecto" style="color: var(--text-muted);">Cargando...</span></p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--text-main);">Personalización</h3>
          <button
            class="btn btn-secondary"
            style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
            onclick="toggleTheme()"
          >
            <svg id="settings-theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Alternar Tema (Claro / Oscuro)
          </button>
        </div>

        <div>
          <button
            class="btn"
            style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background-color: var(--error); border-color: var(--error); color: white;"
            onclick="cerrarSesion()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
`;

html = html.replace(
  '    <!-- MODAL GENERAL / VISOR DE IMAGEN AMPLIABLE -->\n    <div id="modal-overlay" class="modal-overlay">\n      <div class="modal-content" id="modal-content"></div>\n    </div>',
  modalHTML
);

fs.writeFileSync('index.html', html);
