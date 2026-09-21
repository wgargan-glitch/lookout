import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useT } from "@/lib/use-locale";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
});

function HowItWorks() {
  const t = useT();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">{t("how.kicker")}</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">{t("how.title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("how.intro")}</p>

      <div className="mt-10 space-y-6">
        {[
          { t: t("how.s1t"), d: t("how.s1d") },
          { t: t("how.s2t"), d: t("how.s2d") },
          { t: t("how.s3t"), d: t("how.s3d") },
          { t: t("how.s4t"), d: t("how.s4d") },
          { t: t("how.s5t"), d: t("how.s5d") },
        ].map((block, i) => (
          <Card key={block.t} className="p-6">
            <p className="font-display text-sage">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-display text-2xl">{block.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{block.d}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/cars">{t("how.browse")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/host">{t("how.list")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/get-the-app">{t("how.app")}</Link>
        </Button>
      </div>
    </main>
  );
}
