import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { projects } from "@/lib/projects";

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
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Back to home
          </Link>
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
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="text-sm text-muted-foreground">
            {project.tags.join(" • ")}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
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

          <div className="rounded-3xl border border-border bg-background/70 p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
            <img
              src={project.image}
              alt={`${project.title} placeholder artwork`}
              className="h-auto w-full rounded-[1.1rem] border border-border/70 object-cover"
            />
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <Link href={`/projects/${previousProject.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Previous project
          </Link>

          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary">
            <Home className="w-4 h-4" />
            Back to home
          </Link>

          <Link href={`/projects/${nextProject.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary">
            Next project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
