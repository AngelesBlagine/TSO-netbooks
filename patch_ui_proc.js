import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

// 1. Remove from renderAccordionInfo
ui = ui.replace(
  /<strong>Procedimiento técnico:<\/strong>\s*<p style="font-size: 0\.9rem; color: var\(--primary-dark\);">\$\{g\.procedimiento\.join\(" \| "\)\}<\/p>/g,
  ''
);

// 2. Remove from openGenModal
ui = ui.replace(
  /<h4>Procedimiento Técnico \(Resumen\)<\/h4>\s*<p style="font-size:0\.9rem; margin-bottom:1\.5rem;">\$\{g\.procedimiento\.join\("<br>"\)\}<\/p>/g,
  ''
);

fs.writeFileSync('ui.js', ui);
