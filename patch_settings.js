import fs from 'fs';

// 1. Añadir getUserProfile a auth.js
let auth = fs.readFileSync('auth.js', 'utf8');
const userProfileFunc = `
export async function getUserProfile() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const userId = session.user.id;
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  return {
    email: session.user.email,
    proyecto: perfil?.proyecto || "N/A",
    rol: perfil?.rol || "Técnico/Estudiante"
  };
}
`;
auth = auth.replace('// Lógica para manejar los formularios', userProfileFunc + '\n// Lógica para manejar los formularios');
fs.writeFileSync('auth.js', auth);

