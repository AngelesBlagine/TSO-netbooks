import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const oldRegex = /export async function liberarEquipo\(identificacion, userEmail\) \{[\s\S]*?\}\n\nexport function toggleTheme\(\)/m;

const newFuncs = `export function liberarEquipo(identificacion, userEmail) {
  const modal = document.getElementById("liberar-modal");
  if (!modal) return;
  
  // Set hidden values
  document.getElementById("liberar-hidden-id").value = identificacion;
  document.getElementById("liberar-hidden-email").value = userEmail;
  
  // Reset input and button
  const input = document.getElementById("liberar-input-confirm");
  input.value = "";
  document.getElementById("liberar-btn-confirm").disabled = true;
  
  modal.classList.add("active");
}

export function closeLiberarModal() {
  const modal = document.getElementById("liberar-modal");
  if (modal) modal.classList.remove("active");
}

export function checkLiberarInput() {
  const input = document.getElementById("liberar-input-confirm");
  const btn = document.getElementById("liberar-btn-confirm");
  if (input.value === "liberar equipo") {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

export async function confirmLiberarEquipo() {
  const identificacion = document.getElementById("liberar-hidden-id").value;
  const userEmail = document.getElementById("liberar-hidden-email").value;
  const btn = document.getElementById("liberar-btn-confirm");
  
  btn.disabled = true;
  btn.textContent = "Liberando...";
  
  try {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";
    const payload = { action: "delete", email: userEmail, id: identificacion };
    
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    if (result.success) {
      closeLiberarModal();
      alert("Equipo liberado exitosamente.");
      
      // La instrucción pide: "vacía la casilla 'Email del Responsable' en la vista y elimina la fila de la tabla del usuario."
      // Podemos simplemente recargar la tabla de sheets
      await cargarDesdeSheets();
    } else {
      alert("Error al liberar el equipo: " + (result.error || "Desconocido"));
      btn.disabled = false;
      btn.textContent = "Confirmar";
    }
  } catch (error) {
    console.error("Error liberando equipo:", error);
    alert("Error de red al intentar liberar el equipo.");
    btn.disabled = false;
    btn.textContent = "Confirmar";
  }
}

export function toggleTheme()`;

ui = ui.replace(oldRegex, newFuncs);
fs.writeFileSync('ui.js', ui);
