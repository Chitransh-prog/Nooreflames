import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

async function check() {
  const sql = neon(DEFAULT_NEON_URL);
  const rows = await sql`SELECT key, updated_at, jsonb_array_length(data->'products') as count FROM store_data;`;
  console.log('Neon store_data rows:', rows);
}

check();
