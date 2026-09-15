import fs from 'fs';

// 1. Añadir cerrarSesion a auth.js
let auth = fs.readFileSync('auth.js', 'utf8');
const logoutFunc = `
export async function cerrarSesion() {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    window.location.href = "login.html";
  }
}
`;

auth = auth.replace('// Lógica para manejar los formularios', logoutFunc + '\n// Lógica para manejar los formularios');
fs.writeFileSync('auth.js', auth);

// 2. Importar y exponer en main.js
let main = fs.readFileSync('main.js', 'utf8');
main = main.replace('import { checkAuth } from "./auth.js";', 'import { checkAuth, cerrarSesion } from "./auth.js";');
main = main.replace('window.toggleTheme = toggleTheme;', 'window.toggleTheme = toggleTheme;\nwindow.cerrarSesion = cerrarSesion;');
fs.writeFileSync('main.js', main);

// 3. Añadir botón al index.html
let html = fs.readFileSync('index.html', 'utf8');
const logoutBtn = `            <li>
              <button class="btn btn-secondary" style="padding: 0.4rem; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; margin-left: 0.5rem; background-color: transparent; border: 1px solid var(--error); color: var(--error);" onclick="cerrarSesion()" title="Cerrar sesión">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </li>
          </ul>`;
html = html.replace('          </ul>\n        </nav>', logoutBtn + '\n        </nav>');
fs.writeFileSync('index.html', html);
