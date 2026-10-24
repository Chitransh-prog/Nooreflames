import { Product } from './store';

export interface CategoryInfo {
  id: string;
  slug: string;
  name: string;
  kicker: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  mobileHeroImage?: string;
  editorialTag: string;
  themeAccent: string;
  badges: string[];
  filterTags: string[];
  productIds: string[];
  featuredHeroProductIds: string[];
  perks: { iconName: string; title: string; subtitle: string }[];
  olfactoryStory: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    highlightNotes: { name: string; note: string; desc: string }[];
    quote: string;
    author: string;
  };
}

export const CATEGORIES_DATA: Record<string, CategoryInfo> = {
  perfumes: {
    id: 'perfumes',
    slug: 'perfumes',
    name: 'LUXURY PERFUMES',
    kicker: 'NOOR-E-FLAMES HAUTE PARFUMERIE · 20% EAU DE PARFUM',
    title: 'Luxury Perfumes & Long-Lasting Eau de Parfum | NOOR-E-FLAMES',
    subtitle: 'Handcrafted with 20% Oil Concentration · 14+ Hours Sillage · Signature Flacons',
    tagline: 'Where Fragrance Meets Flames — Botanical Luxury Perfumes',
    description:
      'Immerse in NOOR-E-FLAMES artisanal luxury perfumes. Handcrafted in India with 20% Eau de Parfum concentration, featuring Madagascar bourbon vanilla, fresh ocean ozone, sparkling Italian mandarin, and velvety Damascus rose.',
    heroImage: '/images/hero/hero-stone-bottle.jpg',
    mobileHeroImage: '/images/creatives/noor-discovery-her-mobile.jpg',
    editorialTag: 'HAUTE PARFUMERIE',
    themeAccent: '#c79c5e',
    badges: ['20% EAU DE PARFUM', '14+ HOURS SILLAGE', 'SIGNATURE GOLD TASSELS'],
    filterTags: [
      'All',
      'Warm Gourmand',
      'Oceanic & Fresh',
      'Velvet Florals',
      'Smoky Amber & Woods',
      'Discovery Sets',
    ],
    productIds: [
      'prod-vanilla-covenant',
      'prod-the-eclipse',
      'prod-blush-hour',
      'prod-golden-bakery',
      'prod-the-ninth-tide',
      'prod-after-midnight',
      'prod-rose-maudite',
      'prod-pistachio-affair',
      'prod-disc-dual',
    ],
    featuredHeroProductIds: ['prod-vanilla-covenant', 'prod-the-eclipse', 'prod-blush-hour', 'prod-the-ninth-tide'],
    perks: [
      {
        iconName: 'Clock',
        title: '14+ Hours Sillage',
        subtitle: 'Formulated with 20% pure oil concentration for day-to-night projection.',
      },
      {
        iconName: 'Sparkles',
        title: 'Bespoke Crystal Flacons',
        subtitle: 'Heavy crystal flacons adorned with hand-tied golden silk tassels.',
      },
      {
        iconName: 'ShieldCheck',
        title: 'Skin-Kind Botanicals',
        subtitle: 'Formulated with clean grain alcohol and IFRA-certified natural essences.',
      },
      {
        iconName: 'Truck',
        title: 'Free Express Shipping',
        subtitle: 'Complimentary courier delivery across India on orders above ₹999.',
      },
    ],
    olfactoryStory: {
      heading: 'The Art of Haute Parfumerie',
      subheading: 'Where timeless European elegance blends with opulent Indian botanicals',
      paragraphs: [
        'At Noor-e-Flames, every eau de parfum is built with an obsession for longevity and emotional presence. Departing from ephemeral commercial sprays, our formulations contain 20% pure aromatic oils.',
        'From the comforting vanilla and golden amber of Vanilla Covenant to the bracing oceanic ozone of The Ninth Tide, our perfumes become an unforgettable extension of your personality.',
      ],
      highlightNotes: [
        {
          name: 'Madagascar Bourbon Vanilla',
          note: 'Warm Gourmand',
          desc: 'Intimate, creamy warmth that reacts with natural skin temperature.',
        },
        {
          name: 'High-Seas Atlantic Ozone',
          note: 'Oceanic Freshness',
          desc: 'Cold sea salt mist and Calabrian bergamot for luminous daytime projection.',
        },
        {
          name: 'Centifolia Damask Rose',
          note: 'Velvet Floral',
          desc: 'Dawn-harvested crimson petals blended with gentle spiced amber woods.',
        },
      ],
      quote: 'Perfume is the art that makes memory speak without a word.',
      author: 'NOOR-E-FLAMES Master Atelier',
    },
  },
  men: {
    id: 'men',
    slug: 'men',
    name: 'MEN',
    kicker: 'NOOR NOIR EAU DE PARFUM · FOR HIM',
    title: "Men's Luxury Fragrances & Royal Eau de Parfum",
    subtitle: 'Crafted for Intense Longevity · 14+ Hrs · Pure Botanical Distillations',
    tagline: 'Commanding Sillage, Charred Woods & Royal Amber',
    description:
      'Formulated for discerning gentlemen who seek uncompromising performance and regal distinction. Featuring 20% EAU DE PARFUM concentration, aged Cambodian oud, dark marine ozone accords, and smoldering French oak barrels.',
    heroImage: '/images/hero/hero-stone-bottle.jpg',
    mobileHeroImage: '/images/creatives/noor-alpha-smoke-mobile.jpg',
    editorialTag: 'NOOR NOIR EAU DE PARFUM',
    themeAccent: '#BBA58E',
    badges: ['14+ HOURS WEAR', '20% EAU DE PARFUM', 'HAND-DISTILLED ACCORDS'],
    filterTags: [
      'All',
      'Woody & Oud',
      'Aquatic & Marine',
      'Spiced Amber',
      'Alcohol-Free Attars',
      'Discovery & Testers',
    ],
    productIds: [
      'prod-the-eclipse',
      'prod-the-ninth-tide',
      'prod-noor-oud',
      'prod-khwaab',
      'prod-ruh-khus',
      'prod-mizaaj',
      'prod-pistachio-affair',
      'prod-vanilla-covenant',
      'prod-disc-him',
    ],
    featuredHeroProductIds: ['prod-the-eclipse', 'prod-noor-oud', 'prod-khwaab', 'prod-the-ninth-tide'],
    perks: [
      {
        iconName: 'Clock',
        title: '14+ Hour Sillage',
        subtitle: '20% EAU DE PARFUM concentration formulated for day-to-night projection.',
      },
      {
        iconName: 'ShieldCheck',
        title: 'Clean Formulation & Cruelty-Free',
        subtitle: 'Clean formulations crafted with skin-kind botanicals and zero phthalates.',
      },
      {
        iconName: 'Sparkles',
        title: 'Signature Tassel Flacons',
        subtitle: 'Heavy glass flacons accented with hand-knotted gold silk tassels.',
      },
      {
        iconName: 'Truck',
        title: 'Free Express Courier',
        subtitle: 'Complimentary shipping nationwide on orders above ₹999.',
      },
    ],
    olfactoryStory: {
      heading: 'The Architecture of Enduring Sillage',
      subheading: 'Crafted without compromises for monumental evening presence',
      paragraphs: [
        'At Noor-e-Flames, our men’s collection departs from transient commercial sprays. Each bottle is hand-distilled as a pure 20% EAU DE PARFUM or concentrated attar.',
        'From the mineral freshness of crisp Atlantic marine ozone in Oceanic Breeze to the smoldering embers of charred French oak and Assam agarwood in Oak & Smoke, every composition evolves in slow harmony with personal skin chemistry.',
      ],
      highlightNotes: [
        {
          name: 'Atlantic Marine Ozone',
          note: 'Top Note',
          desc: 'Cold sea salt mist, crushed rosemary and Italian bergamot for effortless crisp radiance.',
        },
        {
          name: 'Charred French Oak',
          note: 'Heart Note',
          desc: 'Aged rum casks infused with smoked cardamom and dark Indonesian patchouli.',
        },
        {
          name: 'Cambodian Royal Agarwood',
          note: 'Base Note',
          desc: 'Rare wild-harvested oud cured over decades with grey ambergris and Bourbon vetiver.',
        },
      ],
      quote:
        'A fragrance should never announce your arrival loudly; it should linger in the minds of others long after you have departed.',
      author: 'Master Perfumer, Noor-e-Flames Atelier',
    },
  },

  women: {
    id: 'women',
    slug: 'women',
    name: 'WOMEN',
    kicker: 'HAUTE PARFUMERIE · VELVET FLORAISON',
    title: "Women's Haute Parfumerie & Floral Eau de Parfum",
    subtitle: 'Sensual Centifolia Rose, Wild Imperial Jasmine & Sweet Gourmands',
    tagline: 'Opulent Blooms, Velvety Amber & Romantic Nectars',
    description:
      'An enchanting olfactory tapestry crafted for romantic souls and elevated moments. Handcrafted with prized Centifolia Damask rose petals, midnight-blooming imperial jasmine, warm saffron threads, and Madagascar vanilla.',
    heroImage: '/images/pdp/model-editorial-break.jpg',
    mobileHeroImage: '/images/creatives/noor-rose-love-mobile.jpg',
    editorialTag: 'VELVET FLORAISON',
    themeAccent: '#d67d73',
    badges: ['CENTIFOLIA DAMASK ROSE', '24+ HR PURE ATTARS', 'ARTISANAL SMALL BATCH'],
    filterTags: [
      'All',
      'Rose & Florals',
      'Pure Crystal Attars',
      'Gourmand & Vanilla',
      'Romantic Keepsakes',
      'Discovery & Testers',
    ],
    productIds: [
      'prod-blush-hour',
      'prod-gul-mehfil',
      'prod-khwaab',
      'prod-musk-royal',
      'prod-mizaaj',
      'prod-after-midnight',
      'prod-rose-maudite',
      'prod-golden-bakery',
      'prod-disc-her',
    ],
    featuredHeroProductIds: ['prod-blush-hour', 'prod-gul-mehfil', 'prod-khwaab', 'prod-rose-maudite'],
    perks: [
      {
        iconName: 'Flower2',
        title: 'Rare Botanical Extracts',
        subtitle: 'Distilled with Centifolia roses, Bulgarian absolutes and wild jasmine.',
      },
      {
        iconName: 'HeartHandshake',
        title: 'Alcohol-Free Skin Elixirs',
        subtitle: 'Pure concentrated attars suspended in nourishing botanical carrier oils.',
      },
      {
        iconName: 'Sparkles',
        title: 'Complimentary 10ML Gift',
        subtitle: 'Receive a complimentary travel perfume flacon on all orders above ₹1,499.',
      },
      {
        iconName: 'Truck',
        title: 'Break-Proof Delivery',
        subtitle: 'Shipped in custom shock-absorbing gold gift packaging.',
      },
    ],
    olfactoryStory: {
      heading: 'The Art of Floral Layering',
      subheading: 'Creating an intimate, magnetic 24-hour fragrance bloom',
      paragraphs: [
        'Velvet Floraison celebrates the intoxicating beauty of dawn-harvested blossoms. We select only the most fragrant Centifolia and Damascena roses, steep them in Persian saffron tincture, and anchor them with dark amber and Tahitian vanilla.',
        'For an unforgettable signature aura, atelier connoisseurs pair a dot of alcohol-free Imperial Jasmine Attar on pulse points with a sheer mist of Velvet Rose EDP across hair fibers and collarbone.',
      ],
      highlightNotes: [
        {
          name: 'Persian Saffron Threads',
          note: 'Top Accord',
          desc: 'Warm sun-dried saffron threads paired with pink peppercorn and sparkling citron.',
        },
        {
          name: 'Centifolia Damask Absolute',
          note: 'Heart Accord',
          desc: 'Velvety crimson petals hand-harvested at daybreak for unmatched sweetness and depth.',
        },
        {
          name: 'Bourbon & White Amber',
          note: 'Base Accord',
          desc: 'Creamy Madagascar vanilla pods balanced by golden ambergris and cashmere cedar.',
        },
      ],
      quote:
        'To wear rose is to wear poetry. It wraps you in a tender, undeniable warmth that never fades.',
      author: 'Noor-e-Flames Botanical Conservatory',
    },
  },

  'gift-shop': {
    id: 'gift-shop',
    slug: 'gift-shop',
    name: 'CANDLES & GIFTS',
    kicker: '100% NATURAL SOY WAX · SECRET MESSAGE CANDLES',
    title: 'Handcrafted Scented Candles & Secret Message Candles | NOOR-E-FLAMES',
    subtitle: '100% Botanical Soy Wax · Hidden Love Note Melts · Crackling Wood Wicks',
    tagline: 'Hand-Poured Scented Candles Sealed with Handcrafted Wax Medallions',
    description:
      'Shop NOOR-E-FLAMES viral handcrafted scented candles and sculptural wax art. Featuring 100% pure botanical soy wax, crackling wooden wicks, secret message candles that melt into view, and realistic dessert coupes.',
    heroImage: '/images/banners/brand-packaging-banner.jpg',
    mobileHeroImage: '/images/creatives/noor-discovery-her-mobile.jpg',
    editorialTag: 'ARTISANAL GIFT VAULTS',
    themeAccent: '#c79c5e',
    badges: ['SEALED WAX MEDALLION', 'SECRET MESSAGE MELTS', 'COMPLIMENTARY GIFT NOTE'],
    filterTags: [
      'All',
      'Secret Message Candles',
      'Dessert & Gourmand Coupes',
      'Sculptural Soy Art',
      'Artisanal Gift Vaults',
    ],
    productIds: [
      'prod-1',
      'prod-2',
      'prod-3',
      'prod-21',
      'prod-22',
      'prod-23',
      'prod-7',
      'prod-25',
      'prod-cupcake-teddy',
      'prod-chocolate-cupcake',
      'prod-6',
    ],
    featuredHeroProductIds: ['prod-1', 'prod-2', 'prod-21', 'prod-3'],
    perks: [
      {
        iconName: 'Gift',
        title: 'Wax Medallion Sealing',
        subtitle: 'Every vault box is hand-stamped with our signature gold wax seal.',
      },
      {
        iconName: 'FileText',
        title: 'Custom Handwritten Note',
        subtitle: 'Include a personalized message printed on textured parchment paper.',
      },
      {
        iconName: 'Flame',
        title: '100% Pure Soy Wax',
        subtitle: 'Clean-burning botanical wax with crackling organic wooden wicks.',
      },
      {
        iconName: 'Sparkles',
        title: 'Unboxing Guarantee',
        subtitle: 'Designed for breathtaking unboxing moments and social celebration.',
      },
    ],
    olfactoryStory: {
      heading: 'The Magic of Hidden Love Notes',
      subheading: 'Where pure candlelight meets an unexpected heartfelt revelation',
      paragraphs: [
        'Our viral Whispered Surprises candle was created to turn a simple burn into an unforgettable moment. As the natural golden soy wax warms and forms a shimmering clear pool, an embossed message floats into view through the amber wax.',
        'Combined with our realistic dessert coupes, teddy bath sculptural candles, and rigid gold-stamped arch vault gift boxes, every item in our Gift Shop is conceived as an enduring token of affection.',
      ],
      highlightNotes: [
        {
          name: 'Golden Soy & Wooden Wick',
          note: 'Clean Burn',
          desc: 'Organic soy wax with crackling wood wick that burns evenly for 65+ soothing hours.',
        },
        {
          name: 'Secret Note Revelation',
          note: 'The Ritual',
          desc: 'Unveils custom heartfelt notes within 60-90 minutes of first lighting.',
        },
        {
          name: 'Artisan Dessert Coupes',
          note: 'Sculpted Wax',
          desc: 'Whipped wax frosting, realistic fruit toppings and rich cocoa ganache aromas.',
        },
      ],
      quote:
        'The best gifts are not merely items; they are unhurried experiences that create memories you hold forever.',
      author: 'Noor-e-Flames Atelier Studio',
    },
  },

  'discovery-sets': {
    id: 'discovery-sets',
    slug: 'discovery-sets',
    name: 'DISCOVERY SETS',
    kicker: 'TRY BEFORE YOU COMMIT · ATELIER SAMPLERS',
    title: 'Signature Discovery Sets & Travel Testers',
    subtitle: '5 Handcrafted 10ML Miniatures & Curated Olfactory Sets',
    tagline: '100% Redeemable as Voucher Credit Towards Any Full-Size Bottle',
    description:
      'Find your signature scent with zero hesitation. Sample the complete spectrum of Noor-e-Flames haute perfumery in leak-proof 10ml travel glass atomizers. Featuring curated collections For Him, For Her, and complete master vaults.',
    heroImage: '/images/creatives/noor-discovery-dual.jpg',
    mobileHeroImage: '/images/creatives/noor-discovery-dual-mobile.jpg',
    editorialTag: 'SIGNATURE DISCOVERY VAULT',
    themeAccent: '#BBA58E',
    badges: ['100% VOUCHER CASHBACK', '10ML TRAVEL ATOMIZERS', 'COMPLETE ATELIER SETS'],
    filterTags: [
      'All',
      'Vault Sets (4 & 8-Pack)',
      'Pocket Testers (10ML)',
      'Full Size Eau de Parfums',
    ],
    productIds: [
      'prod-disc-her',
      'prod-disc-him',
      'prod-disc-dual',
      'prod-blush-hour',
      'prod-the-eclipse',
      'prod-vanilla-covenant',
      'prod-pistachio-affair',
      'prod-oud-regence',
    ],
    featuredHeroProductIds: ['prod-disc-her', 'prod-disc-dual', 'prod-disc-him', 'prod-blush-hour'],
    perks: [
      {
        iconName: 'BadgePercent',
        title: '100% Purchase Credit',
        subtitle: 'The full cost of your discovery set is credited towards your next 50ml flacon.',
      },
      {
        iconName: 'Plane',
        title: 'Travel & TSA Approved',
        subtitle: 'Leak-proof 10ml glass atomizers with ultra-fine mist nozzles for effortless travel.',
      },
      {
        iconName: 'Sparkles',
        title: '150+ Sprays Per 10ML',
        subtitle: 'Generous volume allows you to live with each eau de parfum for weeks before deciding.',
      },
      {
        iconName: 'Box',
        title: 'Gold Keepsake Box',
        subtitle: 'Delivered in a gold-embossed drawer vault with olfactory blotter guide.',
      },
    ],
    olfactoryStory: {
      heading: 'How the Discovery Guarantee Works',
      subheading: 'Try the entire collection on your skin in the comfort of your own home',
      paragraphs: [
        'Perfume is deeply personal and changes throughout the day as base notes react with body warmth. Paper tester strips in shopping malls can never convey the true evolution of high-concentration eau de parfums.',
        'With our Discovery Sets, you receive 4 to 8 distinct eau de parfums in 10ml travel flacons. Test each blend across mornings, meetings, evenings, and weekend getaways. When you find your true match, use your included voucher for full credit towards the full-size 50ml flacon.',
      ],
      highlightNotes: [
        {
          name: 'Step 01 · Order Your Vault',
          note: 'Select Profile',
          desc: 'Choose For Her (Romance & Florals), For Him (Oud & Woods), or the Complete Dual Vault.',
        },
        {
          name: 'Step 02 · Live With the Scents',
          note: 'Real Skin Test',
          desc: 'Wear each scent over 14+ hours to experience top, heart, and lingering base notes.',
        },
        {
          name: 'Step 03 · Redeem Full Credit',
          note: 'Full Bottle',
          desc: 'Apply your personal ₹999 voucher code at checkout to claim your full-size favorite.',
        },
      ],
      quote:
        'Never rush into a signature scent. Give each note time to breathe, settle, and speak your story.',
      author: 'Noor-e-Flames Olfactory Guide',
    },
  },
  'ocean-fresh': {
    id: 'ocean-fresh',
    slug: 'ocean-fresh',
    name: 'OCEANIC & FRESH',
    kicker: 'CRISP OZONE & AQUATIC EAU DE PARFUM',
    title: 'Oceanic & Fresh Luxury Fragrances',
    subtitle: 'Invigorating Sea Salt Mist, Italian Bergamot & Sunlit Ozone',
    tagline: 'Crisp Marine Radiance, Coastal Driftwood & Pure Elixirs',
    description:
      'Hand-crafted for those who crave the exhilarating freedom of open waters. Featuring crisp sea salt ozone accords, crushed rosemary, sunlit Calabrian bergamot, and buoyant white cedarwood.',
    heroImage: '/images/pdp/citrus-flacon-hero.jpg',
    mobileHeroImage: '/images/creatives/noor-alpha-smoke-mobile.jpg',
    editorialTag: 'OCEANIC EAU DE PARFUM',
    themeAccent: '#4da6a6',
    badges: ['CRISP MARINE ACCORDS', '20% EAU DE PARFUM', '14+ HOURS SILLAGE'],
    filterTags: [
      'All',
      'Aquatic & Marine',
      'Citrus & Ozone',
      'Alcohol-Free Attars',
      'Discovery & Testers',
    ],
    productIds: [
      'prod-the-eclipse',
      'prod-the-ninth-tide',
      'prod-disc-him',
    ],
    featuredHeroProductIds: ['prod-the-eclipse', 'prod-the-ninth-tide'],
    perks: [
      {
        iconName: 'Droplets',
        title: 'Crisp Marine Ozone',
        subtitle: 'Invigorating Atlantic sea breeze accords balanced with citrus zest.',
      },
      {
        iconName: 'Clock',
        title: '14+ Hour Radiance',
        subtitle: '20% EAU DE PARFUM concentration formulated for all-day crispness.',
      },
      {
        iconName: 'ShieldCheck',
        title: 'Clean Formulation & Cruelty-Free',
        subtitle: 'Skin-kind botanical extractions with zero harsh synthetics.',
      },
      {
        iconName: 'Truck',
        title: 'Free Express Courier',
        subtitle: 'Complimentary shipping nationwide on orders above ₹999.',
      },
    ],
    olfactoryStory: {
      heading: 'The Radiance of High-Seas Botanicals',
      subheading: 'Where coastal sea mist meets sun-drenched Mediterranean citrus',
      paragraphs: [
        'Our Oceanic & Fresh blends capture the exhilarating chill of morning ocean mist rolling across sunlit cliffs. Crafted with cold-pressed Italian bergamot, wild Atlantic sea kelp ozone, and mineral salts.',
        'Anchored with weathered French oak driftwood and grey ambergris, these eau de parfums project a crisp, luminous sillage that turns heads throughout warm days and vibrant evenings.',
      ],
      highlightNotes: [
        {
          name: 'Atlantic Sea Salt Ozone',
          note: 'Top Note',
          desc: 'Bracing oceanic mist, crushed rosemary and Italian bergamot.',
        },
        {
          name: 'Sunlit Neroli & Cypress',
          note: 'Heart Note',
          desc: 'Mediterranean orange blossoms paired with cool mountain cypress.',
        },
        {
          name: 'Coastal White Ambergris',
          note: 'Base Note',
          desc: 'Sun-bleached driftwood cured with white amber and Bourbon vetiver.',
        },
      ],
      quote:
        'Like the first breath of ocean air at sunrise—clean, boundless, and instantly unforgettable.',
      author: 'Noor-e-Flames Atelier Nose',
    },
  },

  'floral-rose': {
    id: 'floral-rose',
    slug: 'floral-rose',
    name: 'ROSE & FLORAL',
    kicker: 'HAUTE PARFUMERIE · VELVET BLOSSOMS',
    title: 'Rose & Floral Haute Parfumerie',
    subtitle: 'Sensual Centifolia Rose, Wild Imperial Jasmine & Saffron Nectars',
    tagline: 'Opulent Blooms, Velvety Damask & Romantic Keepsakes',
    description:
      'An enchanting bouquet crafted with prized Centifolia Damask rose petals, midnight-blooming imperial jasmine, warm sun-dried saffron threads, and Madagascar vanilla.',
    heroImage: '/images/pdp/model-editorial-break.jpg',
    mobileHeroImage: '/images/creatives/noor-rose-love-mobile.jpg',
    editorialTag: 'VELVET FLORAISON',
    themeAccent: '#d67d73',
    badges: ['CENTIFOLIA DAMASK ROSE', '24+ HR PURE ATTARS', 'ARTISANAL SMALL BATCH'],
    filterTags: [
      'All',
      'Rose & Florals',
      'Pure Crystal Attars',
      'Botanical Wax Melts',
      'Discovery & Testers',
    ],
    productIds: [
      'prod-blush-hour',
      'prod-gul-mehfil',
      'prod-khwaab',
      'prod-musk-royal',
      'prod-rose-maudite',
      'prod-after-midnight',
      'prod-golden-bakery',
      'prod-disc-her',
    ],
    featuredHeroProductIds: ['prod-blush-hour', 'prod-gul-mehfil', 'prod-khwaab', 'prod-rose-maudite'],
    perks: [
      {
        iconName: 'Flower2',
        title: 'Centifolia Rose Absolutes',
        subtitle: 'Distilled with dawn-harvested Damask petals for pure floral depth.',
      },
      {
        iconName: 'HeartHandshake',
        title: 'Alcohol-Free Attars',
        subtitle: 'Pure concentrated attars suspended in nourishing botanical carrier oils.',
      },
      {
        iconName: 'Sparkles',
        title: 'Secret Message Wax',
        subtitle: 'Paired with viral secret message candles for complete romantic rituals.',
      },
      {
        iconName: 'Truck',
        title: 'Break-Proof Delivery',
        subtitle: 'Shipped in custom shock-absorbing gold gift packaging.',
      },
    ],
    olfactoryStory: {
      heading: 'The Poetry of Dawn-Harvested Blooms',
      subheading: 'Distilling romantic intimacy into long-lasting botanical poetry',
      paragraphs: [
        'Every blossom in our Rose & Floral collection is harvested by hand in early morning hours before sunlight evaporates delicate essential essences.',
        'From the velvet richness of Centifolia Damascena in Velvet Rose to the pure nocturnal sweetness of Imperial Jasmine Attar, each fragrance envelops the wearer in a magnetic, tender aura.',
      ],
      highlightNotes: [
        {
          name: 'Persian Saffron Threads',
          note: 'Top Accord',
          desc: 'Sun-dried saffron threads paired with sparkling pink peppercorn.',
        },
        {
          name: 'Centifolia Damask Absolute',
          note: 'Heart Accord',
          desc: 'Crimson rose petals distilled at dawn for timeless floral luxury.',
        },
        {
          name: 'Bourbon & White Amber',
          note: 'Base Accord',
          desc: 'Warm Tahitian vanilla pods anchored with golden ambergris.',
        },
      ],
      quote:
        'To wear rose is to wear poetry. It wraps you in a tender, undeniable warmth that never fades.',
      author: 'Noor-e-Flames Botanical Conservatory',
    },
  },

  'royal-oud': {
    id: 'royal-oud',
    slug: 'royal-oud',
    name: 'ROYAL OUD & AMBER',
    kicker: 'MAJESTIC AGARWOOD · CHARRED EMBERS',
    title: 'Royal Oud Perfumes & Aged Agarwood Blends | NOOR-E-FLAMES Ouds',
    subtitle: 'Aged Cambodian Agarwood, Smoked Leather & Golden Ambergris',
    tagline: 'Commanding Sillage, Charred Oak & Monumental Evening Presence',
    description:
      'Formulated for connoisseurs of royal ouds and agarwood perfumery. Featuring wild-harvested Cambodian agarwood cured over decades, dark saffron threads, French oak barrels, and warm golden ambergris.',
    heroImage: '/images/hero/hero-stone-bottle.jpg',
    mobileHeroImage: '/images/creatives/noor-alpha-smoke-mobile.jpg',
    editorialTag: 'ROYAL OUD EAU DE PARFUM',
    themeAccent: '#c79c5e',
    badges: ['AGED CAMBODIAN OUD', '20% EAU DE PARFUM', 'HAND-DISTILLED SMOKE'],
    filterTags: [
      'All',
      'Rare Agarwood & Oud',
      'Smoky Leather',
      'Golden Amber',
      'Concentrated Attars',
      'Discovery & Testers',
    ],
    productIds: [
      'prod-noor-oud',
      'prod-khwaab',
      'prod-mizaaj',
      'prod-pistachio-affair',
      'prod-vanilla-covenant',
      'prod-disc-him',
    ],
    featuredHeroProductIds: ['prod-noor-oud', 'prod-khwaab', 'prod-mizaaj', 'prod-pistachio-affair'],
    perks: [
      {
        iconName: 'Clock',
        title: '16+ Hour Longevity',
        subtitle: 'High-density agarwood resins project monumental sillage through the evening.',
      },
      {
        iconName: 'Flame',
        title: 'Smoked French Oak',
        subtitle: 'Charred barrel accords cured with dark Indonesian patchouli.',
      },
      {
        iconName: 'Sparkles',
        title: 'Signature Gold Tassels',
        subtitle: 'Housed in heavy crystal flacons accented with hand-tied silk tassels.',
      },
      {
        iconName: 'Truck',
        title: 'Break-Proof Courier',
        subtitle: 'Delivered in rigid gold-stamped luxury gift vaults.',
      },
    ],
    olfactoryStory: {
      heading: 'The Majesty of Aged Agarwood',
      subheading: 'Ancient resinous trees distilled into modern sovereign luxury',
      paragraphs: [
        'Royal Oud & Amber represents the pinnacle of Middle Eastern and European haute perfumery crossover. Using only naturally aged Cambodian and Assam agarwood chips, our distillations unfold with mysterious warmth.',
        'Smoldering birch tar, dark honey, and French oak rum barrels give way to a creamy golden amber foundation that settles luxuriously on personal skin.',
      ],
      highlightNotes: [
        {
          name: 'Smoked Saffron & Thyme',
          note: 'Top Note',
          desc: 'Cardamom pods steeped with dried saffron and French lavender.',
        },
        {
          name: 'Charred French Oak',
          note: 'Heart Note',
          desc: 'Aged rum casks infused with smoked cedar and Indonesian patchouli.',
        },
        {
          name: 'Cambodian Royal Agarwood',
          note: 'Base Note',
          desc: 'Wild-harvested oud cured with grey ambergris and Bourbon vetiver.',
        },
      ],
      quote:
        'True oud is not merely worn; it commands the room with silent, unforgettable nobility.',
      author: 'Master Perfumer, Noor-e-Flames Atelier',
    },
  },
  attars: {
    id: 'attars',
    slug: 'attars',
    name: 'ARTISANAL ATTARS',
    kicker: '100% ALCOHOL-FREE · PURE PERFUME OILS',
    title: 'Pure Artisanal Attars & Crystal Flacons (Alcohol-Free) | NOOR-E-FLAMES',
    subtitle: 'Noor Oud, Khwaab, Ruh Khus, Musk Royal, Mizaaj & Gul Mehfil Pure Attars',
    tagline: '100% Alcohol-Free Pure Perfume Oils in Handcrafted Crystal Flacons',
    description:
      'Discover NOOR-E-FLAMES pure artisanal attars. Ancient steam hydro-distillations and concentrated oil extractions encased in hand-cut crystal flacons. Formulated 100% alcohol-free for an intimate, 24+ hour skin contact ritual.',
    heroImage: '/images/products/attar-crystal-flacon.jpg',
    mobileHeroImage: '/images/products/attar-crystal-flacon-4.jpg',
    editorialTag: 'ARTISANAL CRYSTAL ATTARS',
    themeAccent: '#997B5E',
    badges: ['100% ALCOHOL-FREE', 'HAND-CUT CRYSTAL FLACONS', '14+ HOURS WEAR'],
    filterTags: [
      'All',
      'Oud-Led Attars',
      'Cool & Earthy',
      'Comforting Musks',
      'Modern Gourmand',
      'Living Rose',
    ],
    productIds: [
      'prod-noor-oud',
      'prod-khwaab',
      'prod-ruh-khus',
      'prod-musk-royal',
      'prod-mizaaj',
      'prod-gul-mehfil',
    ],
    featuredHeroProductIds: ['prod-noor-oud', 'prod-khwaab', 'prod-gul-mehfil', 'prod-mizaaj'],
    perks: [
      {
        iconName: 'Droplets',
        title: '0% Alcohol · 100% Pure Oil',
        subtitle: 'Concentrated natural perfume essences that stay intimate and skin-kind.',
      },
      {
        iconName: 'Clock',
        title: '14+ Hours Longevity',
        subtitle: 'Pure oil formulations that evolve with body heat across the entire day.',
      },
      {
        iconName: 'Sparkles',
        title: 'Hand-Cut Crystal Flacons',
        subtitle: 'Bespoke crystal flacons fitted with pure glass applicator rods.',
      },
      {
        iconName: 'ShieldCheck',
        title: 'Direct-to-Skin Safe',
        subtitle: 'Natural botanicals and essential oils formulated for sensitive skin.',
      },
    ],
    olfactoryStory: {
      heading: 'The Sacred Heritage of Oil Distillations',
      subheading: 'Ancient slow-cooking hydro-distillations distilled for modern rituals',
      paragraphs: [
        'Before commercial spray perfumery, traditional Indian and Arabian ateliers perfected the art of the attar—capturing living petals, rare agarwoods, and roots directly into carrier bases without a single drop of alcohol.',
        'At Noor-e-Flames, our Attar Atelier honors this timeless ritual. Each flacon is designed to be touched directly to pulse points, warming with personal body temperature to project an aura of effortless refinement.',
      ],
      highlightNotes: [
        {
          name: 'Smoky Cambodian Agarwood',
          note: 'Oud Character',
          desc: 'Distinctive depth balanced with subtle tobacco, warm spice, and aged woods.',
        },
        {
          name: 'Wild Indian Khus Roots',
          note: 'Earthy & Cool',
          desc: 'Naturally refreshing, calm, and grounded rain-soaked earth notes.',
        },
        {
          name: 'Living Damask Rose',
          note: 'Floral Warmth',
          desc: 'Fresh blooming petals with an intimate warmth that stays in memory.',
        },
      ],
      quote:
        'Something you wear for yourself, and others remember you by.',
      author: 'Noor-e-Flames Attar Atelier',
    },
  },
};

export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES_DATA);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  if (CATEGORIES_DATA[cleanSlug]) return CATEGORIES_DATA[cleanSlug];

  // Aliases for SEO keywords
  if (
    cleanSlug === 'perfumes' ||
    cleanSlug === 'perfume' ||
    cleanSlug === 'edp' ||
    cleanSlug === 'edps' ||
    cleanSlug === 'fragrances' ||
    cleanSlug === 'fragrance' ||
    cleanSlug === 'eau-de-parfum' ||
    cleanSlug === 'parfum'
  ) {
    return CATEGORIES_DATA['perfumes'];
  }
  if (cleanSlug === 'mens' || cleanSlug === 'him' || cleanSlug === 'men-perfume') {
    return CATEGORIES_DATA['men'];
  }
  if (cleanSlug === 'womens' || cleanSlug === 'her' || cleanSlug === 'women-perfume') {
    return CATEGORIES_DATA['women'];
  }
  if (
    cleanSlug === 'candles' ||
    cleanSlug === 'candle' ||
    cleanSlug === 'scented-candles' ||
    cleanSlug === 'soy-candles' ||
    cleanSlug === 'secret-message-candle' ||
    cleanSlug === 'secret-message-candles' ||
    cleanSlug === 'gifts' ||
    cleanSlug === 'gift' ||
    cleanSlug === 'gifts-shop' ||
    cleanSlug === 'giftshop'
  ) {
    return CATEGORIES_DATA['gift-shop'];
  }
  if (
    cleanSlug === 'discovery' ||
    cleanSlug === 'discovery-set' ||
    cleanSlug === 'discover' ||
    cleanSlug === 'testers' ||
    cleanSlug === 'samples'
  ) {
    return CATEGORIES_DATA['discovery-sets'];
  }
  if (
    cleanSlug === 'ocean-fresh' ||
    cleanSlug === 'oceanic-fresh' ||
    cleanSlug === 'oceanic' ||
    cleanSlug === 'ocean' ||
    cleanSlug === 'fresh' ||
    cleanSlug === 'marine'
  ) {
    return CATEGORIES_DATA['ocean-fresh'];
  }
  if (
    cleanSlug === 'floral-rose' ||
    cleanSlug === 'rose-floral' ||
    cleanSlug === 'rose' ||
    cleanSlug === 'floral' ||
    cleanSlug === 'blossom' ||
    cleanSlug === 'roses'
  ) {
    return CATEGORIES_DATA['floral-rose'];
  }
  if (
    cleanSlug === 'ouds' ||
    cleanSlug === 'oud' ||
    cleanSlug === 'royal-ouds' ||
    cleanSlug === 'royal-oud' ||
    cleanSlug === 'royal-oud-amber' ||
    cleanSlug === 'amber' ||
    cleanSlug === 'amber-oud' ||
    cleanSlug === 'oud-amber' ||
    cleanSlug === 'agarwood' ||
    cleanSlug === 'oudh'
  ) {
    return CATEGORIES_DATA['royal-oud'];
  }
  if (
    cleanSlug === 'attars' ||
    cleanSlug === 'attar' ||
    cleanSlug === 'attars-ouds' ||
    cleanSlug === 'pure-attars' ||
    cleanSlug === 'artisanal-attars' ||
    cleanSlug === 'perfume-oils' ||
    cleanSlug === 'oils'
  ) {
    return CATEGORIES_DATA['attars'];
  }

  return undefined;
}

export function getCategoryProducts(category: CategoryInfo, allProducts: Product[]): Product[] {
  const orderedProducts: Product[] = [];
  const addedIds = new Set<string>();

  // 1. First add products explicitly listed in category.productIds
  category.productIds.forEach((id) => {
    const found = allProducts.find((p) => p.id === id);
    if (found && !addedIds.has(found.id)) {
      orderedProducts.push(found);
      addedIds.add(found.id);
    }
  });

  // 2. Add any additional relevant products by category matching if needed
  if (category.id === 'perfumes') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.productType === 'PERFUME' ||
          p.category === 'floral-rose' ||
          p.category === 'ocean-fresh' ||
          p.category === 'royal-oud') &&
        p.category !== 'candles'
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'men') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.category === 'royal-oud' || p.category === 'ocean-fresh') &&
        !p.title.toLowerCase().includes('jasmine') &&
        !p.title.toLowerCase().includes('velvet rose')
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'women') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.category === 'floral-rose' ||
          p.title.toLowerCase().includes('rose') ||
          p.title.toLowerCase().includes('jasmine') ||
          p.title.toLowerCase().includes('strawberry'))
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'gift-shop') {
    allProducts.forEach((p) => {
      if (!addedIds.has(p.id) && p.category === 'candles') {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'discovery-sets') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.category === 'discovery-sets' ||
          p.id.includes('disc') ||
          p.title.toLowerCase().includes('discovery') ||
          p.title.toLowerCase().includes('tester'))
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'ocean-fresh') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.category === 'ocean-fresh' ||
          p.title.toLowerCase().includes('ocean') ||
          p.title.toLowerCase().includes('aqua') ||
          p.title.toLowerCase().includes('ozone'))
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'floral-rose') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.category === 'floral-rose' ||
          p.title.toLowerCase().includes('rose') ||
          p.title.toLowerCase().includes('jasmine') ||
          p.title.toLowerCase().includes('blossom'))
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  } else if (category.id === 'royal-oud') {
    allProducts.forEach((p) => {
      if (
        !addedIds.has(p.id) &&
        (p.category === 'royal-oud' ||
          p.title.toLowerCase().includes('oud') ||
          p.title.toLowerCase().includes('amber') ||
          p.title.toLowerCase().includes('tobacco') ||
          p.title.toLowerCase().includes('smoke'))
      ) {
        orderedProducts.push(p);
        addedIds.add(p.id);
      }
    });
  }

  return orderedProducts;
}
