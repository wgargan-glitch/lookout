import { useRef, useState } from "react";
import { Camera, Check, X } from "lucide-react";
import { toast } from "sonner";
import { compressListingPhoto } from "@/lib/compress-image";
import { PHOTO_ANGLES, REQUIRED_PHOTO_IDS, type PhotoAngle } from "@/lib/listing-photos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VehicleGallery({
  photos,
  onChange,
  disabled,
}: {
  photos: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const filled = REQUIRED_PHOTO_IDS.filter((id) => photos[id]).length;

  return (
    <div className="sm:col-span-2 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Six required angles. Suggested shots help guests book and keep claims honest.
        </p>
        <Badge tone={filled === 6 ? "pine" : "outline"}>
          {filled} / 6 required
        </Badge>
      </div>

      <div>
        <h3 className="text-sm font-medium">Required</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTO_ANGLES.filter((a) => a.kind === "required").map((angle) => (
            <PhotoSlot
              key={angle.id}
              angle={angle}
              src={photos[angle.id]}
              disabled={disabled}
              onAdd={async (src) => onChange({ ...photos, [angle.id]: src })}
              onRemove={() => {
                const next = { ...photos };
                delete next[angle.id];
                onChange(next);
              }}
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
              onAdd={async (src) => onChange({ ...photos, [angle.id]: src })}
              onRemove={() => {
                const next = { ...photos };
                delete next[angle.id];
                onChange(next);
              }}
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
  onAdd,
  onRemove,
}: {
  angle: PhotoAngle;
  src?: string;
  disabled?: boolean;
  onAdd: (src: string) => Promise<void> | void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressListingPhoto(file);
      await onAdd(compressed);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add that photo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className={cn("relative aspect-[4/3] bg-secondary", !src && "border-b border-dashed border-border")}>
        {src ? (
          <img src={src} alt={angle.label} className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
            <Camera className="size-6" />
            <p className="text-xs">{busy ? "Compressing…" : "Add photo"}</p>
          </div>
        )}
        {src ? (
          <span className="absolute top-2 left-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" />
          </span>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || busy}
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{angle.label}</p>
          {angle.kind === "required" ? (
            <Badge tone="outline">Required</Badge>
          ) : (
            <Badge>Suggested</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{angle.hint}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
          >
            {src ? "Replace" : "Upload"}
          </Button>
          {src ? (
            <Button type="button" size="sm" variant="ghost" disabled={disabled || busy} onClick={onRemove}>
              <X className="size-3.5" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
