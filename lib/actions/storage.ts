"use server";

import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import {
  COMPLETION_PHOTOS_BUCKET,
  REQUEST_PHOTOS_BUCKET,
} from "@/lib/constants";

export async function uploadPhoto(
  bucket: typeof REQUEST_PHOTOS_BUCKET | typeof COMPLETION_PHOTOS_BUCKET,
  file: File,
  folder: string
): Promise<string> {
  const supabase = createServiceClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`사진 업로드 실패: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}
