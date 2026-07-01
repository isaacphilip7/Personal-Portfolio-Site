import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, ExternalLink, Trophy, Star, Sparkles, Code2, Paintbrush, Layers, CheckCircle2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";


function GlowWord({ children, autoPlayDelay = 0 }: { children: string; autoPlayDelay?: number }) {
  const [hovered, setHovered] = useState(false);
  const letters = children.split("");

  useEffect(() => {
    const t1 = setTimeout(() => setHovered(true), autoPlayDelay * 1000);
    const t2 = setTimeout(() => setHovered(false), (autoPlayDelay + 0.65) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
  delay = 0,
}: {
  thumbnail: React.ReactNode;
  badge: string;
  type: string;
  title: string;
  desc: string;
  bullets: string[];
  link: { href: string; label: string };
  status?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group relative border border-border bg-background/60 overflow-hidden flex flex-col hover:border-primary/40 transition-colors"
    >
      <div className="relative shrink-0 overflow-hidden">
        <div className="shrink-0">{thumbnail}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 px-6 text-center opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
          <p className="text-sm text-white/90 leading-relaxed mb-4 max-w-xs">{desc}</p>
          <ShimmerButton
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="border border-white/20 bg-white/10 text-white text-sm backdrop-blur-sm"
          >
            View Project <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </ShimmerButton>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{badge}</Badge>
          {status
            ? <span className="text-xs text-primary font-medium">{status}</span>
            : <span className="text-xs text-muted-foreground font-medium">{type}</span>
          }
        </div>
        <h3 className="text-base font-bold leading-snug">{title}</h3>
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
        title: "Advocacy Platform",
        tag: "Greenfield · AI-Native",
        desc: "Leading UX and design integration for a greenfield enterprise application built using Spec-Driven Development (SDD) with Claude Code as the AI development engine.",
        bullets: [
          "Integrated design workflows into the AI development pipeline using Figma MCP, enabling seamless design-to-code handoff within the SDD model.",
          "Made 60+ commits to the repository; built custom web components with WCAG compliance and design system adherence natively enforced through AI.",
          "Designed and created 15+ custom icons to ensure visual consistency and scalability across the design system.",
        ],
        stat: "WCAG compliance and UI consistency enforced natively across all screens",
      },
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
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary mb-6">
                <Sparkles className="w-3 h-3" />
                <span>Design Builder</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.25] pb-2 overflow-visible"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Creating <GlowWord autoPlayDelay={0.85}>solutions</GlowWord> that tug at your <GlowWord autoPlayDelay={1.05}>heart strings.</GlowWord>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.42 }}
            >
              I'm Isaac Philip. I transform complex enterprise challenges into intuitive digital products. 10+ years of making screens work.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            >
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
            </motion.div>
          </div>

          {/* Right — illustration */}
          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <img
              src="/hero-illustration.png"
              alt=""
              aria-hidden="true"
              className="w-full max-w-sm object-contain"
              style={{ mixBlendMode: "screen" }}
            />
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
                  At Cognizant, I've led design for several contract lifecycle management applications, including Contract Signature, Commitment Management AI, Contracts Storage, and Contracts Authoring. <mark className="px-0.5 not-italic font-normal" style={{background: "hsl(var(--primary) / 0.25)", color: "inherit"}}>Most recently I was driving a greenfield project using Claude Code and Spec-Driven Development.</mark>
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  I also bring a strong visual design foundation spanning branding, illustration, and motion design, extending into space and experience design — I led a full design overhaul of an experience center for a leading US bank.
                </p>
                <ShimmerButton
                  href="https://docs.google.com/document/d/1vnLR_jnXasTEzbImIshQ_H-Z2T4FoWTt/edit?usp=sharing&ouid=110213304138732668530&rtpof=true&sd=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary/50 text-primary text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download my resume
                </ShimmerButton>
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
                delay={0}
                badge="AI / UX" type="" status="Agent Design"
                title="Neuro AI Multi-Agent Accelerator"
                desc="Next-generation UI for an AI agent studio — making multi-agent orchestration intuitive for enterprise teams."
                bullets={[
                  "Designing the UX for an AI agent studio from the ground up.",
                  "Leveraging Anima, GitHub Copilot & Microsoft Copilot to accelerate design-to-dev handoff.",
                  "Built using Claude Code and Spec-Driven Development.",
                ]}
                link={{ href: "https://github.com/isaacphilip7/Neuro-UI-Sky-Blue", label: "github.com/isaacphilip7/Neuro-UI-Sky-Blue" }}
                thumbnail={
                  <div className="h-56 relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background flex items-center justify-center">
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
                delay={0.06}
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
                  <div className="h-56 overflow-hidden">
                    <img src="/thumb-logis.png" alt="Logis" className="w-full h-full object-cover object-top" />
                  </div>
                }
              />

              {/* 2 — Homesense */}
              <PortfolioCard
                delay={0.1}
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
                  <div className="h-56 overflow-hidden">
                    <img src="/thumb-homesense.png" alt="Homesense" className="w-full h-full object-cover object-center" />
                  </div>
                }
              />

              {/* 3 — Goodweather */}
              <PortfolioCard
                delay={0.14}
                badge="Mobile App" type="UI/UX Case Study"
                title="Goodweather"
                desc="A weather app that goes beyond temperature to offer contextual lifestyle recommendations based on conditions."
                bullets={[
                  "Warm pastel palette adapts to weather conditions for emotional resonance.",
                  "Pollen, wind, and UV data surfaced alongside temperature for fuller context.",
                  "Full Figma prototype — from wireframes through polished UI.",
                ]}
                link={{ href: "https://www.behance.net/gallery/139904507/Goodweather-UIUX-case-study", label: "behance.net/gallery/139904507" }}
                thumbnail={
                  <div className="h-56 overflow-hidden">
                    <img src="/thumb-goodweather.png" alt="Goodweather" className="w-full h-full object-cover object-top" />
                  </div>
                }
              />

              {/* 4 — Personal Illustrations 2023 */}
              <PortfolioCard
                delay={0.18}
                badge="Procreate" type="Creative"
                title="Illustrations"
                desc="A personal illustration series exploring conceptual themes. A reminder that design ability starts with the ability to draw."
                bullets={[
                  "Conceptual series grounded in personal storytelling.",
                  "Demonstrates the visual communication foundation behind the UX work.",
                ]}
                link={{ href: "https://www.behance.net/gallery/187300823/Personal-Illustrations-2023", label: "behance.net/gallery/187300823" }}
                thumbnail={
                  <div className="h-56 overflow-hidden">
                    <img src="/thumb-illustrations.png" alt="Personal Illustrations" className="w-full h-full object-cover object-center" />
                  </div>
                }
              />

              {/* 5 — Notes App */}
              <PortfolioCard
                delay={0.22}
                badge="Mobile App" type="UI/UX"
                title="Notes App"
                desc="A notes app UI/UX project that pairs dark, tactile aesthetics with botanical illustration — making the mundane act of note-taking feel considered."
                bullets={[
                  "Dark notebook-inspired UI contrasted with organic botanical elements.",
                  "Yellow accent system for quick-capture actions and hierarchy.",
                  "Balances personality with functional clarity.",
                ]}
                link={{ href: "https://www.behance.net/gallery/155834013/Notes-App", label: "behance.net/gallery/155834013" }}
                thumbnail={
                  <div className="h-56 overflow-hidden">
                    <img src="/thumb-notes.png" alt="Notes App" className="w-full h-full object-cover object-center" />
                  </div>
                }
              />

            </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
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

          <div className="grid lg:grid-cols-[1fr_minmax(0,200px)] gap-10 items-center">
            {/* Left — experience content */}
            <div className="space-y-0 divide-y divide-border lg:max-w-[90%]">
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

            {/* Right — illustration (hidden below lg) */}
            <motion.div
              className="hidden lg:flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <img
                src="/experience-illustration.png"
                alt=""
                aria-hidden="true"
                className="w-full h-auto object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="pt-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 flex min-h-12 items-center gap-4">
            Craft
          </h2>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 border-y border-border" style={{ borderColor: "hsl(var(--border) / 0.8)" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="md:grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              {/* Design Tooling */}
              <div className="px-6 py-10 md:py-12">
                <div className="flex items-center gap-3 mb-8">
                  <Paintbrush className="text-primary shrink-0" />
                  <h3 className="text-lg font-bold">Design Tooling</h3>
                </div>
                <ul className="space-y-3">
                  {['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Procreate', 'Affinity Designer'].map(skill => (
                    <li key={skill} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary/50" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI & Dev */}
              <div className="px-6 py-10 md:py-12">
                <div className="flex items-center gap-3 mb-8">
                  <Code2 className="text-accent shrink-0" />
                  <h3 className="text-lg font-bold">AI & Dev</h3>
                </div>
                <ul className="space-y-3">
                  {['GitHub', 'Claude Code', 'Replit', 'Adobe Firefly', 'Lovable', 'Vercel', 'VS Code'].map(skill => (
                    <li key={skill} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-accent/50" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core Craft */}
              <div className="px-6 py-10 md:py-12">
                <div className="flex items-center gap-3 mb-8">
                  <Layers className="text-foreground/40 shrink-0" />
                  <h3 className="text-lg font-bold">Core Craft</h3>
                </div>
                <ul className="space-y-3">
                  {['UX Research', 'Accessibility (WCAG 2.2)', 'Interaction Design', 'Design Systems', 'Information Architecture', 'Visual Design', 'Wire Framing', 'Illustrations', 'Icon Design'].map(skill => (
                    <li key={skill} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-foreground/20" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Certs */}
      <section className="pt-16 pb-28 px-6 md:px-8 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-24">

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
              <Trophy className="text-primary" /> Awards
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
                  className="p-6 md:p-7 border border-border bg-background/60 space-y-2 relative overflow-hidden group transition-all duration-450 hover:border-primary/40 hover:shadow-[0_16px_45px_-24px_hsl(var(--primary)/0.55)]"
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-primary to-accent transition-all duration-450 group-hover:w-full group-hover:bg-gradient-to-r" />
                  <div className="relative z-10 pl-3 transition-colors duration-450 group-hover:text-white">
                    <div className="flex items-start gap-2 mb-1">
                      <Star className="w-4 h-4 text-accent shrink-0 mt-0.5 transition-colors duration-450 group-hover:text-white" />
                      <h4 className="font-bold text-sm leading-snug transition-colors duration-450">{award.title}</h4>
                    </div>
                    <p className="text-xs text-primary/80 font-medium mb-2 transition-colors duration-450 group-hover:text-white/90">{award.meta}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-450 group-hover:text-white/90">{award.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
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
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-12 leading-[1.25] pb-2 overflow-visible"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Let's build something <GlowWord autoPlayDelay={0.6}>better.</GlowWord>
          </motion.h2>

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

          <div className="pt-12 border-t border-border flex flex-col md:flex-row items-start justify-between gap-4 text-sm text-muted-foreground">
            <p className="self-center">Based in Chennai, India.</p>
            <div className="flex flex-col items-end gap-2">
              <p>Designed with intention. Built for scale.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-background/40 text-xs text-muted-foreground tracking-wide">
                {[
                  { label: "Figma", href: null },
                  { label: "Replit", href: null },
                  { label: "Github", href: "https://github.com/isaacphilip7/Personal-Portfolio-Site" },
                  { label: "Vercel", href: null },
                ].map(({ label, href }, i, arr) => (
                  <span key={label} className="flex items-center gap-2">
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{label}</a>
                    ) : (
                      <span>{label}</span>
                    )}
                    {i < arr.length - 1 && <span className="text-primary/50">›</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
