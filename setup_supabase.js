const fs = require("fs");

// 1. Create supabaseClient.js
const supabaseClientCode = `import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://lihcbyeukrglqtyxfchh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SCLopsc7mvq3lbVRYVeZYQ_MEyrPGf1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
`;
fs.writeFileSync("supabaseClient.js", supabaseClientCode);

// 2. Modify auth.js
let authCode = fs.readFileSync("auth.js", "utf8");

// The original import and init might be smushed
authCode = authCode.replace(
  /import \{ createClient \} from "https:\/\/cdn.jsdelivr.net\/npm\/@supabase\/supabase-js@2\/\+esm";.*?\}\) \{  supabase = createClient\(SUPABASE_URL, SUPABASE_ANON_KEY\);\} else \{  console.warn\(    "Supabase no está configurado. Por favor ingresa credenciales válidas en auth.js.",  );\}/,
  'import { supabase } from "./supabaseClient.js";',
);

// In case the replacement failed due to formatting, let's try a regex
authCode = authCode.replace(
  /import \{ createClient \}.*?\}\);\}/s,
  'import { supabase } from "./supabaseClient.js";',
);
authCode = authCode.replace(
  /import \{ createClient \} from 'https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\/\+esm';.*?console\.warn\("Supabase no está configurado\. Por favor ingresa credenciales válidas en auth\.js\."\);?\}/s,
  'import { supabase } from "./supabaseClient.js";',
);
authCode = authCode.replace(
  /import \{ createClient \} from "https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\/\+esm";.*?console\.warn\(\s*"Supabase no está configurado\. Por favor ingresa credenciales válidas en auth\.js\.",\s*\);?\}/s,
  'import { supabase } from "./supabaseClient.js";',
);

fs.writeFileSync("auth.js", authCode);

console.log("Done");
