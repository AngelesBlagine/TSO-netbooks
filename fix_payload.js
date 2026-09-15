import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

const oldPayloadStr = `    const payload = {
      action: "add",
      email: currentUserEmail,
      data: {
        identificacion: qrwState.data.identificacion || "",
        marca: qrwState.data.marca || "",
        n_serie: qrwState.data.n_serie || "",
        generacion: qrwState.data.generacion || "",
        bloqueada: qrwState.data.bloqueada || "No",
        bateria: qrwState.data.bateria || "",
        observaciones: qrwState.data.observaciones || "",
        situacion_final: qrwState.data.situacion_final || "Pendiente",
      },
    };`;

const newPayloadStr = `    const valorId = qrwState.data.identificacion || "";
    const payload = {
      action: "add",
      email: currentUserEmail,
      id: String(valorId),
      data: {
        identificacion: valorId,
        "Identificación": valorId,
        marca: qrwState.data.marca || "",
        n_serie: qrwState.data.n_serie || "",
        generacion: qrwState.data.generacion || "",
        bloqueada: qrwState.data.bloqueada || "No",
        bateria: qrwState.data.bateria || "",
        observaciones: qrwState.data.observaciones || "",
        situacion_final: qrwState.data.situacion_final || "Pendiente",
      },
    };
    
    console.log("Payload enviado a Apps Script:", payload);`;

ui = ui.replace(oldPayloadStr, newPayloadStr);

fs.writeFileSync('ui.js', ui);
