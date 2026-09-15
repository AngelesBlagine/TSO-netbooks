import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const oldHtml = `<p style="color: var(--text-muted); margin-bottom: 1rem">
            Accedé a la planilla oficial externa o consultá las intervenciones
            guardadas localmente.
          </p>
          <button
            class="btn"
            style="width: auto; margin-bottom: 1.5rem"
            onclick="openExternalRegister()"
          >
            Abrir registro externo ↗
          </button>`;

const newHtml = `<p style="color: var(--text-muted); margin-bottom: 1rem">
            Consultá tus intervenciones guardadas en el sistema o recuperá tu historial antiguo desde la planilla.
          </p>
          <div style="margin-bottom: 1.5rem">
            <button
              class="btn"
              style="width: auto; margin-bottom: 1rem"
              onclick="cargarDesdeSheets()"
              id="btn-load-sheets"
            >
              Ver equipos intervenidos (Historial Google Sheets)
            </button>
            <div id="sheets-data-container" style="display: none; overflow-x: auto; border: 1px solid var(--border); border-radius: 8px; padding: 1rem;">
               <!-- Tabla dinámica renderizada por JS -->
            </div>
          </div>`;

html = html.replace(oldHtml, newHtml);

// If the regex replacement failed (e.g. whitespace issues), let's use a simpler approach.
if (!html.includes('cargarDesdeSheets')) {
  console.log("Regex failed, trying simpler replacement");
  html = html.replace(/<p style="color: var\(--text-muted\); margin-bottom: 1rem">[\s\S]*?Abrir registro externo ↗\s*<\/button>/m, newHtml);
}

fs.writeFileSync('index.html', html);
