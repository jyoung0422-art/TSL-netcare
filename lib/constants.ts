export const STATUSES = ["접수", "배정", "수선중", "완료"] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_COLORS: Record<Status, string> = {
  접수: "bg-gray-100 text-gray-700",
  배정: "bg-blue-100 text-blue-700",
  수선중: "bg-orange-100 text-orange-700",
  완료: "bg-green-100 text-green-700",
};

export const SESSION_COOKIE = "captain_phone";

export const REQUEST_PHOTOS_BUCKET = "request-photos";
export const COMPLETION_PHOTOS_BUCKET = "completion-photos";
