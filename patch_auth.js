import fs from 'fs';
let code = fs.readFileSync('auth.js', 'utf8');

code = code.replace(
  'console.warn("Autenticación omitida: faltan credenciales de Supabase.");\n    return;',
  'console.warn("Autenticación omitida: faltan credenciales de Supabase.");\n    return false;'
);

code = code.replace(
  'window.location.href = "login.html";\n    return;',
  'window.location.href = "login.html";\n    return false;'
);

code = code.replace(
  'window.location.href = "login.html";\n  }\n}',
  'window.location.href = "login.html";\n    return false;\n  }\n  return true;\n}'
);

fs.writeFileSync('auth.js', code);
