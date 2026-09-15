import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace('innerHTML = \\`', 'innerHTML = `');
ui = ui.replace('    \\`;', '    `;');

fs.writeFileSync('ui.js', ui);
