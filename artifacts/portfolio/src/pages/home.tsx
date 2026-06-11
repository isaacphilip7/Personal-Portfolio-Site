import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, ExternalLink, Trophy, Star, Sparkles, Code2, Paintbrush, Layers, CheckCircle2, ChevronDown, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const companies = [
  {
    company: "Cognizant",
    role: "Senior UX Designer",
    time: "Oct 2022 – Present",
    desc: "Leading UX for massive enterprise modernization efforts and AI accelerators.",
    projects: [
      {
        title: "Neuro AI Multi-Agent Accelerator",
        desc: "Designing the next-generation UI for an AI agent studio. Making agent orchestration intuitive.",
        stat: "Next-Gen UI",
        tag: "AI / UX"
      },
      {
        title: "Commitment Management AI",
        desc: "Re-imagined the commitment creation process from the ground up, integrating AI assistance.",
        stat: "50% Time Reduction",
        tag: "Enterprise"
      },
      {
        title: "Contract Signature Application",
        desc: "End-to-end digital transformation creating a single-window service for enterprise contracts.",
        stat: "Full Transformation",
        tag: "B2B SaaS"
      },
      {
        title: "Contracts Storage System",
        desc: "Migrated users from scattered email threads to a centralized, intuitive application.",
        stat: "90%+ Adoption",
        tag: "Workflow"
      }
    ]
  },
  {
    company: "TCS",
    role: "UX Designer / Design Lead — L&D",
    time: "Jun 2016 – Sep 2022",
    desc: "Bagged 10x On The Spot awards for consistently delivering high-quality enterprise interfaces.",
    projects: [
      {
        title: "CXO Dashboard — Pharma",
        desc: "Designed the landing page for a CXO analytics dashboard surfacing live business insights; primary UX advocate for the project.",
        stat: "Executive-Level UX",
        tag: "Analytics"
      },
      {
        title: "L&D Digital Transformation",
        desc: "Led cloud migration of learning processes; conducted user research for 30,000+ associates globally. 40,000+ associates completed a fully digital learning experience within one year.",
        stat: "40k+ Associates",
        tag: "Digital Learning"
      }
    ]
  },
  {
    company: "Go4runs",
    role: "Graphic Designer",
    time: "May 2013 – Apr 2014",
    desc: "Created graphic design assets for clients including NAC Jewellers, Footprints Holidays, and eAmbalam. Executed campaigns improving organic social reach.",
    projects: []
  },
  {
    company: "Ogilvy",
    role: "Graphic Design Intern",
    time: "May 2012 – Jun 2012",
    desc: "Contributed to design for Vodafone, The Hindu, and MTR. Declined a full-time offer upon completion to finish my degree. A tough call that paid off.",
    projects: []
  }
];

export default function Home() {
  const [openCompany, setOpenCompany] = useState<string | null>("Cognizant");
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 flex items-center justify-center border border-border hover:bg-muted transition-colors"
              data-testid="toggle-theme"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex items-center justify-center min-h-[90vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary mb-8">
              <Sparkles className="w-3 h-3" />
              <span>Multi-disciplinary Designer</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
              Creating solutions that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">tug at your heart strings.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              I'm Isaac Philip. I transform complex enterprise pain into intuitive digital products. 10+ years of making screens work.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <span className="text-primary">01.</span> Who I am
            </h2>

            <div className="grid md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed">
              <div className="space-y-6">
                <p>
                  I've been making enterprise software less miserable since 2016. Based in Chennai, currently leading UX at Cognizant.
                </p>
                <p>
                  My background isn't typical. I hold a BSc in Visual Communication and an MA in English. That means I don't just draw rectangles—I write copy that people actually read, and I build narratives that drive adoption.
                </p>
              </div>
              <div className="space-y-6">
                <p>
                  I specialize in the messy, complicated stuff. The kind of B2B applications that run multi-national operations. If your users need a 40-page manual to use your tool, we need to talk.
                </p>
                <p>
                  Lately, I've been deep in the trenches of GenAI, designing agentic workflows and AI-native interfaces that make "50% faster workflows" a reality, not just a marketing claim.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section — blank, to be populated */}
      <section id="projects" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold flex items-center gap-4">
              <span className="text-primary">02.</span> Projects
            </h2>
          </motion.div>
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
              <span className="text-primary">03.</span> Experience
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
                          <div className="grid md:grid-cols-2 gap-4">
                            {job.projects.map((project, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: j * 0.07 }}
                                className="group p-6 border border-border bg-background hover:bg-muted/50 transition-colors relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                  <Badge variant="outline" className="mb-4 text-xs">{project.tag}</Badge>
                                  <h4 className="text-lg font-bold mb-3">{project.title}</h4>
                                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{project.desc}</p>
                                  <div className="pt-4 border-t border-border">
                                    <span className="text-primary font-medium text-sm">{project.stat}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
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
            <span className="text-primary">04.</span> Toolkit & Craft
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
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Trophy className="text-primary" /> Recognition
            </h2>
            <ul className="space-y-6">
              {[
                { title: "Guinness World Record", desc: "GenAI Hackathon (Aug 2025)" },
                { title: "Raising the Bar Award", desc: "Cognizant (Sep 2025)" },
                { title: "Rising Star", desc: "2024" },
                { title: "Q2 Best Performer", desc: "2024" }
              ].map((award, i) => (
                <li key={i} className="flex gap-4">
                  <Star className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">{award.title}</h4>
                    <p className="text-sm text-muted-foreground">{award.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-primary" /> Certifications
            </h2>
            <ul className="space-y-6">
              {[
                { title: "Google Cloud Certified Generative AI Leader", desc: "Nov 2025" },
                { title: "GitHub Copilot Certified", desc: "Microsoft" },
                { title: "Google UX Certification", desc: "Coursera / Google" }
              ].map((cert, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-5 h-5 rounded bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground">{cert.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
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
