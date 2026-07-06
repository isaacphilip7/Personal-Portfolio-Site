export type ProjectItem = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  tags: string[];
  badge: string;
  type: string;
  status?: string;
  image: string;
  highlights: string[];
};

export const projects: ProjectItem[] = [
  {
    slug: "neuro-ai",
    title: "Neuro AI Multi-Agent Accelerator",
    shortDescription: "A design-first experience for orchestrating multi-agent AI workflows.",
    description:
      "This project explores how enterprise teams can make complex AI agent systems feel understandable, trustworthy, and usable. The experience focuses on clarity, orchestration, and thoughtful interaction design for multi-agent collaboration.",
    tags: ["AI / UX", "Agent Design", "Enterprise UX"],
    badge: "AI / UX",
    type: "Product Design",
    status: "Agent Design",
    image: "/project-images/neuro-ai.svg",
    highlights: [
      "Designing a new AI studio experience from the ground up.",
      "Bringing structure to agent orchestration, flows, and handoff states.",
      "Balancing technical complexity with approachable interface design.",
    ],
  },
  {
    slug: "logis",
    title: "Logis — Website Design",
    shortDescription: "A modern logistics website designed around clarity, trust, and real-time shipment confidence.",
    description:
      "The project was shaped around helping users quickly understand services, track operations, and feel comfortable engaging with a logistics platform. Every screen balances industrial context with warmth and confidence.",
    tags: ["Web Design", "UI/UX", "Branding"],
    badge: "Web Design",
    type: "UI/UX",
    image: "/thumb-logis.png",
    highlights: [
      "Conversion-focused landing page with clear messaging and hierarchy.",
      "A warm visual language to make logistics feel human and reliable.",
      "Streamlined navigation around core tasks and user intent.",
    ],
  },
  {
    slug: "homesense",
    title: "Homesense App",
    shortDescription: "A calm and minimal smart-home experience for everyday control.",
    description:
      "Homesense was designed to make home automation feel effortless rather than technical. The interface uses gentle visuals, precise hierarchy, and calm interactions to support confidence and ease.",
    tags: ["Mobile App", "UI/UX", "Design Systems"],
    badge: "Mobile App",
    type: "UI/UX",
    image: "/thumb-homesense.png",
    highlights: [
      "Simple control flows for non-technical users.",
      "Consistent structure across room, device, and scene views.",
      "Minimal aesthetic that reduces cognitive load.",
    ],
  },
  {
    slug: "goodweather",
    title: "Goodweather",
    shortDescription: "A weather app that offers lifestyle-aware recommendations beyond the forecast.",
    description:
      "Goodweather turns weather data into a more emotional and useful experience by connecting environmental context to recommendations. The result is both functional and expressive.",
    tags: ["Mobile App", "UI/UX", "Prototyping"],
    badge: "Mobile App",
    type: "UI/UX",
    image: "/thumb-goodweather.png",
    highlights: [
      "Context-rich weather surfaces including pollen, wind, and UV data.",
      "A warm palette that adapts to mood and conditions.",
      "A complete end-to-end Figma prototype from wireframes to polished UI.",
    ],
  },
  {
    slug: "illustrations",
    title: "Illustrations",
    shortDescription: "A personal illustration series blending storytelling and visual thinking.",
    description:
      "This series explores ideas and emotions through visual language. It reflects the same foundations that shape the more product-oriented work: composition, rhythm, empathy, and communication.",
    tags: ["Illustration", "Creative", "Storytelling"],
    badge: "Procreate",
    type: "Creative",
    image: "/thumb-illustrations.png",
    highlights: [
      "Conceptual illustrations grounded in personal themes.",
      "A visual language study that strengthens the core design practice.",
      "A reminder that strong UX starts with strong drawing fundamentals.",
    ],
  },
  {
    slug: "notes-app",
    title: "Notes App",
    shortDescription: "A tactile note-taking experience with a dark, botanical-inspired aesthetic.",
    description:
      "The notes app is meant to make everyday capture feel deliberate and calm. The interface combines earthy illustration, strong hierarchy, and a quietly expressive visual system.",
    tags: ["Mobile App", "UI/UX", "Visual Design"],
    badge: "Mobile App",
    type: "UI/UX",
    image: "/thumb-notes.png",
    highlights: [
      "A dark notebook-inspired interface with warm accents.",
      "Botanical visuals that bring softness to a utilitarian task.",
      "A balanced system for quick capture and long-term organization.",
    ],
  },
];
