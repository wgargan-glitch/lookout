import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function LegalDoc({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">{kicker}</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated {updated}</p>
      <article className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_a]:text-foreground [&_a]:underline">
        {children}
      </article>
      <p className="mt-10 text-sm text-muted-foreground">
        Questions?{" "}
        <Link to="/support" className="underline">
          Open a help-desk ticket
        </Link>{" "}
        or read{" "}
        <Link to="/help" className="underline">
          Help
        </Link>
        .
      </p>
    </main>
  );
}
