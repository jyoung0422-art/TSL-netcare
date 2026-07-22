"use server";

import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import {
  getCaptainPhone,
  normalizePhone,
  setCaptainPhone,
  clearCaptainPhone,
} from "@/lib/session";
import type { ActionResult, Captain } from "@/lib/types";

export async function loginCaptain(
  phone: string
): Promise<ActionResult<{ exists: boolean; shipName?: string }>> {
  const normalized = normalizePhone(phone);

  if (!normalized || normalized.length < 10) {
    return { success: false, error: "올바른 전화번호를 입력해주세요." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("captains")
    .select("phone, ship_name")
    .eq("phone", normalized)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  if (data) {
    await setCaptainPhone(normalized);
    return {
      success: true,
      data: { exists: true, shipName: data.ship_name },
    };
  }

  return { success: true, data: { exists: false } };
}

export async function registerCaptain(
  phone: string,
  shipName: string
): Promise<ActionResult> {
  const normalized = normalizePhone(phone);
  const trimmedName = shipName.trim();

  if (!normalized || normalized.length < 10) {
    return { success: false, error: "올바른 전화번호를 입력해주세요." };
  }

  if (!trimmedName) {
    return { success: false, error: "선박명을 입력해주세요." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("captains").insert({
    phone: normalized,
    ship_name: trimmedName,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  await setCaptainPhone(normalized);
  return { success: true };
}

export async function logoutCaptain(): Promise<void> {
  await clearCaptainPhone();
  redirect("/login");
}

export async function getCurrentCaptain(): Promise<Captain | null> {
  const phone = await getCaptainPhone();
  if (!phone) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("captains")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
