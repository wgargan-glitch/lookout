import { useRef, useState } from "react";
import { Camera, Check, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { compressListingPhoto } from "@/lib/compress-image";
import type { PhotoAngle } from "@/lib/listing-photos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PhonePhotoSlot({
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
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
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
      if (cameraRef.current) cameraRef.current.value = "";
      if (libraryRef.current) libraryRef.current.value = "";
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
            <p className="text-xs">{busy ? "Compressing…" : "Take it at the car"}</p>
          </div>
        )}
        {src ? (
          <span className="absolute top-2 left-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" />
          </span>
        ) : null}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={disabled || busy}
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <input
          ref={libraryRef}
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
          {angle.kind === "required" ? <Badge tone="outline">Required</Badge> : <Badge>Suggested</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">{angle.hint}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" disabled={disabled || busy} onClick={() => cameraRef.current?.click()}>
            <Camera className="size-3.5" />
            {src ? "Retake" : "Camera"}
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={disabled || busy} onClick={() => libraryRef.current?.click()}>
            <ImageIcon className="size-3.5" />
            Library
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
