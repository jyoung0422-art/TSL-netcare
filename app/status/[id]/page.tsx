import { notFound } from "next/navigation";
import { getRequestById } from "@/lib/actions/requests";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPhone } from "@/lib/utils";

interface StatusPageProps {
  params: Promise<{ id: string }>;
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { id } = await params;
  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  const shipName = request.captains?.ship_name || "-";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">접수 상세</h1>
        <p className="mt-1 text-sm text-slate-600">{shipName}</p>
      </div>

      <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <StatusBadge status={request.status} />
          <span className="text-xs text-slate-400">
            {formatDate(request.created_at)} 접수
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">연락처</span>
            <p className="font-medium text-slate-900">
              {formatPhone(request.captain_phone)}
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
              <a
                href={request.photo_url}
                target="_blank"
                rel="noreferrer"
                className="space-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={request.photo_url}
                  alt="접수 사진"
                  className="h-24 w-24 rounded border border-slate-200 object-cover"
                />
                <p className="text-center text-xs text-slate-500">접수 사진</p>
              </a>
            )}
            {request.completion_photo_url && (
              <a
                href={request.completion_photo_url}
                target="_blank"
                rel="noreferrer"
                className="space-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={request.completion_photo_url}
                  alt="완료 사진"
                  className="h-24 w-24 rounded border border-green-200 object-cover"
                />
                <p className="text-center text-xs text-slate-500">완료 사진</p>
              </a>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
