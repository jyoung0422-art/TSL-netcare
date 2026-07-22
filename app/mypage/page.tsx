import Link from "next/link";
import { getMyRequests } from "@/lib/actions/requests";
import { getCurrentCaptain, logoutCaptain } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default async function MyPage() {
  const captain = await getCurrentCaptain();

  if (!captain) {
    redirect("/login");
  }

  const requests = await getMyRequests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
          <p className="mt-1 text-sm text-slate-600">
            {captain.ship_name} · {captain.phone}
          </p>
        </div>
        <form action={logoutCaptain}>
          <Button type="submit" variant="outline" size="sm">
            로그아웃
          </Button>
        </form>
      </div>

      <div className="flex justify-end">
        <Link href="/request">
          <Button>새 접수하기</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          아직 접수한 내역이 없습니다.
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    <span className="text-xs text-slate-400">
                      {formatDate(req.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    입항: {formatDate(req.arrival_date)} · 기한:{" "}
                    {formatDate(req.repair_deadline)}
                  </p>
                  {req.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {req.description}
                    </p>
                  )}
                </div>
                <Link
                  href={`/status/${req.id}`}
                  className="shrink-0 text-sm text-blue-600 hover:underline"
                >
                  상세보기
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
