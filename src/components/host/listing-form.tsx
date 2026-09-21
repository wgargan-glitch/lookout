import { type FormEvent, useMemo, useRef, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  createListing,
  decodeHostVehicle,
  publishListing,
  removeListingPhoto,
  updateListing,
  upsertListingPhoto,
  type HostListing,
  type Profile,
} from "@/lib/api";
import { groupedParks } from "@/lib/catalog";
import { compressListingPhoto } from "@/lib/compress-image";
import { listingLiveGaps, REQUIRED_PHOTO_IDS } from "@/lib/listing-photos";
import { FUELS, OPTIONAL_BUILD_TAGS, type DrivetrainId, type FuelId } from "@/lib/us-vehicles";
import { useTerritoryCatalog } from "@/lib/use-territory-catalog";
import { VehicleGallery } from "@/components/host/vehicle-gallery";
import { VehicleIdentityFields } from "@/components/host/vehicle-identity";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ListingForm({
  profile,
  existing,
}: {
  profile: Profile;
  existing?: HostListing;
}) {
  const { parks } = useTerritoryCatalog();
  const parkGroups = groupedParks(parks);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [parkSlug, setParkSlug] = useState(existing?.car.parkSlug ?? "yosemite");
  const park = parks.find((p) => p.slug === parkSlug) ?? parks[0];
  const [photos, setPhotos] = useState<Record<string, string>>(() =>
    Object.fromEntries((existing?.shots ?? []).map((s) => [s.id, s.src])),
  );
  const [specKey, setSpecKey] = useState(0);
  const [lookup, setLookup] = useState(existing?.vin || existing?.plate || "");
  const [lookupPending, setLookupPending] = useState(false);
  const [lookupNote, setLookupNote] = useState<string | null>(null);
  const [vin, setVin] = useState(existing?.vin ?? "");
  const [plate, setPlate] = useState(existing?.plate ?? "");
  const [trim, setTrim] = useState("");
  const [doors, setDoors] = useState(existing?.car.doors ?? 4);
  const [seats, setSeats] = useState(existing?.car.seats ?? 5);
  const [lookedUp, setLookedUp] = useState<{
    year?: number;
    make?: string;
    model?: string;
    transmission?: string;
    drivetrain?: string;
    fuel?: string;
  } | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  const filledRequired = REQUIRED_PHOTO_IDS.filter((id) => photos[id]).length;

  async function fillFromFactory(photo?: string) {
    if (!photo && lookup.trim().length < 2) return;
    setLookupPending(true);
    try {
      const result = await decodeHostVehicle({
        data: { query: lookup.trim() || undefined, photo },
      });
      if (result.plate) setPlate(result.plate);
      if (result.spec) {
        const spec = result.spec;
        setVin(spec.vin);
        setTrim(spec.trim);
        setDoors(spec.doors);
        setSeats(spec.seats);
        setLookedUp({
          year: spec.year,
          make: spec.make,
          model: spec.model,
          transmission: spec.transmission,
          drivetrain: spec.drivetrain,
          fuel: spec.fuel,
        });
        setSpecKey((n) => n + 1);
        setLookupNote(result.note);
        toast(result.note);
        return;
      }
      setLookupNote(result.note);
      toast("Plate saved. Snap the VIN on the dash or registration to fill year, make, and model.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not look that up.");
    } finally {
      setLookupPending(false);
    }
  }

  async function onVinPhoto(file: File | undefined) {
    if (!file) return;
    setLookupPending(true);
    try {
      const compressed = await compressListingPhoto(file);
      await fillFromFactory(compressed);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not read that photo.");
      setLookupPending(false);
    } finally {
      if (cameraRef.current) cameraRef.current.value = "";
      if (libraryRef.current) libraryRef.current.value = "";
    }
  }

  function intentFrom(e: FormEvent<HTMLFormElement>): "draft" | "live" {
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    return submitter?.value === "draft" ? "draft" : "live";
  }

  const previewGaps = useMemo(
    () =>
      listingLiveGaps({
        shots: Object.entries(photos).map(([id, src]) => ({ id, src })),
        plate: existing?.plate ?? "x",
        pickupNotes: existing?.pickupNotes ?? "xxxxxxxxxx",
        insurer: existing?.insurer ?? "xx",
        policyNumber: existing?.policyNumber ?? "xx",
        mileage: existing?.mileage ?? 0,
        phone: profile.phone ?? "",
        insuranceAttested: true,
      }).filter((g) => g.endsWith("photo") || g === "host phone"),
    [photos, profile.phone, existing],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>, intent: "draft" | "live") {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("insuranceAttested") !== "on") {
      toast("Hosts must attest they carry current auto insurance.");
      return;
    }
    if (intent === "live" && data.get("hostAgreement") !== "on") {
      toast("Agree to the Host agreement to publish.");
      return;
    }
    const payload = {
      make: String(data.get("make") ?? ""),
      model: String(data.get("model") ?? ""),
      year: Number(data.get("year")),
      parkSlug: String(data.get("parkSlug") ?? ""),
      daily: Number(data.get("daily")),
      seats: Number(data.get("seats")),
      doors: Number(data.get("doors") || 4),
      transmission: (String(data.get("transmission") ?? "Automatic") === "Manual" ? "Manual" : "Automatic") as
        | "Automatic"
        | "Manual",
      drivetrain: (["2WD", "4x4", "AWD"].includes(String(data.get("drivetrain")))
        ? String(data.get("drivetrain"))
        : "AWD") as DrivetrainId,
      fuel: (FUELS as readonly string[]).includes(String(data.get("fuel")))
        ? (String(data.get("fuel")) as FuelId)
        : "Gas",
      description: String(data.get("description") ?? ""),
      camping: data.get("camping") === "on",
      petFriendly: data.get("petFriendly") === "on",
      instantBook: data.get("instantBook") === "on",
      overland: data.get("overland") === "on",
      electric: String(data.get("fuel") ?? "") === "Electric",
      insuranceAttested: true as const,
      plate: String(data.get("plate") ?? ""),
      vin: String(data.get("vin") ?? "") || undefined,
      trim: String(data.get("trim") ?? "") || undefined,
      mileage: Number(data.get("mileage")),
      pickupNotes: String(data.get("pickupNotes") ?? ""),
      insurer: String(data.get("insurer") ?? ""),
      policyNumber: String(data.get("policyNumber") ?? ""),
      phone: String(data.get("phone") ?? profile.phone ?? ""),
      hometown: String(data.get("hometown") ?? profile.hometown ?? "") || undefined,
    };

    const liveGaps = listingLiveGaps({
      shots: Object.entries(photos).map(([id, src]) => ({ id, src })),
      plate: payload.plate,
      pickupNotes: payload.pickupNotes,
      insurer: payload.insurer,
      policyNumber: payload.policyNumber,
      mileage: Number.isFinite(payload.mileage) ? payload.mileage : null,
      phone: payload.phone,
      insuranceAttested: true,
    });
    if (intent === "live" && liveGaps.length) {
      toast(`Still needed: ${liveGaps.join(", ")}.`);
      return;
    }

    setPending(true);
    try {
      let id = existing?.car.id;
      if (id) {
        setProgress("Saving details…");
        await updateListing({ data: { ...payload, id } });
      } else {
        setProgress("Creating listing…");
        const created = await createListing({ data: payload });
        id = created.id;
      }
      if (!id) throw new Error("Could not save the listing.");

      const previous = new Set((existing?.shots ?? []).map((s) => s.id));
      const nextIds = Object.keys(photos);
      for (const angleId of previous) {
        if (!photos[angleId]) {
          setProgress("Updating gallery…");
          await removeListingPhoto({ data: { id, angleId } });
        }
      }
      let uploaded = 0;
      const toUpload = nextIds.filter((angleId) => {
        const prior = existing?.shots.find((s) => s.id === angleId)?.src;
        return photos[angleId] && photos[angleId] !== prior;
      });
      for (const angleId of toUpload) {
        uploaded += 1;
        setProgress(`Uploading photo ${uploaded} of ${toUpload.length}…`);
        await upsertListingPhoto({ data: { id, angleId, src: photos[angleId] } });
      }

      if (intent === "live") {
        setProgress("Publishing…");
        await publishListing({ data: { id } });
        toast("Your car is on the map.");
        void navigate({ to: "/cars/$carId", params: { carId: id } });
      } else {
        toast("Draft saved. Add the remaining photos to go live.");
        void navigate({ to: "/host", search: { edit: id } });
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save the listing.");
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  const car = existing?.car;

  return (
    <Card className="p-6">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void onSubmit(e, intentFrom(e))}>
        <Section title="01 · Vehicle" />
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="vehicleLookup">VIN, plate, or a photo of the dash</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="vehicleLookup"
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (lookup.trim().length >= 2 && !lookupPending) void fillFromFactory();
                }
              }}
              placeholder="17-character VIN, or the plate"
              className="sm:flex-1"
              autoComplete="off"
              spellCheck={false}
            />
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto"
              disabled={lookupPending || lookup.trim().length < 2}
              onClick={() => void fillFromFactory()}
            >
              {lookupPending ? "Looking up…" : "Fill from factory"}
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              disabled={lookupPending}
              onChange={(e) => void onVinPhoto(e.target.files?.[0])}
            />
            <input
              ref={libraryRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={lookupPending}
              onChange={(e) => void onVinPhoto(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto"
              disabled={lookupPending}
              onClick={() => cameraRef.current?.click()}
            >
              <Camera />
              Snap dash or registration
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto"
              disabled={lookupPending}
              onClick={() => libraryRef.current?.click()}
            >
              <ImageIcon />
              Upload photo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste the VIN, or photograph the plate on the dash, the sticker in the driver's door jamb, or the
            registration. We'll fill year, make, model, drivetrain, fuel, and doors. The license plate still belongs
            on the listing so guests know the car.
          </p>
          {lookupNote ? <p className="text-sm font-medium">{lookupNote}</p> : null}
        </div>
        <input type="hidden" name="trim" value={trim} />
        <VehicleIdentityFields
          key={specKey}
          car={{ ...(lookedUp ?? car), fuel: lookedUp?.fuel ?? existing?.fuel }}
        />
        {OPTIONAL_BUILD_TAGS.map((tag) => (
          <label key={tag.id} className="flex min-h-11 items-start gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              name={tag.id}
              className="mt-1 size-4 accent-primary"
              defaultChecked={Boolean(car?.[tag.id as "overland"]) || car?.category === "overland"}
            />
            <span>
              {tag.label}
              <span className="block text-xs text-muted-foreground">{tag.hint}</span>
            </span>
          </label>
        ))}
        <div className="space-y-1.5">
          <Label htmlFor="plate">License plate</Label>
          <Input
            id="plate"
            name="plate"
            required
            placeholder="NPS 4X4"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            name="vin"
            maxLength={17}
            placeholder="Filled from the dash or registration"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mileage">Current mileage</Label>
          <Input id="mileage" name="mileage" type="number" required min={0} max={800000} defaultValue={existing?.mileage ?? 42000} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seats">Seats</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            required
            min={2}
            max={12}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value) || 5)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doors">Doors</Label>
          <Input
            id="doors"
            name="doors"
            type="number"
            required
            min={2}
            max={5}
            value={doors}
            onChange={(e) => setDoors(Number(e.target.value) || 4)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">About this car</Label>
          <Textarea
            id="description"
            name="description"
            required
            minLength={40}
            rows={5}
            placeholder="Where it lives, what it is good for, and what you expect back."
            defaultValue={car?.description}
          />
        </div>

        <Section title="02 · Park & pickup" />
        <div className="space-y-1.5">
          <Label htmlFor="parkSlug">Park</Label>
          <select
            id="parkSlug"
            name="parkSlug"
            required
            className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
            value={parkSlug}
            onChange={(e) => setParkSlug(e.target.value)}
          >
            {parkGroups.map((group) => (
              <optgroup key={group.region} label={group.region}>
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
          <Label htmlFor="hometown">Your hometown</Label>
          <Input id="hometown" name="hometown" placeholder="Springdale, UT" defaultValue={profile.hometown ?? ""} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="pickupNotes">Pickup notes</Label>
          <Textarea
            id="pickupNotes"
            name="pickupNotes"
            required
            minLength={10}
            rows={3}
            placeholder="Meet at the grocer lot on Zion Park Blvd. I’ll text a pin the morning of."
            defaultValue={existing?.pickupNotes}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="phone">Host phone</Label>
          <Input id="phone" name="phone" required minLength={7} placeholder="For guests after they book" defaultValue={profile.phone ?? ""} />
        </div>

        <Section title="03 · Photos" />
        <VehicleGallery
          photos={photos}
          onChange={setPhotos}
          disabled={pending}
          parkSlug={park?.slug}
          parkName={park?.name}
          parkImage={park?.image}
        />

        <Section title="04 · Rate & kit" />
        <div className="space-y-1.5">
          <Label htmlFor="daily">Daily rate (USD)</Label>
          <Input id="daily" name="daily" type="number" required min={35} max={500} defaultValue={car ? Math.round(car.dailyCents / 100) : 95} />
        </div>
        <div className="grid grid-cols-2 gap-3 content-end">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" name="instantBook" className="size-4 accent-primary" defaultChecked={car?.instantBook ?? true} />
            Instant book
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" name="camping" className="size-4 accent-primary" defaultChecked={car?.camping} />
            Camping kit
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" name="petFriendly" className="size-4 accent-primary" defaultChecked={car?.petFriendly} />
            Pet friendly
          </label>
        </div>

        <Section title="05 · Off-trip insurance" />
        <p className="sm:col-span-2 text-sm text-muted-foreground">
          This policy covers the car when it is not on a Lookout trip. Guests pay trip liability and a protection plan at checkout. Personal auto policies usually exclude car-sharing — they are not the trip cover.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="insurer">Carrier</Label>
          <Input id="insurer" name="insurer" required placeholder="State Farm, GEICO…" defaultValue={existing?.insurer} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="policyNumber">Policy number</Label>
          <Input id="policyNumber" name="policyNumber" required defaultValue={existing?.policyNumber} />
        </div>
        <label className="flex min-h-11 items-start gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="insuranceAttested" className="mt-1 size-4 accent-primary" required defaultChecked={existing?.insuranceAttested} />
          <span>
            I carry current auto insurance on this car for periods when it is not rented on Lookout. I understand that policy does not cover guest trips, that Lookout Protection is a guest-paid waiver, and that I cannot opt out of trip cover as an ordinary host.{" "}
            <Link to="/protection" className="underline">
              Read coverage
            </Link>
            .
          </span>
        </label>
        <label className="flex min-h-11 items-start gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="hostAgreement" className="mt-1 size-4 accent-primary" defaultChecked={existing?.status === "live"} />
          <span>
            I agree to the{" "}
            <Link to="/host-agreement" className="underline">
              Host agreement
            </Link>{" "}
            between me and Lookout Parks, including the platform service fee.
          </span>
        </label>

        {previewGaps.length && filledRequired < 6 ? (
          <p className="sm:col-span-2 text-sm text-muted-foreground">
            You can save a draft. To go live: {previewGaps.join(", ")}.
          </p>
        ) : null}

        <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" name="intent" value="live" size="lg" disabled={pending || filledRequired < 6}>
            {pending ? progress ?? "Saving…" : existing?.status === "live" ? "Save and keep live" : "Publish listing"}
          </Button>
          <Button type="submit" name="intent" value="draft" size="lg" variant="outline" disabled={pending}>
            Save draft
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Section({ title }: { title: string }) {
  return (
    <h2 className="sm:col-span-2 mt-4 border-t border-border pt-6 font-display text-xl first:mt-0 first:border-0 first:pt-0">
      {title}
    </h2>
  );
}
