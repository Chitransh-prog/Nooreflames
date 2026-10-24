import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

async function updateStore() {
  const diskPath = path.resolve('data', 'store.json');
  console.log('Reading from:', diskPath);
  const rawDisk = fs.readFileSync(diskPath, 'utf8');
  const store = JSON.parse(rawDisk);

  // Update Hero featured product image
  if (store.hero && store.hero.featuredProduct) {
    store.hero.featuredProduct.image = '/images/Candles/Whispered Surprise/1.png';
    store.hero.featuredProduct.link = '/product/prod-1';
  }

  // 1. Update prod-vanilla-covenant
  const vanilla = store.products.find((p) => p.id === 'prod-vanilla-covenant');
  if (vanilla) {
    vanilla.image = '/images/Perfume/Vanilla Covenant Perfume Elegance.png';
    vanilla.gallery = [
      '/images/Perfume/Vanilla Covenant Perfume Elegance.png',
      '/images/products/perfume-tassel-flacon-2.jpg',
      '/images/products/perfume-tassel-flacon-5.jpg',
      '/images/products/perfume-tassel-flacon-11.jpg',
      '/images/products/perfume-tassel-flacon-12.jpg',
    ];
    console.log('Updated prod-vanilla-covenant image and gallery');
  }

  // 2. Update prod-1 (Whispered Surprises)
  const prod1 = store.products.find((p) => p.id === 'prod-1');
  if (prod1) {
    prod1.image = '/images/Candles/Whispered Surprise/1.png';
    prod1.gallery = [
      '/images/Candles/Whispered Surprise/1.png',
      '/images/Candles/Whispered Surprise/2.png',
      '/images/Candles/Whispered Surprise/3.png',
      '/images/products/whispered-surprises-real.jpg',
      '/images/products/whispered-surprises-real-2.jpg',
    ];
    console.log('Updated prod-1 image and gallery');
  }

  // 3. Update prod-21 (Birthday Candle)
  const prod21 = store.products.find((p) => p.id === 'prod-21');
  if (prod21) {
    prod21.image = '/images/Candles/Birthday Candle/1.png';
    prod21.gallery = [
      '/images/Candles/Birthday Candle/1.png',
      '/images/Candles/Birthday Candle/2.png',
      '/images/Candles/Birthday Candle/3.png',
      '/images/Candles/Birthday Candle/4.png',
      '/images/products/birthday-candle-real.jpg',
    ];
    console.log('Updated prod-21 image and gallery');
  }

  // 4. Update prod-2 (Cutting Chai)
  const prod2 = store.products.find((p) => p.id === 'prod-2');
  if (prod2) {
    prod2.image = '/images/Candles/Cutting Chai/Cozy Chai Candle Vignette.png';
    prod2.gallery = [
      '/images/Candles/Cutting Chai/Cozy Chai Candle Vignette.png',
      '/images/Candles/Cutting Chai/Cozy Chai Candle Tea-Time Vignette.png',
      '/images/Candles/Cutting Chai/A Little Joy Inside Gift Box.png',
      '/images/products/cutting-chai-real.jpg',
    ];
    console.log('Updated prod-2 image and gallery');
  }

  // 5. Update prod-22 (Evil Eye)
  const prod22 = store.products.find((p) => p.id === 'prod-22');
  if (prod22) {
    prod22.image = '/images/Candles/Evil Eye/1.png';
    prod22.gallery = [
      '/images/Candles/Evil Eye/1.png',
      '/images/Candles/Evil Eye/2.png',
      '/images/Candles/Evil Eye/3.png',
      '/images/products/evil-eye-candle-real.jpg',
    ];
    console.log('Updated prod-22 image and gallery');
  }

  // 6. Update prod-3 (Mango Berry Bliss)
  const prod3 = store.products.find((p) => p.id === 'prod-3');
  if (prod3) {
    prod3.image = '/images/Candles/Mango Berry Bliss/1.png';
    prod3.gallery = [
      '/images/Candles/Mango Berry Bliss/1.png',
      '/images/Candles/Mango Berry Bliss/2.png',
      '/images/Candles/Mango Berry Bliss/3.png',
      '/images/products/mango-berry-bliss-real.jpg',
    ];
    console.log('Updated prod-3 image and gallery');
  }

  // 7. Update prod-23 (Rose Whimsy)
  const prod23 = store.products.find((p) => p.id === 'prod-23');
  if (prod23) {
    prod23.image = '/images/Candles/Rose Whimpsy/1.png';
    prod23.gallery = [
      '/images/Candles/Rose Whimpsy/1.png',
      '/images/Candles/Rose Whimpsy/2.png',
      '/images/Candles/Rose Whimpsy/3.png',
      '/images/products/rose-whimsy-real.jpg',
    ];
    console.log('Updated prod-23 image and gallery');
  }

  // 8. Update prod-25 (Berry Bliss)
  const prod25 = store.products.find((p) => p.id === 'prod-25');
  if (prod25) {
    prod25.title = 'Berry Bliss Scented Soy Candle';
    prod25.image = '/images/Candles/Berry Bliss/1.png';
    prod25.badge = 'STRAWBERRY & CHOCOLATE';
    prod25.gallery = [
      '/images/Candles/Berry Bliss/1.png',
      '/images/Candles/Berry Bliss/2.png',
      '/images/Candles/Berry Bliss/3.png',
      '/images/Candles/Berry Bliss/4.png',
      '/images/products/berry-bliss-real.jpg',
    ];
    console.log('Updated prod-25 image and gallery');
  }

  // 9. Update prod-7 (Teddy 4 U – Bubble Bear)
  const prod7 = store.products.find((p) => p.id === 'prod-7');
  if (prod7) {
    prod7.title = 'Teddy 4 U – Romantic Bubble Bear Candle';
    prod7.badge = 'BUBBLE BEAR · HANDCRAFTED';
    prod7.subtitle = 'Romantic Sculpted Bubble Bear Candle · Velvet Rose Petals & Sweet French Vanilla Warmth';
    prod7.image = '/images/Candles/Teddy 4 U/1.png';
    prod7.gallery = [
      '/images/Candles/Teddy 4 U/1.png',
      '/images/Candles/Teddy 4 U/2.png',
      '/images/Candles/Teddy 4 U/3.png',
      '/images/Candles/Teddy 4 U/Romantic Bubble Bear Candle Still Life.png',
      '/images/products/teddy-bath-real.jpg',
    ];
    console.log('Updated prod-7 image and gallery');
  }

  // 10. Add or Update prod-cupcake-teddy
  let cupcakeTeddy = store.products.find((p) => p.id === 'prod-cupcake-teddy');
  if (!cupcakeTeddy) {
    cupcakeTeddy = {
      id: 'prod-cupcake-teddy',
      sku: 'NF-CAN-010',
      slug: 'cupcake-teddy-candle',
      badge: 'SCULPTED TEDDY · HIT',
      brand: 'NOOREFLAMES',
      image: '/images/Candles/Cupcake Teddy/1.png',
      price: 699,
      originalPrice: 999,
      title: 'Cupcake Teddy Bath & Balloon Candle',
      rating: 5,
      volume: '220g Sculptural Ceramic Bath Candle',
      gallery: [
        '/images/Candles/Cupcake Teddy/1.png',
        '/images/Candles/Cupcake Teddy/2.png',
        '/images/Candles/Cupcake Teddy/3.png',
      ],
      inStock: true,
      category: 'candles',
      subtitle: 'Adorable Sculpted Teddy in Fluted Pastel Bath · Balloon Accents · Sweet Honey & Vanilla Glow',
      topNotes: ['Sweet Vanilla Cream', 'Golden Honey Blossom'],
      baseNotes: ['Clean Botanical Soy', 'Warm Amber Cashmere'],
      heartNotes: ['Pastel Sugar Sprinkles', 'Whipped Frosting'],
      stockCount: 45,
      description:
        'A charming miniature sculpted teddy bear lounging peacefully in a pastel fluted ceramic bath with balloon details. Handcrafted with 100% pure botanical soy wax and infused with comforting vanilla and sweet honey blossom.\n\nDesigned as a breathtaking centerpiece for bedroom sanctuaries, vanity tables, and joyful gifting.',
      ingredients: [
        '100% Pure Soy Wax',
        'Non-Toxic Mineral Dyes',
        'Organic Cotton Wick',
        'Vanilla & Honey Fragrance Blends',
      ],
      productType: 'CANDLE',
      scentFamily: 'Sweet Vanilla Frosting & Golden Honey Blossom',
      usageRitual:
        'Always place sculptural candle on a heat-resistant tray with raised edges to catch melting wax. Trim wick to 1/4 inch before lighting.',
      reviewsCount: 142,
      concentration: '100% Botanical Soy Wax',
      countryOfOrigin: 'INDIA',
      shortDescription:
        'Handcrafted Teddy in Fluted Pastel Tumbler · Balloon Accents · Sweet Vanilla & Honey Warmth',
      materialComposition: '100% Soy Wax',
    };
    store.products.push(cupcakeTeddy);
    console.log('Added new prod-cupcake-teddy');
  } else {
    cupcakeTeddy.image = '/images/Candles/Cupcake Teddy/1.png';
    cupcakeTeddy.gallery = [
      '/images/Candles/Cupcake Teddy/1.png',
      '/images/Candles/Cupcake Teddy/2.png',
      '/images/Candles/Cupcake Teddy/3.png',
    ];
    console.log('Updated existing prod-cupcake-teddy');
  }

  // 11. Add or Update prod-chocolate-cupcake
  let chocoCupcake = store.products.find((p) => p.id === 'prod-chocolate-cupcake');
  if (!chocoCupcake) {
    chocoCupcake = {
      id: 'prod-chocolate-cupcake',
      sku: 'NF-CAN-011',
      slug: 'chocolate-cupcake-candle',
      badge: 'GOURMAND HEART · BESTSELLER',
      brand: 'NOOREFLAMES',
      image: '/images/Candles/Chocolate cupcake candle/1.png',
      price: 649,
      originalPrice: 899,
      title: 'Chocolate Cupcake Scented Candle',
      rating: 5,
      volume: '200g Handcrafted Dessert Cupcake Candle',
      gallery: [
        '/images/Candles/Chocolate cupcake candle/1.png',
        '/images/Candles/Chocolate cupcake candle/2.png',
        '/images/Candles/Chocolate cupcake candle/3.png',
      ],
      inStock: true,
      category: 'candles',
      subtitle:
        'Rich Dark Chocolate & Creamy Strawberry Heart · Hand-Sculpted Bar Accents · Sweet Gourmand Aroma',
      topNotes: ['Dark Cacao Dust', 'Sweet Strawberry Puree'],
      baseNotes: ['Warm Bakery Vanilla', 'Golden Caramelized Sugar'],
      heartNotes: ['Rich Milk Chocolate Ganache', 'Whipped Frosting'],
      stockCount: 50,
      description:
        'Indulge in the sweetness of a hand-sculpted chocolate cupcake candle, adorned with artisanal miniature chocolate bars and a vibrant crimson heart wax topper. Fills the room with rich cocoa, buttercream frosting, and sweet strawberry nectar.\n\nPerfect for romantic evenings, celebrations, or treating your space to pure sweet bliss.',
      ingredients: [
        '100% Pure Soy Wax',
        'Dark Cacao Fragrance Essence',
        'Crimson Wax Heart Topper',
        'Organic Cotton Wick',
      ],
      productType: 'CANDLE',
      scentFamily: 'Rich Dark Chocolate, Whipped Buttercream & Sweet Berry Nectar',
      usageRitual:
        'Place on a stable heat-safe dish before lighting. Allow even melting and enjoy the delicious aroma. Decorative wax chocolate elements are part of the candle design—do not consume.',
      reviewsCount: 168,
      concentration: 'Handcrafted Sculptural Soy Wax',
      countryOfOrigin: 'INDIA',
      shortDescription:
        'Rich Dark Chocolate & Creamy Strawberry Heart · Hand-Sculpted Bar Accents · Sweet Gourmand Aroma',
      materialComposition: 'Handcrafted Soy Wax',
    };
    store.products.push(chocoCupcake);
    console.log('Added new prod-chocolate-cupcake');
  } else {
    chocoCupcake.image = '/images/Candles/Chocolate cupcake candle/1.png';
    chocoCupcake.gallery = [
      '/images/Candles/Chocolate cupcake candle/1.png',
      '/images/Candles/Chocolate cupcake candle/2.png',
      '/images/Candles/Chocolate cupcake candle/3.png',
    ];
    console.log('Updated existing prod-chocolate-cupcake');
  }

  // 1. Write to local disk
  fs.writeFileSync(diskPath, JSON.stringify(store, null, 2), 'utf8');
  console.log('Successfully saved to data/store.json! Total products:', store.products.length);

  // 2. Persist to Neon PostgreSQL
  try {
    const connStr = process.env.DATABASE_URL || DEFAULT_NEON_URL;
    const sql = neon(connStr);
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
    console.log('Successfully synchronized to Neon PostgreSQL database!');
  } catch (dbErr) {
    console.error('Failed to sync to Neon DB:', dbErr);
  }
}

updateStore().catch((err) => {
  console.error('Update script failed:', err);
  process.exit(1);
});
