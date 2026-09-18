import { formatMoney } from "@/lib/format";
import { TRIP_LIABILITY, type TripQuote } from "@/lib/pricing";

export function TripQuoteLines({ quote }: { quote: TripQuote }) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between gap-3">
        <dt>Trip · {quote.days} days</dt>
        <dd className="tabular-nums">{formatMoney(quote.tripCents)}</dd>
      </div>
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt>Lookout service fee (10%)</dt>
        <dd className="tabular-nums">{formatMoney(quote.serviceCents)}</dd>
      </div>
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt>{TRIP_LIABILITY.name}</dt>
        <dd className="tabular-nums">{formatMoney(quote.liabilityCents)}</dd>
      </div>
      <div className="flex justify-between gap-3 text-muted-foreground">
        <dt>{quote.protectionName} protection</dt>
        <dd className="tabular-nums">{formatMoney(quote.protectionCents)}</dd>
      </div>
      <div className="flex justify-between gap-3 border-t border-border pt-2 font-medium">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatMoney(quote.totalCents)}</dd>
      </div>
    </dl>
  );
}
