import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const bitacoraSection = `
          <!-- BITACORA DE TRABAJO -->
          <div style="margin-top: 2rem">
            <div class="card">
              <h2>Bitácora de Trabajo (Control de Horas)</h2>
              <p style="color: var(--text-muted); margin-bottom: 1rem">
                Registrá tus horas de trabajo de forma local. Estos datos se guardan únicamente en este dispositivo.
              </p>
              
              <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: flex-end;">
                <input type="hidden" id="bitacora-edit-id" value="" />
                <div class="form-group" style="flex: 1; min-width: 120px; margin: 0;">
                  <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Fecha</label>
                  <input type="date" id="bitacora-fecha" class="input-field" style="width: 100%;" />
                </div>
                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0;">
                  <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Horario</label>
                  <input type="time" id="bitacora-horario" class="input-field" style="width: 100%;" />
                </div>
                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0;">
                  <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Duración (Hs)</label>
                  <input type="number" step="0.5" id="bitacora-duracion" class="input-field" style="width: 100%;" placeholder="Ej: 2.5" />
                </div>
                <div class="form-group" style="flex: 2; min-width: 200px; margin: 0;">
                  <label style="display:block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Trabajo Realizado</label>
                  <input type="text" id="bitacora-trabajo" class="input-field" style="width: 100%;" placeholder="Ej: Desbloqueo y flasheo G5..." />
                </div>
                <button class="btn" id="bitacora-btn-add" style="width: auto; height: 42px;" onclick="addBitacoraRecord()">Añadir</button>
                <button class="btn btn-secondary" id="bitacora-btn-cancel" style="width: auto; height: 42px; display: none;" onclick="cancelBitacoraEdit()">Cancelar</button>
              </div>

              <div style="overflow-x: auto; border: 1px solid var(--border); border-radius: 8px;">
                <table class="history-table" style="min-width: 600px; font-size: 0.85rem; width: 100%; margin-top: 0;">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Duración (Hs)</th>
                      <th>Trabajo Realizado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="bitacora-tbody">
                    <!-- Filas renderizadas por JS -->
                    <tr><td colspan="5" style="text-align:center; padding: 1rem; color: var(--text-muted);">Cargando bitácora...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
`;

// Insert the bitacora Section right before the end of the view-inicio section.
const endOfSection = '        </div>\n      </section>';
if (html.includes(endOfSection)) {
  html = html.replace(endOfSection, bitacoraSection + '\n' + endOfSection);
  fs.writeFileSync('index.html', html);
  console.log('Bitacora added to index.html');
} else {
  console.log('Could not find injection point');
}
