import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Park } from "@/lib/catalog";
import { groupedParks, parkRegionLabel } from "@/lib/catalog";
import { addDays, toISODate } from "@/lib/format";
import { useLocale, useT } from "@/lib/use-locale";

export function TripSearch({
  parks,
  variant = "hero",
  defaultPark,
  defaultFrom,
  defaultTo,
}: {
  parks: Park[];
  variant?: "hero" | "bar";
  defaultPark?: string;
  defaultFrom?: string;
  defaultTo?: string;
}) {
  const navigate = useNavigate();
  const t = useT();
  const locale = useLocale((s) => s.id);
  const today = useMemo(() => toISODate(new Date()), []);
  const [park, setPark] = useState(defaultPark ?? "");
  const [from, setFrom] = useState(defaultFrom ?? addDays(today, 1));
  const [to, setTo] = useState(defaultTo ?? addDays(today, 5));

  function submit(e: FormEvent) {
    e.preventDefault();
    void navigate({
      to: "/cars",
      search: {
        park: park || undefined,
        from: from || undefined,
        to: to || undefined,
      },
    });
  }

  return (
    <form
      onSubmit={submit}
      className={
        variant === "hero"
          ? "grid gap-3 rounded-xl bg-card p-4 shadow-soft md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
          : "grid gap-3 rounded-xl border border-border bg-card p-3 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
      }
    >
      <div className="space-y-1.5">
        <Label htmlFor="park">{t("search.park")}</Label>
        <select
          id="park"
          value={park}
          onChange={(e) => setPark(e.target.value)}
          className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
        >
          <option value="">{t("search.anyPark")}</option>
          {groupedParks(parks).map((group) => (
            <optgroup key={group.region} label={parkRegionLabel(group.region, locale)}>
              {group.parks.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}, {p.state}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="from">{t("search.pickup")}</Label>
        <input
          id="from"
          type="date"
          min={today}
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            if (e.target.value >= to) setTo(addDays(e.target.value, 3));
          }}
          className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="to">{t("search.return")}</Label>
        <input
          id="to"
          type="date"
          min={from || today}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
        />
      </div>
      <Button type="submit" size="lg" className="w-full md:w-auto">
        {t("search.showCars")}
      </Button>
    </form>
  );
}
