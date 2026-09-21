import { useRef, useState } from "react";
import { Camera, Check, Mountain, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { enhanceListingPhoto } from "@/lib/api";
import { compressDataUrl, compressListingPhoto } from "@/lib/compress-image";
import { PHOTO_ANGLES, REQUIRED_PHOTO_IDS, type PhotoAngle } from "@/lib/listing-photos";
import { canThemeAngle, themeKindFor } from "@/lib/park-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VehicleGallery({
  photos,
  onChange,
  disabled,
  parkSlug,
  parkName,
  parkImage,
}: {
  photos: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
  parkSlug?: string;
  parkName?: string;
  parkImage?: string;
}) {
  const filled = REQUIRED_PHOTO_IDS.filter((id) => photos[id]).length;
  const [originals, setOriginals] = useState<Record<string, string>>({});
  const [themedAt, setThemedAt] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const photosRef = useRef(photos);
  photosRef.current = photos;
  const originalsRef = useRef(originals);
  originalsRef.current = originals;
  const themedAtRef = useRef(themedAt);
  themedAtRef.current = themedAt;

  const themeableFilled = PHOTO_ANGLES.filter((a) => canThemeAngle(a) && photos[a.id]);
  const pendingTheme = themeableFilled.filter((a) => themedAt[a.id] !== parkName);
  const parkReady = Boolean(parkSlug && parkName);

  function commit(next: Record<string, string>) {
    photosRef.current = next;
    onChange(next);
  }

  function addPhoto(id: string, src: string) {
    originalsRef.current = { ...originalsRef.current, [id]: src };
    setOriginals(originalsRef.current);
    const nextThemed = { ...themedAtRef.current };
    delete nextThemed[id];
    themedAtRef.current = nextThemed;
    setThemedAt(nextThemed);
    commit({ ...photosRef.current, [id]: src });
  }

  function removePhoto(id: string) {
    const next = { ...photosRef.current };
    delete next[id];
    commit(next);
    const nextOrig = { ...originalsRef.current };
    delete nextOrig[id];
    originalsRef.current = nextOrig;
    setOriginals(nextOrig);
    const nextThemed = { ...themedAtRef.current };
    delete nextThemed[id];
    themedAtRef.current = nextThemed;
    setThemedAt(nextThemed);
  }

  async function themeOne(id: string): Promise<boolean> {
    const src = photosRef.current[id];
    if (!src || !parkSlug) {
      toast("Choose the park first, then place the car there.");
      return false;
    }
    setBusyId(id);
    try {
      const original = originalsRef.current[id] ?? src;
      if (!originalsRef.current[id]) {
        originalsRef.current = { ...originalsRef.current, [id]: original };
        setOriginals(originalsRef.current);
      }
      const result = await enhanceListingPhoto({
        data: { parkSlug, angleId: id, photo: original },
      });
      const compressed = await compressDataUrl(result.src);
      commit({ ...photosRef.current, [id]: compressed });
      themedAtRef.current = { ...themedAtRef.current, [id]: result.parkName };
      setThemedAt(themedAtRef.current);
      toast(`Placed at ${result.parkName}.`);
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not place that photo at the park.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function themeGallery() {
    if (!parkSlug) {
      toast("Choose the park first, then theme the gallery.");
      return;
    }
    const pending = PHOTO_ANGLES.filter(
      (a) => canThemeAngle(a) && photosRef.current[a.id] && themedAtRef.current[a.id] !== parkName,
    );
    if (!pending.length) {
      toast("Those shots are already at the park.");
      return;
    }
    for (const angle of pending) {
      const ok = await themeOne(angle.id);
      if (!ok) break;
    }
  }

  function undoTheme(id: string) {
    const original = originalsRef.current[id];
    if (!original) return;
    commit({ ...photosRef.current, [id]: original });
    const nextThemed = { ...themedAtRef.current };
    delete nextThemed[id];
    themedAtRef.current = nextThemed;
    setThemedAt(nextThemed);
  }

  return (
    <div className="sm:col-span-2 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Six required angles. After you upload, place the car at {parkName ?? "the park"} —
          showcase first, then the rest of the gallery. Wear, odometer, and the pickup spot stay as shot.
        </p>
        <Badge tone={filled === 6 ? "pine" : "outline"}>{filled} / 6 required</Badge>
      </div>

      {parkReady ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-3">
          {parkImage ? (
            <img
              src={parkImage}
              alt=""
              className="size-14 shrink-0 rounded-lg object-cover outline outline-1 -outline-offset-1 outline-black/10"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{parkName}</p>
            <p className="text-sm text-muted-foreground">Listings read better when the car is already at the gate.</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled || Boolean(busyId) || pendingTheme.length === 0}
            onClick={() => void themeGallery()}
          >
            <Mountain className="size-3.5" />
            Theme gallery
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Pick a park above so we know which landscape to use.</p>
      )}

      <div>
        <h3 className="text-sm font-medium">Required</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTO_ANGLES.filter((a) => a.kind === "required").map((angle) => (
            <PhotoSlot
              key={angle.id}
              angle={angle}
              src={photos[angle.id]}
              disabled={disabled}
              busy={busyId === angle.id}
              parkName={parkName}
              themedPark={themedAt[angle.id]}
              onAdd={(src) => addPhoto(angle.id, src)}
              onRemove={() => removePhoto(angle.id)}
              onTheme={() => void themeOne(angle.id)}
              onUndo={() => undoTheme(angle.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium">Suggested</h3>
        <p className="mt-1 text-sm text-muted-foreground">Not required to go live. Strong listings use most of them.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTO_ANGLES.filter((a) => a.kind === "suggested").map((angle) => (
            <PhotoSlot
              key={angle.id}
              angle={angle}
              src={photos[angle.id]}
              disabled={disabled}
              busy={busyId === angle.id}
              parkName={parkName}
              themedPark={themedAt[angle.id]}
              onAdd={(src) => addPhoto(angle.id, src)}
              onRemove={() => removePhoto(angle.id)}
              onTheme={() => void themeOne(angle.id)}
              onUndo={() => undoTheme(angle.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PhotoSlot({
  angle,
  src,
  disabled,
  busy,
  parkName,
  themedPark,
  onAdd,
  onRemove,
  onTheme,
  onUndo,
}: {
  angle: PhotoAngle;
  src?: string;
  disabled?: boolean;
  busy?: boolean;
  parkName?: string;
  themedPark?: string;
  onAdd: (src: string) => Promise<void> | void;
  onRemove: () => void;
  onTheme: () => void;
  onUndo: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const themeable = canThemeAngle(angle);
  const hero = themeKindFor(angle.id) === "hero";
  const themedHere = Boolean(themedPark && parkName && themedPark === parkName);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setReading(true);
    try {
      const compressed = await compressListingPhoto(file);
      await onAdd(compressed);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add that photo.");
    } finally {
      setReading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const working = Boolean(disabled || busy || reading);

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", hero ? "border-primary/40 sm:col-span-2 lg:col-span-1" : "border-border")}>
      <div className={cn("relative aspect-[4/3] bg-secondary", !src && "border-b border-dashed border-border")}>
        {src ? (
          <img src={src} alt={angle.label} className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
            <Camera className="size-6" />
            <p className="text-xs">{reading ? "Compressing…" : "Add photo"}</p>
          </div>
        )}
        {src && busy ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/55 px-4 text-center text-sm text-primary-foreground">
            Placing at {parkName ?? "the park"}…
          </div>
        ) : null}
        {src && !busy ? (
          <span className="absolute top-2 left-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" />
          </span>
        ) : null}
        {themedPark && src && !busy ? (
          <span className="absolute top-2 right-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-medium tracking-wide text-primary-foreground uppercase">
            {themedPark}
          </span>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={working}
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{hero ? "Showcase · Front 3/4" : angle.label}</p>
          {angle.kind === "required" ? (
            <Badge tone="outline">Required</Badge>
          ) : (
            <Badge>Suggested</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {hero
            ? "The listing hero. Upload the car, then place it at the park."
            : themeable
              ? angle.hint
              : `${angle.hint} Kept as shot.`}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={working}
            onClick={() => inputRef.current?.click()}
          >
            {src ? "Replace" : "Upload"}
          </Button>
          {src && themeable ? (
            <Button type="button" size="sm" disabled={working || !parkName} onClick={onTheme}>
              <Mountain className="size-3.5" />
              {themedHere ? "Re-place" : hero ? `Place at ${parkName ?? "park"}` : "Park backdrop"}
            </Button>
          ) : null}
          {src && themedPark ? (
            <Button type="button" size="sm" variant="ghost" disabled={working} onClick={onUndo}>
              <RotateCcw className="size-3.5" />
              Undo
            </Button>
          ) : null}
          {src ? (
            <Button type="button" size="sm" variant="ghost" disabled={working} onClick={onRemove}>
              <X className="size-3.5" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
