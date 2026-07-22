import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_BUCKET || "ryzenfall";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

/**
 * Upload a file buffer to the Supabase bucket and return its public URL.
 */
export async function uploadImage(buffer, mimetype, originalName = "") {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : "png";
  const path = `projects/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: mimetype, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Remove an image from the bucket given its public URL. Silently ignores
 * URLs that don't belong to this bucket.
 */
export async function deleteImage(publicUrl) {
  if (!publicUrl) return;
  const marker = `/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;

  const path = publicUrl.slice(idx + marker.length);
  await supabase.storage.from(bucket).remove([path]);
}
