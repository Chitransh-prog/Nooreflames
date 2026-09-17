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
  men: {
    id: 'men',
    slug: 'men',
    name: 'MEN',
    kicker: 'NOOR NOIR EXTRAITS · FOR HIM',
    title: "Men's Luxury Fragrances & Royal Extraits",
    subtitle: 'Crafted for Intense Longevity · 14+ Hrs · Pure Botanical Distillations',
    tagline: 'Commanding Sillage, Charred Woods & Royal Amber',
    description:
      'Formulated for discerning gentlemen who seek uncompromising performance and regal distinction. Featuring 35% ultra-concentration extraits de parfum, aged Cambodian oud, dark marine ozone accords, and smoldering French oak barrels.',
    heroImage: '/images/hero/hero-stone-bottle.jpg',
    mobileHeroImage: '/images/creatives/noor-alpha-smoke-mobile.jpg',
    editorialTag: 'NOOR NOIR EXTRAITS',
    themeAccent: '#BBA58E',
    badges: ['14+ HOURS WEAR', 'EXTRAIT DE PARFUM (35%)', 'HAND-DISTILLED ACCORDS'],
    filterTags: [
      'All',
      'Woody & Oud',
      'Aquatic & Marine',
      'Spiced Amber',
      'Alcohol-Free Attars',
      'Discovery & Testers',
    ],
    productIds: [
      'prod-9',
      'prod-10',
      'prod-14',
      'prod-15',
      'prod-20',
      'prod-11',
      'prod-16',
      'prod-disc-him',
      'prod-26',
    ],
    featuredHeroProductIds: ['prod-9', 'prod-14', 'prod-10', 'prod-15'],
    perks: [
      {
        iconName: 'Clock',
        title: '14+ Hour Sillage',
        subtitle: '35% pure oil extrait concentration formulated for day-to-night projection.',
      },
      {
        iconName: 'ShieldCheck',
        title: 'IFRA Certified & Cruelty-Free',
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
        'At Noor-e-Flames, our men’s collection departs from transient commercial sprays. Each bottle is hand-distilled as a pure Extrait de Parfum or concentrated attar, carrying up to 35% pure botanical oil essence.',
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
    title: "Women's Haute Parfumerie & Floral Extraits",
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
      'prod-12',
      'prod-13',
      'prod-16',
      'prod-11',
      'prod-23',
      'prod-24',
      'prod-21',
      'prod-disc-her',
      'prod-26',
    ],
    featuredHeroProductIds: ['prod-12', 'prod-13', 'prod-16', 'prod-11'],
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
        subtitle: 'Receive a complimentary travel extrait on all orders above ₹1,499.',
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
    name: 'GIFT SHOP',
    kicker: 'ARTISANAL GIFT VAULTS & SURPRISES',
    title: 'The Artisanal Gift Shop & Keepsakes',
    subtitle: 'Viral Secret Message Candles, Dessert Coupes & Sculptural Art Pieces',
    tagline: 'Heartfelt Keepsakes Sealed with Handcrafted Wax Medallion',
    description:
      'Gifts crafted to make hearts skip a beat. Explore our viral secret message candles that slowly unveil heartfelt handwritten love notes as the wax melts, realistic handcrafted dessert coupes, and luxury gift boxes.',
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
      'prod-7',
      'prod-8',
      'prod-21',
      'prod-22',
      'prod-23',
      'prod-24',
      'prod-25',
      'prod-6',
    ],
    featuredHeroProductIds: ['prod-1', 'prod-6', 'prod-3', 'prod-7'],
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
      'Full Size Extraits',
    ],
    productIds: [
      'prod-disc-her',
      'prod-disc-him',
      'prod-disc-dual',
      'prod-26',
      'prod-9',
      'prod-12',
      'prod-14',
      'prod-15',
      'prod-20',
      'prod-11',
      'prod-13',
      'prod-16',
    ],
    featuredHeroProductIds: ['prod-disc-her', 'prod-disc-dual', 'prod-disc-him', 'prod-26'],
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
        subtitle: 'Generous volume allows you to live with each extrait for weeks before deciding.',
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
        'Perfume is deeply personal and changes throughout the day as base notes react with body warmth. Paper tester strips in shopping malls can never convey the true evolution of high-concentration extraits.',
        'With our Discovery Sets, you receive 4 to 8 distinct extraits in 10ml travel flacons. Test each blend across mornings, meetings, evenings, and weekend getaways. When you find your true match, use your included voucher for full credit towards the full-size 50ml flacon.',
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
};

export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES_DATA);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  if (CATEGORIES_DATA[cleanSlug]) return CATEGORIES_DATA[cleanSlug];

  // Aliases
  if (cleanSlug === 'mens' || cleanSlug === 'him' || cleanSlug === 'men-perfume') {
    return CATEGORIES_DATA['men'];
  }
  if (cleanSlug === 'womens' || cleanSlug === 'her' || cleanSlug === 'women-perfume') {
    return CATEGORIES_DATA['women'];
  }
  if (cleanSlug === 'gifts' || cleanSlug === 'gift' || cleanSlug === 'gifts-shop' || cleanSlug === 'giftshop') {
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
  if (category.id === 'men') {
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
  }

  return orderedProducts;
}
