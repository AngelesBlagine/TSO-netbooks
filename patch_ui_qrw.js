import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const qrwLogic = `
let qrwState = {
  step: 1,
  totalSteps: 8,
  data: {}
};

const qrwStepsConfig = [
  {
    id: "identificacion",
    title: "Identificación de la Netbook",
    desc: "Corresponde al valor que aparece escrito con fibra sobre la cinta de papel.",
    type: "text",
    placeholder: "Ej: A-12",
    required: true
  },
  {
    id: "marca",
    title: "Marca del Equipo",
    desc: "Ingresá la marca de la netbook.",
    type: "text",
    placeholder: "Ej: Coradir, Novatech..."
  },
  {
    id: "n_serie",
    title: "Número de Serie",
    desc: "Identificador único de fábrica del equipo.",
    type: "text",
    placeholder: "Ej: NT2018..."
  },
  {
    id: "generacion",
    title: "Generación",
    desc: "Generación a la que pertenece la netbook.",
    type: "text",
    placeholder: "Ej: G5"
  },
  {
    id: "bloqueada",
    title: "¿El equipo está bloqueado?",
    desc: "Indicá si la netbook presenta pantalla de bloqueo de hardware.",
    type: "select",
    options: ["No", "Sí"]
  },
  {
    id: "bateria",
    title: "Estado de Batería",
    desc: "Indicá si retiene carga, si está inflada o ausente.",
    type: "text",
    placeholder: "Ej: Retiene carga, Ausente..."
  },
  {
    id: "observaciones",
    title: "Observaciones",
    desc: "Detalles adicionales sobre el estado del equipo.",
    type: "textarea",
    placeholder: "Falta tecla A, pantalla rayada..."
  },
  {
    id: "situacion_final",
    title: "Situación Final",
    desc: "Estado en el que queda el equipo tras la intervención.",
    type: "select",
    options: ["Pendiente", "Reparada", "No reparable"]
  }
];

export function initQrw() {
  qrwState.step = 1;
  qrwState.data = {};
  renderQrwStep();
}

export function qrwNext() {
  const currentConfig = qrwStepsConfig[qrwState.step - 1];
  const input = document.getElementById('qrw-input');
  
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
    const input = document.getElementById('qrw-input');
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
    const input = document.getElementById('qrw-input');
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

  document.getElementById("qrw-step-label").textContent = \`Paso \${qrwState.step} / \${qrwState.totalSteps}\`;
  document.getElementById("qrw-progress").style.width = \`\${(qrwState.step / qrwState.totalSteps) * 100}%\`;

  let inputHtml = "";
  if (currentConfig.type === "text") {
    inputHtml = \`<input type="text" id="qrw-input" placeholder="\${currentConfig.placeholder}" value="\${currentValue}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem;" oninput="checkQrwInput()">\`;
  } else if (currentConfig.type === "textarea") {
    inputHtml = \`<textarea id="qrw-input" placeholder="\${currentConfig.placeholder}" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem; resize: vertical;" oninput="checkQrwInput()">\${currentValue}</textarea>\`;
  } else if (currentConfig.type === "select") {
    const optionsHtml = currentConfig.options.map(opt => 
      \`<option value="\${opt}" \${currentValue === opt ? 'selected' : ''}>\${opt}</option>\`
    ).join("");
    inputHtml = \`<select id="qrw-input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem;" onchange="checkQrwInput()">\${optionsHtml}</select>\`;
  }

  container.innerHTML = \`
    <div class="question-title" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">
      \${currentConfig.title} \${currentConfig.required ? '<span style="color: var(--error);">*</span>' : ''}
    </div>
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">\${currentConfig.desc}</p>
    \${inputHtml}
  \`;

  const btnPrev = document.getElementById("qrw-btn-prev");
  const btnNext = document.getElementById("qrw-btn-next");

  btnPrev.disabled = (qrwState.step === 1);
  btnNext.textContent = (qrwState.step === qrwState.totalSteps) ? "Finalizar y Guardar" : "Siguiente →";
  
  checkQrwInput();
}

async function finishQrw() {
  const btnNext = document.getElementById("qrw-btn-next");
  const btnPrev = document.getElementById("qrw-btn-prev");
  
  btnNext.disabled = true;
  btnPrev.disabled = true;
  btnNext.textContent = "Guardando...";

  if (!supabase) {
    alert("Error: Supabase no está configurado.");
    btnNext.disabled = false;
    btnNext.textContent = "Finalizar y Guardar";
    return;
  }

  const { getUserProfile } = await import("./auth.js");
  const profile = await getUserProfile();
  const currentUserEmail = profile ? profile.email : "desconocido@email.com";

  const { error } = await supabase.from("registro_reparaciones").insert([
    {
      identificacion: qrwState.data.identificacion || "",
      marca: qrwState.data.marca || "",
      n_serie: qrwState.data.n_serie || "",
      generacion: qrwState.data.generacion || "",
      bloqueada: qrwState.data.bloqueada || "No",
      bateria: qrwState.data.bateria || "",
      observaciones: qrwState.data.observaciones || "",
      situacion_final: qrwState.data.situacion_final || "Pendiente",
      responsable: currentUserEmail
    }
  ]);

  if (error) {
    alert("Error al guardar en Supabase: " + error.message);
    btnNext.disabled = false;
    btnNext.textContent = "Finalizar y Guardar";
    btnPrev.disabled = false;
    return;
  }

  // Refresh tables
  await cargarRegistros();

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
  
  // Patch: to show buttons again on next initQrw, we need to modify initQrw or renderQrwStep
}
`;

// To make sure buttons show again, let's patch renderQrwStep inside the string
const patchedQrwLogic = qrwLogic.replace(
  '  btnPrev.disabled = (qrwState.step === 1);',
  '  btnPrev.style.display = "block";\n  btnNext.style.display = "block";\n  btnPrev.disabled = (qrwState.step === 1);'
);

ui = ui + '\n' + patchedQrwLogic;
fs.writeFileSync('ui.js', ui);

