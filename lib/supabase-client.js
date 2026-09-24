import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

/**
 * Uploads an array of image files directly from the browser to Supabase Storage.
 * This bypasses Server Action payload limits and React 19 Flight array nesting limits.
 *
 * @param {Array<File | { file: File } | string>} images
 * @param {string} carId - Unique ID or folder name for the car
 * @returns {Promise<string[]>} Array of public URLs
 */
export async function uploadCarImages(images, carId) {
  const folderPath = `cars/${carId}`;
  const uploadedUrls = [];

  for (let i = 0; i < images.length; i++) {
    const item = images[i];

    // If it's already a full URL, no need to re-upload
    if (typeof item === "string" && item.startsWith("http")) {
      uploadedUrls.push(item);
      continue;
    }

    const file = item instanceof File ? item : item?.file;

    if (!file) {
      // If it's a data URL or base64 string, convert it to a Blob and upload
      if (typeof item === "string" && item.startsWith("data:image/")) {
        const mimeMatch = item.match(/data:image\/([a-zA-Z0-9]+);/);
        const ext = mimeMatch ? mimeMatch[1] : "jpeg";
        const base64Data = item.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let j = 0; j < byteCharacters.length; j++) {
          byteNumbers[j] = byteCharacters.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/${ext}` });

        const fileName = `image-${Date.now()}-${i}.${ext}`;
        const filePath = `${folderPath}/${fileName}`;

        const { error } = await supabaseClient.storage
          .from("car-images")
          .upload(filePath, blob, {
            contentType: `image/${ext}`,
            upsert: true,
          });

        if (error) {
          throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
        }

        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
        uploadedUrls.push(publicUrl);
        continue;
      }

      console.warn("Skipping unknown image item:", item);
      continue;
    }

    // Determine extension
    let extension = "jpeg";
    if (file.name && file.name.includes(".")) {
      extension = file.name.split(".").pop().toLowerCase();
    } else if (file.type) {
      extension = file.type.split("/")[1] || "jpeg";
    }

    const fileName = `image-${Date.now()}-${i}.${extension}`;
    const filePath = `${folderPath}/${fileName}`;

    const { error } = await supabaseClient.storage
      .from("car-images")
      .upload(filePath, file, {
        contentType: file.type || `image/${extension}`,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload image "${file.name}": ${error.message}`);
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}
