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
  if (!viewId) return;

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

                

                <button class="btn" onclick="closeModal(); loadProcedure('${g.id}')">Ver procedimiento paso a paso →</button>
            `;

  overlay.classList.add("active");
}

export async function openRegisterModal() {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  const { getUserProfile } = await import("./auth.js");
  const profile = await getUserProfile();
  const currentUserEmail = profile ? profile.email : "desconocido@email.com";

  content.className = "modal-content";
  content.innerHTML = `
                <h3>Registrar Equipo Intervenido</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Guarda la intervención de este equipo en la base de datos.</p>
                
                <div style="display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
                    <label style="font-size:0.85rem; font-weight:bold;">Identificación
                        <input type="text" id="reg-input-id" placeholder="ID corto" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Marca
                        <input type="text" id="reg-input-marca" value="${activeProcedureGen ? activeProcedureGen.marcas[0] : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">N° de Serie
                        <input type="text" id="reg-input-nserie" placeholder="N° Serie" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Generación
                        <input type="text" id="reg-input-gen" value="${activeProcedureGen ? activeProcedureGen.id : ""}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Bloqueada
                        <select id="reg-input-bloqueada" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                        </select>
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Batería
                        <input type="text" id="reg-input-bateria" placeholder="Estado Batería" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Observaciones
                        <textarea id="reg-input-obs" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;"></textarea>
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Situación Final
                        <select id="reg-input-situacion" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px;">
                            <option value="Reparada">Reparada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="No reparable">No reparable</option>
                        </select>
                    </label>
                    <label style="font-size:0.85rem; font-weight:bold;">Responsable
                        <input type="text" id="reg-input-responsable" value="${currentUserEmail}" readonly style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:4px; background-color:var(--bg-main); color:var(--text-muted); cursor:not-allowed;">
                    </label>
                </div>

                <div style="display:flex; gap:0.5rem; margin-top:1.5rem;">
                    <button class="btn" id="btn-save-record" onclick="saveRecord()">Guardar</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                </div>
            `;

  overlay.classList.add("active");
}

export function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

export async function cargarDesdeSheets() {
  const container = document.getElementById("sheets-data-container");
  const btn = document.getElementById("btn-load-sheets");
  if (!container || !btn) return;

  container.style.display = "block";
  container.innerHTML =
    "<p style='color: var(--text-muted); text-align: center; margin: 1rem 0;'>Cargando datos desde Sheets, por favor esperá...</p>";
  btn.disabled = true;

  try {
    const { getUserProfile } = await import("./auth.js");
    const profile = await getUserProfile();
    const userEmail = profile ? profile.email : null;

    if (!userEmail) {
      container.innerHTML =
        "<p style='color: var(--error); text-align: center;'>No se pudo obtener el email del usuario logueado.</p>";
      btn.disabled = false;
      return;
    }

    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";
    const response = await fetch(
      `${SCRIPT_URL}?email=${encodeURIComponent(userEmail)}`,
    );
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      if (data && data.length > 0) {
        renderSheetsData(data, container, userEmail);
      } else {
        container.innerHTML =
          "<p style='color: var(--text-muted); text-align: center; margin: 1rem 0;'>No se encontraron registros en la planilla para tu usuario.</p>";
      }
    } else {
      container.innerHTML = `<p style='color: var(--error); text-align: center;'>Error del Apps Script: ${result.error}</p>`;
    }
  } catch (error) {
    container.innerHTML = `<p style='color: var(--error); text-align: center;'>Error de red al consultar Google Sheets: ${error.message}</p>`;
  } finally {
    btn.disabled = false;
  }
}

function renderSheetsData(data, container, userEmail) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  let tableHtml = `<table class="history-table" style="min-width: 600px; font-size: 0.85rem;"><thead><tr>`;
  headers.forEach((h) => {
    const headerTitle = h.charAt(0).toUpperCase() + h.slice(1);
    tableHtml += `<th>${headerTitle}</th>`;
  });
  tableHtml += `<th>Acciones</th></tr></thead><tbody>`;
  data.forEach((row) => {
    tableHtml += `<tr>`;
    let isOwner = false;
    let identificacion = "";

    headers.forEach((h) => {
      let cellValue = row[h];
      if (cellValue === undefined || cellValue === null || cellValue === "")
        cellValue = "-";
      tableHtml += `<td>${cellValue}</td>`;

      // Check if user is owner by matching email in any column
      if (
        typeof cellValue === "string" &&
        cellValue.toLowerCase().trim() === userEmail.toLowerCase().trim()
      ) {
        isOwner = true;
      }

      // Attempt to identify the 'id' column
      const lowerH = h.toLowerCase();
      if (lowerH.includes("identificaci") || lowerH === "id") {
        identificacion = cellValue;
      }
    });

    if (!identificacion && headers.length > 0) {
      identificacion = row[headers[0]];
    }

    tableHtml += `<td>`;
    if (isOwner) {
      // Escape row to JSON string
      const rowJsonStr = encodeURIComponent(JSON.stringify(row));
      tableHtml += `
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onclick="openEditModal('${identificacion}', '${userEmail}', '${rowJsonStr}')">
            ✏️ Editar
          </button>
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onclick="liberarEquipo('${identificacion}', '${userEmail}')">
            Liberar
          </button>
        </div>`;
    } else {
      tableHtml += `-`;
    }
    tableHtml += `</td></tr>`;
  });
  tableHtml += `</tbody></table>`;
  container.innerHTML = tableHtml;
}

export function liberarEquipo(identificacion, userEmail) {
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
    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";
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
        document.getElementById("settings-proyecto").textContent =
          profile.proyecto;
      }
    } catch (e) {
      console.error("Error al cargar perfil:", e);
      document.getElementById("settings-email").textContent = "Error al cargar";
      document.getElementById("settings-rol").textContent = "Error al cargar";
      document.getElementById("settings-proyecto").textContent =
        "Error al cargar";
    }
  }
}

export function closeSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

let qrwState = {
  step: 1,
  totalSteps: 8,
  data: {},
};

const qrwStepsConfig = [
  {
    id: "identificacion",
    title: "Identificación de la Netbook",
    desc: "Corresponde al valor que aparece escrito con fibra sobre la cinta de papel.",
    type: "text",
    placeholder: "Ej: A-12",
    required: true,
  },
  {
    id: "marca",
    title: "Marca del Equipo",
    desc: "Seleccioná la marca de la netbook.",
    type: "chips",
    options: [
      "EXO",
      "SAMSUNG",
      "POSITIVO BGH",
      "BANGHÓ",
      "CDR",
      "DEPOT",
      "HUNYRA",
      "NEWTRONIC",
      "NOVATECH",
      "NOBLEX",
      "EDUTEC",
      "OTRO",
    ],
    footerInfo: "En caso de ser otra marca, escribirla en observaciones",
  },
  {
    id: "n_serie",
    title: "Número de Serie",
    desc: "Identificador único de fábrica del equipo.",
    type: "text",
    placeholder: "Ej: NT2018...",
  },
  {
    id: "generacion",
    title: "Generación",
    desc: "Generación a la que pertenece la netbook.",
    type: "select",
    options: ["", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"],
  },
  {
    id: "bloqueada",
    title: "¿El equipo está bloqueado?",
    desc: "Indicá si la netbook presenta pantalla de bloqueo de hardware.",
    type: "select",
    options: ["", "NO BLOQUEADO", "BLOQUEADO"],
  },
  {
    id: "bateria",
    title: "Estado de Batería",
    desc: "Indicá si el equipo posee batería o no.",
    type: "select",
    options: ["", "NO TIENE", "TIENE"],
  },
  {
    id: "observaciones",
    title: "Observaciones",
    desc: "Detalles adicionales sobre el estado del equipo.",
    type: "textarea",
    placeholder: "Falta tecla A, pantalla rayada...",
  },
  {
    id: "situacion_final",
    title: "Situación Final",
    desc: "Estado actual tras tu intervención.",
    type: "text",
    placeholder: "Ej: Pendiente de repuesto, Reparada...",
  },
];

export function initQrw() {
  qrwState.step = 1;
  qrwState.data = {};
  renderQrwStep();
}

export function qrwNext() {
  const currentConfig = qrwStepsConfig[qrwState.step - 1];
  const input = document.getElementById("qrw-input");

  if (input) {
    qrwState.data[currentConfig.id] = input.value;
  }

  if (qrwState.step < qrwState.totalSteps) {
    qrwState.step++;
    renderQrwStep();
  } else {
    finishQrw();
  }
}

export function qrwPrev() {
  if (qrwState.step > 1) {
    const currentConfig = qrwStepsConfig[qrwState.step - 1];
    const input = document.getElementById("qrw-input");
    if (input) {
      qrwState.data[currentConfig.id] = input.value;
    }
    qrwState.step--;
    renderQrwStep();
  }
}

export function checkQrwInput() {
  const currentConfig = qrwStepsConfig[qrwState.step - 1];
  const btnNext = document.getElementById("qrw-btn-next");
  if (currentConfig.required) {
    const input = document.getElementById("qrw-input");
    btnNext.disabled = !input || input.value.trim() === "";
  } else {
    btnNext.disabled = false;
  }
}

function renderQrwStep() {
  const container = document.getElementById("qrw-step-container");
  if (!container) return;

  const currentConfig = qrwStepsConfig[qrwState.step - 1];
  const currentValue = qrwState.data[currentConfig.id] || "";

  document.getElementById("qrw-step-label").textContent =
    `Paso ${qrwState.step} / ${qrwState.totalSteps}`;
  document.getElementById("qrw-progress").style.width =
    `${(qrwState.step / qrwState.totalSteps) * 100}%`;

  let inputHtml = "";
  if (currentConfig.type === "text") {
    inputHtml = `<input type="text" id="qrw-input" placeholder="${currentConfig.placeholder}" value="${currentValue}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem;" oninput="checkQrwInput()">`;
  } else if (currentConfig.type === "textarea") {
    inputHtml = `<textarea id="qrw-input" placeholder="${currentConfig.placeholder}" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem; resize: vertical;" oninput="checkQrwInput()">${currentValue}</textarea>`;
  } else if (currentConfig.type === "select") {
    const optionsHtml = currentConfig.options
      .map(
        (opt) =>
          `<option value="${opt}" ${currentValue === opt ? "selected" : ""}>${opt || "Seleccionar..."}</option>`,
      )
      .join("");
    inputHtml = `<select id="qrw-input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem; background-color: var(--bg-main); color: var(--text-main);" onchange="checkQrwInput()">${optionsHtml}</select>`;
  } else if (currentConfig.type === "chips") {
    const chipsHtml = currentConfig.options
      .map((opt) => {
        const isSelected = currentValue === opt;
        return `<button type="button" class="btn ${isSelected ? "btn-primary" : "btn-secondary"}" style="padding: 0.5rem 1rem; margin: 0.25rem; font-size: 0.9rem; width: auto; display: inline-block; flex-grow: 1; flex-basis: 30%;" onclick="document.getElementById('qrw-input').value = '${opt}'; document.querySelectorAll('.chip-btn').forEach(b => b.classList.replace('btn-primary', 'btn-secondary')); this.classList.replace('btn-secondary', 'btn-primary'); checkQrwInput();">${opt}</button>`;
      })
      .join("");

    inputHtml = `
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start; margin-bottom: 1rem;">
        ${chipsHtml.replace(/btn /g, "btn chip-btn ")}
      </div>
      <input type="hidden" id="qrw-input" value="${currentValue}">
      ${currentConfig.footerInfo ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">${currentConfig.footerInfo}</p>` : ""}
    `;
  }

  container.innerHTML = `
    <div class="question-title" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">
      ${currentConfig.title} ${currentConfig.required ? '<span style="color: var(--error);">*</span>' : ""}
    </div>
    ${currentConfig.desc ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${currentConfig.desc}</p>` : ""}
    ${inputHtml}
  `;

  const btnPrev = document.getElementById("qrw-btn-prev");
  const btnNext = document.getElementById("qrw-btn-next");

  btnPrev.style.display = "block";
  btnNext.style.display = "block";
  btnPrev.disabled = qrwState.step === 1;
  btnNext.textContent =
    qrwState.step === qrwState.totalSteps
      ? "+ Registrar Equipo"
      : "Siguiente →";

  checkQrwInput();
}

async function finishQrw() {
  const btnNext = document.getElementById("qrw-btn-next");
  const btnPrev = document.getElementById("qrw-btn-prev");

  btnNext.disabled = true;
  btnPrev.disabled = true;
  btnNext.innerHTML = `<span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 8px;">⏳</span> Guardando...`;

  try {
    const { getUserProfile } = await import("./auth.js");
    const profile = await getUserProfile();
    const currentUserEmail = profile ? profile.email : "desconocido@email.com";

    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";

    const valorId = qrwState.data.identificacion || "";
    const payload = {
      action: "add",
      email: currentUserEmail,
      id: String(valorId),
      data: {
        identificacion: valorId,
        Identificación: valorId,
        marca: qrwState.data.marca || "",
        n_serie: qrwState.data.n_serie || "",
        generacion: qrwState.data.generacion || "",
        bloqueada: qrwState.data.bloqueada || "No",
        bateria: qrwState.data.bateria || "",
        observaciones: qrwState.data.observaciones || "",
        situacion_final: qrwState.data.situacion_final || "Pendiente",
      },
    };

    console.log("Payload enviado a Apps Script:", payload);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      const id = qrwState.data.identificacion || "Desconocido";
      btnNext.disabled = false;
      btnNext.textContent = "+ Registrar Equipo";
      btnPrev.disabled = false;

      let alertMsg = "";
      if (result.errorType === "ALREADY_TAKEN" || result.owner) {
        const ownerEmail = result.owner || "otro usuario";
        alertMsg = `El equipo ID ${id} ya es responsabilidad del usuario ${ownerEmail}. Por favor, busca otra netbook para reparar o consulta con tu docente.`;
      } else {
        alertMsg = `El ID ingresado no se encuentra en la planilla pre-cargada. Verifica la etiqueta.`;
      }

      // Mostrar modal estilizada de error
      showCustomAlert(alertMsg);
      return;
    }

    // Recargar tabla si está visible
    cargarDesdeSheets();

    // Show confirmation and reset
    const container = document.getElementById("qrw-step-container");
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 0;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h3 style="color: var(--primary-dark); margin-bottom: 0.5rem;">¡Registro guardado!</h3>
        <p style="color: var(--text-muted);">El equipo fue ingresado correctamente a la base de datos.</p>
        <button class="btn" style="margin-top: 1.5rem; width: auto;" onclick="initQrw()">Registrar otro equipo</button>
      </div>
    `;

    btnNext.style.display = "none";
    btnPrev.style.display = "none";
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error de red al intentar guardar los datos.");
    btnNext.disabled = false;
    btnNext.textContent = "Finalizar y Guardar";
    btnPrev.disabled = false;
  }
}

export function irARegistroRapido() {
  navigateTo("view-inicio");
  initQrw();
  setTimeout(() => {
    const wizard = document.getElementById("quick-register-wizard");
    if (wizard) {
      wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
}

export function showCustomAlert(message) {
  let alertModal = document.getElementById("custom-alert-modal");
  if (!alertModal) {
    alertModal = document.createElement("div");
    alertModal.id = "custom-alert-modal";
    alertModal.className = "modal-overlay";
    alertModal.innerHTML = `
      <div class="modal-content" style="max-width: 400px; text-align: center;">
        <h3 style="color: var(--error); margin-bottom: 1rem;">Aviso Importante</h3>
        <p id="custom-alert-msg" style="color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.5;"></p>
        <button class="btn" style="width: 100%; background-color: var(--error); border-color: var(--error);" onclick="document.getElementById('custom-alert-modal').classList.remove('active')">Entendido</button>
      </div>
    `;
    document.body.appendChild(alertModal);
  }
  document.getElementById("custom-alert-msg").textContent = message;
  alertModal.classList.add("active");
}

export function openEditModal(identificacion, userEmail, rowJsonEncoded) {
  const modal = document.getElementById("edit-equipo-modal");
  if (!modal) return;

  let rowData = {};
  try {
    rowData = JSON.parse(decodeURIComponent(rowJsonEncoded));
  } catch (e) {
    console.error("Failed to parse row data", e);
  }

  document.getElementById("edit-hidden-id").value = identificacion;
  document.getElementById("edit-hidden-email").value = userEmail;

  // Find corresponding fields (case-insensitive check)
  const getFieldValue = (keyName) => {
    const key = Object.keys(rowData).find((k) =>
      k.toLowerCase().includes(keyName),
    );
    return key ? rowData[key] : "";
  };

  const bloqueadaVal = getFieldValue("bloqueada") || "NO BLOQUEADA";
  const bateriaVal = getFieldValue("bateria") || "NO TIENE";
  const situacionVal = getFieldValue("situaci") || getFieldValue("final") || "";
  const obsVal = getFieldValue("observacion") || "";

  // Set the values in the modal

  const selectBloqueada = document.getElementById("edit-select-bloqueada");
  if (
    bloqueadaVal.toUpperCase() === "BLOQUEADA" ||
    bloqueadaVal.toUpperCase() === "SI"
  ) {
    selectBloqueada.value = "BLOQUEADA";
  } else {
    selectBloqueada.value = "NO BLOQUEADA";
  }

  const selectBateria = document.getElementById("edit-select-bateria");
  if (
    bateriaVal.toUpperCase() === "TIENE" ||
    bateriaVal.toUpperCase() === "SI"
  ) {
    selectBateria.value = "TIENE";
  } else {
    selectBateria.value = "NO TIENE";
  }

  document.getElementById("edit-input-situacion").value = situacionVal;
  document.getElementById("edit-textarea-observaciones").value = obsVal;

  modal.classList.add("active");
}

export function closeEditModal() {
  const modal = document.getElementById("edit-equipo-modal");
  if (modal) modal.classList.remove("active");
}

export async function saveEditEquipo() {
  const id = document.getElementById("edit-hidden-id").value;
  const userEmail = document.getElementById("edit-hidden-email").value;
  const bloqueada = document.getElementById("edit-select-bloqueada").value;
  const bateria = document.getElementById("edit-select-bateria").value;
  const situacion = document.getElementById("edit-input-situacion").value;
  const observaciones = document.getElementById(
    "edit-textarea-observaciones",
  ).value;

  const btnSave = document.getElementById("edit-btn-save");

  btnSave.disabled = true;
  btnSave.innerHTML = `<span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 8px;">⏳</span> Guardando...`;

  const payload = {
    action: "update",
    email: userEmail,
    id: String(id),
    data: {
      Bloqueada: bloqueada,
      Batería: bateria,
      "Situación Final": situacion,
      Observaciones: observaciones,
    },
  };

  console.log("Payload enviado a Apps Script para update:", payload);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      closeEditModal();
      showCustomAlert("¡Cambios guardados con éxito!");
      await cargarDesdeSheets();
    } else {
      showCustomAlert(
        "Error al actualizar: " + (result.error || "Desconocido"),
      );
    }
  } catch (error) {
    console.error(error);
    showCustomAlert("Error de red al intentar actualizar los datos.");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Guardar Cambios";
  }
}

// BITACORA LOGIC (Local Storage)
export async function getBitacoraKey() {
  try {
    const { getUserProfile } = await import("./auth.js");
    const profile = await getUserProfile();
    if (profile && profile.email) {
      return `bitacora_${profile.email}`;
    }
  } catch (e) {
    console.error("Error fetching user email for bitacora", e);
  }
  return "bitacora_guest";
}

export async function renderBitacora() {
  const tbody = document.getElementById("bitacora-tbody");
  if (!tbody) return;

  const key = await getBitacoraKey();
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; padding: 1rem; color: var(--text-muted);">Aún no tienes registros de horas.</td></tr>';
    return;
  }

  let html = "";
  // Sort descending by id or date, let's keep it simple (as they are entered or reverse)
  data.reverse().forEach((record) => {
    // encode record to pass to edit function
    const recordJsonStr = encodeURIComponent(JSON.stringify(record));
    html += `
      <tr>
        <td>${record.fecha || "-"}</td>
        <td>${record.horarioDesde ? record.horarioDesde + " - " + (record.horarioHasta || "") : record.horario || "-"}</td>
        <td>${record.duracion || "-"}</td>
        <td>${record.trabajo || "-"}</td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; width: auto;" onclick="editBitacoraRecord('${recordJsonStr}')">✏️ Editar</button>
            <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; width: auto; color: var(--error);" onclick="deleteBitacoraRecord('${record.id}')">🗑️ Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

export async function addBitacoraRecord() {
  const fecha = document.getElementById("bitacora-fecha").value;
  const horarioDesde = document.getElementById("bitacora-horario-desde").value;
  const horarioHasta = document.getElementById("bitacora-horario-hasta").value;
  const duracion = document.getElementById("bitacora-duracion").value;
  const trabajo = document.getElementById("bitacora-trabajo").value;
  const editId = document.getElementById("bitacora-edit-id").value;

  if (!fecha || !duracion || !trabajo) {
    showCustomAlert(
      "Por favor, completa al menos Fecha, Duración y Trabajo Realizado.",
    );
    return;
  }

  const key = await getBitacoraKey();
  let data = JSON.parse(localStorage.getItem(key) || "[]");

  if (editId) {
    // Update existing
    const idx = data.findIndex((r) => r.id === editId);
    if (idx !== -1) {
      data[idx] = {
        ...data[idx],
        fecha,
        horarioDesde,
        horarioHasta,
        duracion,
        trabajo,
      };
      delete data[idx].horario;
    }
  } else {
    // Create new
    const newRecord = {
      id: Date.now().toString(),
      fecha,
      horarioDesde,
      horarioHasta,
      duracion,
      trabajo,
    };
    data.push(newRecord);
  }

  localStorage.setItem(key, JSON.stringify(data));
  cancelBitacoraEdit(); // reset form
  await renderBitacora();
}

export function editBitacoraRecord(recordEncoded) {
  try {
    const record = JSON.parse(decodeURIComponent(recordEncoded));
    document.getElementById("bitacora-edit-id").value = record.id;
    document.getElementById("bitacora-fecha").value = record.fecha;
    document.getElementById("bitacora-horario-desde").value =
      record.horarioDesde || record.horario || "";
    document.getElementById("bitacora-horario-hasta").value =
      record.horarioHasta || "";
    document.getElementById("bitacora-duracion").value = record.duracion;
    document.getElementById("bitacora-trabajo").value = record.trabajo;

    document.getElementById("bitacora-btn-add").textContent = "Actualizar";
    document.getElementById("bitacora-btn-cancel").style.display = "block";

    // Scroll to the form
    document
      .getElementById("bitacora-fecha")
      .scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    console.error("Error parsing bitacora record", e);
  }
}

export function cancelBitacoraEdit() {
  document.getElementById("bitacora-edit-id").value = "";
  document.getElementById("bitacora-fecha").value = "";
  document.getElementById("bitacora-horario-desde").value = "";
  document.getElementById("bitacora-horario-hasta").value = "";
  document.getElementById("bitacora-duracion").value = "";
  document.getElementById("bitacora-trabajo").value = "";

  document.getElementById("bitacora-btn-add").textContent = "Añadir";
  document.getElementById("bitacora-btn-cancel").style.display = "none";
}

export async function deleteBitacoraRecord(id) {
  if (
    confirm("¿Estás seguro de que quieres eliminar este registro de horas?")
  ) {
    const key = await getBitacoraKey();
    let data = JSON.parse(localStorage.getItem(key) || "[]");
    data = data.filter((r) => r.id !== id);
    localStorage.setItem(key, JSON.stringify(data));
    await renderBitacora();
  }
}

export function openKitModal() {
  const modal = document.getElementById("kit-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

export function closeKitModal() {
  const modal = document.getElementById("kit-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}
