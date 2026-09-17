import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Replace the Horario block with regex
// Let's match id="bitacora-horario" and replace the block
let regex = /<div\s+class="form-group"\s+style="flex: 1; min-width: 100px; margin: 0">\s*<label[^>]*>Horario<\/label>\s*<input[^>]*id="bitacora-horario"[^>]*>\s*<\/div>/i;

let match = html.match(regex);
if (match) {
  let replacement = `                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Llegada</label>
                  <input type="time" id="bitacora-horario-desde" class="input-field" style="width: 100%" />
                </div>
                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Salida</label>
                  <input type="time" id="bitacora-horario-hasta" class="input-field" style="width: 100%" />
                </div>`;
  html = html.replace(regex, replacement);
  html = html.replace('<th>Horario</th>', '<th>Llegada - Salida</th>');
  fs.writeFileSync('index.html', html);
  console.log('Patched HTML');
} else {
  console.log('Regex did not match. Trying line replacement...');
  let lines = html.split('\n');
  const start = 274;
  const end = 294;
  let replacement = `                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Llegada</label>
                  <input type="time" id="bitacora-horario-desde" class="input-field" style="width: 100%" />
                </div>
                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Salida</label>
                  <input type="time" id="bitacora-horario-hasta" class="input-field" style="width: 100%" />
                </div>`;
  lines.splice(start, end - start + 1, replacement);
  let newHtml = lines.join('\n');
  newHtml = newHtml.replace('<th>Horario</th>', '<th>Llegada - Salida</th>');
  fs.writeFileSync('index.html', newHtml);
  console.log('Patched using lines');
}
