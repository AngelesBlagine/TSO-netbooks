import fs from 'fs';

// 1. Modificar ui.js
let ui = fs.readFileSync('ui.js', 'utf8');
const settingsLogic = `
export async function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.add("active");
    try {
      const { getUserProfile } = await import("./auth.js");
      const profile = await getUserProfile();
      if (profile) {
        document.getElementById("settings-email").textContent = profile.email;
        document.getElementById("settings-rol").textContent = profile.rol;
        document.getElementById("settings-proyecto").textContent = profile.proyecto;
      }
    } catch (e) {
      console.error("Error al cargar perfil:", e);
      document.getElementById("settings-email").textContent = "Error al cargar";
      document.getElementById("settings-rol").textContent = "Error al cargar";
      document.getElementById("settings-proyecto").textContent = "Error al cargar";
    }
  }
}

export function closeSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}
`;
ui += '\n' + settingsLogic;
fs.writeFileSync('ui.js', ui);

// 2. Modificar main.js
let main = fs.readFileSync('main.js', 'utf8');
main = main.replace('initTheme,', 'initTheme,\n  openSettingsModal,\n  closeSettingsModal,');
main = main.replace('window.toggleTheme = toggleTheme;', 'window.toggleTheme = toggleTheme;\nwindow.openSettingsModal = openSettingsModal;\nwindow.closeSettingsModal = closeSettingsModal;');
fs.writeFileSync('main.js', main);

