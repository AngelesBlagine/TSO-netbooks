import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// The original HTML for Horario
// I'll search for id="bitacora-horario" and its container, but it's easier to find the surrounding context.
const formStart = '<div class="form-group" style="flex: 1; min-width: 120px; margin: 0;">';
const btnAddStart = '<button class="btn" id="bitacora-btn-add"';

// Actually, let's just use regex or replace the specific div containing bitacora-horario.
html = html.replace(
  /<div\s+class="form-group"\s+style="flex: 1; min-width: 100px; margin: 0">\s*<label[^>]*>Horario<\/label>\s*<input\s+type="time"\s+id="bitacora-horario"[^>]*>\s*<\/div>/i,
  \`<div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Llegada</label>
                  <input type="time" id="bitacora-horario-desde" class="input-field" style="width: 100%" />
                </div>
                <div class="form-group" style="flex: 1; min-width: 100px; margin: 0">
                  <label style="display: block; margin-bottom: 0.5rem; color: var(--text-main); font-size: 0.85rem; font-weight: 500;">Salida</label>
                  <input type="time" id="bitacora-horario-hasta" class="input-field" style="width: 100%" />
                </div>\`
);

// We need to be careful with newlines and spaces due to prettier. Let's use a simpler approach.
fs.writeFileSync('update_html.js', html);
