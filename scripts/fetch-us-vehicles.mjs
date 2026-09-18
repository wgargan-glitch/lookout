#!/usr/bin/env node
/** Pull US-market light-vehicle models from NHTSA vPIC for 2000–current. */

import { writeFile } from "node:fs/promises";

const CURRENT = new Date().getFullYear();
const MIN_YEAR = 2000;
const MAX_YEAR = Math.max(CURRENT, 2026);

const MAKES = [
  "ACURA",
  "ALFA ROMEO",
  "ASTON MARTIN",
  "AUDI",
  "BENTLEY",
  "BMW",
  "BUICK",
  "CADILLAC",
  "CHEVROLET",
  "CHRYSLER",
  "DAEWOO",
  "DODGE",
  "FERRARI",
  "FIAT",
  "FISKER",
  "FORD",
  "GENESIS",
  "GMC",
  "HONDA",
  "HUMMER",
  "HYUNDAI",
  "INEOS",
  "INFINITI",
  "ISUZU",
  "JAGUAR",
  "JEEP",
  "KARMA",
  "KIA",
  "LAMBORGHINI",
  "LAND ROVER",
  "LEXUS",
  "LINCOLN",
  "LOTUS",
  "LUCID",
  "MASERATI",
  "MAYBACH",
  "MAZDA",
  "MCLAREN",
  "MERCEDES-BENZ",
  "MERCURY",
  "MINI",
  "MITSUBISHI",
  "NISSAN",
  "OLDSMOBILE",
  "PLYMOUTH",
  "POLESTAR",
  "PONTIAC",
  "PORSCHE",
  "RAM",
  "RIVIAN",
  "ROLLS-ROYCE",
  "SAAB",
  "SATURN",
  "SCION",
  "SMART",
  "SUBARU",
  "SUZUKI",
  "TESLA",
  "TOYOTA",
  "VINFAST",
  "VOLKSWAGEN",
  "VOLVO",
];

const SKIP_MODEL = /incomplete|chassis|stripped|cutaway|motorhome|incomplete vehicle|glider/i;

const PRETTY_MAKE = {
  BMW: "BMW",
  GMC: "GMC",
  MINI: "MINI",
  RAM: "Ram",
  FIAT: "FIAT",
  "MERCEDES-BENZ": "Mercedes-Benz",
  "LAND ROVER": "Land Rover",
  "ALFA ROMEO": "Alfa Romeo",
  "ASTON MARTIN": "Aston Martin",
  "ROLLS-ROYCE": "Rolls-Royce",
  MCLAREN: "McLaren",
  VINFAST: "VinFast",
};

function prettyMake(make) {
  if (PRETTY_MAKE[make]) return PRETTY_MAKE[make];
  return make
    .toLowerCase()
    .split(/([-\s])/g)
    .map((part) => (/[-\s]/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

async function modelsFor(make, year, attempt = 0) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const names = new Set();
    for (const row of json.Results ?? []) {
      const model = String(row.Model ?? "").trim();
      if (!model || SKIP_MODEL.test(model)) continue;
      names.add(model);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  } catch (err) {
    if (attempt >= 3) {
      console.error("fail", make, year, err);
      return [];
    }
    await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    return modelsFor(make, year, attempt + 1);
  }
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return out;
}

const jobs = [];
for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
  for (const make of MAKES) jobs.push({ year, make });
}

console.error(`fetching ${jobs.length} year/make pairs`);
const byYear = {};
let done = 0;
await pool(jobs, 12, async (job) => {
  const models = await modelsFor(job.make, job.year);
  done += 1;
  if (done % 50 === 0) console.error(`${done}/${jobs.length}`);
  if (!models.length) return;
  const y = String(job.year);
  const make = prettyMake(job.make);
  byYear[y] ??= {};
  byYear[y][make] = models;
});

const years = Object.keys(byYear).sort();
const makeCount = new Set(years.flatMap((y) => Object.keys(byYear[y]))).size;
const comboCount = years.reduce(
  (n, y) => n + Object.values(byYear[y]).reduce((m, models) => m + models.length, 0),
  0,
);
const payload = {
  minYear: MIN_YEAR,
  maxYear: MAX_YEAR,
  source: "NHTSA vPIC GetModelsForMakeYear",
  years: byYear,
};
const path = new URL("../src/lib/us-vehicles.json", import.meta.url);
await writeFile(path, JSON.stringify(payload));
console.error(`wrote ${path.pathname} makes=${makeCount} combos=${comboCount}`);
