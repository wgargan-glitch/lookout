import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { HELP_ARTICLES } from "@/lib/help";

export const Route = createFileRoute("/help/")({ component: HelpIndex });

const TOPICS = [
  { id: "guests", label: "Guests" },
  { id: "hosts", label: "Hosts" },
  { id: "protection", label: "Protection" },
  { id: "account", label: "Account" },
] as const;

function HelpIndex() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Help</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">How the mountain works</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Booking, hosting, trip cover, and the ranger desk. Need a person? Open a ticket.
      </p>
      {TOPICS.map((topic) => (
        <section key={topic.id} className="mt-10">
          <h2 className="font-display text-2xl">{topic.label}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {HELP_ARTICLES.filter((a) => a.topic === topic.id).map((article) => (
              <Link key={article.slug} to="/help/$slug" params={{ slug: article.slug }}>
                <Card className="h-full p-5 transition-colors hover:bg-secondary">
                  <p className="font-medium">{article.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{article.blurb}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm text-muted-foreground">
        Still stuck?{" "}
        <Link to="/support" className="underline">
          Open a help-desk ticket
        </Link>
        .
      </p>
    </main>
  );
}
