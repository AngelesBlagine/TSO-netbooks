import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const oldTable = `<div style="overflow-x: auto">
            <table class="history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Generación</th>
                  <th>Marca</th>
                  <th>Estado</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody id="history-tbody"></tbody>
            </table>
          </div>`;

const newTable = `<div style="overflow-x: auto">
            <button
              class="btn"
              style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-bottom: 1rem;"
              onclick="agregarFilaManual()"
            >
              + Agregar Fila
            </button>
            <table class="history-table" style="min-width: 900px; font-size: 0.85rem;">
              <thead>
                <tr>
                  <th>Identificación</th>
                  <th>Marca</th>
                  <th>N° de Serie</th>
                  <th>Generación</th>
                  <th>Bloqueada</th>
                  <th>Batería</th>
                  <th>Observaciones</th>
                  <th>Situación Final</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="history-tbody"></tbody>
            </table>
          </div>`;

html = html.replace(/<div style="overflow-x: auto">[\s\S]*?<\/table>\s*<\/div>/, newTable);

fs.writeFileSync('index.html', html);
