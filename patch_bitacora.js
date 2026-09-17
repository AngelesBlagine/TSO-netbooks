import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const targetStr = \`                <div
                  class="form-group"
                  style="flex: 1; min-width: 100px; margin: 0"
                >
                  <label
                    style="
                      display: block;
                      margin-bottom: 0.5rem;
                      color: var(--text-main);
                      font-size: 0.85rem;
                      font-weight: 500;
                    "
                    >Horario</label
                  >
                  <input
                    type="time"
                    id="bitacora-horario"
                    class="input-field"
                    style="width: 100%"
                  />
                </div>\`;

const newInputs = \`                <div
                  class="form-group"
                  style="flex: 1; min-width: 100px; margin: 0"
                >
                  <label
                    style="
                      display: block;
                      margin-bottom: 0.5rem;
                      color: var(--text-main);
                      font-size: 0.85rem;
                      font-weight: 500;
                    "
                    >Llegada</label
                  >
                  <input
                    type="time"
                    id="bitacora-horario-desde"
                    class="input-field"
                    style="width: 100%"
                  />
                </div>
                <div
                  class="form-group"
                  style="flex: 1; min-width: 100px; margin: 0"
                >
                  <label
                    style="
                      display: block;
                      margin-bottom: 0.5rem;
                      color: var(--text-main);
                      font-size: 0.85rem;
                      font-weight: 500;
                    "
                    >Salida</label
                  >
                  <input
                    type="time"
                    id="bitacora-horario-hasta"
                    class="input-field"
                    style="width: 100%"
                  />
                </div>\`;

html = html.replace(targetStr, newInputs);
html = html.replace('<th>Horario</th>', '<th>Llegada - Salida</th>');
fs.writeFileSync('index.html', html);
