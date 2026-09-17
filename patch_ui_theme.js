import fs from 'fs';
let ui = fs.readFileSync('ui.js', 'utf8');

const newThemeLogic = `
export function setThemeMode(mode) {
  document.body.setAttribute("data-theme-mode", mode);
  localStorage.setItem("app_theme_mode", mode);
  
  const btnLight = document.getElementById("theme-btn-light");
  const btnDark = document.getElementById("theme-btn-dark");
  if (btnLight && btnDark) {
    if (mode === "dark") {
      btnDark.classList.add("active");
      btnLight.classList.remove("active");
    } else {
      btnLight.classList.add("active");
      btnDark.classList.remove("active");
    }
  }
}

export function setThemeColor(color) {
  document.body.setAttribute("data-theme-color", color);
  localStorage.setItem("app_theme_color", color);
  
  const swatches = ["coral", "indigo", "borgona"];
  swatches.forEach(c => {
    const el = document.getElementById("swatch-" + c);
    if (el) {
      if (c === color) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    }
  });
}

export function initTheme() {
  let savedMode = localStorage.getItem("app_theme_mode");
  let savedColor = localStorage.getItem("app_theme_color");
  
  if (!savedMode) {
    // Check OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      savedMode = "dark";
    } else {
      savedMode = "light";
    }
  }
  if (!savedColor) {
    savedColor = "coral"; // default
  }
  
  setThemeMode(savedMode);
  setThemeColor(savedColor);
}
`;

const regex = /export function toggleTheme\(\) \{[\s\S]*?\}\s*function updateThemeIcon\(isDark\) \{[\s\S]*?\}/;
ui = ui.replace(regex, newThemeLogic.trim());

// We also need to remove toggleTheme if it's exported in main.js, and add setThemeMode, setThemeColor
fs.writeFileSync('ui.js', ui);
console.log('ui.js updated');
