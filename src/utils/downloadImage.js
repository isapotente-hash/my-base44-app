/**
 * Downloads an image cropped to the given aspect ratio using a canvas.
 * This ensures the saved file matches the displayed ratio regardless of
 * what the AI API actually returned.
 *
 * @param {string} imageUrl  - URL of the source image
 * @param {string} aspectRatio - one of "1:1", "16:9", "9:16"
 */
export async function downloadCroppedImage(imageUrl, aspectRatio) {
  const ratioMap = {
    "1:1": 1,
    "16:9": 16 / 9,
    "9:16": 9 / 16,
  };
  const targetRatio = ratioMap[aspectRatio] ?? 1;

  // Load the image
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;

  // Calculate crop box (centre-crop to targetRatio)
  let cropW = srcW;
  let cropH = srcH;

  if (srcW / srcH > targetRatio) {
    // Source is wider than target → crop sides
    cropW = Math.round(srcH * targetRatio);
  } else {
    // Source is taller than target → crop top/bottom
    cropH = Math.round(srcW / targetRatio);
  }

  const offsetX = Math.round((srcW - cropW) / 2);
  const offsetY = Math.round((srcH - cropH) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = cropW;
  canvas.height = cropH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, offsetX, offsetY, cropW, cropH, 0, 0, cropW, cropH);

  // Export as blob and trigger download
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-image-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}