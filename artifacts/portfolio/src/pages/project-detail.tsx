import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import type { ReactNode } from "react";
import { projects } from "@/lib/projects";

function ShimmerLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div whileHover="hovered" whileTap={{ scale: 0.97 }} initial="idle">
      <Link
        href={href}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border px-4 py-2 text-sm transition-colors ${className}`}
      >
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          variants={{
            idle: { x: "-100%" },
            hovered: { x: "200%", transition: { duration: 0.5, ease: "easeInOut" } },
          }}
        />
        <motion.span
          className="absolute inset-0"
          variants={{
            idle: { boxShadow: "0 0 0px 0px rgba(255,255,255,0)" },
            hovered: { boxShadow: "0 0 18px 2px hsl(var(--primary) / 0.6)", transition: { duration: 0.3 } },
          }}
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    </motion.div>
  );
}

function ProjectArrowLink({
  href,
  direction,
  title,
  label,
}: {
  href: string;
  direction: "prev" | "next";
  title: string;
  label: string;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <motion.div whileHover="hovered" whileTap={{ scale: 0.96 }} initial="idle" className="group relative inline-flex items-center">
      <Link
        href={href}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        aria-label={label}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
          variants={{
            idle: { x: "-100%" },
            hovered: { x: "200%", transition: { duration: 0.5, ease: "easeInOut" } },
          }}
        />
        <Icon className="relative z-10 h-4 w-4" />
      </Link>
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border/70 bg-background/95 px-3 py-1 text-xs text-muted-foreground shadow-sm opacity-0 transition-all duration-300 ${direction === "prev" ? "left-12 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" : "right-12 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100"}`}
      >
        {title}
      </span>
    </motion.div>
  );
}

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:slug");
  const activeSlug = params?.slug;
  const project = projects.find((item) => item.slug === activeSlug);

  if (!match || !project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-sm font-medium text-primary mb-3">Project not found</p>
          <h1 className="text-3xl font-semibold mb-4">This project page is still being prepared.</h1>
          <p className="text-muted-foreground mb-8">Head back home to explore the available case studies.</p>
          <ShimmerLink href="/#projects" className="hover:border-primary/50 hover:text-primary">
            <Home className="h-4 w-4" />
            Back to home
          </ShimmerLink>
        </div>
      </div>
    );
  }

  const index = projects.findIndex((item) => item.slug === project.slug);
  const total = projects.length;
  const previousProject = projects[(index - 1 + total) % total];
  const nextProject = projects[(index + 1) % total];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <ShimmerLink href="/" className="border-none bg-transparent px-0 py-0 text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </ShimmerLink>
          <div className="text-sm text-muted-foreground">
            {project.tags.join(" • ")}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:px-8">
        <section className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {project.badge}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-muted/20">
              <img
                src={project.image}
                alt={`${project.title} preview`}
                className="h-[320px] w-full object-cover object-center"
              />
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-6">
              <h2 className="text-lg font-semibold">What this project covers</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <ProjectArrowLink href={`/projects/${previousProject.slug}`} direction="prev" title={previousProject.title} label={`Previous project: ${previousProject.title}`} />

          <ShimmerLink href="/#projects" className="hover:border-primary/50 hover:text-primary">
            <Home className="h-4 w-4" />
            Back to home
          </ShimmerLink>

          <ProjectArrowLink href={`/projects/${nextProject.slug}`} direction="next" title={nextProject.title} label={`Next project: ${nextProject.title}`} />
        </section>
      </main>
    </div>
  );
}
