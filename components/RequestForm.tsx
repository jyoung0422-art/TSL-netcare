"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRequest } from "@/lib/actions/requests";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";

interface RequestPageProps {
  shipName: string;
}

export function RequestForm({ shipName }: RequestPageProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createRequest(formData);

    if (!result.success) {
      setError(result.error || "접수에 실패했습니다.");
      setLoading(false);
      return;
    }

    setSuccess({ id: result.data!.id });
    setLoading(false);
  }

  if (success) {
    const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/status/${success.id}`;

    return (
      <Card className="p-6 text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h2 className="text-xl font-bold text-slate-900">접수 완료</h2>
        <p className="mt-2 text-sm text-slate-600">
          접수 번호: <span className="font-mono text-xs">{success.id}</span>
        </p>
        <p className="mt-4 text-sm text-slate-600">
          아래 링크로 수선 완료 후 사진을 확인할 수 있습니다.
        </p>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs break-all text-slate-700">
          {statusUrl}
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push("/mypage")}>마이페이지</Button>
          <Button variant="outline" onClick={() => setSuccess(null)}>
            추가 접수
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 rounded-lg bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-800">
          선박: <span className="font-semibold">{shipName}</span>
        </p>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-slate-900">수선 접수</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="입항 날짜"
          name="arrival_date"
          type="date"
          required
        />
        <Input
          label="수선 기한"
          name="repair_deadline"
          type="date"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            사진 업로드
          </label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="미리보기"
              className="mt-2 h-40 w-auto rounded-lg object-cover"
            />
          )}
        </div>

        <Textarea
          label="수선 범위 설명"
          name="description"
          placeholder="수선이 필요한 부위와 범위를 간단히 설명해주세요"
          rows={4}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "접수 중..." : "접수하기"}
        </Button>
      </form>
    </Card>
  );
}
