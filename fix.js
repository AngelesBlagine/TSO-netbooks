import fs from "fs";

// 1. Create supabaseClient.js
const supabaseClientCode = `import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://lihcbyeukrglqtyxfchh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SCLopsc7mvq3lbVRYVeZYQ_MEyrPGf1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
`;
fs.writeFileSync("supabaseClient.js", supabaseClientCode);

// 2. Modify auth.js
let authCode = fs.readFileSync("auth.js", "utf8");
const searchString = `import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";// IMPORTANTE: Reemplaza estas constantes con tus credenciales reales de Supabaseconst SUPABASE_URL = "https://lihcbyeukrglqtyxfchh.supabase.co";const SUPABASE_ANON_KEY = "sb_publishable_SCLopsc7mvq3lbVRYVeZYQ_MEyrPGf1";export let supabase = null;if (SUPABASE_URL.startsWith("http")) {  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);} else {  console.warn(    "Supabase no está configurado. Por favor ingresa credenciales válidas en auth.js.",  );}`;

if (authCode.includes(searchString)) {
  authCode = authCode.replace(
    searchString,
    'import { supabase } from "./supabaseClient.js";',
  );
} else {
  // Let's just use substring matching
  const endIndex = authCode.indexOf("export async function checkAuth()");
  if (endIndex !== -1) {
    authCode =
      'import { supabase } from "./supabaseClient.js";\n\n' +
      authCode.substring(endIndex);
  }
}
fs.writeFileSync("auth.js", authCode);

// 3. Modify ui.js
let uiCode = fs.readFileSync("ui.js", "utf8");
uiCode = uiCode.replace(
  /import\s*\{\s*supabase\s*\}\s*from\s*['"].\/auth\.js['"];?/g,
  'import { supabase } from "./supabaseClient.js";',
);
fs.writeFileSync("ui.js", uiCode);

console.log("Success");
