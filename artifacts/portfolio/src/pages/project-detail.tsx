import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { projects } from "@/lib/projects";

function ActionLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm text-foreground ${className}`}
    >
      <span className="flex items-center gap-2">{children}</span>
    </Link>
  );
}

function ProjectArrowLink({ href, direction, label }: { href: string; direction: "prev" | "next"; label: string }) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={href}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:slug");
  const activeSlug = params?.slug;
  const project = projects.find((item) => item.slug === activeSlug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeSlug]);

  if (!match || !project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-sm font-medium text-primary mb-3">Project not found</p>
          <h1 className="text-3xl font-semibold mb-4">This project page is still being prepared.</h1>
          <p className="text-muted-foreground mb-8">Head back home to explore the available case studies.</p>
          <ActionLink href="/#projects">
            <Home className="h-4 w-4" />
            Back to home
          </ActionLink>
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
          <ActionLink href="/" className="border-none bg-transparent px-0 py-0 text-sm font-medium text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </ActionLink>
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
          <ProjectArrowLink href={`/projects/${previousProject.slug}`} direction="prev" label={`Previous project: ${previousProject.title}`} />

          <ActionLink href="/#projects">
            <Home className="h-4 w-4" />
            Back to home
          </ActionLink>

          <ProjectArrowLink href={`/projects/${nextProject.slug}`} direction="next" label={`Next project: ${nextProject.title}`} />
        </section>
      </main>
    </div>
  );
}
