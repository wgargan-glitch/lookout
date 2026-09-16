import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  completeInspection,
  startInspection,
  upsertInspectionPhoto,
  type InspectionRecord,
} from "@/lib/api";
import {
  CLEANLINESS,
  DAMAGE_AREAS,
  DAMAGE_SEVERITY,
  FUEL_LABELS,
  INSPECTION_REQUIRED,
  INSPECTION_SUGGESTED,
  inspectionLiveGaps,
  type CleanlinessId,
  type DamageItem,
} from "@/lib/inspection";
import { PhonePhotoSlot } from "@/components/trips/phone-photo-slot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InspectionForm({
  bookingId,
  kind,
  electric,
  existing,
  onDone,
  readOnly,
}: {
  bookingId: string;
  kind: "checkin" | "checkout";
  electric: boolean;
  existing?: InspectionRecord | null;
  onDone: (record: InspectionRecord) => void;
  readOnly?: boolean;
}) {
  const locked = existing?.status === "complete" || Boolean(readOnly);
  const [photos, setPhotos] = useState<Record<string, string>>(() =>
    Object.fromEntries((existing?.shots ?? []).map((s) => [s.id, s.src])),
  );
  const [cleanliness, setCleanliness] = useState<CleanlinessId | "">(existing?.cleanliness ?? "");
  const [fuel, setFuel] = useState(existing?.fuelEighths ?? 6);
  const [odometer, setOdometer] = useState(existing?.odometer != null ? String(existing.odometer) : "");
  const [keys, setKeys] = useState(existing?.keysOk ?? false);
  const [noDamage, setNoDamage] = useState(existing?.noDamage ?? false);
  const [damage, setDamage] = useState<DamageItem[]>(existing?.damage ?? []);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const filled = INSPECTION_REQUIRED.filter((a) => photos[a.id]).length;

  const gaps = useMemo(
    () =>
      inspectionLiveGaps({
        kind,
        shots: Object.entries(photos).map(([id, src]) => ({ id, src })),
        cleanliness,
        fuelEighths: fuel,
        odometer: odometer === "" ? null : Number(odometer),
        keys,
        noDamage,
        damage,
        notes,
      }),
    [kind, photos, cleanliness, fuel, odometer, keys, noDamage, damage, notes],
  );

  async function submit() {
    if (locked) return;
    if (gaps.length) {
      toast(`Still needed: ${gaps.join(", ")}.`);
      return;
    }
    setPending(true);
    try {
      setProgress("Opening the inspection…");
      const started = await startInspection({ data: { bookingId, kind } });
      const id = started.id;
      let n = 0;
      const toUpload = Object.keys(photos).filter((angleId) => photos[angleId]);
      for (const angleId of toUpload) {
        n += 1;
        setProgress(`Uploading photo ${n} of ${toUpload.length}…`);
        await upsertInspectionPhoto({ data: { id, angleId, src: photos[angleId] } });
      }
      setProgress(kind === "checkin" ? "Saving check-in…" : "Saving check-out…");
      const saved = await completeInspection({
        data: {
          id,
          cleanliness: cleanliness as CleanlinessId,
          fuelEighths: fuel,
          odometer: Number(odometer),
          keys,
          noDamage,
          notes,
          damage,
        },
      });
      toast(kind === "checkin" ? "Check-in is on the record." : "Check-out is on the record.");
      onDone(saved);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save the inspection.");
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  function addDamage() {
    setNoDamage(false);
    setDamage((rows) => [
      ...rows,
      { id: crypto.randomUUID().slice(0, 8), area: "Front bumper", severity: "cosmetic", notes: "" },
    ]);
  }

  const copy =
    kind === "checkin"
      ? {
          title: "Check in",
          lead: "Walk the car before you drive. Photos from this phone are the record if anything is already wrong.",
          keys: "I have the keys and the car starts.",
          submit: "Submit check-in",
        }
      : {
          title: "Check out",
          lead: "Same walk, same angles, so the host can match pickup to return.",
          keys: "Keys are back with the host, or in the lockbox.",
          submit: "Submit check-out",
        };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium tracking-wide text-sage uppercase">{copy.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{copy.lead}</p>
      </div>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-xl">Photos from this phone</h3>
          <Badge tone={filled === 6 ? "pine" : "outline"}>{filled} / 6 required</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Use the camera at the car. Library is only a backup.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INSPECTION_REQUIRED.map((angle) => (
            <PhonePhotoSlot
              key={angle.id}
              angle={angle}
              src={photos[angle.id]}
              disabled={locked || pending}
              onAdd={(src) => setPhotos((p) => ({ ...p, [angle.id]: src }))}
              onRemove={() =>
                setPhotos((p) => {
                  const next = { ...p };
                  delete next[angle.id];
                  return next;
                })
              }
            />
          ))}
        </div>
        <h4 className="mt-6 text-sm font-medium">Suggested</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {INSPECTION_SUGGESTED.map((angle) => (
            <PhonePhotoSlot
              key={angle.id}
              angle={angle}
              src={photos[angle.id]}
              disabled={locked || pending}
              onAdd={(src) => setPhotos((p) => ({ ...p, [angle.id]: src }))}
              onRemove={() =>
                setPhotos((p) => {
                  const next = { ...p };
                  delete next[angle.id];
                  return next;
                })
              }
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`odo-${kind}`}>Odometer</Label>
          <Input
            id={`odo-${kind}`}
            type="number"
            min={0}
            max={800000}
            value={odometer}
            disabled={locked}
            onChange={(e) => setOdometer(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`fuel-${kind}`}>{electric ? "Charge" : "Fuel"}</Label>
          <select
            id={`fuel-${kind}`}
            className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
            value={fuel}
            disabled={locked}
            onChange={(e) => setFuel(Number(e.target.value))}
          >
            {FUEL_LABELS.map((label, i) => (
              <option key={label} value={i}>
                {electric ? `${Math.round((i / 8) * 100)}%` : label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl">Cleanliness</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {CLEANLINESS.map((c) => (
            <label
              key={c.id}
              className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${
                cleanliness === c.id ? "border-primary bg-secondary" : "border-border bg-card"
              }`}
            >
              <input
                type="radio"
                name={`clean-${kind}`}
                className="mt-1 size-4 accent-primary"
                checked={cleanliness === c.id}
                disabled={locked}
                onChange={() => setCleanliness(c.id)}
              />
              <span>
                <span className="font-medium">{c.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{c.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-xl">Existing damage</h3>
          {locked ? null : (
            <Button type="button" size="sm" variant="outline" onClick={addDamage}>
              Add damage
            </Button>
          )}
        </div>
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-primary"
            checked={noDamage}
            disabled={locked}
            onChange={(e) => {
              setNoDamage(e.target.checked);
              if (e.target.checked) setDamage([]);
            }}
          />
          No damage I can see beyond normal park-road wear.
        </label>
        <div className="mt-3 space-y-3">
          {damage.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-3 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="flex h-11 rounded-md border border-input bg-card px-3 text-sm"
                  value={item.area}
                  disabled={locked}
                  onChange={(e) =>
                    setDamage((rows) => rows.map((r) => (r.id === item.id ? { ...r, area: e.target.value } : r)))
                  }
                >
                  {DAMAGE_AREAS.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
                <select
                  className="flex h-11 rounded-md border border-input bg-card px-3 text-sm"
                  value={item.severity}
                  disabled={locked}
                  onChange={(e) =>
                    setDamage((rows) =>
                      rows.map((r) =>
                        r.id === item.id
                          ? { ...r, severity: e.target.value as DamageItem["severity"] }
                          : r,
                      ),
                    )
                  }
                >
                  {DAMAGE_SEVERITY.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                rows={2}
                placeholder="Where it is, how big, whether it looks old."
                value={item.notes}
                disabled={locked}
                onChange={(e) =>
                  setDamage((rows) => rows.map((r) => (r.id === item.id ? { ...r, notes: e.target.value } : r)))
                }
              />
              <PhonePhotoSlot
                angle={{
                  id: `damage-${item.id}`,
                  kind: "suggested",
                  label: "Close-up",
                  hint: "Fill the frame with the mark.",
                }}
                src={photos[`damage-${item.id}`]}
                disabled={locked || pending}
                onAdd={(src) => setPhotos((p) => ({ ...p, [`damage-${item.id}`]: src }))}
                onRemove={() =>
                  setPhotos((p) => {
                    const next = { ...p };
                    delete next[`damage-${item.id}`];
                    return next;
                  })
                }
              />
              {locked ? null : (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDamage((rows) => rows.filter((r) => r.id !== item.id));
                    setPhotos((p) => {
                      const next = { ...p };
                      delete next[`damage-${item.id}`];
                      return next;
                    });
                  }}
                >
                  Remove this mark
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        <Label htmlFor={`notes-${kind}`}>Notes</Label>
        <Textarea
          id={`notes-${kind}`}
          rows={3}
          placeholder={kind === "checkin" ? "Anything the host should already know." : "How you left it."}
          value={notes}
          disabled={locked}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-primary"
          checked={keys}
          disabled={locked}
          onChange={(e) => setKeys(e.target.checked)}
        />
        {copy.keys}
      </label>

      {locked ? (
        <p className="text-sm text-muted-foreground">This {kind === "checkin" ? "check-in" : "check-out"} is locked.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" size="lg" disabled={pending || gaps.length > 0} onClick={() => void submit()}>
            {pending ? progress ?? "Saving…" : copy.submit}
          </Button>
          {gaps.length ? <p className="text-sm text-muted-foreground">{gaps.length} item{gaps.length === 1 ? "" : "s"} still needed.</p> : null}
        </div>
      )}
    </div>
  );
}
