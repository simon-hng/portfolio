import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Simon Huang`,
    description: post.description,
  };
}

const components = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mb-6 mt-12 font-mono text-3xl font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-4 mt-10 font-mono text-2xl font-semibold">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-3 mt-8 font-mono text-xl font-semibold">{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-emerald-600 dark:text-emerald-400">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="mb-4 border-l-4 border-emerald-500 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-emerald-600 underline underline-offset-2 hover:text-emerald-500 dark:text-emerald-400"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-16">
        <header className="mb-12">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground mb-8 inline-block font-mono text-sm transition-colors"
          >
            ← cd ~/blog
          </Link>
          
          <h1 className="font-mono text-3xl font-bold leading-tight md:text-4xl">
            {post.title}
          </h1>
          
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <time className="text-muted-foreground font-mono">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-muted-foreground font-mono">{post.readingTime}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose-terminal">
          <MDXRemote source={post.content} components={components} />
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-emerald-500 font-mono text-sm transition-colors"
          >
            ← Back to all posts
          </Link>
        </footer>
      </article>
    </main>
  );
}


