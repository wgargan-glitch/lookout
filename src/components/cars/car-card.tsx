import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { FavoriteButton } from "@/components/cars/favorite-button";
import { Badge } from "@/components/ui/badge";
import type { Car, Park } from "@/lib/catalog";
import { carTitle, isOverlandCar } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";

export function CarCard({ car, park }: { car: Car; park?: Park | null }) {
  return (
    <Link
      to="/cars/$carId"
      params={{ carId: car.id }}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={car.images[0]}
          alt={carTitle(car)}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <FavoriteButton id={car.id} className="absolute top-3 right-3" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {car.instantBook ? <Badge tone="pine">Instant book</Badge> : null}
          {isOverlandCar(car) ? <Badge>Overland</Badge> : null}
          {car.camping ? <Badge>Camping</Badge> : null}
          {car.electric ? <Badge>Electric</Badge> : null}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{carTitle(car)}</p>
            <p className="text-sm text-muted-foreground">
              {park?.name ?? "National park"} · {car.trim}
            </p>
          </div>
          <p className="flex items-center gap-1 text-sm tabular-nums">
            <Star className="size-3.5 fill-foreground text-foreground" />
            {car.ratingAvg.toFixed(2)}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{car.tripCount} trips · {car.drivetrain} · {car.seats} seats</p>
        <p className="pt-1">
          <span className="font-medium tabular-nums">{formatMoney(car.dailyCents)}</span>
          <span className="text-sm text-muted-foreground"> / day</span>
        </p>
      </div>
    </Link>
  );
}
