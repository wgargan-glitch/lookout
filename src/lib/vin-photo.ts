import { parseRegistrationRead, type RegistrationRead } from "@/lib/vin-decode";

const READ_PROMPT = [
  "This photo is a vehicle identification number plate, a door-jamb VIN sticker, a dashboard VIN, or a vehicle registration / title.",
  "Extract only vehicle identity. Ignore owner names, addresses, dates of birth, and driver's license numbers.",
  "Return JSON with keys vin, plate, year, make, model, trim.",
  "vin must be the 17-character VIN if it is readable, otherwise an empty string.",
  "plate is the license plate if visible, otherwise empty.",
  "year is a 4-digit model year if printed, otherwise empty.",
  "make, model, trim are empty strings when not clearly printed.",
].join(" ");

export async function readRegistrationFromPhoto(photo: string, apiKey: string): Promise<RegistrationRead> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 400,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: photo, detail: "high" } },
            { type: "text", text: READ_PROMPT },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) {
    throw new Error("Could not read that photo right now. Paste the VIN from the dash instead.");
  }
  const body = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = body.choices?.[0]?.message?.content ?? "";
  return parseRegistrationRead(text);
}
