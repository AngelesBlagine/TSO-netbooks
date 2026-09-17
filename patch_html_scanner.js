import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const scannerModal = `
    <!-- Escáner Modal -->
    <div id="scanner-modal" class="modal-overlay" onclick="if(event.target === this) closeScannerModal()">
      <div class="modal-content" style="max-width: 500px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem">
          <h2 style="margin: 0; display:flex; align-items:center; gap:0.5rem; font-size: 1.25rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
            Reconocimiento Visual
          </h2>
          <button class="btn btn-secondary" style="width: auto; padding: 0.5rem; line-height: 1;" onclick="closeScannerModal()">✕</button>
        </div>
        
        <div style="background: #000; height: 200px; border-radius: 8px; margin-bottom: 1.5rem; position: relative; overflow: hidden; display: flex; justify-content:center; align-items:center;">
           <div style="position:absolute; inset:20px; border: 2px dashed rgba(255,255,255,0.4); border-radius:8px;"></div>
           <div style="color:rgba(255,255,255,0.6); font-family: monospace; font-size:0.9rem;">Esperando cámara...</div>
           <div style="position:absolute; bottom:10px; right:10px; color:rgba(255,255,255,0.8); font-size:0.8rem; display:flex; align-items:center; gap:4px;">
              <span style="display:inline-block; width:8px; height:8px; background:red; border-radius:50%; box-shadow: 0 0 4px red;"></span> EN VIVO
           </div>
        </div>

        <div style="background-color: var(--bg-main); border: 1px solid var(--border); padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; gap: 1rem; align-items:flex-start;">
          <div style="font-size: 1.5rem;">🟢</div>
          <div>
            <strong style="display:block; color:var(--text-main); margin-bottom:0.25rem;">Recuadro de detección verde</strong>
            <p style="margin:0; font-size:0.9rem; color:var(--text-muted); line-height:1.4;">Identificación automática en tiempo real de la zona exacta del integrado a intervenir al enfocar la placa.</p>
          </div>
        </div>

        <div style="background-color: var(--bg-main); border: 1px solid var(--border); padding: 1rem; border-radius: 6px; display: flex; gap: 1rem; align-items:flex-start;">
          <div style="font-size: 1.5rem;">🔄</div>
          <div>
            <strong style="display:block; color:var(--text-main); margin-bottom:0.25rem;">Indicador de orientación</strong>
            <p style="margin:0; font-size:0.9rem; color:var(--text-muted); line-height:1.4;">Alerta inteligente que indicará "Dar vuelta la placa" en caso de que el componente buscado se encuentre del lado posterior.</p>
          </div>
        </div>
      </div>
    </div>
`;
html = html.replace('    <script type="module" src="main.js"></script>', scannerModal + '    <script type="module" src="main.js"></script>');
fs.writeFileSync('index.html', html);
