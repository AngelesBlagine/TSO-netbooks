import fs from 'fs';

// 1. Update styles.css
let css = fs.readFileSync('styles.css', 'utf8');
const verdeCss = `
/* data-theme-color="verde" */
[data-theme-mode="light"][data-theme-color="verde"] {
  --primary: #249b7a;
  --primary-dark: #176b59;
  --primary-light: #e5f4ef;
}
[data-theme-mode="dark"][data-theme-color="verde"] {
  --primary: #2ebc96;
  --primary-dark: #249b7a;
  --primary-light: #1f3832;
}
`;
// insert before the backwards compatibility block or at the end of the colors
css = css.replace('/* Backwards compatibility', verdeCss + '\n/* Backwards compatibility');
fs.writeFileSync('styles.css', css);

// 2. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const newSwatch = '              <div class="swatch" id="swatch-verde" style="background-color: #249b7a;" onclick="setThemeColor(\'verde\')"></div>\n              <div class="swatch active" id="swatch-coral"';
html = html.replace('              <div class="swatch active" id="swatch-coral"', newSwatch);
fs.writeFileSync('index.html', html);

// 3. Update ui.js
let ui = fs.readFileSync('ui.js', 'utf8');
ui = ui.replace('const swatches = ["coral", "indigo", "borgona"];', 'const swatches = ["coral", "indigo", "borgona", "verde"];');
fs.writeFileSync('ui.js', ui);

console.log('Verde theme added');
