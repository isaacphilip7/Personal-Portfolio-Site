import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { projects } from "@/lib/projects";

const projectImageEntries = import.meta.glob("/public/project-images/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

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
      className={`inline-flex items-center justify-center border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary ${className}`}
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
      className="inline-flex h-11 w-11 items-center justify-center border border-border bg-background/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function ProjectGallery({ slug, title, fallbackImage }: { slug: string; title: string; fallbackImage: string }) {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadGalleryImages = () => {
      const resolved = Object.keys(projectImageEntries)
        .filter((entry) => entry.startsWith(`/public/project-images/${slug}/`))
        .map((entry) => entry.replace(/^\/public/, ""))
        .sort((left, right) => {
          const leftNumber = Number(left.match(/(\d+)\.[^.]+$/)?.[1] ?? 0);
          const rightNumber = Number(right.match(/(\d+)\.[^.]+$/)?.[1] ?? 0);
          return leftNumber - rightNumber;
        });

      if (!cancelled) {
        setGalleryImages(resolved);
      }
    };

    loadGalleryImages();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (galleryImages.length === 0) {
    return (
      <div className="overflow-hidden border border-border bg-muted/20">
        <img
          src={fallbackImage}
          alt={`${title} preview`}
          className="block h-[320px] w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border bg-muted/20">
      <div className="flex flex-col">
        {galleryImages.map((imageSrc) => (
          <img
            key={imageSrc}
            src={imageSrc}
            alt={`${title} gallery image`}
            className="block w-full object-cover object-center"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:slug");
  const activeSlug = params?.slug;
  const project = projects.find((item) => item.slug === activeSlug);
  const [isScrolledPastTop, setIsScrolledPastTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeSlug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastTop(window.scrollY > 140);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 transition-all duration-300">
        <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${isScrolledPastTop ? "py-3" : "py-5"}`}>
          <ActionLink href="/#projects" className="border-none bg-transparent px-0 py-0 text-sm font-medium text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </ActionLink>
          <div className="relative min-h-6 flex items-center justify-end text-sm text-muted-foreground">
            <span
              className={`absolute inset-0 flex items-center justify-end transition-all duration-300 ${isScrolledPastTop ? "pointer-events-none opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}
            >
              {project.tags.join(" • ")}
            </span>
            <span
              className={`flex items-center justify-end transition-all duration-300 ${isScrolledPastTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"}`}
            >
              <span className="font-medium text-foreground">{project.title}</span>
            </span>
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
            <ProjectGallery slug={project.slug} title={project.title} fallbackImage={project.image} />
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <ProjectArrowLink href={`/projects/${previousProject.slug}`} direction="prev" label={`Previous project: ${previousProject.title}`} />

          <ProjectArrowLink href={`/projects/${nextProject.slug}`} direction="next" label={`Next project: ${nextProject.title}`} />
        </section>
      </main>
    </div>
  );
}
