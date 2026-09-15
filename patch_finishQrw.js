import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const oldFuncRegex = /async function finishQrw\(\) \{[\s\S]*?\n\}/m;

const newFunc = `async function finishQrw() {
  const btnNext = document.getElementById("qrw-btn-next");
  const btnPrev = document.getElementById("qrw-btn-prev");

  btnNext.disabled = true;
  btnPrev.disabled = true;
  btnNext.textContent = "Guardando...";

  try {
    const { getUserProfile } = await import("./auth.js");
    const profile = await getUserProfile();
    const currentUserEmail = profile ? profile.email : "desconocido@email.com";

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec';

    const payload = {
      action: 'add',
      email: currentUserEmail,
      data: {
        identificacion: qrwState.data.identificacion || "",
        marca: qrwState.data.marca || "",
        n_serie: qrwState.data.n_serie || "",
        generacion: qrwState.data.generacion || "",
        bloqueada: qrwState.data.bloqueada || "No",
        bateria: qrwState.data.bateria || "",
        observaciones: qrwState.data.observaciones || "",
        situacion_final: qrwState.data.situacion_final || "Pendiente"
      }
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.success) {
      if (result.errorType === 'ALREADY_TAKEN') {
        const ownerEmail = result.owner || 'otro usuario';
        alert(\`Este equipo ya está asignado a \${ownerEmail}. Te sugerimos buscar otra netbook para reparar.\`);
      } else {
        alert("Error al guardar: " + (result.error || "El ID no existe o ocurrió un error desconocido."));
      }
      btnNext.disabled = false;
      btnNext.textContent = "Finalizar y Guardar";
      btnPrev.disabled = false;
      return;
    }

    // Recargar tabla si está visible
    cargarDesdeSheets();

    // Show confirmation and reset
    const container = document.getElementById("qrw-step-container");
    container.innerHTML = \`
      <div style="text-align: center; padding: 2rem 0;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h3 style="color: var(--primary-dark); margin-bottom: 0.5rem;">¡Registro guardado!</h3>
        <p style="color: var(--text-muted);">El equipo fue ingresado correctamente a la base de datos.</p>
        <button class="btn" style="margin-top: 1.5rem; width: auto;" onclick="initQrw()">Registrar otro equipo</button>
      </div>
    \`;

    btnNext.style.display = "none";
    btnPrev.style.display = "none";
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error de red al intentar guardar los datos.");
    btnNext.disabled = false;
    btnNext.textContent = "Finalizar y Guardar";
    btnPrev.disabled = false;
  }
}`;

ui = ui.replace(oldFuncRegex, newFunc);
fs.writeFileSync('ui.js', ui);
