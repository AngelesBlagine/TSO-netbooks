import fs from 'fs';

const missingFuncs = `
export async function cargarRegistros() {
  const tbody = document.getElementById("history-tbody");
  if (!tbody) return;

  tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--text-muted);">Cargando registros...</td></tr>\`;

  if (!supabase) {
    tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--error);">Supabase no está configurado.</td></tr>\`;
    return;
  }

  const { data, error } = await supabase
    .from("registro_reparaciones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--error);">Error al cargar: \${error.message}</td></tr>\`;
    return;
  }

  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = \`<tr><td colspan="10" style="text-align:center; color:var(--text-muted);">No hay equipos registrados.</td></tr>\`;
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement("tr");
    
    let sitColor = "var(--text-main)";
    let sitBg = "var(--border)";
    if (item.situacion_final === "Reparada") {
        sitColor = "var(--primary-dark)";
        sitBg = "var(--primary-light)";
    } else if (item.situacion_final === "Pendiente") {
        sitColor = "#b08500";
        sitBg = "var(--warning-bg)";
    } else if (item.situacion_final === "No reparable") {
        sitColor = "var(--error)";
        sitBg = "#fde8e8";
    }

    tr.innerHTML = \`
      <td>\${item.identificacion || "-"}</td>
      <td>\${item.marca || "-"}</td>
      <td>\${item.n_serie || "-"}</td>
      <td><strong>\${item.generacion || "-"}</strong></td>
      <td>\${item.bloqueada || "-"}</td>
      <td>\${item.bateria || "-"}</td>
      <td>\${item.observaciones || "-"}</td>
      <td><span class="badge" style="background-color:\${sitBg}; color:\${sitColor};">\${item.situacion_final || "-"}</span></td>
      <td>\${item.responsable || "-"}</td>
      <td></td>
    \`;
    tbody.appendChild(tr);
  });
}

export async function agregarFilaManual() {
  const tbody = document.getElementById("history-tbody");
  if (!tbody) return;

  // Si dice "No hay equipos", lo quitamos
  if (tbody.innerHTML.includes("No hay equipos registrados")) {
    tbody.innerHTML = "";
  }

  const { getUserProfile } = await import("./auth.js");
  const profile = await getUserProfile();
  const currentUserEmail = profile ? profile.email : "desconocido@email.com";

  const tr = document.createElement("tr");
  tr.id = "new-row-manual";
  tr.style.backgroundColor = "var(--bg-main)";

  tr.innerHTML = \`
    <td><input type="text" id="new-identificacion" placeholder="ID" style="width:70px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-marca" placeholder="Marca" style="width:90px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-n_serie" placeholder="N° Serie" style="width:100px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-generacion" placeholder="G1, G2..." style="width:70px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td>
        <select id="new-bloqueada" style="padding:0.4rem; border:1px solid var(--border); border-radius:4px; width:60px;">
            <option value="No">No</option>
            <option value="Sí">Sí</option>
        </select>
    </td>
    <td><input type="text" id="new-bateria" placeholder="Batería" style="width:90px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td><input type="text" id="new-observaciones" placeholder="Obs..." style="width:120px; padding:0.4rem; border:1px solid var(--border); border-radius:4px;"></td>
    <td>
        <select id="new-situacion" style="padding:0.4rem; border:1px solid var(--border); border-radius:4px; width:110px;">
            <option value="Reparada">Reparada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="No reparable">No reparable</option>
        </select>
    </td>
    <td><input type="text" id="new-responsable" value="\${currentUserEmail}" readonly style="width:130px; padding:0.4rem; border:1px solid var(--border); border-radius:4px; background-color:var(--bg-main); color:var(--text-muted); cursor:not-allowed;"></td>
    <td style="display:flex; gap:4px;">
        <button class="btn" style="padding:0.4rem 0.6rem; font-size:0.8rem; width:auto;" onclick="guardarFilaManual(this)">Guardar</button>
        <button class="btn btn-secondary" style="padding:0.4rem 0.6rem; font-size:0.8rem; width:auto;" onclick="this.closest('tr').remove()">X</button>
    </td>
  \`;

  tbody.insertBefore(tr, tbody.firstChild);
}

export async function guardarFilaManual(btn) {
  const tr = btn.closest('tr');
  const identificacion = tr.querySelector('#new-identificacion').value;
  const marca = tr.querySelector('#new-marca').value;
  const n_serie = tr.querySelector('#new-n_serie').value;
  const generacion = tr.querySelector('#new-generacion').value;
  const bloqueada = tr.querySelector('#new-bloqueada').value;
  const bateria = tr.querySelector('#new-bateria').value;
  const observaciones = tr.querySelector('#new-observaciones').value;
  const situacion_final = tr.querySelector('#new-situacion').value;
  const responsable = tr.querySelector('#new-responsable').value;

  btn.disabled = true;
  btn.textContent = "...";

  if (!supabase) {
    alert("Error: Supabase no está configurado.");
    btn.disabled = false;
    btn.textContent = "Guardar";
    return;
  }

  const { error } = await supabase.from("registro_reparaciones").insert([
    {
      identificacion,
      marca,
      n_serie,
      generacion,
      bloqueada,
      bateria,
      observaciones,
      situacion_final,
      responsable
    },
  ]);

  if (error) {
    alert("Error al guardar en Supabase: " + error.message);
    btn.disabled = false;
    btn.textContent = "Guardar";
    return;
  }

  await cargarRegistros();
}
`;

let ui = fs.readFileSync('ui.js', 'utf8');

// I will just append to the bottom of the file to be completely sure!
ui = ui + '\n' + missingFuncs;

fs.writeFileSync('ui.js', ui);
