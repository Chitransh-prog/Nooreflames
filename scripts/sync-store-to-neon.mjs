import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

async function syncStoreToNeon() {
  const connStr = process.env.DATABASE_URL || DEFAULT_NEON_URL;
  const sql = neon(connStr);

  const diskPath = path.resolve('data', 'store.json');
  console.log('Reading store from:', diskPath);

  const rawDisk = fs.readFileSync(diskPath, 'utf8');
  const store = JSON.parse(rawDisk);

  console.log('Product count:', store.products?.length);
  console.log('SiteSettings metaTitle:', store.siteSettings?.metaTitle);

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

  console.log('Successfully synced store data to Neon PostgreSQL!');
}

syncStoreToNeon().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
