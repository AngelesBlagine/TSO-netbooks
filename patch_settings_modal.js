import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const personalizationBlock = `
        <div
          style="
            margin-bottom: 1.5rem;
            padding: 1rem;
            background-color: var(--bg-main);
            border-radius: 8px;
            border: 1px solid var(--border);
          "
        >
          <h3
            style="
              font-size: 1rem;
              margin-bottom: 1rem;
              color: var(--text-main);
            "
          >
            Personalización
          </h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Apariencia</label>
            <div class="mode-toggle">
              <button id="theme-btn-light" class="active" onclick="setThemeMode('light')">☀️ Claro</button>
              <button id="theme-btn-dark" onclick="setThemeMode('dark')">🌙 Oscuro</button>
            </div>
          </div>
          
          <div>
            <label style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Color de Acento</label>
            <div class="theme-options">
              <div class="swatch active" id="swatch-coral" style="background-color: #F06E55;" onclick="setThemeColor('coral')"></div>
              <div class="swatch" id="swatch-indigo" style="background-color: #4F46E5;" onclick="setThemeColor('indigo')"></div>
              <div class="swatch" id="swatch-borgona" style="background-color: #8A1538;" onclick="setThemeColor('borgona')"></div>
            </div>
          </div>
        </div>
`;

html = html.replace(
  '            <span id="settings-proyecto" style="color: var(--text-muted)"\n              >Cargando...</span\n            >\n          </p>\n        </div>',
  '            <span id="settings-proyecto" style="color: var(--text-muted)"\n              >Cargando...</span\n            >\n          </p>\n        </div>\n' + personalizationBlock
);

fs.writeFileSync('index.html', html);
console.log('Settings modal updated');
