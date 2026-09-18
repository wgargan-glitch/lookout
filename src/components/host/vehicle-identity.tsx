import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  DRIVETRAINS,
  FUELS,
  TRANSMISSIONS,
  VEHICLE_YEARS,
  makesForYear,
  modelsForYearMake,
  parseDrivetrain,
  parseFuel,
  vehicleSelectClass,
  type DrivetrainId,
  type FuelId,
  type TransmissionId,
} from "@/lib/us-vehicles";

type CarLike = {
  year?: number;
  make?: string;
  model?: string;
  transmission?: string;
  drivetrain?: string;
  electric?: boolean;
};

export function VehicleIdentityFields({ car }: { car?: CarLike & { fuel?: string | null } }) {
  const [year, setYear] = useState<number | "">(car?.year && VEHICLE_YEARS.includes(car.year) ? car.year : "");
  const [make, setMake] = useState(car?.make ?? "");
  const [model, setModel] = useState(car?.model ?? "");

  const makes = useMemo(() => {
    if (year === "") return [];
    const list = makesForYear(year);
    if (make && !list.includes(make)) return [make, ...list];
    return list;
  }, [year, make]);
  const models = useMemo(
    () => (year === "" || !make ? [] : modelsForYearMake(year, make, model)),
    [year, make, model],
  );

  const drivetrain: DrivetrainId = parseDrivetrain(car?.drivetrain);
  const fuel: FuelId = parseFuel({ fuel: car?.fuel, electric: car?.electric });
  const transmission: TransmissionId = car?.transmission === "Manual" ? "Manual" : "Automatic";

  function onYear(next: string) {
    const y = Number(next);
    setYear(Number.isFinite(y) ? y : "");
    setMake("");
    setModel("");
  }

  function onMake(next: string) {
    setMake(next);
    setModel("");
  }

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="year">Year</Label>
        <select
          id="year"
          name="year"
          required
          value={year}
          onChange={(e) => onYear(e.target.value)}
          className={vehicleSelectClass}
        >
          <option value="">Year first</option>
          {VEHICLE_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="make">Make</Label>
        <select
          id="make"
          name="make"
          required
          disabled={year === ""}
          value={make}
          onChange={(e) => onMake(e.target.value)}
          className={vehicleSelectClass}
        >
          <option value="">{year === "" ? "Pick a year first" : "Make"}</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="model">Model</Label>
        <select
          id="model"
          name="model"
          required
          disabled={!make}
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className={vehicleSelectClass}
        >
          <option value="">{make ? "Model" : "Pick a make first"}</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="drivetrain">Drivetrain</Label>
        <select
          id="drivetrain"
          name="drivetrain"
          required
          defaultValue={drivetrain}
          className={vehicleSelectClass}
        >
          {DRIVETRAINS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fuel">Fuel</Label>
        <select id="fuel" name="fuel" required defaultValue={fuel} className={vehicleSelectClass}>
          {FUELS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="transmission">Transmission</Label>
        <select
          id="transmission"
          name="transmission"
          required
          defaultValue={transmission}
          className={vehicleSelectClass}
        >
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
