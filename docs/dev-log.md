# KoreanPremium.io 개발 로그

## 프로젝트 개요
- **사이트**: https://koreanpremium.io
- **GitHub**: https://github.com/nangeorge/KoreanPremiumIo
- **배포**: Vercel Pro (자동 배포 — main 브랜치 push 시)
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
- 지원 코인 137개로 확장 (업비트 KRW 마켓 전수 커버)
- 상장폐지 코인 graceful 처리 (flatMap으로 제외)
- 100% 초과 프리미엄 null 처리 (데이터 오염 방지)

### 3단계 — 탭 및 페이지 추가
- 탭 네비게이션: 프리미엄 / 지표분석 / 뉴스
- 지표 분석 페이지 (공포탐욕지수, MVRV, 펀딩비, VIX, 해시레이트, 온체인)
- 뉴스 페이지 (CryptoCompare API)
- 코인 상세 페이지 (/[locale]/coin/[symbol])

### 4단계 — SEO & AdSense
- sitemap.xml, robots.txt
- hreflang (ko/en/zh)
- JSON-LD WebApplication 스키마
- Privacy Policy, Terms of Service, About 페이지 추가
- 투자 면책조항 바 추가
- "Korea Premium Index" 키워드 SEO 반영
- Google AdSense 코드 삽입 (`ca-pub-8327952774757997`) — 심사 대기 중
- Google Search Console 소유권 인증 (`google142258d97f185908`)

### 5단계 — PWA
- manifest.json 설정
- next-pwa 서비스 워커
- 아이콘 생성 (72~512px) — `scripts/generate-all-icons.mjs`
- 앱 이름: **"Korea Premium Index"** / short_name: **"KP Index"**

### 6단계 — Vercel 배포
- GitHub 연결, 자동 배포 설정
- Binance API Vercel 차단 → Bybit 시도 → **OKX API**로 최종 교체
  - `src/lib/api/binance.ts` → OKX spot tickers (인터페이스 BinanceTicker 유지)
  - `src/app/api/candles/route.ts` → fetchOkxOHLC
  - `src/app/api/indicators/route.ts` → OKX 펀딩비 API
  - `src/app/og/route.tsx` → OKX 가격 fetch
- **Vercel Pro 업그레이드** (광고 수익화를 위해 상업적 사용 플랜 필요)
- 도메인: `koreanpremium.io` (Cloudflare 등록, Vercel 연결)

### 7단계 — 이미지 최적화
- next/image remotePatterns: assets.coingecko.com 추가
- 코인 로고 96개 로컬 저장 (`public/logos/`) — `scripts/download-logos.mjs`
  - 나머지 41개는 CoinGecko URL 폴백 유지 (403 다운로드 실패)

### 8단계 — UI/UX 개선
- **Favicon**: KP 로고 (dark navy + "KP" + 차트 라인 + 초록 점)
  - `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`
  - PWA 아이콘도 동일 디자인으로 통일
- **BTC Premium 강조**: StatsBar에서 2xl font-black, 색상 배경 카드
- **Korea Premium 시그널 뱃지**: 공포/무관심/보통/주의/고점/초고점
  - −3% 이하: 🔵 공포 / 0~−3%: ⚪ 무관심 / 0~+3%: 🟢 보통
  - +3~10%: 🟡 주의 / +10~20%: 🟠 고점 / +20%+: 🔴 초고점
- **환율 표시**: `$1 = ₩1,450` 형식 (헤더 + StatsBar + 모바일)
- **UI 레이블**: Binance → Bybit → OKX / Coinbase로 교체
- **Footer Coming Soon 제거**: 데이터 출처 섹션으로 교체
- **Indicators 다국어**: 한글 하드코딩 전부 ko/en/zh 번역 처리
- **툴팁 줄바꿈**: `whitespace-pre-line` 적용 (InfoTooltip)
- **Hero 문구**: "김치 프리미엄 — 세계 최고의 인간 심리 지표" / "The world's most human crypto indicator"

### 9단계 — 성능 개선
- `CoinRow` → `React.memo` 적용 (137개 코인 불필요한 리렌더링 방지)
- `StatsBar` altAvg → `useMemo` 적용
- 환율 API 캐시: 60초 → 300초
- SWR `dedupingInterval`: 4000 → 5000ms (refreshInterval과 동기화)
- 히스토리 배열: spread 복사 → `concat` 최적화
- next.config.ts: `compress`, `optimizePackageImports(lucide-react)`, 이미지 AVIF/WebP, `minimumCacheTTL` 추가

### 10단계 — OG 이미지 (SNS 썸네일)
- 동적 `/og` 엔드포인트 구축
  - `/og?locale=ko|en|zh` 로케일별 다국어 지원
  - Inter 폰트 로드 (선명한 텍스트 렌더링)
  - `₩` 특수문자 → `KRW` 텍스트 교체 (edge runtime 폰트 미지원)
  - OKX API로 BTC 실시간 가격 fetch
- `proxy.ts` matcher에 `/og` 제외 추가 (next-intl 미들웨어 404 방지)

---

## 파일 구조 핵심

```
src/
├── proxy.ts                          # next-intl 미들웨어
├── app/
│   ├── favicon.ico / icon.png / apple-icon.png  ← KP 아이콘
│   ├── layout.tsx        ← SEO 메타데이터, AdSense, GA, Search Console
│   ├── api/
│   │   ├── prices/       ← 업비트 + OKX + Coinbase + 환율
│   │   ├── candles/      ← OHLC 차트 데이터 (OKX)
│   │   ├── indicators/   ← MVRV, 공탐지수, VIX, 펀딩비 (OKX)
│   │   ├── news/         ← CryptoCompare 뉴스
│   │   ├── chat/         ← 실시간 채팅 (인메모리)
│   │   └── og/           ← 동적 OG 이미지
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
│   │   ├── PremiumTable.tsx   ← 메인 테이블 (OKX/Coinbase 탭), React.memo
│   │   └── StatsBar.tsx       ← BTC 프리미엄 강조 + 시그널 뱃지
│   ├── indicators/
│   │   └── IndicatorsClient.tsx  ← ko/en/zh 완전 다국어
│   ├── ui/
│   │   └── InfoTooltip.tsx    ← whitespace-pre-line 줄바꿈 지원
│   └── layout/
│       ├── Header.tsx    ← $1 = ₩환율 표시 (모바일 포함)
│       └── Footer.tsx    ← 데이터 출처 섹션
├── lib/api/
│   ├── binance.ts        ← 실제로는 OKX API 사용 (인터페이스 BinanceTicker 유지)
│   ├── coinbase.ts
│   ├── upbit.ts
│   └── exchangeRate.ts   ← 캐시 TTL 300초
public/
├── logos/                ← 96개 코인 로고 로컬 캐시
├── icons/                ← PWA 아이콘 (72~512px)
├── manifest.json         ← PWA 설정 (Korea Premium Index / KP Index)
└── og-image.png          ← SNS 썸네일 정적 이미지 (레거시)
scripts/
├── download-logos.mjs    ← 코인 로고 다운로드
├── generate-all-icons.mjs ← 아이콘 일괄 생성
└── generate-og-image.mjs  ← OG 이미지 생성
```

---

## 알려진 이슈 & 해결책

| 이슈 | 원인 | 해결 |
|------|------|------|
| Binance/Bybit API 차단 | Vercel IP 블록 | **OKX API**로 전면 교체 |
| /og 404 에러 | next-intl 미들웨어가 /og를 /en/og로 리다이렉트 | proxy.ts matcher에 `og` 제외 추가 |
| OG 이미지 특수문자 깨짐 | edge runtime 기본 폰트 미지원 | `₩` → `KRW` 텍스트 교체, Inter 폰트 로드 |
| 코인 로고 느린 로딩 | CoinGecko CDN 외부 요청 | public/logos/ 로컬 저장 |
| 모바일 데이터 느린 로딩 | no-store 캐시 설정 | s-maxage=5 CDN 캐시 |
| favicon Vercel 로고 | Next.js icon.png 미설정 | src/app/icon.png 추가 |
| Indicators 영문 한글 노출 | 하드코딩 한글 문자열 | LABELS 객체로 다국어 처리 |
| 툴팁 줄바꿈 미작동 | HTML \n 미처리 | whitespace-pre-line CSS 추가 |
| JUP 등 10000% 프리미엄 | Bybit 미상장 코인 가격 오염 | ±100% 초과 시 null 처리 |
| Vercel 무료 플랜 광고 불가 | 비상업적 사용 정책 | Vercel Pro 업그레이드 |

---

## 환경변수 (.env.local & Vercel Dashboard)

```env
NEXT_PUBLIC_BASE_URL=https://koreanpremium.io
NEXT_PUBLIC_ADSENSE_ID=8327952774757997
NEXT_PUBLIC_GA_ID=            # Google Analytics (미설정)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google142258d97f185908
```

> ⚠️ Vercel Dashboard에도 동일하게 설정 필요
> Settings → Environment Variables

---

## 로드맵 (미구현)

- [ ] Google AdSense 광고 슬롯 배치 (심사 승인 후)
- [ ] Google Analytics 연결
- [ ] 크롬 익스텐션 알람 (구독 서비스)
- [ ] **김치 프리미엄 히스토리 DB** (Supabase + GitHub Actions cron)
  - 5분 단위 저장 → 1년 약 1.5GB → Supabase 무료 플랜 가능
- [ ] Upstash Redis (채팅 영속성, 동시접속자 수)
- [ ] 코인 로고 403 실패분 41개 대체 소스 확보
- [ ] Reddit 공유 (r/CryptoCurrency, r/Bitcoin, r/SideProject)
