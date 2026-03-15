# KimchiPremium 프로젝트 컨텍스트

## 프로젝트 개요
실시간 암호화폐 김치 프리미엄(김프) 트래커 웹사이트.
업비트(KRW) vs 바이낸스(USD) 가격 차이를 실시간으로 보여줌.

## 운영 방식
- 나 = 팀장 역할. 디자이너/개발자와 소통하는 포지션.
- 확인 없이 알아서 진행. 물어보지 말고 바로 실행.
- 한국어로 소통.

---

## 기술 스택
- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **next-intl** — KO/ZH/EN 다국어
- **SWR** — 5초 폴링 (실시간 가격)
- **Zustand** — 전역 상태
- **lightweight-charts v5** — TradingView 스타일 차트 (Recharts 대체)
- **lucide-react** — 아이콘

## 개발 서버 실행
```bash
NODE_OPTIONS="" npm run dev
# npm run dev 가 안되면 위처럼 NODE_OPTIONS 비워서 실행
```

## 빌드
```bash
NODE_OPTIONS="" npm run build
```

---

## 핵심 파일 구조

```
src/
├── proxy.ts                          # next-intl 미들웨어 (Next.js 16: middleware→proxy)
├── i18n/
│   ├── config.ts                     # locales = ['ko','en','zh']
│   ├── routing.ts
│   └── request.ts
├── types/index.ts                    # CoinPrice, SUPPORTED_COINS 등
├── store/index.ts                    # Zustand 전역 상태
├── hooks/usePrices.ts                # SWR 폴링 훅
├── lib/
│   ├── utils.ts                      # formatKrw, formatUsd 등 유틸
│   └── api/
│       ├── upbit.ts                  # 업비트 API
│       ├── binance.ts                # 바이낸스 API
│       └── exchangeRate.ts           # 환율 API (fallback 2개)
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (SEO, AdSense, GA)
│   ├── page.tsx                      # / → /ko 리다이렉트
│   ├── sitemap.ts                    # /sitemap.xml 자동 생성
│   ├── robots.ts                     # /robots.txt
│   ├── globals.css                   # 다크테마, glass, skeleton, 애니메이션
│   ├── api/
│   │   ├── prices/route.ts           # 실시간 가격 API (업비트+바이낸스+환율)
│   │   ├── indicators/route.ts       # 공포탐욕지수 + 글로벌 시장
│   │   ├── news/route.ts             # 크립토 뉴스 (CryptoCompare)
│   │   └── chat/route.ts             # 실시간 채팅 (인메모리)
│   └── [locale]/
│       ├── layout.tsx                # hreflang, JSON-LD, ChatWidget 포함
│       ├── page.tsx                  # 메인 대시보드
│       ├── indicators/page.tsx       # 지표 분석 탭
│       └── news/page.tsx             # 뉴스 탭
└── components/
    ├── layout/
    │   ├── Header.tsx                # 로케일 스위처, 환율 표시
    │   ├── Footer.tsx                # 출시예정 로드맵 표시
    │   └── TabNav.tsx                # 📊프리미엄 / 📈지표분석 / 📰뉴스
    ├── coins/
    │   ├── DataProvider.tsx          # usePrices 훅 마운트
    │   ├── PremiumTable.tsx          # 메인 코인 테이블
    │   ├── StatsBar.tsx              # 평균프리미엄/환율/시장상태 카드
    │   └── AlertBanner.tsx           # 크롬 익스텐션 Coming Soon 배너
    ├── charts/
    │   ├── TVChart.tsx               # lightweight-charts v5 래퍼 (SSR disabled, dynamic import)
    │   └── PremiumChart.tsx          # 프리미엄 히스토리 차트 (1H/4H/1D/1W)
    ├── indicators/
    │   └── IndicatorsClient.tsx      # 공탐지수 게이지 + 글로벌시장 + 코인별 바
    ├── news/
    │   └── NewsClient.tsx            # 뉴스 카드 그리드 + 필터
    └── chat/
        └── ChatWidget.tsx            # 플로팅 채팅 위젯

messages/
├── ko.json
├── en.json
└── zh.json
```

---

## 데이터 흐름

```
브라우저
  └─ SWR 5초 폴링 → /api/prices
       ├─ 업비트 API  (KRW-BTC, KRW-ETH, ...)
       ├─ 바이낸스 API (BTCUSDT, ETHUSDT, ...)
       └─ 환율 API    (exchangerate-api.com → cdn.jsdelivr 폴백)
            → 프리미엄 = (업비트KRW - 바이낸스USD×환율) / 바이낸스KRW × 100
```

---

## 지원 코인 (10개)
BTC, ETH, XRP, SOL, ADA, DOGE, POL(구MATIC), LINK, DOT, AVAX

> **주의**: KRW-MATIC 업비트 상장폐지됨 → KRW-POL / POLUSDT 사용

---

## 알려진 이슈 & 해결법

### npm run 오류
node_modules/.bin/next, tsc 가 심볼릭 링크 아닌 복사본으로 설치되는 버그:
```bash
rm node_modules/.bin/next && ln -s ../next/dist/bin/next node_modules/.bin/next
rm node_modules/.bin/tsc  && ln -s ../typescript/bin/tsc  node_modules/.bin/tsc
```

### NODE_OPTIONS 오류
```bash
NODE_OPTIONS="" npm run dev
NODE_OPTIONS="" npm run build
```

### Next.js 16 변경사항
- `middleware.ts` → `proxy.ts` 로 이름 변경됨
- `themeColor` → `metadata`가 아닌 `viewport` export로 분리
- `devIndicators: false` — 개발 모드 Route Info 패널 숨김

---

## 환경변수 (.env.local)
```env
NEXT_PUBLIC_BASE_URL=https://kimchipremium.com

# Google AdSense (발급 후 입력)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX

# Google Analytics (발급 후 입력)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Search Console 인증
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXXXXXXX
```

---

## SEO 구성
- `/sitemap.xml` — ko/en/zh 3개 언어 × 3개 페이지 = 9개 URL, hreflang 포함
- `/robots.txt` — /api/ 크롤 차단
- JSON-LD — WebApplication 스키마 (locale별)
- 로케일별 키워드:
  - KO: 김치프리미엄, 김프, 김프가, 업비트 바이낸스 차이 등
  - EN: kimchi premium, upbit vs binance, korea crypto premium 등
  - ZH: 泡菜溢价, 韩国溢价, 比特币溢价 등

---

## 채팅 기능
- `/api/chat` — GET(폴링) / POST(전송)
- 인메모리 저장 (서버 재시작 시 초기화)
- **프로덕션 배포 전 Upstash Redis 또는 Supabase로 교체 필요**
- 닉네임: localStorage 저장, 랜덤 생성 가능
- 고래/황소/곰 닉네임 → 이모지 배지 자동 부여

---

## 코인 상세 페이지 (`/[locale]/coin/[symbol]`)
- `src/app/[locale]/coin/[symbol]/page.tsx` — 클라이언트 컴포넌트, `/api/prices` 5초 폴링
- 헤더: 로고, 이름, 심볼, 프리미엄 뱃지, 업비트 가격
- 실시간 스탯 6개 카드: 업비트 KRW / 바이낸스 USD / 김치 프리미엄 / 24h 변동 / 거래량 / 환율
- `src/lib/coinContent.ts` — 코인별 콘텐츠 데이터 (BTC/ETH: facts 타입, 나머지: opinion 타입)
  - `facts` 타입: 핵심 정보 그리드 + 섹션별 불릿 리스트
  - `opinion` 타입: 요약 / opinionSections 3개 (tokenomics/protocol/연결 여부) / verdict / sources
  - 전체 137개 코인 중 BTC·ETH·ARB 외 40개 주요 코인 콘텐츠 작성 완료
  - 각 코인 출처(sources) 링크 하단 표시
- PremiumTable에서 코인 심볼 클릭 시 상세 페이지로 이동

## 지원 코인 확장
- 기존 10개 → **137개** 코인 지원 (업비트 KRW 마켓 전수 커버)
- Binance 미상장 코인(한국 전용: BORA, MLK, MBL, MED, HUNT 등)은 프리미엄 null 표시
- `src/lib/api/binance.ts`: 40개씩 청크 요청 + 청크 실패 시 개별 fallback
- `src/app/api/prices/route.ts`: 빈 binancePair 필터링, COIN_LOGOS 137개 등록
- 특수 매핑: SONIC(업비트) → SUSDT(바이낸스), MANTRA(업비트) → OMUSDT(바이낸스), BTT → BTTCUSDT, HOLO → HOTUSDT

## StatsBar 추가 지표
- 공포탐욕지수 카드 (InfoTooltip 포함)
- VIX 카드 (TradingView 외부 링크 포함)
- `/api/indicators`: Yahoo Finance API로 VIX 히스토리 조회

## CNN 스타일 반원형 게이지
- `IndicatorsClient.tsx`의 `FearGreedGauge` — SVG 120개 세그먼트, 색상 보간, 바늘 애니메이션
- 지표 분석 탭: VIX 차트 (TVChart), 구간선 20/30 표시

## Footer 개선
- 브랜드 섹션 제거 (3열 → 3열 유지, 내용 재배치)
- 하드코딩 한국어 → next-intl `t()` 호출로 전환

---

## 로드맵 (미구현)
- [ ] 크롬 익스텐션 알람 (구독 서비스)
- [ ] PWA 아이콘 파일 생성 (public/icons/*.png)
- [ ] OG 이미지 생성 (public/og-image.png)
- [ ] Vercel 배포
- [ ] 도메인 연결 (Cloudflare 추천 — 원가 판매)
- [ ] Upstash Redis 연결 (채팅 영속성)
- [ ] 동시 접속자 수 표시 (Upstash Redis)
- [ ] Google AdSense 광고 슬롯 배치
- [ ] **김치 프리미엄 히스토리 DB 저장** (1년 이상 차트 제공용)
  - 추천: Supabase (Postgres) + GitHub Actions cron
  - 5초 간격 저장 → 하루 ~17,000행 → 1년 ~600만행 (무료 500MB 이내)
  - 현재는 업비트/바이낸스 API로 최대 200개 캔들만 조회 가능 (1H 기준 약 8일치)

---

## 대화 히스토리 요약

1. 프로젝트 초기 세팅 (Next.js 16, next-intl, Tailwind, SWR, Zustand, Recharts)
2. 업비트/바이낸스 실시간 가격 API 구축
3. 메인 대시보드 (프리미엄 테이블, 스탯바, 차트)
4. KRW-MATIC 상장폐지 → KRW-POL 수정
5. 코인 순서 고정 (5초 갱신해도 순서 안 바뀌게)
6. 원화 전체 표시 (M 약자 제거), 로케일별 가격 표기
7. 탭 네비게이션 추가 (프리미엄/지표분석/뉴스)
8. 지표 분석 페이지 (공포탐욕지수 게이지, 글로벌 시장, 코인별 프리미엄 바)
9. 뉴스 페이지 (CryptoCompare API, 필터)
10. SEO 전면 적용 (sitemap, robots, hreflang, JSON-LD, AdSense 준비)
11. 실시간 채팅 위젯 (플로팅, 3초 폴링, 닉네임 30개×3언어)
12. TradingView lightweight-charts v5 적용 (PremiumChart, IndicatorsClient)
13. 지표 분석 탭 3개 섹션: 온체인(MVRV/HashRate/ActiveAddr/TxCount) / 시장(공탐/글로벌) / 파생상품(펀딩비 히스토그램)
14. StatsBar에 공포탐욕지수 + VIX 카드 추가, CNN 스타일 반원형 게이지
15. Footer 개선 (브랜드 섹션 제거, i18n 완성)
16. 코인 상세 페이지 구현 (/[locale]/coin/[symbol]) — facts/opinion 타입 콘텐츠
17. 137개 코인으로 확장 (업비트 KRW 마켓 전수 커버), Binance 청크 fallback 처리
