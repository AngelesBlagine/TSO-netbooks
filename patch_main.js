import fs from 'fs';
let main = fs.readFileSync('main.js', 'utf8');

main = main.replace('cargarRegistros,', 'cargarRegistros,\n  toggleTheme,\n  initTheme,');
main = main.replace('window.cargarRegistros = cargarRegistros;', 'window.cargarRegistros = cargarRegistros;\nwindow.toggleTheme = toggleTheme;');

main = main.replace('window.addEventListener("DOMContentLoaded", async () => {', 'window.addEventListener("DOMContentLoaded", async () => {\n  initTheme();');

fs.writeFileSync('main.js', main);
