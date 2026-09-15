import { supabase } from "./supabaseClient.js";
import { CONFIG, REGISTRO_URL } from "./config.js";
import { generaciones, wizardQuestions } from "./generaciones.js";

export function aplicarModoExposicion() {
  // Ya no ocultamos el contenedor HTML entero.
  // La validación ahora se maneja en loadProcedure() para inyectar la tarjeta de bloqueo.
}

export let wizardState = { step: 0, answers: {} };
export let activeProcedureGen = null;
export let currentChecklistStatus = [];

export function navigateTo(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((el) => el.classList.remove("active"));
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    if (btn.dataset.target === viewId) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  window.scrollTo(0, 0);
}

export function startWizard() {
  wizardState.step = 0;
  wizardState.answers = {};
  renderWizardStep();
  navigateTo("view-identificar");
}

export function renderWizardStep() {
  const q = wizardQuestions[wizardState.step];
  const total = wizardQuestions.length; // 4 preguntas
  const percent = Math.round(((wizardState.step + 1) / total) * 100);

  document.getElementById("wizard-step-label").textContent =
    `Pregunta ${wizardState.step + 1} de ${total}`;
  document.getElementById("wizard-percent-label").textContent = `${percent}%`;
  document.getElementById("wizard-progress").style.width = `${percent}%`;

  document.getElementById("question-title").textContent = q.title;
  const container = document.getElementById("question-options");
  container.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.textContent = opt.label;
    btn.onclick = () => selectWizardOption(q.key, opt.value);
    container.appendChild(btn);
  });

  document.getElementById("btn-wizard-prev").disabled = wizardState.step === 0;
}

export function selectWizardOption(key, value) {
  wizardState.answers[key] = value;
  if (wizardState.step < wizardQuestions.length - 1) {
    wizardState.step++;
    renderWizardStep();
  } else {
    evaluateWizardResults();
  }
}

export function prevWizardStep() {
  if (wizardState.step > 0) {
    wizardState.step--;
    renderWizardStep();
  }
}

export function evaluateWizardResults() {
  const a = wizardState.answers;
  let matches = [];

  if (a.camara === "giratoria") {
    matches.push({
      gen: generaciones.find((g) => g.id === "G5/G6"),
      matchedProps: ["Cámara giratoria 180°"],
    });
  } else if (a.marca === "Bangho" || a.manija === "plegable") {
    matches.push({
      gen: generaciones.find((g) => g.id === "G4 / G4.1"),
      matchedProps: ["Marca Banghó (G4.1) o manija plegable integrada"],
    });
  } else if (
    a.marca === "BGH" ||
    a.manija === "fija" ||
    (a.marca === "CDR_DEPOT" && a.manija === "ninguna")
  ) {
    matches.push({
      gen: generaciones.find((g) => g.id === "G3"),
      matchedProps: ["Marca Positivo BGH o modelo CDR/DEPOT"],
    });
  } else if (a.marca === "Samsung" || a.camara === "horizontal") {
    matches.push({
      gen: generaciones.find((g) => g.id === "G2"),
      matchedProps: ["Marca Samsung o cámara alargada horizontal"],
    });
  } else if (
    a.marca === "EXO" &&
    a.manija === "ninguna" &&
    a.bateria === "extraible"
  ) {
    matches.push({
      gen: generaciones.find((g) => g.id === "G1"),
      matchedProps: ["Marca EXO rígida", "Botón externo y detalles de cuero"],
    });
  }

  if (matches.length === 1) {
    showSingleResult(matches[0].gen, matches[0].matchedProps);
  } else if (matches.length > 1) {
    showMultipleResults(
      matches.map((m) => m.gen),
      "Coincidencias múltiples detectadas.",
    );
  } else {
    showMultipleResults(
      [],
      "No se encontró una coincidencia exacta con las respuestas cargadas.",
    );
  }
}

export function showSingleResult(genObj, matchedTraits) {
  document.getElementById("res-gen-title").textContent = genObj.id;
  document.getElementById("res-gen-models").textContent =
    `Marcas relacionadas: ${genObj.marcas.join(", ")}`;

  const mainImg = document.getElementById("res-main-image");
  const thumbsContainer = document.getElementById("res-thumbnails-container");

  thumbsContainer.innerHTML = "";
  if (genObj.imagenes && genObj.imagenes.length > 0) {
    mainImg.src = genObj.imagenes[0];

    genObj.imagenes.forEach((imgUrl, idx) => {
      const thumb = document.createElement("img");
      thumb.src = imgUrl;
      thumb.className = `thumb-img ${idx === 0 ? "active" : ""}`;
      thumb.onclick = () => {
        mainImg.src = imgUrl;
        document
          .querySelectorAll(".thumb-img")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      };
      thumbsContainer.appendChild(thumb);
    });
  }

  const ul = document.getElementById("res-matched-list");
  ul.innerHTML = "";
  matchedTraits.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });

  document.getElementById("btn-confirm-match").onclick = () =>
    loadProcedure(genObj.id);
  navigateTo("view-resultado");
}

export function handleNoMatch() {
  showMultipleResults(
    [],
    "El equipo ingresado no coincide con la generación propuesta.",
  );
}

export function showMultipleResults(genArray, msg) {
  const container = document.getElementById("multi-cards-container");
  container.innerHTML = "";
  document.getElementById("multi-desc").textContent = msg;

  const listToRender = genArray.length > 0 ? genArray : generaciones;

  listToRender.forEach((g) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.textAlign = "left";
    const firstImg = g.imagenes && g.imagenes.length > 0 ? g.imagenes[0] : "";
    card.innerHTML = `
                    <span class="badge">${g.id}</span>
                    <h3 style="margin: 0.5rem 0;">${g.nombre}</h3>
                    <img src="${firstImg}" alt="${g.id}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:0.5rem; cursor:pointer;" onclick="openZoomImage('${firstImg}')">
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 1rem;">${g.caracteristicas}</p>
                    <button class="btn" onclick="loadProcedure('${g.id}')">Ver procedimiento</button>
                `;
    container.appendChild(card);
  });

  navigateTo("view-resultado-multiple");
}

// CARGA DE PROCEDIMIENTO CON IMÁGENES AMPLIABLES POR PASO
// Carga del procedimiento utilizando la propiedad 'desbloqueo'
export function loadProcedure(genId) {
  const gen = generaciones.find((g) => g.id === genId);
  if (!gen) return;

  activeProcedureGen = gen;
  document.getElementById("proc-gen-badge").textContent = gen.id;

  const container = document.getElementById("procedure-steps-container");
  container.innerHTML = "";
  document.getElementById("procedure-completion-card").style.display = "none";

  if (CONFIG.MODO_EXPOSICION) {
    container.innerHTML = `
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
    `;
    navigateTo("view-procedimiento");
    return;
  }

  let stepsHTML = `
        <div class="card step-card" id="step-card-0">
            <div class="step-header">
                <span class="step-title">Paso 1: Preparación técnica</span>
                <span class="badge" style="background-color: var(--border); color: var(--text-main);">Requerido</span>
            </div>
            <ul style="list-style: none; margin-bottom: 1rem; font-size: 0.9rem;">
                <li>☐ Equipo completamente apagado</li>
                <li>☐ Fuente de alimentación y batería desconectadas</li>
                <li>☐ Verificar coincidencia visual (${gen.marcas.join("/")})</li>
            </ul>
            <button class="btn btn-secondary" id="btn-step-0" onclick="toggleStep(0)">Marcar como realizado</button>
        </div>
    `;

  gen.procedimiento.forEach((procText, index) => {
    const stepNum = index + 2;

    // Extraer imagen y detalle del nuevo formato de objeto
    let rawImg = "";
    let imgDetail = "";

    if (gen.desbloqueo && gen.desbloqueo[index]) {
      // Si desbloqueo es un objeto { img, detalle }
      if (typeof gen.desbloqueo[index] === "object") {
        rawImg = gen.desbloqueo[index].img || "";
        imgDetail = gen.desbloqueo[index].detalle || "";
      } else {
        // Si viene como string simple (compatibilidad)
        rawImg = gen.desbloqueo[index];
      }
    }

    const imgForStep = String(rawImg).replace(/\\/g, "/").replace(/'/g, "\\'");

    stepsHTML += `
            <div class="card step-card" id="step-card-${stepNum - 1}">
                <div class="step-header">
                    <span class="step-title">Paso ${stepNum}: Desbloqueo Hardware</span>
                </div>
                <p style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--primary-dark);">${procText}</p>
                
                ${
                  imgForStep
                    ? `
                <div class="step-img-wrapper">
                    <img src="${imgForStep}" alt="Paso ${stepNum}" class="step-img-preview" onclick="openZoomImage('${imgForStep}')">
                    <br>
                    <button type="button" class="zoom-hint-btn" onclick="openZoomImage('${imgForStep}')">🔍 Ampliar imagen de referencia</button>
                    
                    ${
                      imgDetail
                        ? `
                        <div class="img-detail-box" style="margin-top: 0.8rem; padding: 0.6rem 0.8rem; background-color: #f4f6f8; border-left: 3px solid var(--primary); font-size: 0.88rem; color: #333; text-align: left; border-radius: 0 4px 4px 0;">
                            💡 <strong>Orientación y ubicación:</strong> ${imgDetail}
                        </div>
                    `
                        : ""
                    }
                </div>
                `
                    : ""
                }

                ${gen.notasTecnicas ? `<div class="tech-note" style="margin-top:0.8rem;"><strong>Nota Técnica:</strong> ${gen.notasTecnicas}</div>` : ""}
                <button class="btn btn-secondary" style="margin-top: 1rem;" id="btn-step-${stepNum - 1}" onclick="toggleStep(${stepNum - 1})">Marcar como realizado</button>
            </div>
        `;
  });

  container.innerHTML = stepsHTML;
  currentChecklistStatus = new Array(gen.procedimiento.length + 1).fill(false);
  navigateTo("view-procedimiento");
}

export function toggleStep(stepIdx) {
  currentChecklistStatus[stepIdx] = !currentChecklistStatus[stepIdx];
  const card = document.getElementById(`step-card-${stepIdx}`);
  const btn = document.getElementById(`btn-step-${stepIdx}`);

  if (currentChecklistStatus[stepIdx]) {
    card.classList.add("completed");
    btn.textContent = "✓ Completado";
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-warning");
  } else {
    card.classList.remove("completed");
    btn.textContent = "Marcar como realizado";
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-secondary");
  }

  const allDone = currentChecklistStatus.every((st) => st === true);
  if (allDone) {
    document.getElementById("procedure-completion-card").style.display =
      "block";
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    document.getElementById("procedure-completion-card").style.display = "none";
  }
}

export function renderGeneracionesCatalog() {
  const grid = document.getElementById("generaciones-grid");
  grid.innerHTML = "";

  generaciones.forEach((g) => {
    const card = document.createElement("div");
    card.className = "card";
    const firstImg = g.imagenes && g.imagenes.length > 0 ? g.imagenes[0] : "";
    card.innerHTML = `
                    <span class="badge">${g.id}</span>
                    <h3 style="margin: 0.5rem 0;">${g.nombre}</h3>
                    <img src="${firstImg}" alt="${g.id}" style="width:100%; height:130px; object-fit:cover; border-radius:6px; margin-bottom:0.5rem; cursor:pointer;" onclick="openZoomImage('${firstImg}')">
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${g.marcas.join(" · ")}</p>
                    <button class="btn btn-secondary" onclick="openGenModal('${g.id}')">Ver ficha técnica</button>
                `;
    grid.appendChild(card);
  });
}

export function renderAccordionInfo() {
  const container = document.getElementById("accordion-container");
  container.innerHTML = "";

  generaciones.forEach((g) => {
    const item = document.createElement("div");
    item.className = "accordion-item";
    item.innerHTML = `
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        <span>${g.id} - ${g.nombre} (${g.marcas.join(", ")})</span>
                        <span>▼</span>
                    </button>
                    <div class="accordion-content">
                        <strong>Características físicas:</strong>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">${g.caracteristicas}</p>
                        <strong>Indicadores clave:</strong>
                        <ul style="font-size: 0.9rem; margin-bottom: 0.5rem; padding-left: 1.2rem;">
                            ${g.indicadores.map((i) => `<li>${i}</li>`).join("")}
                        </ul>
                        <strong>Procedimiento técnico:</strong>
                        <p style="font-size: 0.9rem; color: var(--primary-dark);">${g.procedimiento.join(" | ")}</p>
                    </div>
                `;
    container.appendChild(item);
  });
}

export function toggleAccordion(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains("active");

  document
    .querySelectorAll(".accordion-item")
    .forEach((el) => el.classList.remove("active"));
  if (!isOpen) item.classList.add("active");
}

// Función del Visor Modal de Imágenes
export function openZoomImage(imgSrc) {
  if (!imgSrc) return;
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  content.className = "zoom-modal-content";
  content.innerHTML = `
        <img src="${imgSrc}" class="zoom-modal-img" alt="Vista ampliada">
        <button type="button" class="btn btn-secondary" style="margin-top:1rem; width:auto; background: #fff;" onclick="closeModal()">✕ Cerrar visor</button>
    `;

  overlay.classList.add("active");
}

export function openGenModal(genId) {
  const g = generaciones.find((item) => item.id === genId);
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  content.className = "modal-content";
  const imgsHTML = g.imagenes
    .map(
      (src) =>
        `<img src="${src}" style="width:100px; height:70px; object-fit:cover; border-radius:4px; border:1px solid var(--border); cursor:pointer;" onclick="openZoomImage('${src}')">`,
    )
    .join("");

  content.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h2>${g.id} - ${g.nombre}</h2>
                    <button class="btn btn-secondary" style="width:auto;" onclick="closeModal()">✕</button>
                </div>
                <hr style="border:none; border-top:1px solid var(--border); margin:1rem 0;">
                
                <div style="display:flex; gap:0.5rem; overflow-x:auto; margin-bottom:1rem;">
                    ${imgsHTML}
                </div>

                <h4>Características físicas</h4>
                <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">${g.caracteristicas}</p>
                
                <h4>Puntos clave de identificación</h4>
                <ul style="font-size:0.9rem; margin-bottom:1rem; padding-left:1.2rem;">
                    ${g.indicadores.map((i) => `<li>${i}</li>`).join("")}
                </ul>

                <h4>Procedimiento Técnico (Resumen)</h4>
                <p style="font-size:0.9rem; margin-bottom:1.5rem;">${g.procedimiento.join("<br>")}</p>

                <button class="btn" onclick="closeModal(); loadProcedure('${g.id}')">Ver procedimiento paso a paso →</button>
            `;

  overlay.classList.add("active");
}

export function openRegisterModal() {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  content.className = "modal-content";
  content.innerHTML = `
                <h3>Registrar Equipo Intervenido</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Guardá el registro en la memoria local del dispositivo.</p>
                
                <div style="display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
                    <label style="font-size:0.85rem; font-weight:bold;">Generación
                        <input type="text" id="reg-input-gen" value="${activeProcedureGen ? activeProcedureGen.id : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Marca
                        <input type="text" id="reg-input-marca" value="${activeProcedureGen ? activeProcedureGen.marcas[0] : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Observaciones
                        <textarea id="reg-input-obs" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;"></textarea>
                    </label>
                </div>

                <div style="display:flex; gap:0.5rem; margin-top:1.5rem;">
                    <button class="btn" onclick="saveRecord()">Guardar Localmente</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                </div>
            `;

  overlay.classList.add("active");
}

export function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

export function openExternalRegister() {
  if (REGISTRO_URL && REGISTRO_URL !== "PEGAR_AQUI_URL") {
    window.open(REGISTRO_URL, "_blank");
  } else {
    alert("La URL del registro externo no ha sido configurada.");
  }
}

export function getHistory() {
  return [];
}

export async function saveRecord() {
  const btn = document.getElementById("btn-save-record");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Guardando...";
  }

  const gen = document.getElementById("reg-input-gen")?.value || "N/A";
  const marca = document.getElementById("reg-input-marca")?.value || "N/A";
  const estado = document.getElementById("reg-input-estado")?.value || "N/A";
  const detalles = document.getElementById("reg-input-detalles")?.value || "-";

  if (!supabase) {
    alert("Error: Supabase no está configurado.");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Guardar Registro";
    }
    return;
  }

  const { error } = await supabase.from("registro_reparaciones").insert([
    {
      generacion: gen,
      marca: marca,
      estado: estado,
      detalles: detalles,
    },
  ]);

  if (error) {
    alert("Error al guardar en Supabase: " + error.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Guardar Registro";
    }
    return;
  }

  closeModal();
  await cargarRegistros();
  navigateTo("view-registro");
}

export async function cargarRegistros() {
  const tbody = document.getElementById("history-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Cargando registros...</td></tr>`;

  if (!supabase) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--error);">Supabase no está configurado.</td></tr>`;
    return;
  }

  const { data, error } = await supabase
    .from("registro_reparaciones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--error);">Error al cargar: ${error.message}</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No hay equipos registrados.</td></tr>`;
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

    tr.innerHTML = `
      <td>${fechaFormateada}</td>
      <td><strong>${item.generacion}</strong></td>
      <td>${item.marca || "-"}</td>
      <td><span class="badge" style="background-color: ${badgeColor}; color: ${textColor};">${item.estado || "-"}</span></td>
      <td>${item.detalles || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

export function clearHistory() {
  alert("La eliminación está deshabilitada (se usa BD remota).");
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

export function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById("theme-icon");
  if (!icon) return;
  if (isDark) {
    // Show sun for dark theme (to switch to light)
    icon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  } else {
    // Show moon for light theme (to switch to dark)
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
}
