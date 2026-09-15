import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const newFunc = `
export function irARegistroRapido() {
  navigateTo('view-inicio');
  initQrw();
  setTimeout(() => {
    const wizard = document.getElementById('quick-register-wizard');
    if (wizard) {
      wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}
`;

ui += newFunc;
fs.writeFileSync('ui.js', ui);
