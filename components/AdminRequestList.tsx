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

interface AdminRequestListProps {
  requests: RequestWithCaptain[];
}

export function AdminRequestList({ requests }: AdminRequestListProps) {
  const [modalPhoto, setModalPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500">
        접수된 요청이 없습니다.
      </Card>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-3 py-2 font-medium">선박명</th>
              <th className="px-3 py-2 font-medium">연락처</th>
              <th className="px-3 py-2 font-medium">입항일</th>
              <th className="px-3 py-2 font-medium">수선기한</th>
              <th className="px-3 py-2 font-medium">상태</th>
              <th className="px-3 py-2 font-medium">사진</th>
              <th className="px-3 py-2 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <AdminRow
                key={req.id}
                request={req}
                onPhotoClick={setModalPhoto}
                copiedId={copiedId}
                onCopied={setCopiedId}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {requests.map((req) => (
          <AdminCard
            key={req.id}
            request={req}
            onPhotoClick={setModalPhoto}
            copiedId={copiedId}
            onCopied={setCopiedId}
          />
        ))}
      </div>

      <PhotoModal
        src={modalPhoto?.src || ""}
        alt={modalPhoto?.alt || ""}
        open={!!modalPhoto}
        onClose={() => setModalPhoto(null)}
      />
    </>
  );
}

function AdminRow({
  request,
  onPhotoClick,
  copiedId,
  onCopied,
}: {
  request: RequestWithCaptain;
  onPhotoClick: (photo: { src: string; alt: string }) => void;
  copiedId: string | null;
  onCopied: (id: string | null) => void;
}) {
  const shipName = request.captains?.ship_name || "-";

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-3 py-3 font-medium">{shipName}</td>
      <td className="px-3 py-3">
        <a
          href={`tel:${request.captain_phone}`}
          className="text-blue-600 hover:underline"
        >
          {formatPhone(request.captain_phone)}
        </a>
      </td>
      <td className="px-3 py-3">{formatDate(request.arrival_date)}</td>
      <td className="px-3 py-3">{formatDate(request.repair_deadline)}</td>
      <td className="px-3 py-3">
        <StatusSelect id={request.id} status={request.status} />
      </td>
      <td className="px-3 py-3">
        <PhotoThumbnails request={request} onPhotoClick={onPhotoClick} />
      </td>
      <td className="px-3 py-3">
        <AdminActions
          request={request}
          copiedId={copiedId}
          onCopied={onCopied}
        />
      </td>
    </tr>
  );
}

function AdminCard({
  request,
  onPhotoClick,
  copiedId,
  onCopied,
}: {
  request: RequestWithCaptain;
  onPhotoClick: (photo: { src: string; alt: string }) => void;
  copiedId: string | null;
  onCopied: (id: string | null) => void;
}) {
  const shipName = request.captains?.ship_name || "-";

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{shipName}</h3>
          <p className="text-xs text-slate-400">{formatDate(request.created_at)}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-slate-500">입항일</span>
          <p>{formatDate(request.arrival_date)}</p>
        </div>
        <div>
          <span className="text-slate-500">수선기한</span>
          <p>{formatDate(request.repair_deadline)}</p>
        </div>
      </div>

      {request.description && (
        <p className="text-sm text-slate-600">{request.description}</p>
      )}

      <PhotoThumbnails request={request} onPhotoClick={onPhotoClick} />

      <div className="flex flex-wrap items-center gap-2">
        <a href={`tel:${request.captain_phone}`}>
          <Button variant="outline" size="sm">
            📞 {formatPhone(request.captain_phone)}
          </Button>
        </a>
        <StatusSelect id={request.id} status={request.status} />
      </div>

      <AdminActions
        request={request}
        copiedId={copiedId}
        onCopied={onCopied}
      />
    </Card>
  );
}

function PhotoThumbnails({
  request,
  onPhotoClick,
}: {
  request: RequestWithCaptain;
  onPhotoClick: (photo: { src: string; alt: string }) => void;
}) {
  return (
    <div className="flex gap-2">
      {request.photo_url && (
        <button
          onClick={() =>
            onPhotoClick({ src: request.photo_url!, alt: "접수 사진" })
          }
          className="overflow-hidden rounded border border-slate-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={request.photo_url}
            alt="접수 사진"
            className="h-12 w-12 object-cover"
          />
        </button>
      )}
      {request.completion_photo_url && (
        <button
          onClick={() =>
            onPhotoClick({
              src: request.completion_photo_url!,
              alt: "완료 사진",
            })
          }
          className="overflow-hidden rounded border border-green-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={request.completion_photo_url}
            alt="완료 사진"
            className="h-12 w-12 object-cover"
          />
        </button>
      )}
      {!request.photo_url && !request.completion_photo_url && (
        <span className="text-xs text-slate-400">없음</span>
      )}
    </div>
  );
}

function StatusSelect({ id, status }: { id: string; status: Status }) {
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState(status);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setCurrent(newStatus);
    startTransition(async () => {
      await updateRequestStatus(id, newStatus);
    });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function AdminActions({
  request,
  copiedId,
  onCopied,
}: {
  request: RequestWithCaptain;
  copiedId: string | null;
  onCopied: (id: string | null) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const statusUrl = `${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || ""}/status/${request.id}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(statusUrl);
    onCopied(request.id);
    setTimeout(() => onCopied(null), 2000);
  }

  function handleCompletionUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await uploadCompletionPhoto(request.id, formData);
      if (!result.success) {
        setError(result.error || "업로드 실패");
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button variant="ghost" size="sm" onClick={handleCopyLink}>
        {copiedId === request.id ? "복사됨!" : "상태 링크 복사"}
      </Button>

      {(request.status === "완료" || request.status === "수선중") && (
        <form onSubmit={handleCompletionUpload} className="flex items-center gap-2">
          <input
            name="photo"
            type="file"
            accept="image/*"
            required={request.status !== "완료"}
            className="text-xs"
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "업로드..." : "완료 사진"}
          </Button>
        </form>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
