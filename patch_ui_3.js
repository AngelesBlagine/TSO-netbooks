import fs from "fs";
let content = fs.readFileSync("ui.js", "utf8");

const regex =
  /export function getHistory\(\) \{[\s\S]*\}\s*export function clearHistory\(\) \{[\s\S]*?\}/m;

const newRest = `export function getHistory() {
  return [];
}

export async function saveRecord() {
  const btn = document.getElementById("btn-save-record");
  if(btn) {
    btn.disabled = true;
    btn.textContent = "Guardando...";
  }

  const gen = document.getElementById("reg-input-gen")?.value || "N/A";
  const marca = document.getElementById("reg-input-marca")?.value || "N/A";
  const estado = document.getElementById("reg-input-estado")?.value || "N/A";
  const detalles = document.getElementById("reg-input-detalles")?.value || "-";

  if (!supabase) {
    alert("Error: Supabase no está configurado.");
    if(btn) { btn.disabled = false; btn.textContent = "Guardar Registro"; }
    return;
  }

  const { error } = await supabase
    .from('registro_reparaciones')
    .insert([{
        generacion: gen,
        marca: marca,
        estado: estado,
        detalles: detalles
    }]);

  if (error) {
    alert("Error al guardar en Supabase: " + error.message);
    if(btn) { btn.disabled = false; btn.textContent = "Guardar Registro"; }
    return;
  }

  closeModal();
  await cargarRegistros();
  navigateTo("view-registro");
}

export async function cargarRegistros() {
  const tbody = document.getElementById("history-tbody");
  if(!tbody) return;
  
  tbody.innerHTML = \`<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Cargando registros...</td></tr>\`;

  if (!supabase) {
    tbody.innerHTML = \`<tr><td colspan="5" style="text-align:center; color:var(--error);">Supabase no está configurado.</td></tr>\`;
    return;
  }

  const { data, error } = await supabase
    .from('registro_reparaciones')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = \`<tr><td colspan="5" style="text-align:center; color:var(--error);">Error al cargar: \${error.message}</td></tr>\`;
    return;
  }

  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = \`<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No hay equipos registrados.</td></tr>\`;
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement("tr");
    
    let fechaFormateada = "N/A";
    if (item.created_at) {
        fechaFormateada = new Date(item.created_at).toLocaleDateString();
    }
    
    let badgeColor = "var(--border)";
    let textColor = "var(--text-main)";
    if (item.estado === "Reparada") {
      badgeColor = "var(--primary-light)";
      textColor = "var(--primary-dark)";
    } else if (item.estado === "Pendiente") {
      badgeColor = "var(--warning-bg)";
      textColor = "#b08500";
    } else if (item.estado === "No reparable") {
      badgeColor = "#fde8e8";
      textColor = "var(--error)";
    }

    tr.innerHTML = \`
      <td>\${fechaFormateada}</td>
      <td><strong>\${item.generacion}</strong></td>
      <td>\${item.marca || '-'}</td>
      <td><span class="badge" style="background-color: \${badgeColor}; color: \${textColor};">\${item.estado || '-'}</span></td>
      <td>\${item.detalles || '-'}</td>
    \`;
    tbody.appendChild(tr);
  });
}

export function clearHistory() {
  alert("La eliminación está deshabilitada (se usa BD remota).");
}`;

content = content.replace(regex, newRest);
fs.writeFileSync("ui.js", content);
