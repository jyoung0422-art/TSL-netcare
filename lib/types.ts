import type { Status } from "./constants";

export interface Captain {
  phone: string;
  ship_name: string;
  created_at: string;
}

export interface Request {
  id: string;
  captain_phone: string;
  arrival_date: string;
  repair_deadline: string;
  photo_url: string | null;
  description: string | null;
  status: Status;
  completion_photo_url: string | null;
  created_at: string;
}

export interface RequestWithCaptain extends Request {
  captains: Pick<Captain, "ship_name"> | null;
}

export interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}
