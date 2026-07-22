import Link from "next/link";
import { getCaptainPhone } from "@/lib/session";

export async function Header() {
  const phone = await getCaptainPhone();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          TSL NetCare
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {phone ? (
            <>
              <Link href="/request" className="text-slate-600 hover:text-blue-600">
                접수하기
              </Link>
              <Link href="/mypage" className="text-slate-600 hover:text-blue-600">
                마이페이지
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-slate-600 hover:text-blue-600">
              로그인
            </Link>
          )}
          <Link href="/admin" className="text-slate-400 hover:text-slate-600">
            관리자
          </Link>
        </nav>
      </div>
    </header>
  );
}
