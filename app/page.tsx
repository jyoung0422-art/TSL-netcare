import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          TSL NetCare
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          선박 입항 전 그물 수선을 간편하게 접수하세요
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="text-4xl">⚓</div>
          <h2 className="text-xl font-semibold">선장님</h2>
          <p className="text-sm text-slate-600">
            전화번호로 로그인 후 수선 접수 및 진행 상황을 확인하세요
          </p>
          <Link href="/login">
            <Button size="lg">수선 접수하기</Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="text-4xl">🔧</div>
          <h2 className="text-xl font-semibold">관리자</h2>
          <p className="text-sm text-slate-600">
            접수 목록 확인, 작업자 배정, 수선 진행 및 완료 처리
          </p>
          <Link href="/admin">
            <Button variant="secondary" size="lg">
              관리자 페이지
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
