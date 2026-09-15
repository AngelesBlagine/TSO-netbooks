import { checkAuth } from "./auth.js";
import {
  aplicarModoExposicion,
  navigateTo,
  startWizard,
  selectWizardOption,
  prevWizardStep,
  handleNoMatch,
  loadProcedure,
  toggleStep,
  toggleAccordion,
  openZoomImage,
  openGenModal,
  openRegisterModal,
  closeModal,
  openExternalRegister,
  saveRecord,
  clearHistory,
  renderGeneracionesCatalog,
  renderAccordionInfo,
  cargarRegistros,
} from "./ui.js";

// Exponer funciones globales para los atributos 'onclick' en el HTML
window.navigateTo = navigateTo;
window.startWizard = startWizard;
window.selectWizardOption = selectWizardOption;
window.prevWizardStep = prevWizardStep;
window.handleNoMatch = handleNoMatch;
window.loadProcedure = loadProcedure;
window.toggleStep = toggleStep;
window.toggleAccordion = toggleAccordion;
window.openZoomImage = openZoomImage;
window.openGenModal = openGenModal;
window.openRegisterModal = openRegisterModal;
window.closeModal = closeModal;
window.openExternalRegister = openExternalRegister;
window.saveRecord = saveRecord;
window.clearHistory = clearHistory;
window.cargarRegistros = cargarRegistros;

window.addEventListener("DOMContentLoaded", async () => {
  // 1. Validar autenticación con Supabase antes de cargar el contenido
  await checkAuth();

  renderGeneracionesCatalog();
  renderAccordionInfo();
  cargarRegistros();
  aplicarModoExposicion();

  // Listeners para botones de navegación
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.target));
  });
});
