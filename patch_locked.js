import fs from 'fs';

// 1. Modificar ui.js
let ui = fs.readFileSync('ui.js', 'utf8');

// Eliminar el ocultamiento de aplicarModoExposicion
ui = ui.replace(
  /export function aplicarModoExposicion\(\) \{[\s\S]*?\}\s*export let wizardState/m,
  `export function aplicarModoExposicion() {
  // Ya no ocultamos el contenedor HTML entero.
  // La validación ahora se maneja en loadProcedure() para inyectar la tarjeta de bloqueo.
}

export let wizardState`
);

// Modificar loadProcedure
const lockCardHTML = `
  if (CONFIG.MODO_EXPOSICION) {
    container.innerHTML = \`
      <div class="card locked-card">
          <div class="locked-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
          </div>
          <h3>Contenido Protegido: Solicite Acceso</h3>
          <span class="locked-subtitle">Próximamente</span>
          <p>El procedimiento técnico detallado se encuentra restringido por motivos de seguridad en esta versión.</p>
      </div>
    \`;
    navigateTo("view-procedimiento");
    return;
  }
`;

const loadProcedureRegex = /container\.innerHTML = "";\s*document\.getElementById\("procedure-completion-card"\)\.style\.display = "none";/;

ui = ui.replace(loadProcedureRegex, `container.innerHTML = "";\n  document.getElementById("procedure-completion-card").style.display = "none";\n${lockCardHTML}`);

fs.writeFileSync('ui.js', ui);

// 2. Add CSS
let css = fs.readFileSync('styles.css', 'utf8');
const lockedCSS = `
/* Locked Card Styles */
.locked-card {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 2px dashed var(--border);
  background-color: transparent;
  margin-top: 2rem;
}

.locked-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.locked-card h3 {
  color: var(--text-main);
  margin: 0;
  font-size: 1.35rem;
}

.locked-subtitle {
  color: var(--warning);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background-color: var(--warning-bg);
  padding: 0.4rem 1rem;
  border-radius: 16px;
}

.locked-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  max-width: 450px;
  margin-top: 0.5rem;
  line-height: 1.6;
}
`;

css += lockedCSS;
fs.writeFileSync('styles.css', css);
