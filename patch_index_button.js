import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const oldRegistroHeader = `<div style="margin-bottom: 1.5rem">
            <button
              class="btn"
              style="width: auto; margin-bottom: 1rem"
              onclick="cargarDesdeSheets()"
              id="btn-load-sheets"
            >
              Ver equipos intervenidos (Historial Google Sheets)
            </button>`;

const newRegistroHeader = `<div style="margin-bottom: 1.5rem">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
              <button
                class="btn"
                style="width: auto;"
                onclick="irARegistroRapido()"
              >
                + Registrar Equipo
              </button>
              <button
                class="btn btn-secondary"
                style="width: auto;"
                onclick="cargarDesdeSheets()"
                id="btn-load-sheets"
              >
                Ver equipos intervenidos (Historial Google Sheets)
              </button>
            </div>`;

html = html.replace(oldRegistroHeader, newRegistroHeader);
fs.writeFileSync('index.html', html);
