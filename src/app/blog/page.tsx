import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Simon Huang",
  description: "Thoughts on software engineering, technology, and life.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <header className="mb-12">
          <Link 
            href="/" 
            className="text-muted-foreground hover:text-foreground mb-8 inline-block font-mono text-sm transition-colors"
          >
            ← cd ~
          </Link>
          <h1 className="font-mono text-4xl font-bold">
            <span className="text-emerald-500">~/</span>blog
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Thoughts on software engineering, technology, and life.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-12 text-center">
            <pre className="text-muted-foreground font-mono text-sm">
{`╭────────────────────────────────────╮
│  No posts yet.                     │
│  Check back soon!                  │
╰────────────────────────────────────╯`}
            </pre>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="rounded-lg border border-border/50 bg-card/50 p-6 transition-all hover:border-emerald-500/50 hover:bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="font-mono text-lg font-semibold group-hover:text-emerald-500 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {post.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                        <time className="text-muted-foreground font-mono">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground font-mono">
                          {post.readingTime}
                        </span>
                        {post.tags.length > 0 && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <div className="flex gap-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-muted px-2 py-0.5 font-mono text-muted-foreground"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground font-mono text-xl opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


