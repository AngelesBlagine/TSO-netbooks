import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const qrwHtml = `
        <div class="card" id="quick-register-wizard" style="margin-top: 2rem;">
          <h2>Registro Rápido de Netbook</h2>
          <p style="color: var(--text-muted); margin-bottom: 1rem;">
            Asistente paso a paso para guardar una nueva intervención.
          </p>
          <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <span id="qrw-step-label">Paso 1 / 8</span>
          </div>
          <div class="progress-bar-container" style="background: var(--bg-main); border-radius: 99px; height: 8px; margin-bottom: 1.5rem; overflow: hidden; position: relative;">
            <div id="qrw-progress" class="progress-bar" style="width: 12.5%; background: var(--primary); height: 100%; transition: width 0.3s ease;"></div>
          </div>
          
          <div id="qrw-step-container" style="min-height: 120px;">
             <!-- Renderizado por JS -->
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem;" id="qrw-btn-prev" onclick="qrwPrev()" disabled>← Anterior</button>
            <button class="btn" style="width: auto; padding: 0.5rem 1rem;" id="qrw-btn-next" onclick="qrwNext()" disabled>Siguiente →</button>
          </div>
        </div>
      </section>`;

html = html.replace('        </div>\n      </section>', '        </div>' + qrwHtml);
fs.writeFileSync('index.html', html);

