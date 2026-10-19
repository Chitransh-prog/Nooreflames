import fs from 'fs';
import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

async function syncToDisk() {
  const sql = neon(DEFAULT_NEON_URL);
  const rows = await sql`SELECT data FROM store_data WHERE key = 'main' LIMIT 1;`;
  const store = rows[0].data;
  fs.writeFileSync('./data/store.json', JSON.stringify(store, null, 2), 'utf8');
  console.log('Synchronized data/store.json! Total products:', store.products.length);
  console.log('Attars:', store.products.filter((p) => p.productType === 'ATTAR').map((p) => p.id));
}

syncToDisk();
