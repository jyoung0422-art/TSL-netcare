-- TSL NetCare DB 스키마
-- Supabase 대시보드 → SQL Editor에서 실행하세요.

-- captains: 선장 정보
CREATE TABLE captains (
  phone TEXT PRIMARY KEY,
  ship_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- requests: 수선 접수
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_phone TEXT NOT NULL REFERENCES captains(phone),
  arrival_date DATE NOT NULL,
  repair_deadline DATE NOT NULL,
  photo_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT '접수'
    CHECK (status IN ('접수', '배정', '수선중', '완료')),
  completion_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_requests_captain_phone ON requests(captain_phone);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
