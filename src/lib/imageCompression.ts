/**
 * Compress an image file to fit under maxSizeBytes by resizing and adjusting quality.
 * Returns a new File object.
 */
export async function compressImage(
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024,
  maxDimension: number = 1920
): Promise<File> {
  // If already small enough, return as-is
  if (file.size <= maxSizeBytes) return file;

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Scale down to maxDimension
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try decreasing quality until under limit
  let quality = 0.85;
  let blob: Blob;
  do {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
    quality -= 0.1;
  } while (blob.size > maxSizeBytes && quality > 0.2);

  // If still too large, scale down further
  if (blob.size > maxSizeBytes) {
    const ratio = Math.sqrt(maxSizeBytes / blob.size) * 0.9;
    const w2 = Math.round(width * ratio);
    const h2 = Math.round(height * ratio);
    const canvas2 = new OffscreenCanvas(w2, h2);
    const ctx2 = canvas2.getContext("2d")!;
    // Redraw from original canvas
    ctx2.drawImage(canvas, 0, 0, width, height, 0, 0, w2, h2);
    blob = await canvas2.convertToBlob({ type: "image/jpeg", quality: 0.7 });
  }

  const ext = "jpg";
  const name = file.name.replace(/\.[^.]+$/, "") + `.${ext}`;
  return new File([blob], name, { type: "image/jpeg" });
}
