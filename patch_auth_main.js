import fs from 'fs';

// 1. Modificar auth.js
let auth = fs.readFileSync('auth.js', 'utf8');

auth = auth.replace(
  /export async function checkAuth\(\) \{[\s\S]*?\}  \}\n\}/m,
  `export async function checkAuth() {
  if (!supabase) {
    console.warn("Autenticación omitida: faltan credenciales de Supabase.");
    return false;
  }
  // 1. Verificamos si hay una sesión activa en Supabase
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    // No hay sesión, redirigir al login
    window.location.href = "login.html";
    return false;
  }
  // 2. Si hay sesión, verificamos en la tabla 'perfiles' si pertenece al proyecto correspondiente
  const userId = session.user.id;
  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("proyecto")
    .eq("id", userId)
    .single();
  // 3. Validar si existe el perfil y si el proyecto es el correcto
  if (perfilError || !perfil || perfil.proyecto !== "reparacion_netbooks") {
    alert(
      "Acceso denegado: No tienes permisos para acceder a esta aplicación.",
    );
    // Cerramos la sesión por seguridad
    await supabase.auth.signOut();
    window.location.href = "login.html";
    return false;
  }
  return true;
}`
);

fs.writeFileSync('auth.js', auth);

// 2. Modificar main.js
let main = fs.readFileSync('main.js', 'utf8');

main = main.replace(
  /window\.addEventListener\("DOMContentLoaded", async \(\) => \{[\s\S]*?await checkAuth\(\);/m,
  `window.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  // Para evitar destellos de la interfaz, la ocultamos hasta validar la sesión
  document.body.style.display = "none";
  
  // 1. Validar autenticación con Supabase antes de cargar el contenido
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    // checkAuth ya se encarga de redirigir, detenemos la carga de la vista
    return;
  }
  
  // Mostrar la interfaz si la validación es correcta
  document.body.style.display = "";`
);

fs.writeFileSync('main.js', main);
