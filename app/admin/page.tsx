import { getAllRequests } from "@/lib/actions/requests";
import { AdminRequestList } from "@/components/AdminRequestList";

export default async function AdminPage() {
  const requests = await getAllRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">관리자 페이지</h1>
        <p className="mt-1 text-sm text-slate-600">
          접수 목록 확인 · 상태 변경 · 완료 사진 업로드
        </p>
      </div>

      <AdminRequestList requests={requests} />
    </div>
  );
}
