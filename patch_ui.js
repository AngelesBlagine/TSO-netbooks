import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

// The functions might be multi-line so we can use a script. Or just leave them since they're harmless without the HTML.
