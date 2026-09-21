const MAX_EDGE = 1280;
const MAX_CHARS = 420_000;

export async function compressListingPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Use a photo (JPEG, PNG, or HEIC).");
  if (file.size > 12 * 1024 * 1024) throw new Error("Keep each photo under 12 MB.");

  const bitmap = await decodeImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if ("close" in bitmap) bitmap.close();
    throw new Error("Could not read that photo.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap) bitmap.close();

  let quality = 0.78;
  let data = canvas.toDataURL("image/jpeg", quality);
  while (data.length > MAX_CHARS && quality > 0.42) {
    quality -= 0.08;
    data = canvas.toDataURL("image/jpeg", quality);
  }
  if (data.length > MAX_CHARS) throw new Error("That photo is still too large. Try a tighter crop.");
  return data;
}

export async function compressDataUrl(dataUrl: string): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = blob.type.startsWith("image/") ? blob.type : "image/jpeg";
  const file = new File([blob], "photo.jpg", { type });
  return compressListingPhoto(file);
}

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* HEIC or odd types — fall through to <img>. */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read that photo."));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}
