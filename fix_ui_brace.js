import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(
  '  setThemeColor(savedColor);\nexport async function openSettingsModal() {',
  '  setThemeColor(savedColor);\n}\n\nexport async function openSettingsModal() {'
);

fs.writeFileSync('ui.js', ui);
console.log('Fixed brace');
