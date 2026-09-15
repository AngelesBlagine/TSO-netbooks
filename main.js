import { checkAuth, cerrarSesion } from "./auth.js";
import {
  initQrw,
  qrwNext,
  qrwPrev,
  checkQrwInput,
  aplicarModoExposicion,
  navigateTo,
  startWizard,
  selectWizardOption,
  prevWizardStep,
  handleNoMatch,
  loadProcedure,
  toggleStep,
  openZoomImage,
  openGenModal,
  openRegisterModal,
  closeModal,
  cargarDesdeSheets,
  liberarEquipo,
  renderGeneracionesCatalog,
  toggleTheme,
  initTheme,
  openSettingsModal,
  closeSettingsModal,
} from "./ui.js";

// Exponer funciones globales para los atributos 'onclick' en el HTML
window.navigateTo = navigateTo;
window.startWizard = startWizard;
window.selectWizardOption = selectWizardOption;
window.prevWizardStep = prevWizardStep;
window.handleNoMatch = handleNoMatch;
window.loadProcedure = loadProcedure;
window.toggleStep = toggleStep;
window.openZoomImage = openZoomImage;
window.openGenModal = openGenModal;
window.openRegisterModal = openRegisterModal;
window.closeModal = closeModal;
window.cargarDesdeSheets = cargarDesdeSheets;
window.liberarEquipo = liberarEquipo;
window.toggleTheme = toggleTheme;
window.openSettingsModal = openSettingsModal;
window.initQrw = initQrw;
window.qrwNext = qrwNext;
window.qrwPrev = qrwPrev;
window.checkQrwInput = checkQrwInput;
window.closeSettingsModal = closeSettingsModal;
window.cerrarSesion = cerrarSesion;

window.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  // Para evitar destellos de la interfaz, la ocultamos hasta validar la sesión
  document.body.style.display = "none";

  // 1. Validar autenticación con Supabase antes de cargar el contenido
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    // checkAuth ya se encarga de redirigir, detenemos la carga de la vista
    return;
  }

  // Mostrar la interfaz si la validación es correcta
  document.body.style.display = "";

  renderGeneracionesCatalog();
  initQrw();
  aplicarModoExposicion();

  // Listeners para botones de navegación
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.target));
  });
});
