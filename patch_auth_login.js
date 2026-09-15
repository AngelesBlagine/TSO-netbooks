import fs from 'fs';
let auth = fs.readFileSync('auth.js', 'utf8');

const loginCheckLogic = `document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Verificar si ya hay sesión iniciada al entrar en login o registro
  if (loginForm || registerForm) {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "index.html";
        return;
      }
    }
  }

  // LOGIC PARA INICIAR SESIÓN`;

auth = auth.replace(
  'document.addEventListener("DOMContentLoaded", () => {\n  const loginForm = document.getElementById("login-form");\n  const registerForm = document.getElementById("register-form");\n\n  // LOGIC PARA INICIAR SESIÓN',
  loginCheckLogic
);

// Fallback if the strict replace above fails
if (!auth.includes('Verificar si ya hay sesión iniciada')) {
    auth = auth.replace(
        'document.addEventListener("DOMContentLoaded", () => {\n  const loginForm = document.getElementById("login-form");\n  const registerForm = document.getElementById("register-form");',
        `document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm || registerForm) {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "index.html";
        return;
      }
    }
  }`
    );
}

fs.writeFileSync('auth.js', auth);
