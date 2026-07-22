"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerCaptain } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatPhone } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [shipName, setShipName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!phone) {
    return (
      <Card className="p-6 text-center">
        <p className="text-slate-600">전화번호가 없습니다.</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          로그인으로 돌아가기
        </Button>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await registerCaptain(phone, shipName);

    if (!result.success) {
      setError(result.error || "등록에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push("/request");
  }

  return (
    <Card className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">선박 등록</h1>
      <p className="mb-6 text-sm text-slate-600">
        처음 이용하시는 번호입니다. 선박명을 입력해주세요.
        <br />
        <span className="font-medium text-slate-800">
          {formatPhone(phone)}
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="선박명"
          name="ship_name"
          placeholder="예: 태평양호"
          value={shipName}
          onChange={(e) => setShipName(e.target.value)}
          required
          error={error}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "등록 중..." : "등록하고 접수하기"}
        </Button>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <Suspense fallback={<div className="text-center text-slate-500">로딩...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
