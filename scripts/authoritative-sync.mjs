import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { ATTARS_DATA } from './update-attars.mjs';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

async function authoritativeSync() {
  const connStr = process.env.DATABASE_URL || DEFAULT_NEON_URL;
  const sql = neon(connStr);

  const diskPath = path.resolve('data', 'store.json');
  console.log('Target disk path:', diskPath);

  const rawDisk = fs.readFileSync(diskPath, 'utf8');
  const store = JSON.parse(rawDisk);

  // Filter out any old attars or duplicates
  const attarIds = new Set(ATTARS_DATA.map((a) => a.id));
  const oldAttarIds = new Set([
    'prod-oud-regence',
    'prod-bulgarian-rose-attar',
    'prod-pralin-de-minuit',
    'prod-khwaab',
    ...attarIds,
  ]);

  const nonAttarProducts = (store.products || []).filter(
    (p) => !oldAttarIds.has(p.id) && p.productType !== 'ATTAR'
  );

  store.products = [...nonAttarProducts, ...ATTARS_DATA];
  console.log('Calculated product count:', store.products.length);

  // 1. Write to Neon DB
  await sql`
    CREATE TABLE IF NOT EXISTS store_data (
      key VARCHAR(50) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    INSERT INTO store_data (key, data, updated_at)
    VALUES ('main', ${JSON.stringify(store)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = NOW();
  `;
  console.log('Saved to Neon PostgreSQL!');

  // 2. Write to local disk
  fs.writeFileSync(diskPath, JSON.stringify(store, null, 2), 'utf8');
  console.log('Saved to local data/store.json!');

  // Verify
  const verifyDisk = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
  console.log('Verification: disk products count =', verifyDisk.products.length);
  console.log(
    'Verification: attar IDs =',
    verifyDisk.products.filter((p) => p.productType === 'ATTAR').map((p) => p.id)
  );
}

authoritativeSync().catch((e) => {
  console.error('Sync failed:', e);
  process.exit(1);
});
