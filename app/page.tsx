"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const LOGO_CLICK_THRESHOLD = 5;
const LOGO_CLICK_WINDOW_MS = 3000;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin1234";

export default function HomePage() {
  const router = useRouter();
  const clickTimestampsRef = useRef<number[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogoClick() {
    const now = Date.now();
    const recentClicks = clickTimestampsRef.current.filter(
      (timestamp) => now - timestamp < LOGO_CLICK_WINDOW_MS
    );
    recentClicks.push(now);
    clickTimestampsRef.current = recentClicks;

    if (recentClicks.length >= LOGO_CLICK_THRESHOLD) {
      clickTimestampsRef.current = [];
      setPassword("");
      setError("");
      setShowAdminModal(true);
    }
  }

  function closeAdminModal() {
    setShowAdminModal(false);
    setPassword("");
    setError("");
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      closeAdminModal();
      router.push("/admin");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1
          onClick={handleLogoClick}
          className="cursor-pointer select-none text-3xl font-bold text-slate-900 sm:text-4xl"
        >
          TSL NetCare
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          선박 입항 전 그물 수선을 간편하게 접수하세요
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-1 sm:justify-center">
        <Card className="mx-auto flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
          <div className="text-4xl">⚓</div>
          <h2 className="text-xl font-semibold">선장님</h2>
          <p className="text-sm text-slate-600">
            전화번호로 로그인 후 수선 접수 및 진행 상황을 확인하세요
          </p>
          <Link href="/login">
            <Button size="lg">수선 접수하기</Button>
          </Link>
        </Card>
      </div>

      {showAdminModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeAdminModal}
        >
          <Card
            className="w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              관리자 로그인
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              관리자 비밀번호를 입력하세요
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                label="비밀번호"
                name="admin-password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={closeAdminModal}
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  로그인
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
