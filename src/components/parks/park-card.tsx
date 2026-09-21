import { Link } from "@tanstack/react-router";
import { parkPlace, type Park } from "@/lib/catalog";
import { useLocale, useT } from "@/lib/use-locale";

export function ParkCard({ park, count }: { park: Park; count?: number }) {
  const locale = useLocale((s) => s.id);
  const t = useT();
  const place = parkPlace(park, locale);
  return (
    <Link
      to="/parks/$parkSlug"
      params={{ parkSlug: park.slug }}
      className="group relative block min-h-56 overflow-hidden rounded-xl"
    >
      <img
        src={park.image}
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
        <p className="font-display text-2xl font-medium">{park.name}</p>
        <p className="text-sm text-primary-foreground/80">
          {place}
          {typeof count === "number" ? ` · ${count} ${count === 1 ? t("parks.car") : t("parks.cars")}` : ""}
        </p>
      </div>
    </Link>
  );
}
