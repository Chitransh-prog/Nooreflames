export interface BlogPost {
  id: string;
  slug: string;
  category: 'fragrance' | 'candles' | 'stories' | 'gifting';
  categoryLabel: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  content?: string[];
  quote?: string;
  quoteAuthor?: string;
  tags?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'sacred-art-of-attars',
    category: 'fragrance',
    categoryLabel: 'Heritage Perfumery',
    title: 'The Sacred Art of Attars: From Kannauj Copper Degs to the Modern Flacon',
    excerpt:
      'Explore the centuries-old traditional hydro-distillation techniques of Deg-Bhapka, where pure morning botanicals and aged sandalwood unite into alcohol-free nectar.',
    image: '/images/banners/brand-packaging-banner.jpg',
    author: 'NOOR-E-FLAMES Atelier',
    date: 'Sep 2, 2024',
    readTime: '6 min read',
    featured: true,
    tags: ['Attar', 'Kannauj', 'Hydro-Distillation', 'Sandalwood'],
    quote:
      'True perfumery is not manufactured; it is coaxed from nature with fire, steam, and sacred patience.',
    quoteAuthor: 'Master Distiller, Kannauj',
    content: [
      'In the historic perfume capital of Kannauj, nestled along the holy Ganges, the rhythm of daybreak begins with an orchestra of copper degs and clay-sealed fires. Long before synthetic aroma-chemicals dominated modern shelves, master artisans perfected the delicate science of Deg-Bhapka—a hydro-distillation ritual unchanged for four centuries.',
      'At Noor-E-Flames, our attar extraits honor this sacred lineage. Fresh hand-picked botanical blossoms—from fresh damask rose petals harvested at 4 AM to wild earthen Mitti—are slow-steeped over wood fires. The fragrant steam travels through bamboo pipes (chonga) into receiver vessels submerged in cool running water, condensing drop by precious drop directly into sustainably sourced aged sandalwood oil.',
      'Because these formulations are 100% alcohol-free and oil-dense (20% EAU DE PARFUM equivalent concentration), they do not evaporate aggressively into the air. Instead, they interact intimately with your body heat, releasing evolving fragrant notes for over 14 hours that remain true, deep, and deeply personal.',
    ],
  },
  {
    id: '2',
    slug: 'science-of-soy-wax',
    category: 'candles',
    categoryLabel: 'Candle Craftsmanship',
    title: 'The Science of Soy Wax: Why Clean Burning Changes Your Living Space',
    excerpt:
      'Why commercial paraffin emits toxic petroleum soot, and how pure plant-based soy wax provides an unpolluted, slow-burning sanctuary for modern homes.',
    image: '/images/social/candle-craft-1.jpg',
    author: 'Noor-E-Flames Studio',
    date: 'Aug 24, 2024',
    readTime: '4 min read',
    featured: false,
    tags: ['Soy Wax', 'Clean Living', 'Artisan Candles', 'Eco-Luxury'],
    quote:
      'A flame in your sanctuary should purify your thoughts, not pollute the air you breathe.',
    quoteAuthor: 'Noor-E-Flames Candle Lab',
    content: [
      'Most mass-market commercial candles are cast from paraffin wax—a petroleum by-product derived from refining crude oil. When burned, paraffin releases volatile organic compounds including toluene and benzene, alongside sticky black carbon soot that coats walls, furniture, and lungs.',
      'In stark contrast, Noor-E-Flames pours 100% renewable plant-based soy wax. Soy wax has a significantly lower melting point than paraffin, allowing it to burn up to 45% longer and cooler. This gentle, slower burn ensures that pure fragrance oils are vaporized cleanly rather than scorched by harsh flash temperatures.',
      'Coupled with unbleached organic cotton wicks and cruelty-free non-toxic fragrance notes, every Noor-E-Flames candle provides a clean atmosphere that is completely pet-friendly, child-safe, and deeply therapeutic.',
    ],
  },
  {
    id: '3',
    slug: 'art-of-scent-layering',
    category: 'fragrance',
    categoryLabel: 'Olfactory Mastery',
    title: 'The Art of Fragrance Layering: Pairing Oceanic Freshness with Royal Oud',
    excerpt:
      'Learn the secret accords of luxury layering. Discover how pairing crisp aquatic notes with deep amber and agarwood creates an unforgettable personal signature.',
    image: '/images/social/candle-craft-2.jpg',
    author: 'Atelier Concierge',
    date: 'Aug 18, 2024',
    readTime: '5 min read',
    featured: false,
    tags: ['Fragrance Layering', 'Royal Oud', 'Oceanic Breeze', 'Signature Scent'],
    quote:
      'A single fragrance makes a statement; an intelligent layering blend tells your story.',
    quoteAuthor: 'Olfactory Workshop Guide',
    content: [
      'Layering fragrance is a bespoke ritual borrowed from centuries of Middle Eastern and Indian courtly traditions, where nobles applied heavy oud attars to pulse points before misting their silks with uplifting citrus and floral waters.',
      'The cardinal rule of fragrance layering is weight hierarchy: always apply the heavier, resinous base note first, followed by the lighter, volatile top notes. When layering our Royal Smokey Oud with Oceanic Breeze, the smokey agarwood and vanilla base anchors the composition, while the crisp sea salt and bergamot provide an effervescent, electric opening.',
      'The result is a dynamic scent bubble that transforms throughout your day—opening with sun-drenched coastal breeze before warming down into regal, intoxicating golden woods.',
    ],
  },
  {
    id: '4',
    slug: 'whispered-surprises-craft',
    category: 'stories',
    categoryLabel: 'Behind the Scenes',
    title: 'Whispered Surprises: The Craft Behind Secret Message Candles',
    excerpt:
      'A peek inside our New Delhi atelier to see how craftsmen hand-embed heat-resistant golden keepsake messages that reveal themselves through molten wax.',
    image: '/images/social/whispered-surprises-hands.jpg',
    author: 'NOOR-E-FLAMES Atelier',
    date: 'Aug 10, 2024',
    readTime: '4 min read',
    featured: false,
    tags: ['Secret Message', 'Handmade', 'Atelier Delhi', 'Gifting Magic'],
    quote:
      'The most meaningful gifts are the ones that take time to reveal their secrets.',
    quoteAuthor: 'Atelier Artisan Team',
    content: [
      'When you first unbox a Whispered Surprises candle, its surface appears smooth, pristine, and opaque. Only when lit for twenty to thirty minutes does the magic unfold: as the top soy wax layer liquefies into a golden aromatic pool, a secret hand-stamped message slowly floats into view.',
      'Creating this surprise requires micrometric precision. Our New Delhi artisans carefully calculate wax pour temperatures and exact wick placements so the custom message plaque neither sinks to the vessel base nor ignites under the wick flame.',
      'Whether carrying words of love, celebration, or intimate personal confessions, each candle transforms an everyday burn ritual into an unforgettable emotional reveal.',
    ],
  },
  {
    id: '5',
    slug: 'mastering-the-first-burn',
    category: 'candles',
    categoryLabel: 'Candle Care Guide',
    title: 'Mastering the First Burn: The Golden Rule of Candle Longevity',
    excerpt:
      'Soy wax possesses memory. Discover why allowing the wax to reach full edge-to-edge melt pool on your initial lighting prevents tunneling and doubles your burn hours.',
    image: '/images/social/candle-craft-3.jpg',
    author: 'Noor-E-Flames Studio',
    date: 'Jul 28, 2024',
    readTime: '3 min read',
    featured: false,
    tags: ['Candle Care', 'Wax Memory', 'Wick Trimming', 'Burn Life'],
    quote:
      'Respect the first burn, and your candle will reward you with double the aromatic life.',
    quoteAuthor: 'Atelier Care Handbook',
    content: [
      'Did you know that natural soy wax has thermal memory? The diameter of your initial burn pool dictates how the candle will burn for the rest of its entire lifespan.',
      'If you extinguish a candle before the molten wax pool reaches the glass edges, the wax will form a hardened ring. On subsequent burns, the flame will bore a narrow hole straight down the wick—a common tragedy known as tunneling.',
      'To prevent this, always dedicate 2 to 3 uninterrupted hours on your first lighting. Allow the liquid pool to touch all edges of the vessel, trim your wick to 1/4 inch before each burn, and keep away from breezy drafts for an even, clean burn.',
    ],
  },
  {
    id: '6',
    slug: 'extrait-de-parfum-secrets',
    category: 'fragrance',
    categoryLabel: 'Perfume Education',
    title: 'Why Extrait de Parfum Outlasts Standard Eau de Parfum (EDP)',
    excerpt:
      'Delve into the molecular architecture of 20% EAU DE PARFUM concentration and why heavy botanical bases cling to skin and garments for 14+ hours.',
    image: '/images/social/candle-craft-4.jpg',
    author: 'Atelier Concierge',
    date: 'Jul 15, 2024',
    readTime: '5 min read',
    featured: false,
    tags: ['Extrait de Parfum', 'Concentration', 'Sillage', 'Longevity'],
    quote:
      'Concentration is not merely about volume—it is the density of pure olfactory emotion.',
    quoteAuthor: 'Noor-E-Flames Nose',
    content: [
      'In conventional department store perfumery, standard Eau de Toilette (EDT) contains between 8% to 12% perfume oils, while Eau de Parfum (EDP) typically averages 15% to 20%. The remainder is predominantly alcohol and water that evaporate in the first ninety minutes.',
      'Extrait de Parfum and luxury Eau de Parfum represent the highest concentration tiers recognized in fine perfumery. At Noor-E-Flames, our signature blends feature an exceptional 20% EAU DE PARFUM oil concentration.',
      'This rich concentration minimizes harsh ethanol bite on initial spray and allows delicate heart accords—such as Kashmir saffron, rare resins, and Bulgarian rose—to unfurl luxuriously over 14 to 18 hours on skin and fabrics.',
    ],
  },
  {
    id: '7',
    slug: 'the-sensory-gift',
    category: 'gifting',
    categoryLabel: 'Luxury Gifting',
    title: 'The Art of Intentional Gifting: Curating Keepsake Boxes for Special Moments',
    excerpt:
      'From bridal registries to corporate milestones, how artisanal scented candles with meaningful quotes transform an ordinary gift into an enduring memory.',
    image: '/images/banners/gift-box-showcase.jpg',
    author: 'Noor-E-Flames Concierge',
    date: 'Jul 4, 2024',
    readTime: '4 min read',
    featured: false,
    tags: ['Gifting', 'Bridal Hampers', 'Signature Box', 'Unboxing'],
    quote:
      'A gift wrapped in fragrance is remembered long after the season has passed.',
    quoteAuthor: 'Private Concierge Team',
    content: [
      'In an era of fleeting digital exchanges, a tactile gift crafted with soul, texture, and aroma stands apart. Scent is the human sense most directly hardwired to the limbic system—the brain’s emotional and memory center.',
      'Our signature keepsake boxes are engineered as permanent mementos: handcrafted rigid white fluted packaging, satin pull ribbons, custom letterpress wax seal cards, and hand-poured botanical candles that leave an indelible olfactory impression.',
      'Whether chosen for intimate anniversaries, grand wedding trousseaus, or bespoke corporate gratitude, gifting Noor-E-Flames is an invitation to pause, breathe, and cherish the moment.',
    ],
  },
];
