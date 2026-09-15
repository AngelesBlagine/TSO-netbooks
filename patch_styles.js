import fs from 'fs';
let css = fs.readFileSync('styles.css', 'utf8');

const darkTheme = `
body.dark-theme {
  --bg-main: #121212;
  --primary: #2ebc96;
  --primary-dark: #249b7a;
  --primary-light: #1f3832;
  --warning-bg: #4a3d13;
  --warning: #f2c94c;
  --error: #ef5350;
  --text-main: #e0e0e0;
  --text-muted: #9e9e9e;
  --white: #1e1e1e;
  --border: #333333;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

header, .card, .btn, input, textarea, select, table th, table td, .modal-content, .badge {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}
`;

css = css.replace('}', '}' + darkTheme);

fs.writeFileSync('styles.css', css);
