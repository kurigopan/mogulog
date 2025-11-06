import { supabase } from "@/lib/supabase/client";

async function uploadFileToBucket(
  file: File,
  userId: string,
  bucketName: string,
) {
  // 例: bucketName/user_id/uuid.ext
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
    });

  if (error) {
    console.error(`アップロードエラー (${bucketName}):`, error.message);
    return null;
  }

  return getPublicUrl(filePath, bucketName);
}

export async function uploadAvatar(file: File, userId: string) {
  return uploadFileToBucket(file, userId, "avatars");
}

export async function uploadImage(file: File, userId: string) {
  return uploadFileToBucket(file, userId, "recipe-images");
}

export function getPublicUrl(filePath: string, bucketName: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  if (data && data.publicUrl) {
    return data.publicUrl;
  }
  return null;
}
