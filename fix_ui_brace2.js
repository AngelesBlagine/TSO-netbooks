import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(
  /setThemeColor\(savedColor\);\s*export async function openSettingsModal/g,
  'setThemeColor(savedColor);\n}\n\nexport async function openSettingsModal'
);

fs.writeFileSync('ui.js', ui);
console.log('Fixed brace using regex');
