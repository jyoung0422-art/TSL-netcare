"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginCaptain } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginCaptain(phone);

    if (!result.success) {
      setError(result.error || "로그인에 실패했습니다.");
      setLoading(false);
      return;
    }

    if (result.data?.exists) {
      router.push("/request");
    } else {
      const normalized = phone.replace(/\D/g, "");
      router.push(`/register?phone=${normalized}`);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">로그인</h1>
        <p className="mb-6 text-sm text-slate-600">
          전화번호를 입력하면 접수 페이지로 이동합니다
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="전화번호"
            name="phone"
            type="tel"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            error={error}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "확인 중..." : "로그인"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
