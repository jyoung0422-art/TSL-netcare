# Supabase 연동 설정 가이드

TSL NetCare를 실행하기 전에 아래 단계를 완료하세요.

## 1. Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속 → **New Project** 생성
2. 프로젝트 대시보드 → **Settings → API**에서 아래 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 절대 클라이언트 노출 금지)

## 2. DB 테이블 생성

1. **SQL Editor** → New query
2. [`supabase/schema.sql`](./supabase/schema.sql) 내용을 붙여넣고 **Run**

## 3. Storage 버킷 생성

1. **Storage → New bucket**
   - 이름: `request-photos` → **Public bucket** 체크
   - 이름: `completion-photos` → **Public bucket** 체크

## 4. 환경변수 설정

1. `.env.local.example`을 복사하여 `.env.local` 생성
2. Supabase에서 복사한 값으로 채우기

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. 앱 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
