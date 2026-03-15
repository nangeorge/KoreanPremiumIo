# KoreanPremium.io 개발 로그

## 프로젝트 개요
- **사이트**: https://koreanpremium.io
- **GitHub**: https://github.com/nangeorge/KoreanPremiumIo
- **배포**: Vercel (자동 배포 — main 브랜치 push 시)
- **도메인**: Cloudflare에서 구매, Vercel DNS 연결

---

## 기술 스택
- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **next-intl** — KO/EN/ZH 다국어
- **SWR** — 5초 폴링 (실시간 가격)
- **Zustand** — 전역 상태
- **lightweight-charts v5** — TradingView 스타일 차트
- **next-pwa** — PWA 지원
- **lucide-react** — 아이콘

---

## 개발 명령어
```bash
NODE_OPTIONS="" npm run dev    # 개발 서버
NODE_OPTIONS="" npm run build  # 빌드
git add -A && git commit -m "메시지" && git push  # 배포
```

---

## 주요 개발 히스토리

### 1단계 — 프로젝트 초기 세팅
- Next.js 16, next-intl, Tailwind, SWR, Zustand 세팅
- 업비트/바이낸스 실시간 가격 API 구축
- 메인 대시보드 (프리미엄 테이블, 스탯바, 차트)

### 2단계 — 코인 및 데이터 개선
- KRW-MATIC 상장폐지 → KRW-POL 수정
- 코인 순서 고정 (5초 갱신해도 순서 유지)
- 원화 전체 표시 (M 약자 제거)
- 지원 코인 130개+로 확장
- DRIFT 코인 추가
- 상장폐지 코인 graceful 처리 (flatMap으로 제외)

### 3단계 — 탭 및 페이지 추가
- 탭 네비게이션: 프리미엄 / 지표분석 / 뉴스
- 지표 분석 페이지 (공포탐욕지수, MVRV, 펀딩비, VIX, 해시레이트, 온체인)
- 뉴스 페이지 (CryptoCompare API)
- 코인 상세 페이지 (/[locale]/coin/[symbol])

### 4단계 — SEO & AdSense 준비
- sitemap.xml, robots.txt
- hreflang (ko/en/zh)
- JSON-LD WebApplication 스키마
- Privacy Policy, Terms of Service, About 페이지 추가
- 투자 면책조항 바 추가
- "Korea Premium Index" 키워드 SEO 반영 (kimchi premium과 병행)

### 5단계 — PWA
- manifest.json 설정
- next-pwa 서비스 워커
- 아이콘 생성 (72~512px) — `scripts/generate-all-icons.mjs`
- 앱 이름: **"Korea Premium Index"** / short_name: **"KP Index"**

### 6단계 — Vercel 배포
- GitHub 연결, 자동 배포 설정
- Binance API Vercel 차단 → **Bybit API**로 전면 교체
  - `src/lib/api/binance.ts` → Bybit API 사용 (인터페이스는 BinanceTicker 유지)
  - `src/app/api/candles/route.ts` → fetchBybitOHLC
  - `src/app/api/indicators/route.ts` → Bybit 펀딩비 API
  - `src/app/og/route.tsx` → Bybit 가격 fetch
- Deployment Protection 해제 (Settings → Security)
- 도메인: `koreanpremium.io` (Cloudflare 등록, Vercel 연결)

### 7단계 — 이미지 최적화
- next/image remotePatterns: assets.coingecko.com 추가
- 코인 로고 96개 로컬 저장 (`public/logos/`) — `scripts/download-logos.mjs`
  - 나머지 42개는 CoinGecko URL 폴백 유지 (403 다운로드 실패)

### 8단계 — UI/UX 개선
- **Favicon**: KP 로고 (dark navy + "KP" + 차트 라인 + 초록 점)
  - `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`
  - PWA 아이콘도 동일 디자인으로 통일
- **BTC Premium 강조**: StatsBar에서 2xl font-black, 색상 배경 카드
- **Korea Premium 시그널 뱃지**: 공포/무관심/보통/주의/고점/초고점
  - −3% 이하: 🔵 공포 / 0~−3%: ⚪ 무관심 / 0~+3%: 🟢 보통
  - +3~10%: 🟡 주의 / +10~20%: 🟠 고점 / +20%+: 🔴 초고점
- **탭 아이콘 제거**: 📊📈📰 이모지 제거, 텍스트만 유지
- **환율 표시**: `$1 = ₩1,450` 형식 (헤더 + StatsBar + 모바일)
- **Binance → Bybit**: UI 전체 레이블 교체
- **Footer Coming Soon 제거**: 데이터 출처 섹션으로 교체
- **Indicators 다국어**: 한글 하드코딩 전부 ko/en/zh 번역 처리

### 9단계 — 성능 개선
- `/api/prices` Cache-Control: `no-store` → `s-maxage=5, stale-while-revalidate=10`
  - Vercel CDN이 5초 캐시 → 모바일 첫 로딩 속도 개선
- SWR `revalidateOnFocus: false` → 앱 전환 시 불필요한 재요청 방지

### 10단계 — OG 이미지 (SNS 썸네일)
- 동적 `/og` 엔드포인트: Binance → Bybit 교체, domain 수정
- 정적 OG 이미지 생성: `public/og-image.png` (1200x630)
  - `scripts/generate-og-image.mjs`로 생성
  - 카카오톡/트위터/페이스북 썸네일용 정적 이미지로 변경
  - 동적 엔드포인트는 타임아웃 가능성 있어 정적으로 교체

---

## 파일 구조 핵심

```
src/
├── app/
│   ├── favicon.ico / icon.png / apple-icon.png  ← KP 아이콘
│   ├── layout.tsx        ← SEO 메타데이터, OG 이미지
│   ├── api/
│   │   ├── prices/       ← 업비트 + Bybit + Coinbase + 환율
│   │   ├── candles/      ← OHLC 차트 데이터 (Bybit)
│   │   ├── indicators/   ← MVRV, 공탐지수, VIX, 펀딩비
│   │   ├── news/         ← CryptoCompare 뉴스
│   │   └── og/           ← 동적 OG 이미지 (레거시)
│   └── [locale]/
│       ├── page.tsx      ← 메인 대시보드
│       ├── coin/[symbol] ← 코인 상세
│       ├── indicators/   ← 지표 분석
│       ├── news/         ← 뉴스
│       ├── about/        ← 소개
│       ├── privacy/      ← 개인정보처리방침
│       └── terms/        ← 이용약관
├── components/
│   ├── coins/
│   │   ├── PremiumTable.tsx   ← 메인 테이블 (Bybit/Coinbase 탭)
│   │   └── StatsBar.tsx       ← BTC 프리미엄 강조 + 시그널
│   ├── indicators/
│   │   └── IndicatorsClient.tsx  ← ko/en/zh 완전 다국어
│   └── layout/
│       ├── Header.tsx    ← $1 = ₩환율 표시
│       └── Footer.tsx    ← 데이터 출처 섹션
├── lib/api/
│   ├── binance.ts        ← 실제로는 Bybit API 사용 (이름 유지)
│   ├── coinbase.ts
│   ├── upbit.ts
│   └── exchangeRate.ts
public/
├── logos/                ← 96개 코인 로고 로컬 캐시
├── icons/                ← PWA 아이콘 (72~512px)
├── manifest.json         ← PWA 설정
└── og-image.png          ← SNS 썸네일 정적 이미지
scripts/
├── download-logos.mjs    ← 코인 로고 다운로드
├── generate-all-icons.mjs ← 아이콘 일괄 생성
└── generate-og-image.mjs  ← OG 이미지 생성
```

---

## 알려진 이슈 & 해결책

| 이슈 | 원인 | 해결 |
|------|------|------|
| Binance API 차단 | Vercel IP 블록 | Bybit API로 전면 교체 |
| OG 이미지 미표시 | 동적 엔드포인트 타임아웃 | 정적 og-image.png로 교체 |
| 코인 로고 느린 로딩 | CoinGecko CDN 외부 요청 | public/logos/ 로컬 저장 |
| 모바일 데이터 느린 로딩 | no-store 캐시 설정 | s-maxage=5 CDN 캐시 |
| favicon Vercel 로고 | Next.js icon.png 미설정 | src/app/icon.png 추가 |
| Indicators 영문 한글 노출 | 하드코딩 한글 문자열 | LABELS 객체로 다국어 처리 |

---

## 환경변수 (.env.local & Vercel Dashboard)

```env
NEXT_PUBLIC_BASE_URL=https://koreanpremium.io
NEXT_PUBLIC_ADSENSE_ID=       # Google AdSense (미발급)
NEXT_PUBLIC_GA_ID=            # Google Analytics (미설정)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=  # Search Console (미설정)
```

> ⚠️ Vercel Dashboard에도 동일하게 설정 필요
> Settings → Environment Variables → NEXT_PUBLIC_BASE_URL = https://koreanpremium.io

---

## 로드맵 (미구현)

- [ ] Google AdSense 광고 슬롯 배치
- [ ] Google Analytics 연결
- [ ] Google Search Console 등록
- [ ] 크롬 익스텐션 알람
- [ ] 김치 프리미엄 히스토리 DB (Supabase + GitHub Actions cron)
- [ ] Upstash Redis (채팅 영속성, 동시접속자 수)
- [ ] 코인 로고 403 실패분 42개 대체 소스 확보
