import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const oldRender = /function renderQrwStep\(\) \{[\s\S]*?async function finishQrw/m;

const newRender = `function renderQrwStep() {
  const container = document.getElementById("qrw-step-container");
  if (!container) return;

  const currentConfig = qrwStepsConfig[qrwState.step - 1];
  const currentValue = qrwState.data[currentConfig.id] || "";

  document.getElementById("qrw-step-label").textContent =
    \`Paso \${qrwState.step} / \${qrwState.totalSteps}\`;
  document.getElementById("qrw-progress").style.width =
    \`\${(qrwState.step / qrwState.totalSteps) * 100}%\`;

  let inputHtml = "";
  if (currentConfig.type === "text") {
    inputHtml = \`<input type="text" id="qrw-input" placeholder="\${currentConfig.placeholder}" value="\${currentValue}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem;" oninput="checkQrwInput()">\`;
  } else if (currentConfig.type === "textarea") {
    inputHtml = \`<textarea id="qrw-input" placeholder="\${currentConfig.placeholder}" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem; resize: vertical;" oninput="checkQrwInput()">\${currentValue}</textarea>\`;
  } else if (currentConfig.type === "select") {
    const optionsHtml = currentConfig.options
      .map(
        (opt) =>
          \`<option value="\${opt}" \${currentValue === opt ? "selected" : ""}>\${opt || "Seleccionar..."}</option>\`,
      )
      .join("");
    inputHtml = \`<select id="qrw-input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-size: 1rem; background-color: var(--bg-main); color: var(--text-main);" onchange="checkQrwInput()">\${optionsHtml}</select>\`;
  } else if (currentConfig.type === "chips") {
    const chipsHtml = currentConfig.options
      .map((opt) => {
        const isSelected = currentValue === opt;
        return \`<button type="button" class="btn \${isSelected ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.5rem 1rem; margin: 0.25rem; font-size: 0.9rem; width: auto; display: inline-block; flex-grow: 1; flex-basis: 30%;" onclick="document.getElementById('qrw-input').value = '\${opt}'; document.querySelectorAll('.chip-btn').forEach(b => b.classList.replace('btn-primary', 'btn-secondary')); this.classList.replace('btn-secondary', 'btn-primary'); checkQrwInput();">\${opt}</button>\`;
      })
      .join("");
      
    inputHtml = \`
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start; margin-bottom: 1rem;">
        \${chipsHtml.replace(/btn /g, 'btn chip-btn ')}
      </div>
      <input type="hidden" id="qrw-input" value="\${currentValue}">
      \${currentConfig.footerInfo ? \`<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">\${currentConfig.footerInfo}</p>\` : ''}
    \`;
  }

  container.innerHTML = \`
    <div class="question-title" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">
      \${currentConfig.title} \${currentConfig.required ? '<span style="color: var(--error);">*</span>' : ""}
    </div>
    \${currentConfig.desc ? \`<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">\${currentConfig.desc}</p>\` : ''}
    \${inputHtml}
  \`;

  const btnPrev = document.getElementById("qrw-btn-prev");
  const btnNext = document.getElementById("qrw-btn-next");

  btnPrev.style.display = "block";
  btnNext.style.display = "block";
  btnPrev.disabled = qrwState.step === 1;
  btnNext.textContent =
    qrwState.step === qrwState.totalSteps
      ? "Finalizar y Guardar"
      : "Siguiente →";

  checkQrwInput();
}

async function finishQrw`;

ui = ui.replace(oldRender, newRender);

fs.writeFileSync('ui.js', ui);
