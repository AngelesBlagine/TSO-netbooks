import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// 1. Modificar cargarDesdeSheets
ui = ui.replace(
  'renderSheetsData(data, container);',
  'renderSheetsData(data, container, userEmail);'
);

// 2. Reemplazar renderSheetsData completamente
const oldRenderRegex = /function renderSheetsData\(data, container\) \{[\s\S]*?\}\n/m;
const newRenderData = `function renderSheetsData(data, container, userEmail) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  let tableHtml = \`<table class="history-table" style="min-width: 600px; font-size: 0.85rem;"><thead><tr>\`;
  headers.forEach((h) => {
    const headerTitle = h.charAt(0).toUpperCase() + h.slice(1);
    tableHtml += \`<th>\${headerTitle}</th>\`;
  });
  tableHtml += \`<th>Acciones</th></tr></thead><tbody>\`;
  data.forEach((row) => {
    tableHtml += \`<tr>\`;
    let isOwner = false;
    let identificacion = '';

    headers.forEach((h) => {
      let cellValue = row[h];
      if (cellValue === undefined || cellValue === null || cellValue === "") cellValue = "-";
      tableHtml += \`<td>\${cellValue}</td>\`;
      
      // Check if user is owner by matching email in any column
      if (typeof cellValue === 'string' && cellValue.toLowerCase().trim() === userEmail.toLowerCase().trim()) {
        isOwner = true;
      }
      
      // Attempt to identify the 'id' column
      const lowerH = h.toLowerCase();
      if (lowerH.includes('identificaci') || lowerH === 'id') {
        identificacion = cellValue;
      }
    });

    if (!identificacion && headers.length > 0) {
      identificacion = row[headers[0]];
    }

    tableHtml += \`<td>\`;
    if (isOwner) {
      tableHtml += \`<button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onclick="liberarEquipo('\${identificacion}', '\${userEmail}')">Liberar Equipo</button>\`;
    } else {
      tableHtml += \`-\`;
    }
    tableHtml += \`</td></tr>\`;
  });
  tableHtml += \`</tbody></table>\`;
  container.innerHTML = tableHtml;
}

export async function liberarEquipo(identificacion, userEmail) {
  if (!confirm(\`¿Estás seguro que deseas liberar el equipo \${identificacion}?\`)) return;
  
  const container = document.getElementById("sheets-data-container");
  const originalHtml = container.innerHTML;
  container.innerHTML = "<p style='color: var(--text-muted); text-align: center; margin: 1rem 0;'>Liberando equipo, por favor esperá...</p>";
  
  try {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec";
    const payload = { action: 'delete', email: userEmail, id: identificacion };
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    if (result.success) {
      alert("Equipo liberado exitosamente.");
      await cargarDesdeSheets();
    } else {
      alert("Error al liberar el equipo: " + (result.error || "Desconocido"));
      container.innerHTML = originalHtml;
    }
  } catch (error) {
    console.error("Error liberando equipo:", error);
    alert("Error de red al intentar liberar el equipo.");
    container.innerHTML = originalHtml;
  }
}
`;

ui = ui.replace(oldRenderRegex, newRenderData);

fs.writeFileSync('ui.js', ui);
