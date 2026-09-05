import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/infrastructure/persistence/database.types.js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.DEMO_USER_EMAIL ?? 'demo@rembuktani.local';

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const main = async (): Promise<void> => {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const user = data.users.find((candidate) => candidate.email === email);
  if (!user) {
    console.log(`No demo user found for ${email}`);
    return;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('user_id', user.id);
  if (profileError) throw profileError;

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) throw deleteError;
  console.log(`Deleted demo user and related RembukTani data for ${email}`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
