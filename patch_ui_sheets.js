import fs from 'fs';

let ui = fs.readFileSync('ui.js', 'utf8');

// Replace openExternalRegister
const oldRegex = /export function openExternalRegister\(\) \{[\s\S]*?\}\n/m;

const newFuncs = `export async function cargarDesdeSheets() {
  const container = document.getElementById("sheets-data-container");
  const btn = document.getElementById("btn-load-sheets");
  if (!container || !btn) return;

  container.style.display = "block";
  container.innerHTML = "<p style='color: var(--text-muted); text-align: center; margin: 1rem 0;'>Cargando datos desde Sheets, por favor esperá...</p>";
  btn.disabled = true;

  try {
    const { getUserProfile } = await import("./auth.js");
    const profile = await getUserProfile();
    const userEmail = profile ? profile.email : null;

    if (!userEmail) {
      container.innerHTML = "<p style='color: var(--error); text-align: center;'>No se pudo obtener el email del usuario logueado.</p>";
      btn.disabled = false;
      return;
    }

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7u_8E_HO8oyY-1jT1kSpskkQQKCBosSRS5-6czjswjHJxe28S1X1RpUaz6t4DJEUZTg/exec';
    const response = await fetch(\`\${SCRIPT_URL}?email=\${encodeURIComponent(userEmail)}\`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      if (data && data.length > 0) {
        renderSheetsData(data, container);
      } else {
        container.innerHTML = "<p style='color: var(--text-muted); text-align: center; margin: 1rem 0;'>No se encontraron registros en la planilla para tu usuario.</p>";
      }
    } else {
      container.innerHTML = \`<p style='color: var(--error); text-align: center;'>Error del Apps Script: \${result.error}</p>\`;
    }
  } catch (error) {
    container.innerHTML = \`<p style='color: var(--error); text-align: center;'>Error de red al consultar Google Sheets: \${error.message}</p>\`;
  } finally {
    btn.disabled = false;
  }
}

function renderSheetsData(data, container) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);

  let tableHtml = \`<table class="history-table" style="min-width: 600px; font-size: 0.85rem;"><thead><tr>\`;
  headers.forEach(h => {
    // Basic formatting for headers: capitalize first letter
    const headerTitle = h.charAt(0).toUpperCase() + h.slice(1);
    tableHtml += \`<th>\${headerTitle}</th>\`;
  });
  tableHtml += \`</tr></thead><tbody>\`;

  data.forEach(row => {
    tableHtml += \`<tr>\`;
    headers.forEach(h => {
      let cellValue = row[h];
      // Quick check if date string to format it better if needed, else just print
      if (cellValue === undefined || cellValue === null || cellValue === "") cellValue = "-";
      tableHtml += \`<td>\${cellValue}</td>\`;
    });
    tableHtml += \`</tr>\`;
  });

  tableHtml += \`</tbody></table>\`;
  container.innerHTML = tableHtml;
}
`;

if (ui.match(oldRegex)) {
  ui = ui.replace(oldRegex, newFuncs + '\n');
} else {
  // Append if not found
  ui += '\n' + newFuncs;
}

fs.writeFileSync('ui.js', ui);

