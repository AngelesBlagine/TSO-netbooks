import { supabase } from "./supabaseClient.js";

export async function checkAuth() {
  if (!supabase) {
    console.warn("Autenticación omitida: faltan credenciales de Supabase.");
    return;
  }

  // 1. Verificamos si hay una sesión activa en Supabase
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    // No hay sesión, redirigir al login
    window.location.href = "login.html";
    return;
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
  }
}

// Lógica para manejar los formularios
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // LOGIC PARA INICIAR SESIÓN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMsg = document.getElementById("error-msg");
      const btnSubmit = document.getElementById("btn-submit");

      errorMsg.style.display = "none";
      btnSubmit.textContent = "Cargando...";
      btnSubmit.disabled = true;

      if (!supabase) {
        errorMsg.textContent =
          "Supabase no está configurado. Revisa las credenciales en auth.js";
        errorMsg.style.display = "block";
        btnSubmit.textContent = "Iniciar Sesión";
        btnSubmit.disabled = false;
        return;
      }

      // Intentamos iniciar sesión con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Mostrar error al usuario
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
        btnSubmit.textContent = "Iniciar Sesión";
        btnSubmit.disabled = false;
      } else {
        // Éxito, redirigir al dashboard/index
        window.location.href = "index.html";
      }
    });
  }

  // LOGIC PARA REGISTRO
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const clave = document.getElementById("reg-clave").value;
      const errorMsg = document.getElementById("reg-error-msg");
      const btnSubmit = document.getElementById("reg-btn-submit");

      errorMsg.style.display = "none";
      btnSubmit.textContent = "Verificando cátedra...";
      btnSubmit.disabled = true;

      if (!supabase) {
        errorMsg.textContent = "Supabase no está configurado.";
        errorMsg.style.display = "block";
        btnSubmit.textContent = "Registrarse";
        btnSubmit.disabled = false;
        return;
      }

      // 1. Verificar la clave de cátedra
      console.log("=== INICIANDO VALIDACIÓN DE CÁTEDRA ===");
      console.log("Clave ingresada por el usuario:", clave);

      const { data: catedraData, error: catedraError } = await supabase
        .from("configuracion_catedra")
        .select("*");

      console.log("Error de Supabase:", catedraError);
      console.log("Data cruda devuelta por Supabase:", catedraData);

      if (catedraError) {
        errorMsg.textContent = "Error al conectar con la base de datos.";
        errorMsg.style.display = "block";
        btnSubmit.textContent = "Registrarse";
        btnSubmit.disabled = false;
        return;
      }

      // Validar buscando si alguna fila coincide (ya que .single() puede fallar si la tabla tiene 0 o más de 1 fila, o por formato)
      // Asumo que la columna se llama 'clave_registro' como indicaste, o 'clave'. Ajustalo si es necesario.
      const claveCorrecta =
        catedraData &&
        catedraData.length > 0 &&
        catedraData.some(
          (row) => row.clave_registro === clave || row.clave === clave,
        );

      console.log("¿La clave coincide con algún registro?:", claveCorrecta);

      if (!claveCorrecta) {
        errorMsg.textContent = "Clave de cátedra incorrecta.";
        errorMsg.style.display = "block";
        btnSubmit.textContent = "Registrarse";
        btnSubmit.disabled = false;
        return;
      }

      btnSubmit.textContent = "Creando cuenta...";

      // 2. Registrar al usuario
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        errorMsg.textContent = signUpError.message;
        errorMsg.style.display = "block";
        btnSubmit.textContent = "Registrarse";
        btnSubmit.disabled = false;
        return;
      }

      // 3. Crear el perfil asociándolo al proyecto reparacion_netbooks
      if (signUpData.user) {
        btnSubmit.textContent = "Configurando perfil...";
        const { error: profileError } = await supabase.from("perfiles").insert([
          {
            id: signUpData.user.id,
            email: signUpData.user.email,
            proyecto: "reparacion_netbooks",
          },
        ]);

        if (profileError) {
          errorMsg.textContent =
            "Error al configurar el perfil: " + profileError.message;
          errorMsg.style.display = "block";
          btnSubmit.textContent = "Registrarse";
          btnSubmit.disabled = false;
          return;
        }
      }

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    });
  }
});
