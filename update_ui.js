import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// The navigateTo("view-inicio") is still correct since everything is in inicio now.
// We can leave irARegistroRapido as is.

fs.writeFileSync('ui.js', ui);
