const fs = require('fs');

let lines = fs.readFileSync('index.html', 'utf8').split('\n');
const start = 274; // 275 in 1-based is index 274
const end = 294;   // 295 in 1-based is index 294

const newHtml = \`                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Llegada</label>
                  <input type="time" id="bitacora-horario-desde" class="input-field" style="width: 100%" />
                </div>
                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Salida</label>
                  <input type="time" id="bitacora-horario-hasta" class="input-field" style="width: 100%" />
                </div>\`;

lines.splice(start, end - start + 1, newHtml);

let html = lines.join('\n');
html = html.replace('<th>Horario</th>', '<th>Llegada - Salida</th>');

fs.writeFileSync('index.html', html);
