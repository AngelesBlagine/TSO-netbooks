import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(/  container\.innerHTML = tableHtml;\n\}\n\}/, '  container.innerHTML = tableHtml;\n}');

fs.writeFileSync('ui.js', ui);
