import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const visualGuideHTML = `
        <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);" id="home-visual-guide">
          <h3 style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 1rem;">
             🔍 Guía Visual (Próximamente)
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
            Selecciona la generación de la netbook para indicar qué placa madre se va a analizar.
          </p>
          
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom: 1.5rem;" id="home-gen-selector">
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G1</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G2</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G3</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G4</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G5</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G6</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G7</button>
            <button class="btn btn-secondary home-gen-btn" style="width:auto; padding:0.5rem 1rem;" onclick="selectHomeGen(this)">G8</button>
          </div>
          
          <div style="position:relative; background-color: var(--bg-body); border-radius: 8px; border: 1px dashed var(--border); padding: 2rem; text-align: center; margin-bottom: 1.5rem; overflow: hidden;">
             <div style="position:absolute; inset:0; background:var(--bg-main); opacity:0.85; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:2;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted); margin-bottom:0.5rem;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span style="font-weight:600; color:var(--text-main);">Contenido Protegido / Próximamente</span>
             </div>
             
             <div style="opacity:0.3; filter:blur(2px);">
                <div style="height: 100px; background:var(--border); margin-bottom: 1rem; border-radius: 4px;"></div>
                <div style="height: 60px; background:var(--border); width: 60%; margin: 0 auto; border-radius: 4px;"></div>
             </div>
          </div>
          
          <button class="btn" style="width: 100%; display:flex; justify-content:center; align-items:center; gap:0.5rem;" onclick="openScannerModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
              Escanear Placa
          </button>
        </div>
`;

html = html.replace(
  '        </div>\n        <div class="card" id="quick-register-wizard"',
  '        </div>\n' + visualGuideHTML + '        <div class="card" id="quick-register-wizard"'
);

fs.writeFileSync('index.html', html);

// Update ui.js
let ui = fs.readFileSync('ui.js', 'utf8');

const newUIRenderLogic = `          \${["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]
            .map((g) => {
                if (g === gen.id) {
                   return \\\`<button class="btn btn-primary" style="width:auto; padding:0.5rem 1rem; cursor:default;">\${g}</button>\\\`;
                } else {
                   return \\\`<button class="btn btn-secondary" disabled style="width:auto; padding:0.5rem 1rem; opacity:0.6; cursor:not-allowed;">\${g}</button>\\\`;
                }
            })
            .join("")}`;

ui = ui.replace(
  /\$\{\["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"\]\s*\.map\(\s*\(g\) =>\s*`<button class="btn btn-secondary" disabled style="width:auto; padding:0.5rem 1rem; opacity:0\.6; cursor:not-allowed;">\$\{g\}<\/button>`,\s*\)\s*\.join\(""\)\}/,
  newUIRenderLogic
);

// Add selectHomeGen
ui += `
export function selectHomeGen(btn) {
  const container = document.getElementById("home-gen-selector");
  if (!container) return;
  const buttons = container.querySelectorAll(".home-gen-btn");
  buttons.forEach(b => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-secondary");
  });
  btn.classList.remove("btn-secondary");
  btn.classList.add("btn-primary");
}
`;
fs.writeFileSync('ui.js', ui);

// Update main.js
let main = fs.readFileSync('main.js', 'utf8');
main = main.replace('openScannerModal,', 'openScannerModal,\n  selectHomeGen,');
main = main.replace('window.openScannerModal = openScannerModal;', 'window.openScannerModal = openScannerModal;\nwindow.selectHomeGen = selectHomeGen;');
fs.writeFileSync('main.js', main);

console.log('Update applied');
