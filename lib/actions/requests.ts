"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { uploadPhoto } from "@/lib/actions/storage";
import { getCaptainPhone } from "@/lib/session";
import { STATUSES, COMPLETION_PHOTOS_BUCKET, REQUEST_PHOTOS_BUCKET } from "@/lib/constants";
import type { Status } from "@/lib/constants";
import type { ActionResult, Request, RequestWithCaptain } from "@/lib/types";

export async function createRequest(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const phone = await getCaptainPhone();
  if (!phone) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const arrivalDate = formData.get("arrival_date") as string;
  const repairDeadline = formData.get("repair_deadline") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const photo = formData.get("photo") as File | null;

  if (!arrivalDate || !repairDeadline) {
    return { success: false, error: "입항 날짜와 수선 기한을 입력해주세요." };
  }

  let photoUrl: string | null = null;

  if (photo && photo.size > 0) {
    try {
      photoUrl = await uploadPhoto(REQUEST_PHOTOS_BUCKET, photo, phone);
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "사진 업로드에 실패했습니다.",
      };
    }
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("requests")
    .insert({
      captain_phone: phone,
      arrival_date: arrivalDate,
      repair_deadline: repairDeadline,
      photo_url: photoUrl,
      description,
      status: "접수",
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/mypage");
  revalidatePath("/admin");
  return { success: true, data: { id: data.id } };
}

export async function getMyRequests(): Promise<Request[]> {
  const phone = await getCaptainPhone();
  if (!phone) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("captain_phone", phone)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getAllRequests(): Promise<RequestWithCaptain[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, captains(ship_name)")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as RequestWithCaptain[];
}

export async function getRequestById(id: string): Promise<RequestWithCaptain | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, captains(ship_name)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as RequestWithCaptain;
}

export async function updateRequestStatus(
  id: string,
  status: Status
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) {
    return { success: false, error: "올바르지 않은 상태입니다." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/mypage");
  revalidatePath(`/status/${id}`);
  return { success: true };
}

export async function uploadCompletionPhoto(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const photo = formData.get("photo") as File | null;

  if (!photo || photo.size === 0) {
    return { success: false, error: "완료 사진을 선택해주세요." };
  }

  const supabase = createServiceClient();
  const { data: request, error: fetchError } = await supabase
    .from("requests")
    .select("captain_phone")
    .eq("id", id)
    .single();

  if (fetchError || !request) {
    return { success: false, error: "접수를 찾을 수 없습니다." };
  }

  let photoUrl: string;
  try {
    photoUrl = await uploadPhoto(
      COMPLETION_PHOTOS_BUCKET,
      photo,
      request.captain_phone
    );
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "사진 업로드에 실패했습니다.",
    };
  }

  const { error } = await supabase
    .from("requests")
    .update({
      completion_photo_url: photoUrl,
      status: "완료",
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  // TODO: 알림톡 연동 예정

  revalidatePath("/admin");
  revalidatePath("/mypage");
  revalidatePath(`/status/${id}`);
  return { success: true };
}
