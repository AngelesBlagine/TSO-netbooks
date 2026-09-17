import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(
  'return \\`<button class="btn btn-primary" style="width:auto; padding:0.5rem 1rem; cursor:default;">${g}</button>\\`;',
  'return \'<button class="btn btn-primary" style="width:auto; padding:0.5rem 1rem; cursor:default;">\' + g + \'</button>\';'
);

ui = ui.replace(
  'return \\`<button class="btn btn-secondary" disabled style="width:auto; padding:0.5rem 1rem; opacity:0.6; cursor:not-allowed;">${g}</button>\\`;',
  'return \'<button class="btn btn-secondary" disabled style="width:auto; padding:0.5rem 1rem; opacity:0.6; cursor:not-allowed;">\' + g + \'</button>\';'
);

fs.writeFileSync('ui.js', ui);
