/**
 * In-memory mock data so pages render without the CI3 backend.
 * Swap each function for `apiPublic.get(...)` calls in src/lib/api-client.ts
 * once the API is reachable.
 */

export type Astrologer = {
  slug: string;
  name: string;
  photo: string;
  tagline: string;
  bio: string;
  specialties: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  pricePaise: number;
  sessionMinutes: number;
};

export type Puja = {
  slug: string;
  name: string;
  deity: string;
  temple: string;
  city: string;
  image: string;
  description: string;
  pricePaise: number;
  durationMinutes: number;
  features: string[];
  featured: boolean;
};

const PHOTOS = [
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80",
];

export const ASTROLOGERS: Astrologer[] = [
  {
    slug: "pandit-suresh-iyer",
    name: "Pandit Suresh Iyer",
    photo: PHOTOS[0],
    tagline: "Vedic + Tamil Jothisyam · 25 years",
    bio: "Born into a lineage of Tirunelveli temple priests, Pandit Suresh has guided 20,000+ seekers through career, marriage and remedial pujas. Known for calm, scripture-led readings.",
    specialties: ["Vedic", "Jothisyam", "KP System"],
    languages: ["English", "Tamil", "Sanskrit"],
    experienceYears: 25,
    rating: 4.9,
    reviewsCount: 1248,
    pricePaise: 99900,
    sessionMinutes: 30,
  },
  {
    slug: "dr-meera-shastri",
    name: "Dr. Meera Shastri",
    photo: PHOTOS[1],
    tagline: "PhD Vedic Astrology · Numerology",
    bio: "PhD in Vedic Astrology from BHU. Specializes in name numerology and the KP system. Evidence-led, no-fluff readings.",
    specialties: ["Numerology", "KP", "Vedic"],
    languages: ["English", "Hindi"],
    experienceYears: 18,
    rating: 4.8,
    reviewsCount: 821,
    pricePaise: 79900,
    sessionMinutes: 30,
  },
  {
    slug: "acharya-rajesh-kumar",
    name: "Acharya Rajesh Kumar",
    photo: PHOTOS[2],
    tagline: "Vasthu Shastra · Remedial Pujas",
    bio: "Vasthu shastra and remedial pujas. Audited 5,000+ homes and businesses across India and the diaspora.",
    specialties: ["Vasthu", "Vedic"],
    languages: ["English", "Hindi", "Bhojpuri"],
    experienceYears: 22,
    rating: 4.95,
    reviewsCount: 510,
    pricePaise: 149900,
    sessionMinutes: 45,
  },
  {
    slug: "smt-lakshmi-narayanan",
    name: "Smt. Lakshmi Narayanan",
    photo: PHOTOS[3],
    tagline: "Jothisyam · Marriage compatibility",
    bio: "Three decades of South Indian jyotisha practice. Marriage compatibility (porutham) specialist.",
    specialties: ["Jothisyam", "Compatibility"],
    languages: ["English", "Tamil", "Telugu", "Kannada"],
    experienceYears: 30,
    rating: 4.85,
    reviewsCount: 1520,
    pricePaise: 89900,
    sessionMinutes: 30,
  },
  {
    slug: "guru-nakul-bhattacharya",
    name: "Guru Nakul Bhattacharya",
    photo: PHOTOS[4],
    tagline: "Bengali astrology · Tantra",
    bio: "Bengali tradition (gurukul-trained). Reading style emphasizes karma, dasha, and tantric remedies.",
    specialties: ["Vedic", "Tantra"],
    languages: ["English", "Hindi", "Bengali"],
    experienceYears: 20,
    rating: 4.75,
    reviewsCount: 432,
    pricePaise: 69900,
    sessionMinutes: 30,
  },
  {
    slug: "pandita-radhika-joshi",
    name: "Pandita Radhika Joshi",
    photo: PHOTOS[5],
    tagline: "Numerology + Tarot",
    bio: "Numerology + tarot, business-name analysis a specialty. Known among Mumbai entrepreneurs and creatives.",
    specialties: ["Numerology", "Tarot"],
    languages: ["English", "Hindi", "Marathi"],
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 287,
    pricePaise: 59900,
    sessionMinutes: 30,
  },
];

export const PUJAS: Puja[] = [
  {
    slug: "kashi-rudrabhishek",
    name: "Kashi Vishwanath Rudrabhishek",
    deity: "Lord Shiva",
    temple: "Kashi Vishwanath Temple",
    city: "Varanasi",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80",
    description:
      "The most sacred Rudrabhishek puja, performed at the Jyotirlinga of Lord Shiva in Kashi. Removes karmic blockages, grants Mahadev's grace.",
    pricePaise: 251100,
    durationMinutes: 90,
    features: [
      "Live HD stream of the puja",
      "Sankalpam recited in your name + gotra",
      "Prasad shipped to your home in 2–4 days",
      "Pre-puja consultation with the head pandit",
    ],
    featured: true,
  },
  {
    slug: "tirupati-balaji-archana",
    name: "Tirupati Balaji Archana",
    deity: "Lord Venkateswara",
    temple: "Sri Venkateswara Temple",
    city: "Tirumala",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80",
    description:
      "Daily archana in your name at the holy abode of Lord Balaji. Granted to seekers across the world.",
    pricePaise: 51100,
    durationMinutes: 30,
    features: ["Sankalpam in your name", "Recorded video", "Prasad delivery"],
    featured: true,
  },
  {
    slug: "mahalakshmi-puja",
    name: "Mahalakshmi Puja for Wealth",
    deity: "Goddess Lakshmi",
    temple: "Mahalakshmi Temple",
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=900&q=80",
    description:
      "Friday Mahalakshmi puja for prosperity and abundance. Performed by hereditary priests on auspicious tithis.",
    pricePaise: 151100,
    durationMinutes: 60,
    features: ["Live stream", "Sankalpam", "Yantra + prasad delivery"],
    featured: false,
  },
  {
    slug: "navagraha-shanti",
    name: "Navagraha Shanti Puja",
    deity: "Nine Planets",
    temple: "Suryanar Kovil",
    city: "Kumbakonam",
    image: "https://images.unsplash.com/photo-1604608672806-5a06ac08eb53?w=900&q=80",
    description:
      "Navagraha shanti to pacify malefic planetary periods (sade-sati, dasha sandhi, raahu/ketu).",
    pricePaise: 199900,
    durationMinutes: 90,
    features: ["Live stream", "Personalized sankalpam", "Yantra + prasad"],
    featured: true,
  },
  {
    slug: "ganesh-homam",
    name: "Ganesh Homam",
    deity: "Lord Ganesha",
    temple: "Karpaga Vinayagar Temple",
    city: "Pillayarpatti",
    image: "https://images.unsplash.com/photo-1605369572399-f0f0e2c0f60c?w=900&q=80",
    description:
      "Begin a new venture, marriage or move with Lord Ganesha's blessings. Removes obstacles.",
    pricePaise: 121100,
    durationMinutes: 60,
    features: ["Live stream", "Modak prasad delivery", "Sankalpam"],
    featured: false,
  },
  {
    slug: "saraswati-puja",
    name: "Saraswati Puja for Students",
    deity: "Goddess Saraswati",
    temple: "Sringeri Sharadamba",
    city: "Sringeri",
    image: "https://images.unsplash.com/photo-1606406054219-619c4c2e2100?w=900&q=80",
    description:
      "For students preparing for board exams, JEE, NEET, UPSC, GMAT/GRE, or any major academic milestone.",
    pricePaise: 99900,
    durationMinutes: 45,
    features: ["Live stream", "Sankalpam in student's name", "Vidya yantra delivery"],
    featured: false,
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  cover: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  body: string; // HTML
};

export const ARTICLES: Article[] = [
  {
    slug: "how-to-read-your-vedic-birth-chart",
    title: "How to read your Vedic birth chart — a beginner's guide",
    excerpt: "Your kundli is a snapshot of the sky at the moment you were born. Here's how to start understanding what it says about you.",
    category: "Astrology",
    tags: ["kundli", "vedic", "beginner"],
    cover: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=1200&q=80",
    author: "Mileora Editorial",
    publishedAt: "2026-04-22",
    readMinutes: 8,
    body: `
      <p>Your Vedic birth chart, or <em>kundli</em>, is essentially a frozen snapshot of the sky at the precise moment you took your first breath. It records where each of the nine planets (the Navagraha) was sitting against the twelve zodiac signs and twelve houses of life. Read carefully, it reveals the karmic blueprint you came here with — and the dasha periods that will activate different chapters of that blueprint over your lifetime.</p>
      <h2>The four most important things to look at first</h2>
      <h3>1. Your Lagna (Ascendant)</h3>
      <p>The Lagna is the zodiac sign rising on the eastern horizon at your moment of birth. It is more important to your personality than your sun sign in Vedic astrology — it shapes your first impression on others, your physical body, and your overall approach to life.</p>
      <h3>2. Your Moon sign (Rasi)</h3>
      <p>Where the Moon was placed at your birth defines your inner emotional world — how you process feelings, what comforts you, and what your nakshatra (birth star) is. The nakshatra is what most Tamil and South Indian families use for naming and matchmaking.</p>
      <h3>3. Your current dasha</h3>
      <p>Vedic astrology divides your life into long planetary periods called dashas (Vimshottari being the most common). Each dasha brings the themes of its ruling planet to centre stage — Saturn dasha tests responsibility, Venus dasha activates relationships, Jupiter dasha brings expansion and learning.</p>
      <h3>4. The 7th house (relationships) and 10th house (career)</h3>
      <p>For most readers, the practical questions are about love and work. Look at the planets sitting in the 7th and 10th houses, and the planets aspecting them. This is where a trained astrologer earns their fee — interpreting nuance the textbooks miss.</p>
      <h2>What a chart cannot tell you</h2>
      <p>A kundli cannot tell you exactly what will happen, only what is more likely. Free will, effort, and remedies (mantra, charity, restraint) all modulate the influence of the planets. Treat your reading as guidance, not destiny.</p>
      <h2>Where to start</h2>
      <p>Generate your <a href="/free/kundli">free Vedic kundli</a> on Mileora and read your Lagna, Rasi, and current dasha. Once you have the basic map, a 30-minute reading with a verified astrologer will go much deeper, much faster.</p>
    `,
  },
  {
    slug: "numerology-life-path-explained",
    title: "Your life path number, explained without the jargon",
    excerpt: "Add the digits of your DOB until you get a single number. That's your life path. But what does each one actually mean?",
    category: "Numerology",
    tags: ["numerology", "life path"],
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    author: "Dr. Meera Shastri",
    publishedAt: "2026-04-15",
    readMinutes: 5,
    body: `<p>Your life path number is the most important number in your numerology chart…</p><p>Try our <a href="/free/numerology">free numerology calculator</a> to see all your numbers.</p>`,
  },
  {
    slug: "online-puja-vs-temple-visit",
    title: "Online puja vs visiting the temple — does it count the same?",
    excerpt: "A pandit, a sankalpam, your name, the right mantras. The form may have changed but the bhava remains.",
    category: "Puja",
    tags: ["puja", "tradition"],
    cover: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80",
    author: "Pandit Suresh Iyer",
    publishedAt: "2026-04-08",
    readMinutes: 6,
    body: `<p>It's a fair question. The short answer: yes, when done properly…</p><p>Browse <a href="/puja">our online pujas</a> to see how it works.</p>`,
  },
];

export const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
