import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');
ui = ui.replace('export function navigateTo(viewId) {', 'export function navigateTo(viewId) {\n  if (!viewId) return;\n');
fs.writeFileSync('ui.js', ui);

let main = fs.readFileSync('main.js', 'utf8');
main = main.replace(
  'btn.addEventListener("click", () => navigateTo(btn.dataset.target));',
  'if (btn.dataset.target) { btn.addEventListener("click", () => navigateTo(btn.dataset.target)); }'
);
fs.writeFileSync('main.js', main);
