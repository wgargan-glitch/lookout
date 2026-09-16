import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { helpBySlug } from "@/lib/help";

export const Route = createFileRoute("/help/$slug")({
  loader: ({ params }) => {
    const article = helpBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  component: HelpArticlePage,
});

function HelpArticlePage() {
  const { article } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
        ← Help
      </Link>
      <h1 className="mt-4 font-display text-4xl">{article.title}</h1>
      <p className="mt-2 text-muted-foreground">{article.blurb}</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground">
        {article.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/support">Open a ticket</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/protection">Protection plans</Link>
        </Button>
      </div>
    </main>
  );
}
