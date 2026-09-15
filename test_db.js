import { supabase } from './supabaseClient.js';
async function test() {
  const { data, error } = await supabase.from('registro_reparaciones').select('*').limit(1);
  console.log(data, error);
}
test();
