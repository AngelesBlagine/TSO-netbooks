import fs from 'fs';

let css = fs.readFileSync('styles.css', 'utf8');

// Replace everything from :root to the end of body.dark-theme with our new theme system
const regex = /:root\s*\{[^}]+\}\s*body\.dark-theme\s*\{[^}]+\}/m;

const newThemes = `
:root, [data-theme-mode="light"] {
  /* Light Mode - Base */
  --bg-main: #f6f8f7;
  --bg-body: #f6f8f7; /* Adding bg-body just in case, used in UI */
  --warning-bg: #fff5d6;
  --warning: #f2c94c;
  --error: #e96a6a;
  --text-main: #17252f;
  --text-muted: #66737a;
  --white: #ffffff;
  --border: #e2e8e5;
  --shadow: 0 4px 12px rgba(23, 37, 47, 0.05);
  
  --radius-card: 12px;
  --radius-btn: 8px;
  --transition: all 0.2s ease-in-out;
}

[data-theme-mode="dark"] {
  /* Dark Mode - Base */
  --bg-main: #121212;
  --bg-body: #121212;
  --warning-bg: #4a3d13;
  --warning: #f2c94c;
  --error: #ef5350;
  --text-main: #e0e0e0;
  --text-muted: #9e9e9e;
  --white: #1e1e1e;
  --border: #333333;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 
  Colors 
  data-theme-color="coral" (default)
*/
:root,
[data-theme-mode="light"][data-theme-color="coral"] {
  --primary: #F06E55;
  --primary-dark: #D4543D;
  --primary-light: #FDE8E4;
}
[data-theme-mode="dark"][data-theme-color="coral"] {
  --primary: #FF8A65;
  --primary-dark: #F06E55;
  --primary-light: #4A231C;
}

/* data-theme-color="indigo" */
[data-theme-mode="light"][data-theme-color="indigo"] {
  --primary: #4F46E5;
  --primary-dark: #4338CA;
  --primary-light: #E0E7FF;
}
[data-theme-mode="dark"][data-theme-color="indigo"] {
  --primary: #818CF8;
  --primary-dark: #6366F1;
  --primary-light: #1E1B4B;
}

/* data-theme-color="borgona" */
[data-theme-mode="light"][data-theme-color="borgona"] {
  --primary: #8A1538;
  --primary-dark: #5C0C24;
  --primary-light: #F5E6EA;
}
[data-theme-mode="dark"][data-theme-color="borgona"] {
  --primary: #E05D7C;
  --primary-dark: #B23A5B;
  --primary-light: #3D101C;
}

/* Backwards compatibility for toggleTheme in ui.js (adds .dark-theme to body) */
body.dark-theme {
  --bg-main: #121212;
  --bg-body: #121212;
  --warning-bg: #4a3d13;
  --error: #ef5350;
  --text-main: #e0e0e0;
  --text-muted: #9e9e9e;
  --white: #1e1e1e;
  --border: #333333;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
`;

css = css.replace(regex, newThemes.trim());

// We'll also add some CSS for the theme toggle UI (swatches) at the end of styles.css
const swatchCss = `
.theme-options {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
}
.swatch:hover {
  transform: scale(1.1);
}
.swatch.active {
  border-color: var(--text-main);
}
.swatch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.mode-toggle {
  display: flex;
  background-color: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 0.5rem;
}
.mode-toggle button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}
.mode-toggle button.active {
  background-color: var(--primary);
  color: white;
}
`;
css += '\n' + swatchCss;

fs.writeFileSync('styles.css', css);
console.log('styles.css updated');
