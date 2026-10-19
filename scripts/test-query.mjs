import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

async function test() {
  const sql = neon(DEFAULT_NEON_URL);
  const rows = await sql`SELECT data FROM store_data WHERE key = 'main';`;
  const store = rows[0]?.data;
  if (store) {
    fs.writeFileSync('data/store.json', JSON.stringify(store, null, 2), 'utf8');
    console.log('Successfully wrote Neon data to data/store.json! Total products:', store.products?.length);
    const attars = store.products.filter(p => p.productType === 'ATTAR');
    console.log('Attars in file:', attars.map(a => a.id));
  }
}

test();
