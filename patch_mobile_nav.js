import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const oldMobileRegistro = `        <li>
          <button class="nav-btn" data-target="view-registro">
            📋<br />Registro
          </button>
        </li>`;

const newMobileSettings = `        <li>
          <button class="nav-btn" onclick="openSettingsModal()">
            ⚙️<br />Ajustes
          </button>
        </li>`;

html = html.replace(oldMobileRegistro, newMobileSettings);

fs.writeFileSync('index.html', html);
