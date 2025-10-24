import { supabase } from "@/lib/supabase/client";

export async function uploadAvatar(file: File, userId: string) {
  const bucketName = "avatars";
  const filePath = `${userId}/${file.name}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // 同名ファイルがあれば上書き
    });

  if (error) {
    console.error("アップロードエラー:", error.message);
    return null;
  }

  const signedUrl = await getSignedUrl(filePath, bucketName);

  return signedUrl;
}

export async function getSignedUrl(filePath: string, bucketName: string) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 3600);

  if (error) {
    console.error("署名付きURL取得エラー:", error.message);
    return null;
  }
  if (data && data.signedUrl) {
    return data.signedUrl;
  }
  return null;
}

export async function uploadImage(file: File, userId: string) {
  const bucketName = "recipe-images";
  // 1. ファイル拡張子を取得
  const fileExt = file.name.split(".").pop();

  // 2. UUIDを生成し、一意なファイルパスを作成
  // 例: recipe-images/user_id/uuid.ext
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
    });

  if (error) {
    console.error("アップロードエラー:", error.message);
    return null;
  }

  const publicUrl = getPublicUrl(filePath, bucketName);

  return publicUrl;
}

export function getPublicUrl(filePath: string, bucketName: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  if (data && data.publicUrl) {
    return data.publicUrl;
  }
  return null;
}
