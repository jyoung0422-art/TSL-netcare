import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestById } from "@/lib/actions/requests";
import { AdminRequestDetail } from "@/components/AdminRequestDetail";

interface AdminRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRequestDetailPage({
  params,
}: AdminRequestDetailPageProps) {
  const { id } = await params;
  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← 목록으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">접수 상세</h1>
      </div>

      <AdminRequestDetail request={request} />
    </div>
  );
}
