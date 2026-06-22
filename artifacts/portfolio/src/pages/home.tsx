import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, ExternalLink, Trophy, Star, Sparkles, Code2, Paintbrush, Layers, CheckCircle2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";


function GlowWord({ children }: { children: string }) {
  const [hovered, setHovered] = useState(false);
  const letters = children.split("");

  return (
    <span
      className="inline-block cursor-default"
      style={{ overflow: "visible" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            overflow: "visible",
          }}
          animate={hovered ? { y: -8 } : { y: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 18,
            delay: hovered ? i * 0.035 : Math.max(0, (letters.length - 1 - i) * 0.02),
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

function ShimmerButton({
  href,
  children,
  className = "",
  testId,
  showArrow = false,
  target,
  rel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  testId?: string;
  showArrow?: boolean;
  target?: string;
  rel?: string;
}) {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`group relative inline-flex items-center justify-center h-12 px-8 font-medium overflow-hidden ${className}`}
      data-testid={testId}
      whileHover="hovered"
      whileTap={{ scale: 0.97 }}
      initial="idle"
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        variants={{
          idle: { x: "-100%" },
          hovered: { x: "200%", transition: { duration: 0.5, ease: "easeInOut" } }
        }}
      />
      <motion.span
        className="absolute inset-0"
        variants={{
          idle: { boxShadow: "0 0 0px 0px rgba(255,255,255,0)" },
          hovered: { boxShadow: "0 0 18px 2px hsl(var(--primary) / 0.6)", transition: { duration: 0.3 } }
        }}
      />
      <span className="relative z-10 flex items-center">
        {children}
        {showArrow && (
          <motion.span
            variants={{
              idle: { x: 0 },
              hovered: { x: 5, transition: { type: "spring", stiffness: 400, damping: 20 } }
            }}
            className="ml-2 flex items-center"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        )}
      </span>
    </motion.a>
  );
}

type Project = {
  title: string;
  desc: string;
  bullets: string[];
  stat: string;
  tag: string;
  link?: string;
};

type Company = {
  company: string;
  role: string;
  time: string;
  location: string;
  desc: string;
  projects: Project[];
};

function ProjectCard({
  project, index, open, onToggle,
}: { project: Project; index: number; open: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group border border-border bg-background relative overflow-hidden flex flex-col cursor-pointer hover:border-primary/30 transition-colors"
      onClick={onToggle}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10 flex flex-col flex-1 p-5">
        {/* Always visible: tag + title */}
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs shrink-0">{project.tag}</Badge>
          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`} />
        </div>
        <h4 className="text-sm font-semibold mt-2 leading-snug">{project.title}</h4>

        {/* Expanded: desc + bullets + stat */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">{project.desc}</p>
              {project.bullets.length > 0 && (
                <ul className="space-y-1.5 mt-3">
                  {project.bullets.map((b, k) => (
                    <li key={k} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap mt-4">
                <span className="text-primary font-medium text-xs">{project.stat}</span>
                {project.link && (
                  <a
                    href={`https://${project.link}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {project.link}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="grid md:grid-cols-2 gap-4 items-start">
      {projects.map((project, j) => (
        <ProjectCard
          key={j}
          project={project}
          index={j}
          open={openIdx === j}
          onToggle={() => setOpenIdx(openIdx === j ? null : j)}
        />
      ))}
    </div>
  );
}

function PortfolioCard({
  thumbnail, badge, type, title, desc, bullets, link, status,
  isOpen, onToggle, delay = 0,
}: {
  thumbnail: React.ReactNode;
  badge: string;
  type: string;
  title: string;
  desc: string;
  bullets: string[];
  link: { href: string; label: string };
  status?: string;
  isOpen: boolean;
  onToggle: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group relative border border-border bg-background/60 overflow-hidden flex flex-col hover:border-primary/40 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <div className="shrink-0">{thumbnail}</div>
      <div className="px-5 pt-4 pb-5 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{badge}</Badge>
            {status
              ? <span className="text-xs text-primary font-medium">{status}</span>
              : <span className="text-xs text-muted-foreground font-medium">{type}</span>
            }
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
        </div>
        <h3 className="text-base font-bold leading-snug">{title}</h3>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-3">{desc}</p>
              <ul className="space-y-1.5 mb-4">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-border">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {link.label}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const companies: Company[] = [
  {
    company: "Cognizant",
    role: "Senior UX Designer",
    time: "Oct 2022 – Present",
    location: "Chennai, India",
    desc: "Leading UX for large-scale enterprise modernization and AI accelerator initiatives. Designing across the full product lifecycle — from research and IA to component libraries and AI-native workflows.",
    projects: [
      {
        title: "Contract Signature Application",
        tag: "B2B SaaS",
        desc: "Transformed a manual Excel and email-based workflow into a fully digital application, significantly improving usability and adoption.",
        bullets: [
          "Designed end-to-end UX and UI, including a reusable component library aligned to the design system.",
          "Single-window service streamlined the entire contract lifecycle management process.",
        ],
        stat: "Faster turnaround across all business units",
      },
      {
        title: "Commitment Management AI",
        tag: "Enterprise AI",
        desc: "Architected UX, information architecture, and user workflows from scratch for an AI-powered contract commitment management application.",
        bullets: [
          "Designed AI-assisted workflows and created a full icon and component library for developer handoff.",
          "Delivered greater control for FinOps teams through smarter, AI-driven commitment flows.",
        ],
        stat: "50% reduction in time to create commitments",
      },
      {
        title: "Contracts Storage System",
        tag: "Workflow",
        desc: "Led end-to-end redesign to increase automation and align with evolving business needs.",
        bullets: [
          "Conducted user interviews and stakeholder reviews to identify gaps.",
          "Migrated UI components to an updated, unified design system.",
          "Merged disparate processes into a streamlined contract lifecycle flow.",
        ],
        stat: "90%+ of contracts now created in-app vs. via email",
      },
      {
        title: "Contracts Authoring",
        tag: "AI / UX",
        desc: "Redesigned application to enable seamless cross-application workflows, replacing siloed processes with integrated UX.",
        bullets: [
          "Reworked user flows across multiple personas to reduce redundancy and improve task completion.",
          "Integrated AI workflows to complete the full AI transformation of the application.",
        ],
        stat: "Increased efficiency, usability, and user adoption",
      },
      {
        title: "Other Contributions",
        tag: "Design Systems & Strategy",
        desc: "Beyond individual products — a range of strategic, client-facing, and operational contributions.",
        bullets: [
          "Designed components for the Cognizant Design System to improve scalability across products.",
          "Designed and deployed animated microsites for client visits; redesigned GCC presented in Hyderabad — deal was secured.",
          "Developed a POC for a drone management application that won a new client deal.",
          "Delivered a full space design overhaul of an experience center for a leading US bank.",
          "Managed delivery governance across three concurrent projects.",
        ],
        stat: "Multiple deals won through design",
      },
    ],
  },
  {
    company: "TCS",
    role: "UX Designer / Design Lead — L&D",
    time: "Jun 2016 – Sep 2022",
    location: "Chennai, India",
    desc: "Delivered high-quality enterprise UX across analytics, pharma, and learning & development. Received 10× On The Spot awards for outstanding contributions to key organizational initiatives.",
    projects: [
      {
        title: "CXO Dashboard — Pharma Client",
        tag: "Analytics",
        desc: "Designed the landing page for a CXO analytics dashboard surfacing live business insights.",
        bullets: [
          "Served as the primary UX advocate for the project.",
          "Delivered a user-centric design that enhanced executive-level decision-making capabilities.",
        ],
        stat: "Executive-level UX impact",
      },
      {
        title: "L&D Digital Transformation",
        tag: "Digital Learning",
        desc: "Created a unified design language across all learning materials to elevate learnability and enable a digital-first associate experience.",
        bullets: [
          "Led cloud migration of learning processes using Microsoft 365 tools across international regions.",
          "Conducted user research surveys for 30,000+ associates globally, generating actionable insights.",
          "As Design Lead, spearheaded a full overhaul of learning resources aligned to new business demands.",
        ],
        stat: "40,000+ associates completed a fully digital learning experience in one year",
      },
      {
        title: "Other Contributions",
        tag: "Facilitation & Training",
        desc: "Broader organizational contributions beyond product design.",
        bullets: [
          "Facilitated training and surveys for international associates; researched L&D tools and presented findings to leadership.",
          "Delivered creativity and design workshops for non-design team members.",
          "Served as Business Skills Faculty, conducting workshops and surveys across the organization.",
        ],
        stat: "Organisation-wide capability building",
      },
    ],
  },
  {
    company: "Go4runs",
    role: "Graphic Designer",
    time: "May 2013 – Apr 2014",
    location: "Chennai, India",
    desc: "Created graphic design assets for clients including NAC Jewellers, Footprints Holidays, and eAmbalam. Executed campaigns improving organic social reach.",
    projects: [],
  },
  {
    company: "Ogilvy",
    role: "Graphic Design Intern",
    time: "May 2012 – Jun 2012",
    location: "Chennai, India",
    desc: "Contributed to design for Vodafone, The Hindu, and MTR. Declined a full-time offer upon completion to finish my degree. A tough call that paid off.",
    projects: [],
  },
];

const ISSUER_COLORS: Record<string, string> = {
  Google:     "217 88% 68%",
  Cognizant:  "214 75% 65%",
  Miro:       "45 88% 56%",
  Domestika:  "0 68% 60%",
  Udemy:      "262 62% 68%",
  PMI:        "183 52% 54%",
  LinkedIn:   "201 85% 58%",
};

function abbrev(title: string): string {
  if (title.length <= 26) return title;
  const segs = title.split(/\s*[–:]\s*/);
  if (segs[0].length <= 26) return segs[0];
  return title.split(" ").slice(0, 4).join(" ");
}

function CertBadge({
  title, issuer, date, idx,
}: { title: string; issuer: string; date: string; idx: number }) {
  const hsl   = ISSUER_COLORS[issuer] ?? "var(--primary)";
  const color = `hsl(${hsl})`;
  const uid   = `cb-${idx}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.045 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative w-36 h-36 cursor-default select-none">
        {/* SVG rings + arc text */}
        <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full" aria-hidden="true">
          {/* Subtle fill */}
          <circle cx="80" cy="80" r="63" fill={color} fillOpacity="0.07" />
          {/* Outer solid ring */}
          <circle cx="80" cy="80" r="76" fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.45" />
          {/* Inner dashed ring */}
          <circle cx="80" cy="80" r="66" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 5" />
          <defs>
            {/* Top arc — text runs left → over top → right */}
            <path id={`${uid}-top`} d="M 14,80 A 66,66 0 1,1 146,80" />
            {/* Bottom arc — text runs right → under bottom → left (reads correctly upright) */}
            <path id={`${uid}-bot`} d="M 146,80 A 66,66 0 1,1 14,80" />
          </defs>
          {/* Issuer + CERTIFIED around top */}
          <text fontSize="7.5" fill={color} fillOpacity="0.85" letterSpacing="2.2" fontWeight="700">
            <textPath href={`#${uid}-top`} startOffset="50%" textAnchor="middle">
              {issuer.toUpperCase()} · CERTIFIED
            </textPath>
          </text>
          {/* Date around bottom */}
          <text fontSize="7" fill={color} fillOpacity="0.6" letterSpacing="2" fontWeight="500">
            <textPath href={`#${uid}-bot`} startOffset="50%" textAnchor="middle">
              {date.toUpperCase()}
            </textPath>
          </text>
          {/* Dot row near bottom */}
          {[0, 1, 2].map(s => (
            <circle key={s} cx={72 + s * 8} cy={125} r="1.8" fill={color} fillOpacity="0.5" />
          ))}
        </svg>

        {/* Centre: title only */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <p
            className="text-center leading-snug uppercase tracking-wide"
            style={{ color, fontSize: "11px", fontWeight: 400 }}
          >
            {abbrev(title)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function IssuerLogo({ issuer }: { issuer: string }) {
  const svg = {
    className: "w-6 h-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (issuer) {
    case "Google":
      return (
        <svg {...svg} aria-label="Google">
          {/* G: arc around left + crossbar at midline */}
          <path d="M20.5 12.5H13V10h8" />
          <path d="M19.1 7.9A8 8 0 1 0 20 12.5" />
        </svg>
      );
    case "Cognizant":
      return (
        <svg {...svg} aria-label="Cognizant">
          {/* C: large open arc */}
          <path d="M18 6.3A8 8 0 1 0 18 17.7" />
        </svg>
      );
    case "Miro":
      return (
        <svg {...svg} aria-label="Miro">
          {/* M letterform */}
          <path d="M4 18V6l8 7 8-7v12" />
        </svg>
      );
    case "Domestika":
      return (
        <svg {...svg} aria-label="Domestika">
          {/* D in a circle */}
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8h2A4 4 0 0 1 16 12 4 4 0 0 1 12 16h-2V8z" />
        </svg>
      );
    case "Udemy":
      return (
        <svg {...svg} aria-label="Udemy">
          {/* U with underline */}
          <path d="M7 5v8a5 5 0 0 0 10 0V5" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      );
    case "PMI":
      return (
        <svg {...svg} aria-label="PMI">
          {/* Diamond with centre dot */}
          <path d="M12 3l9 9-9 9-9-9z" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...svg} aria-label="LinkedIn">
          {/* Rounded square with "in" marks */}
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <line x1="7.5" y1="10" x2="7.5" y2="17" />
          <circle cx="7.5" cy="7" r="0.75" fill="currentColor" stroke="none" />
          <path d="M12 10v7m0-4a3.5 3.5 0 0 1 7 0v4" />
        </svg>
      );
    default:
      return (
        <svg {...svg} aria-label={issuer}>
          <circle cx="12" cy="10" r="4" />
          <path d="M9.5 14.5l-2.5 7 5-2.5 5 2.5-2.5-7" />
        </svg>
      );
  }
}

export default function Home() {
  const [openCompany, setOpenCompany] = useState<string | null>("Cognizant");
  const [openProjectIdx, setOpenProjectIdx] = useState<number | null>(null);
  const toggleProject = (i: number) => setOpenProjectIdx(prev => prev === i ? null : i);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
    >
      {/* Fixed Navigation */}
      <nav
        aria-label="Main navigation"
        className="fixed z-50 left-0 right-0 flex justify-center"
        style={{
          top: scrolled ? 10 : 0,
          padding: scrolled ? "0 16px" : "0",
          transition: "top 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: scrolled ? 660 : "100vw",
            height: scrolled ? 48 : 64,
            borderRadius: scrolled ? 9999 : 0,
            paddingLeft: scrolled ? 20 : 24,
            paddingRight: scrolled ? 20 : 24,
            background: `hsl(var(--background) / ${scrolled ? "0.72" : "0.82"})`,
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid transparent",
            borderColor: scrolled ? "hsl(var(--border) / 0.55)" : "transparent",
            borderBottomColor: "hsl(var(--border))",
            boxShadow: scrolled
              ? "0 8px 32px hsl(0 0% 0% / 0.10), 0 2px 8px hsl(0 0% 0% / 0.06)"
              : "none",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a href="#" className="font-bold text-xl tracking-tight hover:text-primary transition-colors">
            isaac<span className="text-primary">_</span>philip
          </a>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
              <a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">Experience</a>
              <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">Skills</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 min-h-[80vh] flex items-center"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground) / 0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Multi-disciplinary Designer</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.25] pb-2 overflow-visible">
              Creating <GlowWord>solutions</GlowWord> that tug at your <GlowWord>heart strings.</GlowWord>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              I'm Isaac Philip. I transform complex enterprise challenges into intuitive digital products. 10+ years of making screens work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <ShimmerButton
                href="#projects"
                className="bg-primary text-primary-foreground"
                testId="hero-btn-projects"
                showArrow
              >
                View Projects
              </ShimmerButton>
              <ShimmerButton
                href="mailto:isaacphilip7@gmail.com"
                className="border border-border"
                testId="hero-btn-contact"
              >
                Let's Talk
              </ShimmerButton>
            </div>
          </motion.div>

          {/* Right — illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex items-center justify-center overflow-visible"
          >
            <svg
              viewBox="0 0 800 640"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto select-none pointer-events-none"
              style={{ color: "hsl(var(--primary))" }}
            >
              {/* ── BACKGROUND GRID PANEL ── */}
              <rect x="353" y="20" width="418" height="352" rx="22" stroke="currentColor" strokeWidth="2.5"/>
              <line x1="458" y1="20" x2="458" y2="372" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="563" y1="20" x2="563" y2="372" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="668" y1="20" x2="668" y2="372" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="353" y1="137" x2="771" y2="137" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="353" y1="254" x2="771" y2="254" stroke="currentColor" strokeWidth="1.5"/>
              {/* Row 1 */}
              <rect x="366" y="33" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="471" y="33" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="576" y="33" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="681" y="33" width="79" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              {/* Row 2 */}
              <rect x="366" y="150" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="471" y="150" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="576" y="150" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="681" y="150" width="79" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              {/* Row 3 */}
              <rect x="366" y="267" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="471" y="267" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="576" y="267" width="81" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="681" y="267" width="79" height="93" rx="11" stroke="currentColor" strokeWidth="1.5"/>

              {/* ── MONITOR BODY ── */}
              <rect x="236" y="86" width="470" height="422" rx="20" stroke="currentColor" strokeWidth="2.5"/>
              <rect x="266" y="116" width="410" height="362" rx="10" stroke="currentColor" strokeWidth="1.5"/>
              {/* Stand neck */}
              <rect x="446" y="508" width="38" height="32" rx="5" stroke="currentColor" strokeWidth="2"/>
              {/* Stand base */}
              <path d="M392 542 L418 539 L462 539 L516 539 L538 542 L528 557 L404 557 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>

              {/* ── SCREEN CONTENTS ── */}
              {/* Hamburger */}
              <line x1="276" y1="131" x2="300" y2="131" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="276" y1="139" x2="300" y2="139" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="276" y1="147" x2="300" y2="147" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

              {/* Toolbar pill */}
              <rect x="307" y="122" width="302" height="40" rx="20" stroke="currentColor" strokeWidth="1.5"/>
              {/* Up arrow */}
              <path d="M330 148 L330 134" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M326 139 L330 134 L334 139" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Circle icon */}
              <circle cx="358" cy="142" r="8" stroke="currentColor" strokeWidth="1.4"/>
              {/* Square icon */}
              <rect x="374" y="134" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              {/* Triangle icon */}
              <path d="M412 150 L403 134 L421 134 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              {/* Bullseye */}
              <circle cx="448" cy="142" r="9" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="448" cy="142" r="4" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="448" cy="142" r="1.5" fill="currentColor"/>
              {/* Search icon */}
              <circle cx="638" cy="142" r="9" stroke="currentColor" strokeWidth="1.8"/>
              <line x1="644" y1="148" x2="653" y2="157" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

              {/* Small square below toolbar */}
              <rect x="447" y="172" width="30" height="30" rx="5" stroke="currentColor" strokeWidth="1.3"/>

              {/* Lorem ipsum text lines */}
              <rect x="276" y="218" width="172" height="6" rx="3" fill="currentColor" fillOpacity="0.35"/>
              <rect x="276" y="230" width="178" height="6" rx="3" fill="currentColor" fillOpacity="0.35"/>
              <rect x="276" y="242" width="152" height="6" rx="3" fill="currentColor" fillOpacity="0.35"/>
              <rect x="276" y="254" width="160" height="6" rx="3" fill="currentColor" fillOpacity="0.2"/>

              {/* UI/UX badge */}
              <rect x="276" y="270" width="64" height="26" rx="13" stroke="currentColor" strokeWidth="1.5"/>
              <text x="308" y="288" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="monospace" fontWeight="bold">UI/UX</text>

              {/* Large circle */}
              <circle cx="558" cy="302" r="75" stroke="currentColor" strokeWidth="1.8"/>
              {/* Code icon rectangle */}
              <rect x="515" y="271" width="86" height="58" rx="9" stroke="currentColor" strokeWidth="1.5"/>
              {/* </> */}
              <path d="M535 301 L528 294 L535 287" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M556 301 L563 294 L556 287" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="541" y1="308" x2="550" y2="280" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Small pill inside circle (top) */}
              <rect x="532" y="256" width="52" height="16" rx="8" stroke="currentColor" strokeWidth="1.2"/>

              {/* Top-right gear */}
              <circle cx="614" cy="248" r="22" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="614" cy="248" r="11" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="614" y1="223" x2="614" y2="215" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="628" y1="227" x2="634" y2="221" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="636" y1="241" x2="644" y2="239" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="634" y1="257" x2="642" y2="261" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="624" y1="269" x2="629" y2="277" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="614" y1="273" x2="614" y2="281" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="604" y1="269" x2="599" y2="277" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="592" y1="257" x2="584" y2="261" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="592" y1="241" x2="584" y2="239" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="600" y1="227" x2="594" y2="221" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>

              {/* Small lower gear */}
              <circle cx="580" cy="358" r="18" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="580" cy="358" r="9" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="580" y1="337" x2="580" y2="330" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="593" y1="341" x2="598" y2="336" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="599" y1="354" x2="606" y2="354" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="593" y1="367" x2="598" y2="372" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="580" y1="379" x2="580" y2="386" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="567" y1="375" x2="562" y2="380" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="561" y1="362" x2="554" y2="362" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="567" y1="349" x2="562" y2="344" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>

              {/* Decorative circles on screen */}
              <circle cx="506" cy="196" r="14" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="484" cy="358" r="18" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="648" cy="382" r="22" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.5"/>
              <circle cx="648" cy="200" r="11" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4"/>

              {/* ── DESK LAMP ── */}
              {/* Base */}
              <ellipse cx="110" cy="572" rx="76" ry="14" stroke="currentColor" strokeWidth="2"/>
              {/* Post */}
              <rect x="97" y="534" width="26" height="40" rx="5" stroke="currentColor" strokeWidth="1.8"/>
              {/* Bottom pivot */}
              <circle cx="110" cy="533" r="10" stroke="currentColor" strokeWidth="1.8"/>
              {/* Lower arm (front strut) */}
              <line x1="110" y1="523" x2="162" y2="414" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {/* Lower arm (back strut) */}
              <line x1="121" y1="527" x2="173" y2="417" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
              {/* Middle pivot */}
              <circle cx="164" cy="412" r="10" stroke="currentColor" strokeWidth="1.8"/>
              {/* Upper arm (front strut) */}
              <line x1="164" y1="402" x2="226" y2="304" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {/* Upper arm (back strut) */}
              <line x1="175" y1="406" x2="235" y2="307" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
              {/* Top pivot */}
              <circle cx="227" cy="302" r="9" stroke="currentColor" strokeWidth="1.8"/>
              {/* Shade arm */}
              <line x1="227" y1="293" x2="242" y2="273" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Shade (trapezoid) */}
              <path d="M214 252 L267 266 L273 300 L208 300 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              {/* Bulb cylinder top ellipse */}
              <ellipse cx="240" cy="304" rx="36" ry="14" stroke="currentColor" strokeWidth="1.5"/>
              {/* Bulb cylinder bottom ellipse */}
              <ellipse cx="240" cy="317" rx="33" ry="12" stroke="currentColor" strokeWidth="1.2"/>
              {/* Ribs */}
              <line x1="212" y1="297" x2="212" y2="323" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="220" y1="293" x2="220" y2="325" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="228" y1="291" x2="228" y2="327" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="236" y1="290" x2="236" y2="328" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="244" y1="291" x2="244" y2="327" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="252" y1="293" x2="252" y2="325" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="260" y1="297" x2="260" y2="322" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
              <line x1="268" y1="302" x2="268" y2="320" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>

              {/* ── SMARTPHONE ── */}
              <rect x="284" y="362" width="122" height="220" rx="16" stroke="currentColor" strokeWidth="2.2"/>
              <rect x="296" y="375" width="98" height="194" rx="7" stroke="currentColor" strokeWidth="1.2"/>
              {/* Notch */}
              <rect x="328" y="369" width="38" height="10" rx="5" stroke="currentColor" strokeWidth="1.2"/>
              {/* Donut chart – track */}
              <circle cx="345" cy="413" r="25" stroke="currentColor" strokeWidth="6" strokeOpacity="0.2"/>
              {/* Donut chart – fill */}
              <circle cx="345" cy="413" r="25" stroke="currentColor" strokeWidth="6" strokeDasharray="110 47" strokeDashoffset="39"/>
              {/* List row 1 */}
              <rect x="304" y="450" width="46" height="7" rx="3.5" fill="currentColor" fillOpacity="0.4"/>
              <rect x="354" y="450" width="22" height="7" rx="3.5" fill="currentColor" fillOpacity="0.4"/>
              <rect x="380" y="448" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1"/>
              <path d="M383 454 L386 457 L391 452" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              {/* List row 2 */}
              <rect x="304" y="464" width="40" height="7" rx="3.5" fill="currentColor" fillOpacity="0.3"/>
              <rect x="348" y="464" width="28" height="7" rx="3.5" fill="currentColor" fillOpacity="0.3"/>
              <rect x="380" y="462" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1"/>
              <path d="M383 468 L386 471 L391 466" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              {/* List row 3 */}
              <rect x="304" y="478" width="52" height="7" rx="3.5" fill="currentColor" fillOpacity="0.3"/>
              <rect x="360" y="478" width="16" height="7" rx="3.5" fill="currentColor" fillOpacity="0.3"/>
              <rect x="380" y="476" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1"/>
              <path d="M383 482 L386 485 L391 480" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              {/* List row 4 */}
              <rect x="304" y="492" width="44" height="7" rx="3.5" fill="currentColor" fillOpacity="0.2"/>
              <rect x="352" y="492" width="24" height="7" rx="3.5" fill="currentColor" fillOpacity="0.2"/>
              <rect x="380" y="490" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1"/>
              <path d="M383 496 L386 499 L391 494" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Wave */}
              <path d="M303 532 Q312 523 321 532 Q330 541 339 532 Q348 523 357 532 Q366 541 375 532 Q384 523 393 532" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Dots */}
              <circle cx="332" cy="552" r="3.5" fill="currentColor"/>
              <circle cx="342" cy="552" r="2.5" stroke="currentColor" strokeWidth="1"/>
              <circle cx="351" cy="552" r="2.5" stroke="currentColor" strokeWidth="1"/>
              <circle cx="360" cy="552" r="2.5" stroke="currentColor" strokeWidth="1"/>

              {/* ── KEYBOARD ── */}
              <rect x="301" y="556" width="224" height="54" rx="7" stroke="currentColor" strokeWidth="1.8"/>
              <line x1="311" y1="570" x2="514" y2="570" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4"/>
              <line x1="311" y1="581" x2="514" y2="581" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4"/>
              <line x1="311" y1="592" x2="514" y2="592" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4"/>
              <line x1="324" y1="562" x2="324" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="337" y1="562" x2="337" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="350" y1="562" x2="350" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="363" y1="562" x2="363" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="376" y1="562" x2="376" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="389" y1="562" x2="389" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="402" y1="562" x2="402" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="415" y1="562" x2="415" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="428" y1="562" x2="428" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="441" y1="562" x2="441" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="454" y1="562" x2="454" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="467" y1="562" x2="467" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="480" y1="562" x2="480" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="493" y1="562" x2="493" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>
              <line x1="506" y1="562" x2="506" y2="603" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.3"/>

              {/* ── BUILDING BLOCKS ── */}
              <rect x="168" y="496" width="32" height="82" rx="4" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="202" y="518" width="32" height="60" rx="4" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="236" y="535" width="32" height="43" rx="4" stroke="currentColor" strokeWidth="1.8"/>
              <ellipse cx="202" cy="580" rx="58" ry="10" stroke="currentColor" strokeWidth="1.5"/>

              {/* ── GEARS (bottom right) ── */}
              {/* Large gear */}
              <circle cx="646" cy="568" r="30" stroke="currentColor" strokeWidth="2"/>
              <circle cx="646" cy="568" r="15" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="646" y1="535" x2="646" y2="527" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="663" y1="539" x2="669" y2="532" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="673" y1="553" x2="681" y2="551" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="671" y1="570" x2="679" y2="573" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="663" y1="584" x2="669" y2="591" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="646" y1="598" x2="646" y2="606" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="629" y1="594" x2="623" y2="601" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="619" y1="580" x2="611" y2="583" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="619" y1="563" x2="611" y2="560" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="629" y1="549" x2="623" y2="542" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
              {/* Small gear */}
              <circle cx="694" cy="546" r="20" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="694" cy="546" r="10" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="694" y1="523" x2="694" y2="516" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="708" y1="527" x2="713" y2="521" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="715" y1="539" x2="722" y2="537" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="715" y1="554" x2="722" y2="557" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="708" y1="566" x2="713" y2="572" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="694" y1="569" x2="694" y2="576" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="680" y1="566" x2="675" y2="572" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="673" y1="553" x2="666" y2="555" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="673" y1="539" x2="666" y2="537" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              <line x1="680" y1="527" x2="675" y2="521" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

              {/* ── MOUSE ── */}
              <ellipse cx="748" cy="574" rx="24" ry="30" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="748" y1="549" x2="748" y2="567" stroke="currentColor" strokeWidth="1.2"/>

              {/* ── DESK LINE ── */}
              <line x1="28" y1="585" x2="790" y2="585" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
              Who I am
            </h2>

            <div className="grid md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed">
              <div className="space-y-6">
                <p>
                  My core strength is end-to-end enterprise UX — research, information architecture, interaction design, design systems, and increasingly, AI-powered workflows.
                </p>
                <p>
                  At Cognizant, I've led design for several contract lifecycle management applications, including Contract Signature, Commitment Management AI, Contracts Storage, and Contracts Authoring. <strong>Most recently I was driving a greenfield project using Claude Code and Spec-Driven Development.</strong>
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  I also bring a strong visual design foundation spanning branding, illustration, and motion design, extending into space and experience design — I led a full design overhaul of an experience center for a leading US bank.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold">Projects</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

            {/* 0 — Neuro AI */}
            <PortfolioCard
              isOpen={openProjectIdx === 0} onToggle={() => toggleProject(0)} delay={0}
              badge="AI / UX" type="" status="In Progress"
              title="Neuro AI Multi-Agent Accelerator"
              desc="Next-generation UI for an AI agent studio — making multi-agent orchestration intuitive for enterprise teams."
              bullets={[
                "Designing the UX for an AI agent studio from the ground up.",
                "Leveraging Anima, GitHub Copilot & Microsoft Copilot to accelerate design-to-dev handoff.",
                "Built using Claude Code and Spec-Driven Development.",
              ]}
              link={{ href: "https://github.com/isaacphilip7/Neuro-UI-Sky-Blue", label: "github.com/isaacphilip7/Neuro-UI-Sky-Blue" }}
              thumbnail={
                <div className="h-40 relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <svg viewBox="0 0 160 120" className="w-40 opacity-60" fill="none">
                    <circle cx="80" cy="60" r="14" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                    <circle cx="30" cy="30" r="8"  stroke="hsl(var(--accent))"   strokeWidth="1.5" />
                    <circle cx="130" cy="30" r="8"  stroke="hsl(var(--accent))"   strokeWidth="1.5" />
                    <circle cx="30" cy="90" r="8"  stroke="hsl(var(--primary))"  strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="130" cy="90" r="8"  stroke="hsl(var(--primary))"  strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="80" y1="46" x2="30"  y2="38" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="80" y1="46" x2="130" y2="38" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="80" y1="74" x2="30"  y2="82" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
                    <line x1="80" y1="74" x2="130" y2="82" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
                    <text x="80" y="64" textAnchor="middle" fontSize="9" fill="hsl(var(--primary))" fontFamily="monospace">AI</text>
                  </svg>
                </div>
              }
            />

            {/* 1 — Logis */}
            <PortfolioCard
              isOpen={openProjectIdx === 1} onToggle={() => toggleProject(1)} delay={0.06}
              badge="Web Design" type="Concept"
              title="Logis — Website Design"
              desc='"Global operations made personal." A logistics platform designed around clarity, trust, and real-time shipment tracking.'
              bullets={[
                "Clean, conversion-focused landing page with a bold hero and inline tracking CTA.",
                "Warm, human illustration style to offset the industrial logistics context.",
                "Navigation structured around core user tasks: Send, Services, Pricing.",
              ]}
              link={{ href: "https://www.behance.net/gallery/247694847/Logis-Website-Design", label: "behance.net/gallery/247694847" }}
              thumbnail={
                <div className="h-40 relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-background to-background flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <svg viewBox="0 0 180 120" className="w-44 opacity-70" fill="none">
                    <path d="M20 90 Q60 20 90 60 Q120 95 160 40" stroke="hsl(45 90% 55%)" strokeWidth="2" strokeDasharray="5 4" />
                    <circle cx="20" cy="90" r="5" fill="hsl(45 90% 55%)" />
                    <circle cx="160" cy="40" r="5" fill="hsl(var(--primary))" />
                    <rect x="78" y="48" width="24" height="24" rx="2" stroke="hsl(45 90% 55%)" strokeWidth="1.5" />
                    <line x1="78" y1="56" x2="102" y2="56" stroke="hsl(45 90% 55%)" strokeWidth="1" strokeOpacity="0.6" />
                    <line x1="90" y1="48" x2="90" y2="72" stroke="hsl(45 90% 55%)" strokeWidth="1" strokeOpacity="0.6" />
                    <path d="M154 38 L160 40 L155 44" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              }
            />

            {/* 2 — Homesense */}
            <PortfolioCard
              isOpen={openProjectIdx === 2} onToggle={() => toggleProject(2)} delay={0.1}
              badge="Mobile App" type="UI/UX"
              title="Homesense App"
              desc="A smart home app designed around calm, minimal aesthetics — making home automation feel effortless rather than technical."
              bullets={[
                "Line-art illustration style creates warmth without visual noise.",
                "Focused on intuitive control flows for non-technical users.",
                "Consistent design language across room, device, and scene views.",
              ]}
              link={{ href: "https://www.behance.net/gallery/141252151/Homesense-App", label: "behance.net/gallery/141252151" }}
              thumbnail={
                <div className="h-40 relative overflow-hidden bg-gradient-to-br from-foreground/5 via-background to-background flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <svg viewBox="0 0 180 120" className="w-44 opacity-60" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1">
                    <path d="M30 20 L150 20 L150 100 L30 100 Z" strokeOpacity="0.3" />
                    <path d="M30 20 L60 40 L60 100" strokeOpacity="0.2" />
                    <path d="M150 20 L120 40 L120 100" strokeOpacity="0.2" />
                    <path d="M60 40 L120 40" strokeOpacity="0.15" />
                    <path d="M80 55 L90 47 L100 55 L100 72 L80 72 Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeOpacity="0.8" />
                    <rect x="86" y="62" width="8" height="10" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.6" />
                    <path d="M90 52 Q96 46 102 52" stroke="hsl(var(--accent))" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
                    <path d="M90 52 Q99 42 108 52" stroke="hsl(var(--accent))" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
                  </svg>
                </div>
              }
            />

            {/* 3 — Goodweather */}
            <PortfolioCard
              isOpen={openProjectIdx === 3} onToggle={() => toggleProject(3)} delay={0.14}
              badge="Mobile App" type="UI/UX Case Study"
              title="Goodweather"
              desc="My first UI/UX project — a weather app that goes beyond temperature to offer contextual lifestyle recommendations based on conditions."
              bullets={[
                "Warm pastel palette adapts to weather conditions for emotional resonance.",
                "Pollen, wind, and UV data surfaced alongside temperature for fuller context.",
                "Full Figma prototype — from wireframes through polished UI.",
              ]}
              link={{ href: "https://www.behance.net/gallery/139904507/Goodweather-UIUX-case-study", label: "behance.net/gallery/139904507" }}
              thumbnail={
                <div className="h-40 relative overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(45 80% 60% / 0.2), hsl(var(--accent) / 0.15), hsl(160 50% 50% / 0.1))" }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <svg viewBox="0 0 180 120" className="w-44 opacity-75" fill="none">
                    <circle cx="130" cy="35" r="14" fill="hsl(45 88% 62%)" fillOpacity="0.5" />
                    <ellipse cx="80" cy="62" rx="28" ry="16" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
                    <ellipse cx="94" cy="55" rx="18" ry="14" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1" strokeOpacity="0.35" />
                    <path d="M40 55 Q55 50 70 55" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
                    <path d="M35 65 Q55 58 75 65" stroke="hsl(var(--accent))" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
                    <text x="52" y="90" fontSize="18" fontWeight="700" fill="hsl(var(--accent))" fillOpacity="0.8" fontFamily="serif">23°</text>
                  </svg>
                </div>
              }
            />

            {/* 4 — Personal Illustrations 2023 */}
            <PortfolioCard
              isOpen={openProjectIdx === 4} onToggle={() => toggleProject(4)} delay={0.18}
              badge="Illustration" type="Personal"
              title="Personal Illustrations — 2023"
              desc="A personal illustration series exploring conceptual themes. A reminder that design ability starts with the ability to draw."
              bullets={[
                "Conceptual series grounded in personal storytelling.",
                "Demonstrates the visual communication foundation behind the UX work.",
              ]}
              link={{ href: "https://www.behance.net/gallery/187300823/Personal-Illustrations-2023", label: "behance.net/gallery/187300823" }}
              thumbnail={
                <div className="h-40 relative overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--accent) / 0.12), hsl(var(--primary) / 0.08))" }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <svg viewBox="0 0 180 120" className="w-44 opacity-75" fill="none">
                    <path d="M40 80 Q55 40 80 60 Q105 80 130 35" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
                    <path d="M50 90 Q70 55 90 70 Q110 85 140 50" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
                    <circle cx="40" cy="80" r="3" fill="hsl(var(--accent))" fillOpacity="0.8" />
                    <circle cx="130" cy="35" r="3" fill="hsl(var(--accent))" fillOpacity="0.6" />
                    <circle cx="90" cy="70" r="2" fill="hsl(var(--primary))" fillOpacity="0.6" />
                    <rect x="62" y="28" width="34" height="40" rx="2" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.15" />
                    <rect x="100" y="35" width="26" height="30" rx="2" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.1" />
                  </svg>
                </div>
              }
            />

            {/* 5 — Notes App */}
            <PortfolioCard
              isOpen={openProjectIdx === 5} onToggle={() => toggleProject(5)} delay={0.22}
              badge="Mobile App" type="UI/UX"
              title="Notes App — Capture life beautifully"
              desc="A notes app UI/UX project that pairs dark, tactile aesthetics with botanical illustration — making the mundane act of note-taking feel considered."
              bullets={[
                "Dark notebook-inspired UI contrasted with organic botanical elements.",
                "Yellow accent system for quick-capture actions and hierarchy.",
                "Balances personality with functional clarity.",
              ]}
              link={{ href: "https://www.behance.net/gallery/155834013/Notes-App", label: "behance.net/gallery/155834013" }}
              thumbnail={
                <div className="h-40 relative overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(140 40% 30% / 0.15), hsl(var(--background)))" }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <svg viewBox="0 0 180 120" className="w-44 opacity-75" fill="none">
                    <rect x="68" y="22" width="44" height="58" rx="3" fill="hsl(var(--foreground))" fillOpacity="0.12" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.3" />
                    <path d="M84 80 L84 92 L90 88 L96 92 L96 80" fill="hsl(140 60% 55%)" fillOpacity="0.7" />
                    <rect x="58" y="34" width="18" height="18" rx="3" fill="hsl(52 95% 55%)" fillOpacity="0.9" />
                    <line x1="67" y1="38" x2="67" y2="48" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" />
                    <line x1="62" y1="43" x2="72" y2="43" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" />
                    <path d="M120 30 Q145 18 150 45 Q140 55 120 30Z" fill="hsl(140 50% 45%)" fillOpacity="0.4" />
                    <path d="M115 50 Q135 38 145 60 Q132 68 115 50Z" fill="hsl(140 50% 45%)" fillOpacity="0.25" />
                  </svg>
                </div>
              }
            />

          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold flex items-center gap-4">
              Experience
            </h2>
          </motion.div>

          <div className="space-y-0 divide-y divide-border">
            {companies.map((job, i) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <button
                  onClick={() => setOpenCompany(openCompany === job.company ? null : job.company)}
                  className="w-full text-left py-8 flex items-start justify-between gap-4 group cursor-pointer"
                  data-testid={`experience-toggle-${job.company.toLowerCase()}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 mb-1">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {job.company}
                      </h3>
                      <span className="text-sm text-muted-foreground">{job.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.role}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{job.location}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 ${openCompany === job.company ? "rotate-180 text-primary" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openCompany === job.company && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{job.desc}</p>

                        {job.projects.length > 0 && (
                          <ProjectGrid projects={job.projects} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 flex items-center gap-4">
            Toolkit & Craft
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Paintbrush className="text-primary" />
                <h3 className="text-xl font-bold">Design Tooling</h3>
              </div>
              <ul className="space-y-4">
                {['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Procreate', 'Affinity Designer'].map(skill => (
                  <li key={skill} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Code2 className="text-accent" />
                <h3 className="text-xl font-bold">AI & Dev</h3>
              </div>
              <ul className="space-y-4">
                {['GitHub Copilot', 'Claude AI', 'Anima', 'Adobe Firefly', 'Lovable'].map(skill => (
                  <li key={skill} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Layers className="text-foreground/40" />
                <h3 className="text-xl font-bold">Core Craft</h3>
              </div>
              <ul className="space-y-4">
                {['UX Research', 'Accessibility (WCAG 2.2)', 'Interaction Design', 'Design Systems', 'Information Architecture'].map(skill => (
                  <li key={skill} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Certs */}
      <section className="py-24 px-6 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
              <Trophy className="text-primary" /> Achievements & Awards
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Raising the Bar", meta: "Cognizant · Sep 2025", desc: "Exceptional support during the critical rollout of the Contract Signature application." },
                { title: "Guinness World Record", meta: "Cognizant · Aug 2025", desc: "Most participants in an online Generative AI Hackathon." },
                { title: "Q2 Best Performer", meta: "Cognizant · Oct 2024", desc: "Exceptional efforts across projects and initiatives in the quarter." },
                { title: "Rising Star 2024", meta: "Cognizant · May 2024", desc: "Recognized for career growth and outstanding contributions." },
                { title: "Versatile Design Pioneer", meta: "Cognizant · Oct 2023", desc: "Delivered microsite creation under challenging timelines." },
                { title: "On The Spot ×10", meta: "TCS · 2016–2022", desc: "Received 10 awards for contributions to key organizational initiatives." },
              ].map((award, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="p-5 border border-border bg-background/60 space-y-2 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
                  <div className="pl-3">
                    <div className="flex items-start gap-2 mb-1">
                      <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <h4 className="font-bold text-sm leading-snug">{award.title}</h4>
                    </div>
                    <p className="text-xs text-primary/80 font-medium mb-2">{award.meta}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{award.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
              <CheckCircle2 className="text-primary" /> Certifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
              {[
                { title: "Generative AI Fundamentals",                      issuer: "Google",     date: "May 2026" },
                { title: "Google Cloud Certified Generative AI Leader",      issuer: "Cognizant",  date: "Nov 2025" },
                { title: "Frontline Leaders Client Leadership Program",       issuer: "Cognizant",  date: "Oct 2024" },
                { title: "GitHub Copilot Certified",                          issuer: "Cognizant",  date: "Aug 2024" },
                { title: "Client Collaboration",                              issuer: "Miro",       date: "May 2023" },
                { title: "Mapping & Diagramming",                             issuer: "Miro",       date: "May 2023" },
                { title: "Miro Essentials",                                   issuer: "Miro",       date: "Apr 2023" },
                { title: "App Design: Prototyping for Beginners",             issuer: "Domestika",  date: "Feb 2022" },
                { title: "Figma UI UX Design Essentials",                     issuer: "Udemy",      date: "Apr 2022" },
                { title: "Google UX Certification – Foundations of UX Design",issuer: "Google",     date: "May 2022" },
                { title: "WCAG 2.2 – How to Design for Accessibility",        issuer: "Udemy",      date: "Jul 2022" },
                { title: "Giving and Receiving Feedback",                      issuer: "PMI",        date: "Apr 2020" },
                { title: "Digital Body Language",                              issuer: "LinkedIn",   date: "Jul 2021" },
                { title: "Communicating with Confidence",                      issuer: "LinkedIn",   date: "May 2021" },
              ].map((cert, i) => (
                <CertBadge key={i} idx={i} title={cert.title} issuer={cert.issuer} date={cert.date} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/10 rounded-t-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">Let's build something <span className="text-primary">better.</span></h2>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <ShimmerButton
              href="mailto:isaacphilip7@gmail.com"
              className="border border-border text-sm"
              testId="link-email"
            >
              <Mail className="w-4 h-4 mr-2" /> isaacphilip7@gmail.com
            </ShimmerButton>
            <ShimmerButton
              href="https://linkedin.com/in/isaacphilip"
              target="_blank"
              rel="noreferrer"
              className="border border-border text-sm"
              testId="link-linkedin"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> LinkedIn
            </ShimmerButton>
            <ShimmerButton
              href="https://behance.net/isaacp"
              target="_blank"
              rel="noreferrer"
              className="border border-border text-sm"
              testId="link-behance"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Behance
            </ShimmerButton>
          </div>

          <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Based in Chennai, India.</p>
            <p>Designed with intention. Built for scale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
