// ─── Mock Data Layer ────────────────────────────────────────────────────────

export interface Suit {
  id: string;
  name: string;
  universe: string;
  description: string;
  color: string;
  accentColor: string;
  image: string;
}

export interface Power {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number; // 1-100
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  tag: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  aspect: "wide" | "tall" | "square";
  image: string;
}

export const suits: Suit[] = [
  {
    id: "classic",
    name: "Classic Suit",
    universe: "Earth-1610",
    description:
      "The original black and red suit. Designed by Suhan himself using spray paint and DIY materials. Raw, street-level, iconic.",
    color: "#0a0a0a",
    accentColor: "#e11d48",
    image: "/classicsuit.jpg",
  },
  {
    id: "itsv",
    name: "Across the Spider-Verse",
    universe: "Earth-1610B",
    description:
      "The animated masterpiece suit with hand-drawn line work and halftone shading. A living comic book made real.",
    color: "#0f0f0f",
    accentColor: "#06b6d4",
    image: "/across.jpg",
  },
  {
    id: "programmable",
    name: "Programmable Matter",
    universe: "Earth-1610",
    description:
      "Advanced nanotech suit with programmable matter. Shape-shifting capabilities with full HUD integration and AI assist.",
    color: "#1a0a2e",
    accentColor: "#a855f7",
    image: "/programmable.jpg",
  },
  {
    id: "2099",
    name: "Spider-Man 2099",
    universe: "Earth-928",
    description:
      'Futuristic upgrade inspired by Miguel O\'Hara. Talons, anti-gravity cape, and accelerated vision built for "Nueva York."',
    color: "#0a1628",
    accentColor: "#3b82f6",
    image: "/2099.jpg",
  },
  {
    id: "bodega",
    name: "Bodega Cat Suit",
    universe: "Earth-1610",
    description:
      "A fan-favorite variant featuring a bodega cat companion. Brooklyn charm meets spider-powered vigilantism. Purrfect.",
    color: "#1c1917",
    accentColor: "#f59e0b",
    image: "/cat.jpg",
  },
];

export const powers: Power[] = [
  {
    id: "venom-blast",
    name: "Venom Blast",
    description:
      "Bio-electric energy discharge capable of stunning enemies, short-circuiting electronics, and overloading nervous systems.",
    icon: "⚡",
    level: 95,
  },
  {
    id: "camouflage",
    name: "Camouflage",
    description:
      "Light-bending invisibility that extends to clothing. Perfect for stealth operations and ambush tactics.",
    icon: "👁",
    level: 88,
  },
  {
    id: "spider-sense",
    name: "Spider-Sense",
    description:
      "Precognitive danger detection with millisecond reaction time. The tingling never lies.",
    icon: "🕸",
    level: 92,
  },
  {
    id: "wall-crawling",
    name: "Wall Crawling",
    description:
      "Molecular adhesion allowing traversal of any surface. Combined with super strength for devastating ceiling attacks.",
    icon: "🧱",
    level: 90,
  },
  {
    id: "super-strength",
    name: "Super Strength",
    description:
      "Proportional strength of a spider amplified. Can lift approximately 10 tons and deliver earth-shattering punches.",
    icon: "💪",
    level: 85,
  },
  {
    id: "agility",
    name: "Enhanced Agility",
    description:
      "Superhuman reflexes, balance, and coordination. Acrobatic mastery that makes Olympic gymnasts look amateur.",
    icon: "🌀",
    level: 93,
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: "origin",
    year: "2011",
    title: "The Bite",
    description:
      "Suhan Shrestha is bitten by a genetically modified spider stolen from Oscorp by the Prowler. His life changes forever.",
    tag: "Origin",
  },
  {
    id: "discovery",
    year: "2011",
    title: "Powers Manifest",
    description:
      "Camouflage and venom blast abilities emerge. Suhan initially rejects his powers, wanting a normal life.",
    tag: "Awakening",
  },
  {
    id: "peter-falls",
    year: "2012",
    title: "The Fall of Peter Parker",
    description:
      "The original Spider-Man falls in battle. Suhan feels the weight of responsibility crash onto his shoulders.",
    tag: "Turning Point",
  },
  {
    id: "mantle",
    year: "2012",
    title: "Taking the Mantle",
    description:
      "Suhan becomes the new Spider-Man of his universe, earning the trust of the superhero community and New York City.",
    tag: "Becoming",
  },
  {
    id: "spider-verse",
    year: "2018",
    title: "Into the Spider-Verse",
    description:
      "The multiverse cracks open. Suhan meets alternate Spider-People and must save all of reality from collapse.",
    tag: "Multiverse",
  },
  {
    id: "across",
    year: "2023",
    title: "Across the Spider-Verse",
    description:
      "Suhan confronts the Spider-Society and challenges the very concept of canon events. Every dimension feels it.",
    tag: "Revolution",
  },
  {
    id: "beyond",
    year: "2025",
    title: "Beyond the Spider-Verse",
    description:
      "The ultimate confrontation. Suhan fights to write his own destiny across infinite realities.",
    tag: "Destiny",
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: "m1",
    title: "Leap of Faith",
    category: "Iconic Moments",
    aspect: "wide",
    image: "/leap-of-faith.jpg",
  },
  {
    id: "m2",
    title: "What's Up Danger",
    category: "Soundtrack",
    aspect: "tall",
    image: "/whats-up-danger.jpg",
  },
  {
    id: "m3",
    title: "Brooklyn Visions",
    category: "Locations",
    aspect: "square",
    image: "/brooklyn.jpg",
  },
  {
    id: "m4",
    title: "The Prowler",
    category: "Villains",
    aspect: "wide",
    image: "/prowler.jpg",
  },
  {
    id: "m5",
    title: "Gwen Stacy",
    category: "Allies",
    aspect: "tall",
    image: "/gwen.jpg",
  },
  {
    id: "m6",
    title: "Spider-Society",
    category: "Multiverse",
    aspect: "square",
    image: "/spider-society.jpg",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Suits", href: "#suits" },
  { label: "Powers", href: "#powers" },
  { label: "Story", href: "#story" },
  { label: "Media", href: "#media" },
];

export const stats = [
  { label: "Universes Saved", value: "∞" },
  { label: "Spider-People Met", value: "283+" },
  { label: "Venom Blasts", value: "10K+" },
  { label: "Canon Events Broken", value: "ALL" },
];
