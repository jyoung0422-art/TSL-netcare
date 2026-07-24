"use client";

import { useState, useTransition } from "react";
import {
  updateRequestStatus,
  uploadCompletionPhoto,
} from "@/lib/actions/requests";
import { STATUSES } from "@/lib/constants";
import type { Status } from "@/lib/constants";
import type { RequestWithCaptain } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { PhotoModal } from "@/components/ui/PhotoModal";
import { formatDate, formatPhone } from "@/lib/utils";

interface AdminRequestDetailProps {
  request: RequestWithCaptain;
}

export function AdminRequestDetail({ request }: AdminRequestDetailProps) {
  const [modalPhoto, setModalPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isUploadPending, startUploadTransition] = useTransition();
  const [uploadError, setUploadError] = useState("");

  const shipName = request.captains?.ship_name || "-";
  const statusUrl = `${
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || ""
  }/status/${request.id}`;

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setStatus(newStatus);
    startStatusTransition(async () => {
      await updateRequestStatus(request.id, newStatus);
    });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(statusUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCompletionUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError("");
    const formData = new FormData(e.currentTarget);
    startUploadTransition(async () => {
      const result = await uploadCompletionPhoto(request.id, formData);
      if (!result.success) {
        setUploadError(result.error || "업로드 실패");
      }
    });
  }

  return (
    <>
      <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{shipName}</h2>
            <p className="text-xs text-slate-400">
              {formatDate(request.created_at)} 접수
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">연락처</span>
            <p className="font-medium text-slate-900">
              <a
                href={`tel:${request.captain_phone}`}
                className="text-blue-600 hover:underline"
              >
                {formatPhone(request.captain_phone)}
              </a>
            </p>
          </div>
          <div>
            <span className="text-slate-500">입항일</span>
            <p className="font-medium text-slate-900">
              {formatDate(request.arrival_date)}
            </p>
          </div>
          <div>
            <span className="text-slate-500">수선기한</span>
            <p className="font-medium text-slate-900">
              {formatDate(request.repair_deadline)}
            </p>
          </div>
        </div>

        {request.description && (
          <div className="text-sm">
            <span className="text-slate-500">요청 내용</span>
            <p className="mt-1 whitespace-pre-wrap text-slate-700">
              {request.description}
            </p>
          </div>
        )}

        {(request.photo_url || request.completion_photo_url) && (
          <div className="flex gap-3">
            {request.photo_url && (
              <button
                onClick={() =>
                  setModalPhoto({ src: request.photo_url!, alt: "접수 사진" })
                }
                className="space-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={request.photo_url}
                  alt="접수 사진"
                  className="h-24 w-24 rounded border border-slate-200 object-cover"
                />
                <p className="text-center text-xs text-slate-500">접수 사진</p>
              </button>
            )}
            {request.completion_photo_url && (
              <button
                onClick={() =>
                  setModalPhoto({
                    src: request.completion_photo_url!,
                    alt: "완료 사진",
                  })
                }
                className="space-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={request.completion_photo_url}
                  alt="완료 사진"
                  className="h-24 w-24 rounded border border-green-200 object-cover"
                />
                <p className="text-center text-xs text-slate-500">완료 사진</p>
              </button>
            )}
          </div>
        )}
      </Card>

      <Card className="space-y-3 p-4">
        <h3 className="text-sm font-semibold text-slate-900">관리</h3>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-500" htmlFor="status-select">
            상태 변경
          </label>
          <select
            id="status-select"
            value={status}
            onChange={handleStatusChange}
            disabled={isStatusPending}
            className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <Button variant="ghost" size="sm" onClick={handleCopyLink}>
          {copied ? "복사됨!" : "상태 링크 복사"}
        </Button>

        {(status === "완료" || status === "수선중") && (
          <form
            onSubmit={handleCompletionUpload}
            className="flex items-center gap-2"
          >
            <input
              name="photo"
              type="file"
              accept="image/*"
              required={status !== "완료"}
              className="text-xs"
            />
            <Button type="submit" size="sm" disabled={isUploadPending}>
              {isUploadPending ? "업로드..." : "완료 사진 업로드"}
            </Button>
          </form>
        )}

        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
      </Card>

      <PhotoModal
        src={modalPhoto?.src || ""}
        alt={modalPhoto?.alt || ""}
        open={!!modalPhoto}
        onClose={() => setModalPhoto(null)}
      />
    </>
  );
}
