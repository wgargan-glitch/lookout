import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/partners")({ component: PartnersPage });

const FILES = [
  {
    href: "/print/Lookout-rack-card-4x9.pdf",
    preview: "/print/previews/rack-front.jpg",
    aspect: "aspect-[4/9]",
    title: "4×9 rack card",
    size: "4 × 9 in · two-sided",
    use: "Hotel lobby racks, campground offices, check-in packets. Print on 14pt card and trim to size.",
  },
  {
    href: "/print/Lookout-trifold-11x8.5.pdf",
    preview: "/print/previews/trifold-cover.jpg",
    aspect: "aspect-[4/9]",
    title: "Trifold pamphlet",
    size: "11 × 8.5 in · landscape",
    use: "Front desk stacks. Fold in thirds — the cover is the right panel. Print two-sided, flip on the short edge.",
  },
  {
    href: "/print/Lookout-partner-sheet-letter.pdf",
    preview: "/print/previews/partner-sheet.jpg",
    aspect: "aspect-[8.5/11]",
    title: "Partner leave-behind",
    size: "8.5 × 11 in · one-sided",
    use: "For the manager. Why to display the rack card. Hand this first, then leave a stack of cards.",
  },
];

function PartnersPage() {
  return (
    <main className="flex min-h-full flex-col">
      <section className="relative min-h-[52vh] overflow-hidden">
        <img src="/print/rv-camp.jpg" alt="" className="absolute inset-0 size-full object-cover object-[40%_50%]" />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-4 py-12 text-primary-foreground">
          <p className="text-sm font-medium tracking-[0.18em] uppercase text-primary-foreground/75">
            Hotels, RV parks & campgrounds
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium md:text-6xl">Leave the rig. Take a car.</h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 md:text-lg">
            Motorhome guests keep camp set up and borrow a local car for the park. You are not a rental desk. You put a
            card in the lobby.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          {[
            { n: "01", t: "Park the coach once", d: "Hookups, chairs, the dog’s bed — leave it. The park road was not built for a 30-foot rig." },
            { n: "02", t: "Pick up a local car", d: "Sedans, trucks, 4x4s, vans — whatever is listed in this gateway town. Keys from a neighbor, not a counter." },
            { n: "03", t: "Come back to camp", d: "Unlimited miles. Return the car to town. Dinner is still where they left it." },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-display text-sage">{s.n}</p>
              <h2 className="mt-1 font-display text-2xl">{s.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-medium tracking-wide text-sage uppercase">Print these</p>
        <h2 className="mt-1 font-display text-3xl md:text-4xl">Hand the manager a sheet. Leave a stack on the desk.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Built for businesses that already host motorhomes. No insurance lecture. No fee schedule. Just the trip.
        </p>

        <ol className="mt-10 grid items-start gap-6 md:grid-cols-3">
          {FILES.map((f) => (
            <li key={f.href} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft">
              <img src={f.preview} alt="" className={`${f.aspect} w-full object-cover object-top bg-muted`} />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium tracking-wide text-sage uppercase">{f.size}</p>
                <h3 className="mt-1 font-display text-2xl">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.use}</p>
                <Button asChild className="mt-4 w-full">
                  <a href={f.href} download>
                    Download PDF
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-auto border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/70">If you have a car in the lot</p>
            <h2 className="mt-2 font-display text-3xl">Staff and neighbors can list whatever they drive.</h2>
            <p className="mt-3 text-primary-foreground/80">
              Daily drivers count. Pickup stays in this town. Hosts set the rate.
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <Link to="/host">List a car</Link>
            </Button>
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/70">How to place them</p>
            <ul className="mt-3 space-y-3 text-sm text-primary-foreground/80">
              <li>Give the letter sheet to the manager on the first visit.</li>
              <li>Leave twenty-five 4×9 cards for the lobby rack or check-in packet.</li>
              <li>Leave ten trifolds on the front desk.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
