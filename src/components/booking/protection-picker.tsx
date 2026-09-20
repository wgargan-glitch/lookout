import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import {
  PROTECTION_PLANS,
  planDailyCents,
  type GuestPlanId,
  type ProtectionId,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function ProtectionPicker({
  value,
  onChange,
  tripDailyCents,
}: {
  value: GuestPlanId;
  onChange: (id: GuestPlanId) => void;
  tripDailyCents: number;
}) {
  return (
    <div className="space-y-2">
      {PROTECTION_PLANS.map((plan) => {
        const daily = planDailyCents(plan, tripDailyCents);
        return (
          <label
            key={plan.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm",
              value === plan.id ? "border-primary bg-secondary" : "border-border",
            )}
          >
            <input
              type="radio"
              name="protection"
              className="mt-1 accent-primary"
              checked={value === plan.id}
              onChange={() => onChange(plan.id)}
            />
            <span>
              <span className="font-medium">{plan.name}</span>
              <span className="text-muted-foreground"> · {formatMoney(daily)}/day</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{plan.summary}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function OwnInsurancePanel({
  protection,
}: {
  protection: ProtectionId;
}) {
  const [status, setStatus] = useState<"idle" | "unavailable">("idle");

  function connect() {
    setStatus("unavailable");
    toast("We can’t verify a personal policy yet. Pick a Lookout plan to finish booking.");
  }

  return (
    <div className="rounded-lg border border-border p-3 text-sm">
      <p className="font-medium">Use your own insurance?</p>
      <p className="mt-1 text-xs text-muted-foreground">
        If we can confirm your policy covers this trip, you may skip a Lookout damage plan. That
        check isn’t live yet.
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={connect}>
        Check my policy
      </Button>
      {status === "unavailable" || protection === "own" ? (
        <p className="mt-2 text-xs text-muted-foreground">Pick Minimum, Standard, or Premier above to continue.</p>
      ) : null}
    </div>
  );
}
