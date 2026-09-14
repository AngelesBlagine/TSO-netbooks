const REGISTRO_URL =
  "https://docs.google.com/spreadsheets/d/1uZCdwo-7Oh2R2iEt5VZUnRmsuYxcef24SvX47DY_x4k/edit?usp=drive_link";

// LISTA DE GENERACIONES, ojala se cambie el tema de las imagenes en el deply
const generaciones = [
  {
    id: "G1",
    nombre: "Generación 1",
    marcas: ["EXO"],
    caracteristicas: "Robusta. Plástico blanco/gris claro duro y macizo...",
    indicadores: ["Estructura rígida blanco/gris", "Decorado estilo cuero"],
    imagenes: [
      "generacion/g1.1.png",
      "generacion/g1.2.png",
      "generacion/g1.3.png",
      "generacion/g1.png",
    ],
    procedimiento: [
      "Quitar resistencia R223.",
      "Quitar resistencia R280.",
      "Puentear con estaño la resistencia R283.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G1.png",
        detalle:
          "Ubicación: Resistencia R223 cerca del dispositivo marcado como ICB-IND. Viéndola de frente, se encuentra a la izquierda del cuadrado, justo en el medio, con cuatro resistencias alrededor.",
      },
      {
        img: "desbloqueo/p2G1.png",
        detalle:
          "Ubicación: Resistencia R280 próxima al dispositivo con marca ITE. Viéndola de frente, está en la parte superior, tercera resistencia contando desde la derecha, debajo de un bloque naranja más grande. En la foto ya aparece retirada.",
      },
      {
        img: "desbloqueo/p3G1.png",
        detalle:
          "Ubicación: Espacio vacío de R283 en la misma sección donde se quitó la resistencia anterior, hacia la izquierda. Se debe hacer un puente de estaño uniendo las dos puntas con soldador, rellenando el espacio.",
      },
    ],
  },
  {
    id: "G2",
    nombre: "Generación 2",
    marcas: ["Samsung"],
    caracteristicas: "Marca Samsung. Cámara frontal alargada...",
    indicadores: ["Marca Samsung", "Salida VGA"],
    imagenes: ["generacion/g2.1.png", "generacion/g2.png"],
    procedimiento: ["Realizar puente de estaño en pin 21 y 22."],
    desbloqueo: [
      {
        img: "desbloqueo/pinesG2.png",
        detalle:
          "Ubicación: Lado trasero de la placa madre. Puente de estaño en los pines 21 y 22 del chip TPM (también llamados 7 y 8). Raspar el plástico protector si lo cubre antes de soldar.",
      },
    ],
  },
  {
    id: "G3",
    nombre: "Generación 3",
    marcas: ["CDR", "DEPOT"],
    caracteristicas:
      "Bordes redondeados, manija fija (CDR) o sin manija (DEPOT).",
    indicadores: ["Manija fija o sin manija", "Carcasa robusta"],
    imagenes: [
      "generacion/g3.1.png",
      "generacion/g3.2.png",
      "generacion/g3.png",
    ],
    procedimiento: [
      "Quitar resistencia R180.",
      "Quitar resistencia R289.",
      "Quitar capacitor C146.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G3.png",
        detalle:
          "Ubicación: Resistencia R180 en el lado trasero, cerca del dispositivo ITE. Viéndolo de frente, está en la parte superior, sobre el borde superior derecho de un círculo en la placa.",
      },
      {
        img: "desbloqueo/p2G3.png",
        detalle:
          "Ubicación: Resistencia R289 en el lado trasero, próxima a la pila. Cerca del dispositivo ICS, lado izquierdo, segunda resistencia leyendo de abajo hacia arriba.",
      },
      {
        img: "desbloqueo/p3G3.png",
        detalle:
          "Ubicación: Capacitor C146 en el lado frontal, debajo del hueco de la RAM. Cerca de un objeto ovalado, rodeado por cuatro componentes grandes.",
      },
    ],
  },
  {
    id: "G4",
    nombre: "Generación 4",
    marcas: ["EXO", "CDR"],
    caracteristicas: "Manija plegable, posible entrada TDT.",
    indicadores: ["Manija plegable", "Entrada TDT"],
    imagenes: [
      "generacion/g4.1.png",
      "generacion/g4.2.png",
      "generacion/g4.png",
    ],
    procedimiento: [
      "Quitar resistencia R177 y capacitor C185.",
      "Quitar resistencia R307.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G4.png",
        detalle:
          "Ubicación: Resistencias R177 y C185 en el lado frontal, juntas una debajo de la otra. Están cerca de un dispositivo rectangular alargado y dos conectores, en la parte inferior derecha con la RAM arriba.",
      },
      {
        img: "desbloqueo/p2G4.png",
        detalle:
          "Ubicación: Resistencia R307 en el lado trasero, próxima al dispositivo ITE. Se encuentra en la parte superior del mismo, hacia el lado contrario del hueco del cooler.",
      },
    ],
  },
  {
    id: "G4.1",
    nombre: "Generación 4.1",
    marcas: ["EXO", "CDR"],
    caracteristicas: "Variante con desbloqueo por puente en chip TPM.",
    indicadores: ["Chip TPM visible", "Puente en pines "],
    imagenes: [
      "generacion/g41.png",
      "generacion/g41.2.png",
      "generacion/g41.3.png",
      "generacion/g414.png",
    ],
    procedimiento: ["Realizar puente de estaño en pin 21 y 22."],
    desbloqueo: [
      {
        img: "desbloqueo/puenteG4.1.png",
        detalle:
          "Ubicación: Lado trasero de la placa madre, cerca del cooler. Puente de estaño en los pines 21 y 22 del chip TPM (también llamados 7 y 8). Raspar el plástico protector si lo cubre antes de soldar.",
      },
    ],
  },
  {
    id: "G5/G6",
    nombre: "Generación 5 y 6",
    marcas: ["Noblex"],
    caracteristicas: "Cámara giratoria.",
    indicadores: ["Cámara giratoria", "Diseño moderno"],
    imagenes: [
      "generacion/g56x.png",
      "generacion/g56.1.png",
      "generacion/g56.2.png",
      "generacion/g56.png",
    ],
    procedimiento: [
      "Quitar resistencia R273.",
      "Quitar resistencia R114.",
      "Puentear con estaño la resistencia R112.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G56.png",
        detalle:
          "Ubicación: Resistencia R273 en el lado frontal, cerca del procesador. Se encuentra en el medio de la fila de resistencias.",
      },
      {
        img: "desbloqueo/p2G56.png",
        detalle:
          "Ubicación: Resistencia R114 en el lado trasero de la placa madre.",
      },
      {
        img: "desbloqueo/p3G56.png",
        detalle:
          "Ubicación: Espacio vacío de R112 en el lado trasero de la placa madre. Se debe hacer un puente de estaño uniendo las dos puntas con soldador, rellenando el espacio.",
      },
    ],
  },
];

// CUESTIONARIO REDUCIDO A Exactamente 4 PREGUNTAS
const wizardQuestions = [
  {
    key: "marca",
    title: "1. ¿Qué marca figura en la carcasa de la netbook?",
    options: [
      { label: "EXO", value: "EXO" },
      { label: "Banghó", value: "Bangho" },
      { label: "Positivo BGH", value: "BGH" },
      { label: "Samsung", value: "Samsung" },
      { label: "CDR / DEPOT", value: "CDR_DEPOT" },
      { label: "Noblex / Otra", value: "Noblex" },
    ],
  },
  {
    key: "camara",
    title: "2. ¿Cómo es la cámara web (webcam)?",
    options: [
      { label: "Giratoria / Rotativa (180°)", value: "giratoria" },
      { label: "Alargada y Horizontal", value: "horizontal" },
      { label: "Fija / Estándar", value: "fija" },
    ],
  },
  {
    key: "manija",
    title: "3. ¿Cuenta con manija de transporte integrada?",
    options: [
      { label: "Manija Plegable (se oculta)", value: "plegable" },
      { label: "Manija Fija (rígida)", value: "fija" },
      { label: "No tiene manija", value: "ninguna" },
    ],
  },
  {
    key: "bateria",
    title: "4. ¿Cómo es la batería del equipo?",
    options: [
      { label: "Extraíble (con trabas externas)", value: "extraible" },
      { label: "Interna (requiere desarme)", value: "interna" },
    ],
  },
];

let wizardState = { step: 0, answers: {} };
let activeProcedureGen = null;
let currentChecklistStatus = [];

function navigateTo(viewId) {
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

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => navigateTo(btn.dataset.target));
});

function startWizard() {
  wizardState.step = 0;
  wizardState.answers = {};
  renderWizardStep();
  navigateTo("view-identificar");
}

function renderWizardStep() {
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

function selectWizardOption(key, value) {
  wizardState.answers[key] = value;
  if (wizardState.step < wizardQuestions.length - 1) {
    wizardState.step++;
    renderWizardStep();
  } else {
    evaluateWizardResults();
  }
}

function prevWizardStep() {
  if (wizardState.step > 0) {
    wizardState.step--;
    renderWizardStep();
  }
}

function evaluateWizardResults() {
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

function showSingleResult(genObj, matchedTraits) {
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

function handleNoMatch() {
  showMultipleResults(
    [],
    "El equipo ingresado no coincide con la generación propuesta.",
  );
}

function showMultipleResults(genArray, msg) {
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
function loadProcedure(genId) {
  const gen = generaciones.find((g) => g.id === genId);
  if (!gen) return;

  activeProcedureGen = gen;
  document.getElementById("proc-gen-badge").textContent = gen.id;

  const container = document.getElementById("procedure-steps-container");
  container.innerHTML = "";
  document.getElementById("procedure-completion-card").style.display = "none";

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

function toggleStep(stepIdx) {
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

function renderGeneracionesCatalog() {
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

function renderAccordionInfo() {
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

function toggleAccordion(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains("active");

  document
    .querySelectorAll(".accordion-item")
    .forEach((el) => el.classList.remove("active"));
  if (!isOpen) item.classList.add("active");
}

// Función del Visor Modal de Imágenes
function openZoomImage(imgSrc) {
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

function openGenModal(genId) {
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

function openRegisterModal() {
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

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

function openExternalRegister() {
  if (REGISTRO_URL && REGISTRO_URL !== "PEGAR_AQUI_URL") {
    window.open(REGISTRO_URL, "_blank");
  } else {
    alert("La URL del registro externo no ha sido configurada.");
  }
}

function getHistory() {
  const data = localStorage.getItem("tso_netbooks_history");
  return data ? JSON.parse(data) : [];
}

function saveRecord() {
  const gen = document.getElementById("reg-input-gen").value;
  const marca = document.getElementById("reg-input-marca").value;
  const obs = document.getElementById("reg-input-obs").value;

  const record = {
    fecha: new Date().toLocaleDateString(),
    gen: gen || "N/A",
    marca: marca || "N/A",
    obs: obs || "-",
  };

  const history = getHistory();
  history.unshift(record);
  localStorage.setItem("tso_netbooks_history", JSON.stringify(history));

  closeModal();
  renderHistoryTable();
  navigateTo("view-registro");
}

function renderHistoryTable() {
  const tbody = document.getElementById("history-tbody");
  const history = getHistory();
  tbody.innerHTML = "";

  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Sin registros locales.</td></tr>`;
    return;
  }

  history.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>${item.fecha}</td>
                    <td><strong>${item.gen}</strong></td>
                    <td>${item.marca}</td>
                    <td>${item.obs}</td>
                `;
    tbody.appendChild(tr);
  });
}

function clearHistory() {
  if (confirm("¿Estás seguro de que deseas borrar el historial local?")) {
    localStorage.removeItem("tso_netbooks_history");
    renderHistoryTable();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderGeneracionesCatalog();
  renderAccordionInfo();
  renderHistoryTable();
});
