import fs from 'fs';

// Modificar index.html
let html = fs.readFileSync('index.html', 'utf8');

// 1. Quitar del menú de navegación
html = html.replace(
/            <li>\s*<button class="nav-btn" data-target="view-informacion">\s*Información\s*<\/button>\s*<\/li>/g,
''
);

// 2. Quitar el quick-card del inicio
html = html.replace(
/          <div class="quick-card" onclick="navigateTo\('view-informacion'\)">\s*<h3>📖 Guía técnica ampliatoria<\/h3>\s*<p>\s*Detalles sobre componentes, placas madre e indicadores visuales.\s*<\/p>\s*<\/div>/g,
''
);

// 3. Quitar la sección completa
html = html.replace(
/      <!-- INFORMACIÓN GENERAL -->\s*<section id="view-informacion" class="view">\s*<h2 style="margin-bottom: 1rem">Información General y Referencias<\/h2>\s*<div id="accordion-container"><\/div>\s*<\/section>/g,
''
);

fs.writeFileSync('index.html', html);

// Modificar main.js
let main = fs.readFileSync('main.js', 'utf8');
main = main.replace(/,\s*renderAccordionInfo/g, '');
main = main.replace(/,\s*toggleAccordion/g, '');
main = main.replace(/\s*window\.toggleAccordion = toggleAccordion;/g, '');
main = main.replace(/\s*renderAccordionInfo\(\);/g, '');
fs.writeFileSync('main.js', main);

