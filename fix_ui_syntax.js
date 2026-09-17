import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

ui = ui.replace(
  '} else {\n    // Show moon for light theme (to switch to dark)\n    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;\n  }\n}',
  ''
);

fs.writeFileSync('ui.js', ui);
console.log('Fixed syntax error');
