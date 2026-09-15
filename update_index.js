import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove "Registro" nav item
const navItemToRemove = `            <li>
              <button class="nav-btn" data-target="view-registro">
                Registro
              </button>
            </li>`;
html = html.replace(navItemToRemove, '');


// 2. Extract the content of the view-registro card
const registroCardMatch = html.match(/<div class="card">\s*<h2>Registro de Equipos Intervenidos<\/h2>[\s\S]*?<!-- Tabla dinámica renderizada por JS -->\s*<\/div>\s*<\/div>\s*<\/div>/);
if (registroCardMatch) {
  const registroCardHtml = registroCardMatch[0];
  
  // 3. Remove the entire <section id="view-registro">
  const sectionToRemoveRegex = /<section id="view-registro" class="view">[\s\S]*?<\/section>/;
  html = html.replace(sectionToRemoveRegex, '');

  // 4. Inject the card below the #quick-register-wizard card in view-inicio
  const targetInjection = '        </div>\n      </section>'; // End of view-inicio
  const injectionPoint = html.indexOf(targetInjection);
  
  if (injectionPoint !== -1) {
    const newHtml = html.slice(0, injectionPoint) + 
      '\n        <div style="margin-top: 2rem;">\n' + 
      '          ' + registroCardHtml + 
      '\n        </div>\n' + 
      html.slice(injectionPoint);
      
    fs.writeFileSync('index.html', newHtml);
  } else {
    console.error("Could not find injection point.");
  }
} else {
    console.error("Could not find registro card.");
}
