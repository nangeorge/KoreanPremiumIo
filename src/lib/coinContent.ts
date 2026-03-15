export interface FactItem {
  label: string;
  value: string;
}

export interface ContentSection {
  title: { ko: string; en: string };
  items: { ko: string; en: string }[];
}

export interface OpinionSection {
  title: { ko: string; en: string };
  rating?: "good" | "bad" | "neutral"; // 색상 힌트
  items: { ko: string; en: string }[];
}

export interface Source {
  label: string;
  url: string;
}

export interface CoinContent {
  type: "facts" | "opinion";
  summary: { ko: string; en: string };
  verdict?: { ko: string; en: string };      // opinion 타입: 한 줄 결론
  opinionSections?: OpinionSection[];        // opinion 타입
  facts?: FactItem[][];                      // facts 타입: 2열 그리드 카드
  sections?: ContentSection[];               // facts 타입: 섹션별 불릿 리스트
  sources?: Source[];                        // 출처
}

export const COIN_CONTENT: Record<string, CoinContent> = {
  BTC: {
    type: "facts",
    summary: {
      ko: "비트코인은 2009년 사토시 나카모토가 창시한 세계 최초의 탈중앙화 암호화폐입니다. 최대 공급량 2,100만 개로 설계된 희소성과 검열 저항성을 핵심 가치로 합니다.",
      en: "Bitcoin is the world's first decentralized cryptocurrency, created by Satoshi Nakamoto in 2009. Its core value lies in its scarcity — capped at 21 million coins — and its censorship resistance.",
    },
    facts: [
      [
        { label: "창시자", value: "사토시 나카모토 (익명)" },
        { label: "Creator", value: "Satoshi Nakamoto (anonymous)" },
      ],
      [
        { label: "출시일", value: "2009년 1월 3일" },
        { label: "Launch Date", value: "January 3, 2009" },
      ],
      [
        { label: "최대 공급량", value: "21,000,000 BTC" },
        { label: "Max Supply", value: "21,000,000 BTC" },
      ],
      [
        { label: "현재 유통량", value: "약 19,700,000 BTC (94%)" },
        { label: "Circulating Supply", value: "~19,700,000 BTC (94%)" },
      ],
      [
        { label: "합의 메커니즘", value: "작업증명 (PoW, SHA-256)" },
        { label: "Consensus", value: "Proof of Work (SHA-256)" },
      ],
      [
        { label: "평균 블록 시간", value: "약 10분" },
        { label: "Block Time", value: "~10 minutes" },
      ],
      [
        { label: "반감기 주기", value: "21만 블록마다 (약 4년)" },
        { label: "Halving Cycle", value: "Every 210,000 blocks (~4 years)" },
      ],
      [
        { label: "마지막 반감기", value: "2024년 4월 (보상 3.125 BTC)" },
        { label: "Last Halving", value: "April 2024 (reward: 3.125 BTC)" },
      ],
      [
        { label: "다음 반감기", value: "약 2028년 (보상 1.5625 BTC 예정)" },
        { label: "Next Halving", value: "~2028 (reward: 1.5625 BTC)" },
      ],
      [
        { label: "레이어2", value: "라이트닝 네트워크 (즉시 소액 결제)" },
        { label: "Layer 2", value: "Lightning Network (instant micropayments)" },
      ],
    ],
    sections: [
      {
        title: { ko: "탄생 배경: 2008년 금융위기", en: "Origin: The 2008 Financial Crisis" },
        items: [
          {
            ko: "2008년 9월, 리먼 브라더스가 6,390억 달러의 부채를 안고 파산하며 글로벌 금융 시스템이 붕괴 직전까지 몰렸다. 미국 정부는 7,000억 달러 규모의 구제금융(TARP)으로 은행들을 살렸고, 그 비용은 세금으로 충당됐다.",
            en: "In September 2008, Lehman Brothers collapsed with $639B in debt, nearly taking down the global financial system. The U.S. government bailed out the banks with a $700B package (TARP), paid for by taxpayers.",
          },
          {
            ko: "2008년 10월 31일, 사토시 나카모토(Satoshi Nakamoto)라는 익명의 인물이 암호학 메일링 리스트에 9페이지짜리 논문을 올렸다. 제목: 'Bitcoin: A Peer-to-Peer Electronic Cash System'. 은행 없이 개인 간 직접 돈을 주고받는 시스템이었다.",
            en: "On October 31, 2008, an anonymous person named Satoshi Nakamoto posted a 9-page paper to a cryptography mailing list: 'Bitcoin: A Peer-to-Peer Electronic Cash System' — a system for sending money directly between people without a bank.",
          },
          {
            ko: "2009년 1월 3일, 최초 블록(제네시스 블록)이 채굴됐다. 이 블록 안에는 당시 영국 신문 헤드라인이 새겨져 있었다: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks' — 은행 구제금융을 비꼬는 메시지였다.",
            en: "On January 3, 2009, the genesis block was mined. Embedded in it was a newspaper headline: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks' — a direct jab at the banking system.",
          },
          {
            ko: "사토시는 2010년 12월을 마지막으로 모든 활동을 중단하고 사라졌다. 그의 신원은 지금까지 밝혀지지 않았다. 추정 보유량 약 100만 BTC(약 5%)는 지금도 단 한 번도 움직인 적이 없다.",
            en: "Satoshi's last known communication was in December 2010, after which he disappeared entirely. His identity remains unknown. His estimated ~1 million BTC (~5% of supply) has never moved.",
          },
        ],
      },
      {
        title: { ko: "가격 역사: 사이클과 폭락의 기록", en: "Price History: Cycles & Crashes" },
        items: [
          {
            ko: "2010년 5월 22일 — '비트코인 피자 데이': 라즐로 하네츠가 피자 2판을 10,000 BTC에 구매. 당시 약 41달러. 지금 가치로 수억 달러.",
            en: "May 22, 2010 — 'Bitcoin Pizza Day': Laszlo Hanyecz bought 2 pizzas for 10,000 BTC (~$41 at the time). Those coins are now worth hundreds of millions of dollars.",
          },
          {
            ko: "2013년 — 첫 번째 광풍: 연초 13달러 → 연말 1,200달러. 키프로스 금융위기로 자본이탈 수요 급증. 이후 중국 정부 규제로 80% 폭락.",
            en: "2013 — First mania: $13 at start of year → $1,200 by year end, fueled by Cyprus banking crisis capital flight. Then China cracked down and it crashed 80%.",
          },
          {
            ko: "2017년 — ICO 광풍과 최고가: 연초 1,000달러 → 12월 20,000달러. 수천 개의 알트코인 ICO 열풍. 2018년 내내 하락해 저점 3,200달러(-84%).",
            en: "2017 — ICO bubble: $1,000 → $20,000 by December. Thousands of ICOs launched. Then crashed all of 2018 to a low of $3,200 (-84%).",
          },
          {
            ko: "2020~2021년 — 기관 시대: 코로나 양적완화로 유동성 폭발. 마이크로스트래티지·테슬라 매수. 2021년 11월 69,000달러 신고가 경신. 이후 테라-루나 붕괴(2022년 5월), FTX 파산(2022년 11월)으로 15,000달러까지 추락.",
            en: "2020–2021 — Institutional era: COVID QE flooded markets. MicroStrategy and Tesla bought in. BTC hit $69,000 in Nov 2021. Then Terra-Luna collapsed (May 2022) and FTX imploded (Nov 2022), crashing to $15,000.",
          },
          {
            ko: "2024년 — ETF 시대: 1월 미국 현물 ETF 승인, 4월 반감기. 3월 73,000달러로 사상 최고가 경신. 기관 자금의 본격적인 유입 시작.",
            en: "2024 — ETF era: U.S. spot ETF approved in January, halving in April. New all-time high of $73,000 in March. Institutional money began flowing in at scale.",
          },
        ],
      },
      {
        title: { ko: "기관 채택", en: "Institutional Adoption" },
        items: [
          {
            ko: "2024년 1월, 미국 SEC가 블랙록·피델리티 등 11개 비트코인 현물 ETF를 승인. 출시 첫 달 100억 달러 이상 유입.",
            en: "January 2024: SEC approved 11 Bitcoin spot ETFs including BlackRock and Fidelity. Over $10B flowed in within the first month.",
          },
          {
            ko: "마이크로스트래티지, 테슬라, 스퀘어 등 다수의 상장 기업이 재무 자산으로 보유.",
            en: "MicroStrategy, Tesla, Square and other public companies hold BTC as a treasury asset.",
          },
          {
            ko: "엘살바도르(2021)와 중앙아프리카공화국(2022)이 법정화폐로 채택.",
            en: "El Salvador (2021) and the Central African Republic (2022) adopted Bitcoin as legal tender.",
          },
        ],
      },
      {
        title: { ko: "한국 시장 특성", en: "Korean Market Characteristics" },
        items: [
          {
            ko: "업비트는 글로벌 상위 5위권 거래소로, BTC 원화 거래량이 세계 최대 수준.",
            en: "Upbit is a top-5 global exchange by volume, with KRW-BTC trading among the highest in the world.",
          },
          {
            ko: "김치 프리미엄은 역사적으로 -5% ~ +50% 범위를 기록. 2021년 강세장 때 최고 약 25% 이상.",
            en: "Kimchi premium has historically ranged from -5% to +50%. During the 2021 bull run it peaked above 25%.",
          },
          {
            ko: "국내 자본 이동 제한(외환관리법)으로 인해 해외 차익거래가 어려워 프리미엄이 지속될 수 있음.",
            en: "Korea's capital controls (Foreign Exchange Act) make cross-border arbitrage difficult, allowing the premium to persist.",
          },
        ],
      },
      {
        title: { ko: "주요 리스크 (사실)", en: "Key Risks (Factual)" },
        items: [
          {
            ko: "에너지 소비: 연간 약 120~150 TWh 소모 (일부 국가 전력 소비량과 유사).",
            en: "Energy consumption: ~120–150 TWh per year, comparable to the energy use of some countries.",
          },
          {
            ko: "변동성: 역사적으로 고점 대비 80% 이상 하락한 사례 다수 (2018년, 2022년).",
            en: "Volatility: Has historically dropped 80%+ from peaks multiple times (2018, 2022).",
          },
          {
            ko: "규제 불확실성: 국가별 법적 지위가 상이하며 규제 강화 시 가격에 직접적 영향.",
            en: "Regulatory uncertainty: Legal status varies by country; tighter regulation has historically impacted price directly.",
          },
          {
            ko: "양자 컴퓨팅: 장기적으로 SHA-256 암호화 취약성 가능성 논의 중 (현재 위협 아님).",
            en: "Quantum computing: Long-term potential vulnerability to SHA-256 discussed (not an immediate threat).",
          },
        ],
      },
    ],
    sources: [
      { label: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf" },
      { label: "Bitcoin Wiki", url: "https://en.bitcoin.it/wiki/Main_Page" },
      { label: "Messari: Bitcoin", url: "https://messari.io/asset/bitcoin" },
      { label: "CoinGecko: BTC", url: "https://www.coingecko.com/en/coins/bitcoin" },
    ],
  },

  ETH: {
    type: "facts",
    summary: {
      ko: "이더리움은 2015년 비탈릭 부테린이 창시한 스마트 컨트랙트 플랫폼입니다. 단순 결제를 넘어 탈중앙화 애플리케이션(dApp)과 금융(DeFi)을 구현할 수 있는 프로그래밍 가능한 블록체인으로, 암호화폐 생태계의 인프라 역할을 합니다.",
      en: "Ethereum is a smart contract platform created by Vitalik Buterin in 2015. Unlike Bitcoin, it is a programmable blockchain that powers decentralized applications (dApps) and finance (DeFi), serving as the core infrastructure of the crypto ecosystem.",
    },
    facts: [
      [
        { label: "창시자", value: "비탈릭 부테린 외 7명" },
        { label: "Creator", value: "Vitalik Buterin + 7 co-founders" },
      ],
      [
        { label: "출시일", value: "2015년 7월 30일" },
        { label: "Launch Date", value: "July 30, 2015" },
      ],
      [
        { label: "최대 공급량", value: "없음 (무제한)" },
        { label: "Max Supply", value: "None (uncapped)" },
      ],
      [
        { label: "현재 유통량", value: "약 1억 2,000만 ETH" },
        { label: "Circulating Supply", value: "~120 million ETH" },
      ],
      [
        { label: "합의 메커니즘", value: "지분증명 (PoS, 2022년 9월 전환)" },
        { label: "Consensus", value: "Proof of Stake (since Sep 2022)" },
      ],
      [
        { label: "평균 블록 시간", value: "약 12초" },
        { label: "Block Time", value: "~12 seconds" },
      ],
      [
        { label: "스테이킹 최소 수량", value: "32 ETH (검증자 직접 운영 기준)" },
        { label: "Min. Staking", value: "32 ETH (to run a validator)" },
      ],
      [
        { label: "수수료 소각", value: "EIP-1559 (2021.8~): 기본 수수료 소각" },
        { label: "Fee Burn", value: "EIP-1559 (Aug 2021): base fee burned" },
      ],
      [
        { label: "에너지 절감", value: "The Merge 이후 약 99.95% 감소" },
        { label: "Energy Reduction", value: "~99.95% reduction after The Merge" },
      ],
      [
        { label: "레이어2", value: "Arbitrum, Optimism, Base, zkSync 등" },
        { label: "Layer 2", value: "Arbitrum, Optimism, Base, zkSync, etc." },
      ],
    ],
    sections: [
      {
        title: { ko: "주요 업그레이드 이력", en: "Major Upgrades" },
        items: [
          {
            ko: "The Merge (2022년 9월): PoW → PoS 전환 완료. 에너지 소비 약 99.95% 감소, 신규 ETH 발행량 약 90% 감소.",
            en: "The Merge (Sep 2022): Completed PoW → PoS transition. Energy use dropped ~99.95%, new ETH issuance reduced ~90%.",
          },
          {
            ko: "EIP-1559 (2021년 8월, London 하드포크): 거래 수수료 중 기본 수수료(base fee)를 소각. 이후 누적 소각량 수백만 ETH.",
            en: "EIP-1559 (Aug 2021, London): Base fee is burned instead of paid to miners. Millions of ETH burned since activation.",
          },
          {
            ko: "EIP-4844 (2024년 3월, Dencun): 'Blob' 데이터 구조 도입으로 L2 트랜잭션 수수료 최대 90% 감소.",
            en: "EIP-4844 (Mar 2024, Dencun): Introduced 'blobs' for L2 data, cutting L2 transaction fees by up to 90%.",
          },
        ],
      },
      {
        title: { ko: "생태계 규모", en: "Ecosystem Scale" },
        items: [
          {
            ko: "DeFi TVL(총 예치자산) 기준 전체 체인 중 1위. Uniswap, Aave, MakerDAO 등 주요 프로토콜 다수 이더리움 기반.",
            en: "Ranked #1 by DeFi TVL (Total Value Locked). Major protocols like Uniswap, Aave, and MakerDAO run on Ethereum.",
          },
          {
            ko: "NFT 거래의 대부분이 이더리움 메인넷 및 L2(Base 등)에서 발생. OpenSea, Blur 등 주요 마켓플레이스 기반.",
            en: "Most NFT trading occurs on Ethereum mainnet and L2s (Base, etc.). Major marketplaces like OpenSea and Blur are Ethereum-based.",
          },
          {
            ko: "전체 스테이블코인 발행량의 절반 이상이 이더리움 체인에 존재 (USDT, USDC 등).",
            en: "Over half of all stablecoin supply exists on Ethereum (USDT, USDC, etc.).",
          },
        ],
      },
      {
        title: { ko: "기관 채택", en: "Institutional Adoption" },
        items: [
          {
            ko: "2024년 5월, 미국 SEC가 이더리움 현물 ETF 승인. 블랙록, 피델리티 등 출시.",
            en: "May 2024: SEC approved Ethereum spot ETFs. BlackRock, Fidelity, and others launched products.",
          },
          {
            ko: "이더리움 재단이 프로토콜 개발을 주도하며, 수천 명의 독립 개발자가 생태계에 기여.",
            en: "The Ethereum Foundation leads protocol development, with thousands of independent developers contributing to the ecosystem.",
          },
        ],
      },
      {
        title: { ko: "주요 리스크 (사실)", en: "Key Risks (Factual)" },
        items: [
          {
            ko: "공급 상한 없음: BTC와 달리 발행 한도가 없어 이론적으로 인플레이션 가능. 단, EIP-1559 소각으로 실질 공급은 감소 추세.",
            en: "No supply cap: Unlike BTC, there is no hard limit. However, EIP-1559 burning has kept net issuance deflationary in high-activity periods.",
          },
          {
            ko: "경쟁 체인: Solana, BNB Chain, Avalanche 등 고성능 L1 체인과 경쟁 중.",
            en: "Competing chains: Faces competition from high-performance L1s like Solana, BNB Chain, and Avalanche.",
          },
          {
            ko: "규제 불확실성: SEC가 일부 시점에 ETH를 증권으로 분류 가능성을 시사한 바 있음 (현재 ETF 승인으로 상품 지위 사실상 인정).",
            en: "Regulatory risk: The SEC previously hinted at classifying ETH as a security; however, the spot ETF approval effectively recognized it as a commodity.",
          },
          {
            ko: "L2 중심화 우려: 트랜잭션이 L2로 이동하면서 메인넷 수수료 수익 감소, ETH 소각량 감소 가능성.",
            en: "L2 centralization concern: As activity shifts to L2s, mainnet fee revenue and ETH burn rates may decline.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ethereum.org", url: "https://ethereum.org/en/whitepaper/" },
      { label: "Ultrasound Money (ETH 소각 추적)", url: "https://ultrasound.money" },
      { label: "Messari: Ethereum", url: "https://messari.io/asset/ethereum" },
      { label: "Token Terminal: ETH Revenue", url: "https://tokenterminal.com/terminal/projects/ethereum" },
    ],
  },

  ARB: {
    type: "opinion",
    summary: {
      ko: "아비트럼은 이더리움 최대 L2 네트워크로, 로빈후드 주식 토큰화·RWA 온보딩 등 실사용 면에서 압도적입니다. 그러나 ARB 토큰을 보유할 이유는 단 하나도 없습니다. 프로토콜은 돈을 버는데, 홀더에게 돌아오는 것은 없습니다.",
      en: "Arbitrum is Ethereum's largest L2 network with dominant real-world adoption including Robinhood stock tokenization and RWA onboarding. However, there is no reason to hold ARB tokens. The protocol makes money — none of it goes to holders.",
    },
    verdict: {
      ko: "프로토콜 우수, 토큰 보유 이유 없음. 매수 근거 없다.",
      en: "Strong protocol, zero reason to hold the token. No buy thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          {
            ko: "ARB는 순수 거버넌스 토큰입니다. 보유하면 투표권이 생기지만, 프로토콜 수수료 수익에 대한 경제적 권리는 전혀 없습니다.",
            en: "ARB is a pure governance token. Holders get voting rights but zero economic claim on protocol revenue.",
          },
          {
            ko: "아비트럼 시퀀서는 L1 비용과 유저 수수료의 차이에서 막대한 수익을 올립니다. 이 수익은 아비트럼 재단/DAO 트레저리로 귀속되며, ARB 홀더에게 직접 분배되지 않습니다.",
            en: "The Arbitrum sequencer earns significant revenue from the spread between L1 costs and user fees. This goes to the Arbitrum Foundation/DAO treasury — not ARB holders.",
          },
          {
            ko: "바이백 없음. 소각 없음. 배당 없음. 토큰 가격이 오를 수 있는 구조적 이유가 설계 단계에서부터 빠져 있습니다.",
            en: "No buyback. No burn. No yield. The structural reason for price appreciation was excluded from the design from day one.",
          },
          {
            ko: "수익 분배 거버넌스 제안(AIP)이 여러 차례 논의됐지만 재단의 반대 또는 복잡한 조건으로 실질적 진전이 없습니다.",
            en: "Multiple governance proposals (AIPs) for revenue sharing have been discussed but repeatedly stalled due to foundation pushback or complex conditions.",
          },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          {
            ko: "이더리움 L2 중 TVL·거래량 1위. Uniswap, GMX, Pendle 등 주요 DeFi 프로토콜이 아비트럼 위에서 운영됩니다.",
            en: "Ranked #1 among Ethereum L2s by TVL and volume. Major DeFi protocols including Uniswap, GMX, and Pendle run on Arbitrum.",
          },
          {
            ko: "로빈후드가 아비트럼 체인 위에서 2,000종목 이상의 미국 주식을 토큰화해 거래 중. RWA(실물자산 토큰화)의 핵심 인프라로 자리잡고 있습니다.",
            en: "Robinhood tokenizes 2,000+ US stocks on Arbitrum. It is positioning itself as core infrastructure for RWA (Real World Asset) tokenization.",
          },
          {
            ko: "프로토콜 자체의 성공 가능성은 높습니다. 문제는 그 성공이 ARB 토큰 가격과 연결되지 않는다는 것입니다.",
            en: "The protocol itself has strong prospects. The problem is that this success is not structurally connected to the ARB token price.",
          },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          {
            ko: "연결되지 않습니다. 아비트럼이 글로벌 RWA 인프라가 되어 수조 원의 수수료를 벌어도, ARB 토큰 가격이 오를 구조적 이유가 없습니다.",
            en: "Not connected. Even if Arbitrum becomes global RWA infrastructure earning trillions in fees, there is no structural reason for ARB price to rise.",
          },
          {
            ko: "투표권만으로 토큰 수요가 생기지 않습니다. 재단이 수익 분배를 허용하지 않는 한 거버넌스 참여의 가치는 사실상 없습니다.",
            en: "Voting rights alone don't create token demand. Governance participation has no real value unless the foundation allows revenue distribution.",
          },
          {
            ko: "결국 ARB 가격은 시장 심리와 단기 투기 수요에만 의존합니다. 이는 장기 보유의 근거가 될 수 없습니다.",
            en: "Ultimately, ARB price depends entirely on market sentiment and short-term speculation — not a thesis for long-term holding.",
          },
        ],
      },
    ],
    sources: [
      { label: "Arbitrum Docs", url: "https://docs.arbitrum.io" },
      { label: "Arbitrum DAO Forum (수익 분배 논의)", url: "https://forum.arbitrum.foundation" },
      { label: "L2Beat: Arbitrum TVL", url: "https://l2beat.com/scaling/projects/arbitrum" },
      { label: "Messari: ARB", url: "https://messari.io/asset/arbitrum" },
      { label: "Robinhood Tokenized Stocks on Arbitrum", url: "https://arbitrum.io/blog/robinhood-stock-tokens" },
    ],
  },

  XRP: {
    type: "opinion",
    summary: {
      ko: "XRP는 리플랩스가 만든 국제 송금 특화 코인입니다. 빠른 속도와 낮은 수수료는 인정받지만, 리플이 전체 공급량의 47% 이상을 보유하고 매달 시장에 방출합니다. SEC 소송은 일단락됐으나, 토큰 홀더에게 돌아오는 수익은 없습니다.",
      en: "XRP is a payment-focused coin created by Ripple Labs for cross-border transfers. Its speed and low fees are recognized, but Ripple holds over 47% of total supply and releases tokens monthly. The SEC lawsuit is mostly resolved, but there is no economic return for XRP holders.",
    },
    verdict: {
      ko: "기술은 검증됐으나, 리플이 최대 수혜자. 홀더 환원 구조 없음.",
      en: "Proven technology, but Ripple is the main beneficiary. No holder return mechanism.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "리플랩스는 에스크로에 약 450억 XRP를 보유하며 매달 10억 XRP씩 잠금 해제합니다. 이 중 상당량이 시장에 매도됩니다.", en: "Ripple Labs holds ~45B XRP in escrow, unlocking 1B XRP monthly. A significant portion is sold into the market." },
          { ko: "스테이킹 없음. 소각 없음. 바이백 없음. 거버넌스 투표권도 없습니다. XRP 보유로 얻을 수 있는 것은 가격 상승 기대뿐입니다.", en: "No staking. No burn. No buyback. No governance. The only reason to hold XRP is price appreciation." },
          { ko: "XRP 레저의 트랜잭션 수수료는 소각되지만, 수수료가 극히 낮아(0.00001 XRP) 유통량 감소 효과는 미미합니다.", en: "Transaction fees on XRPL are destroyed, but they're so small (0.00001 XRP) the deflationary effect is negligible." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "RippleNet은 실제 금융기관(SBI, Santander 등)이 채택한 결제 솔루션으로, B2B 국제 송금에서 입지를 구축했습니다.", en: "RippleNet is adopted by real financial institutions (SBI, Santander, etc.) and has established a position in B2B cross-border payments." },
          { ko: "XRPL AMM(자동화 마켓메이커)이 2024년 추가됐으나, 이더리움 DeFi와 비교하면 생태계는 초기 단계입니다.", en: "XRPL AMM was added in 2024, but the ecosystem is nascent compared to Ethereum DeFi." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "리플이 성장할수록 리플랩스 주주가 이익을 얻습니다. XRP 홀더는 그 수익을 공유할 구조적 권리가 없습니다.", en: "As Ripple grows, Ripple Labs shareholders benefit. XRP holders have no structural claim to that revenue." },
          { ko: "XRP 가격은 리플의 사업 성공보다 시장 심리와 리플의 에스크로 방출 일정에 더 많이 영향을 받습니다.", en: "XRP price is driven more by market sentiment and Ripple's escrow release schedule than by its business success." },
        ],
      },
    ],
    sources: [
      { label: "XRP Ledger Docs", url: "https://xrpl.org/docs.html" },
      { label: "Ripple Escrow 현황", url: "https://ripple.com/xrp/" },
      { label: "Messari: XRP", url: "https://messari.io/asset/xrp" },
      { label: "SEC v. Ripple 소송 결과", url: "https://www.sec.gov/litigation/litreleases/2023/lr25784.htm" },
    ],
  },

  SOL: {
    type: "opinion",
    summary: {
      ko: "솔라나는 고성능 L1 블록체인으로, 2024년 밈코인 열풍(Pump.fun)과 DeFi 부활로 실사용 지표가 폭발적으로 성장했습니다. 스테이킹 수익률(약 6~7%)이 있으나, 연간 인플레이션이 스테이킹 수익을 일부 상쇄합니다. 프로토콜과 토큰 모두 강합니다.",
      en: "Solana is a high-performance L1 that saw explosive real-use growth in 2024 via the meme coin wave (Pump.fun) and DeFi revival. Staking yield (~6–7%) exists, but annual inflation partially offsets it. Both protocol and token have strong momentum.",
    },
    verdict: {
      ko: "스테이킹 수익 + 강력한 생태계. 인플레이션 희석이 유일한 약점. 리스트 중 상위권.",
      en: "Staking yield + strong ecosystem. Inflation dilution is the only weakness. Top tier among listed coins.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹 수익", en: "① Tokenomics — Holder Return: Staking Yield" },
        rating: "neutral",
        items: [
          { ko: "SOL 스테이킹 수익률은 연 약 6~7%. 잠금 없이 위임만 해도 수익이 발생합니다.", en: "SOL staking yields ~6–7% annually. You can delegate without locking and still earn rewards." },
          { ko: "현재 인플레이션율은 약 5~6%로 점차 하락 중(최종 목표 1.5%). 실질 수익은 인플레이션 차감 후 소폭에 불과합니다.", en: "Current inflation is ~5–6%, declining toward a 1.5% long-term target. Real yield after inflation is modest." },
          { ko: "트랜잭션 수수료의 50%는 소각, 50%는 검증자에게 분배. 단, 수수료 자체가 낮아 소각 효과는 제한적입니다.", en: "50% of transaction fees are burned, 50% go to validators. However, fees are low, so the burn effect is limited." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "2024년 Pump.fun, Jupiter, Jito, Raydium 등을 중심으로 일일 DEX 거래량이 이더리움을 반복적으로 추월했습니다.", en: "In 2024, daily DEX volume repeatedly surpassed Ethereum, driven by Pump.fun, Jupiter, Jito, and Raydium." },
          { ko: "개발자 활동 지수(Electric Capital 기준)에서 이더리움 다음으로 가장 많은 활성 개발자를 보유합니다.", en: "By developer activity (Electric Capital), Solana has the second-most active developers after Ethereum." },
          { ko: "Firedancer(Jump Crypto) 클라이언트 출시 예정으로 네트워크 안정성과 성능이 대폭 향상될 전망입니다.", en: "The upcoming Firedancer client (Jump Crypto) is expected to dramatically improve network stability and performance." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "수수료 소각 + 스테이킹으로 연결 구조가 존재합니다. 단, 인플레이션이 소각을 크게 초과하는 구간에서는 희석 압력이 발생합니다.", en: "Connection exists via fee burns + staking. However, inflation significantly exceeds burns in most periods, creating dilution pressure." },
          { ko: "네트워크 활동이 증가할수록 수수료 소각이 늘어나는 구조입니다. 생태계가 계속 성장하면 SOL 토큰 가치도 상승 압력을 받습니다.", en: "More network activity → more fee burns. If the ecosystem keeps growing, SOL has structural price appreciation pressure." },
        ],
      },
    ],
    sources: [
      { label: "Solana Docs", url: "https://docs.solana.com" },
      { label: "Solana Beach (스테이킹/인플레이션)", url: "https://solanabeach.io" },
      { label: "Messari: SOL", url: "https://messari.io/asset/solana" },
      { label: "Electric Capital Developer Report", url: "https://www.developerreport.com" },
    ],
  },

  ADA: {
    type: "opinion",
    summary: {
      ko: "카르다노는 학술적 접근으로 설계된 PoS 블록체인으로, 잠금 없는 스테이킹(약 3~4% APY)을 지원합니다. 그러나 스마트 컨트랙트 도입 4년이 지난 지금도 DeFi 생태계는 이더리움 대비 극히 작습니다. 프로토콜 설계는 우수하나 채택률이 너무 낮습니다.",
      en: "Cardano is an academically-designed PoS blockchain offering liquid staking (~3–4% APY) with no lock-up. However, four years after enabling smart contracts, the DeFi ecosystem remains tiny compared to Ethereum. Strong design, weak adoption.",
    },
    verdict: {
      ko: "잠금 없는 스테이킹은 장점. 생태계 성장이 없으면 토큰 가치 상승 근거 약함.",
      en: "Liquid staking is a plus. Without ecosystem growth, the token appreciation thesis is weak.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹 수익", en: "① Tokenomics — Holder Return: Staking Yield" },
        rating: "neutral",
        items: [
          { ko: "ADA 스테이킹은 잠금 없이 위임만으로 약 3~4% APY를 얻을 수 있습니다. 언제든 즉시 출금 가능합니다.", en: "ADA staking requires only delegation — no lock-up — yielding ~3–4% APY with immediate withdrawals." },
          { ko: "트랜잭션 수수료의 일부가 프로토콜 트레저리로 귀속됩니다. 트레저리는 온체인 거버넌스로 개발 자금 등에 사용됩니다.", en: "A portion of transaction fees goes to the on-chain treasury, which funds protocol development via governance." },
          { ko: "소각 메커니즘 없음. 총 공급량 450억 ADA, 유통량 약 360억 ADA로 인플레이션 압력은 크지 않은 편입니다.", en: "No burn mechanism. Total supply is 45B ADA, circulating ~36B. Inflation pressure is moderate." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "2021년 Alonzo 하드포크로 스마트 컨트랙트가 도입됐으나, Plutus 언어의 학습 장벽으로 개발자 유입이 제한적입니다.", en: "Smart contracts launched in 2021 (Alonzo), but the Plutus language has a steep learning curve, limiting developer adoption." },
          { ko: "Hydra(L2 오프체인) 개발 중이나 상용화는 지연되고 있습니다. 현재 DeFi TVL은 전체 체인 중 20위권 밖입니다.", en: "Hydra (L2 off-chain scaling) is in development but delayed. Current DeFi TVL is outside the top 20 chains." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 수익이 있으나, 생태계 활동이 미미해 수수료 기반 수익은 무의미한 수준입니다. 토큰 가치 상승은 새로운 채택에 의존합니다.", en: "Staking yield exists, but ecosystem activity is minimal, making fee-based returns insignificant. Token appreciation depends entirely on new adoption." },
        ],
      },
    ],
    sources: [
      { label: "Cardano Docs", url: "https://docs.cardano.org" },
      { label: "Cardano Explorer (스테이킹)", url: "https://cardanoscan.io" },
      { label: "Messari: ADA", url: "https://messari.io/asset/cardano" },
    ],
  },

  DOGE: {
    type: "opinion",
    summary: {
      ko: "도지코인은 2013년 밈으로 시작한 인플레이션 코인입니다. 연간 50억 개씩 무한 발행되고, 스테이킹도 소각도 바이백도 없습니다. 일론 머스크가 트위터/X 결제에 도입할 것이라는 기대가 있었으나 아직 실현되지 않았습니다. 순수한 커뮤니티 투기 자산입니다.",
      en: "Dogecoin is an inflationary coin that started as a meme in 2013. 5 billion new DOGE are minted annually with no staking, no burn, and no buyback. The hope of Elon Musk integrating DOGE into Twitter/X payments has yet to materialize. It is a pure community speculation asset.",
    },
    verdict: {
      ko: "투자 근거 없음. 순수 투기 자산.",
      en: "No investment thesis. Pure speculation.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "연간 50억 DOGE 고정 발행 (무한 공급). 보유할수록 희석되는 구조입니다.", en: "5 billion DOGE minted annually with no supply cap. Holding means constant dilution." },
          { ko: "스테이킹 없음. 소각 없음. 바이백 없음. 거버넌스 없음. 개발팀 사실상 없음(자원봉사 유지관리 수준).", en: "No staking. No burn. No buyback. No governance. No real dev team (volunteer maintenance only)." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "일론 머스크는 여러 차례 DOGE를 언급했으나, 실제 X(트위터) 결제 도입은 이루어지지 않았습니다.", en: "Elon Musk has mentioned DOGE multiple times, but actual integration into X payments has not happened." },
          { ko: "Mark Cuban 등 일부 유명인이 결제 수단으로 수용했으나 실사용 규모는 미미합니다.", en: "Some celebrities like Mark Cuban accept DOGE payments, but real-world use remains negligible." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "DOGE 가격은 일론 머스크의 트윗과 시장 심리에만 반응합니다. 구조적 가치 연결이 전혀 없습니다.", en: "DOGE price responds only to Elon Musk tweets and market sentiment. There is zero structural value connection." },
        ],
      },
    ],
    sources: [
      { label: "Dogecoin.com", url: "https://dogecoin.com" },
      { label: "Messari: DOGE", url: "https://messari.io/asset/dogecoin" },
    ],
  },

  POL: {
    type: "opinion",
    summary: {
      ko: "폴리곤(구 MATIC)은 2023년 POL로 리브랜딩하며 '모든 체인의 밸리데이터'를 지향하는 Polygon 2.0 비전을 발표했습니다. AggLayer로 체인을 통합하는 야심찬 계획이지만, POL 토큰이 이 성공을 어떻게 포착할지는 여전히 불명확합니다. 스테이킹 수익(약 4~5%)은 있습니다.",
      en: "Polygon (formerly MATIC) rebranded to POL in 2023, announcing Polygon 2.0 with the vision of becoming a 'validator for all chains.' The AggLayer aggregation plan is ambitious, but how POL captures that value remains unclear. Staking yield (~4–5%) exists.",
    },
    verdict: {
      ko: "야심찬 비전, 스테이킹 수익 있음. 그러나 AggLayer 성공 시 POL 가치 포착 구조가 불명확.",
      en: "Ambitious vision, staking yield exists. But value capture mechanism for POL from AggLayer success is unclear.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹 수익", en: "① Tokenomics — Holder Return: Staking Yield" },
        rating: "neutral",
        items: [
          { ko: "POL 스테이킹으로 약 4~5% APY 수익. 검증자로 직접 운영하거나 위임도 가능합니다.", en: "POL staking yields ~4–5% APY. Can operate as validator or delegate." },
          { ko: "Polygon 2.0 비전에서 POL은 'restakeable' 토큰으로, 여러 체인의 검증에 동시에 사용될 수 있습니다. 이는 토큰 수요를 늘릴 수 있습니다.", en: "In the Polygon 2.0 vision, POL is 'restakeable' — it can simultaneously secure multiple chains, potentially increasing token demand." },
          { ko: "그러나 이 구조가 실제로 운영되기까지 시간이 필요하고, 최종적으로 홀더 수익이 얼마나 될지는 확정되지 않았습니다.", en: "However, this structure takes time to implement, and the final holder yield is not yet defined." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "AggLayer는 여러 ZK 체인을 하나로 연결하는 통합 레이어로, 실제 기업 파트너십이 다수입니다 (Sony, Starbucks NFT 등).", en: "AggLayer connects multiple ZK chains into a unified layer. Real enterprise partnerships include Sony and Starbucks NFT programs." },
          { ko: "Polygon zkEVM: 이더리움 호환 ZK Rollup. zkEVM의 기술력은 업계에서 인정받고 있습니다.", en: "Polygon zkEVM is an Ethereum-compatible ZK Rollup with recognized technical credibility in the industry." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "Polygon 2.0 비전이 실현되면 POL의 restaking 수요가 늘어 토큰 수요가 증가할 수 있습니다. 단, 아직 구현 초기 단계입니다.", en: "If Polygon 2.0 materializes, restaking demand could drive POL demand. But implementation is still early stage." },
        ],
      },
    ],
    sources: [
      { label: "Polygon 2.0 Blog", url: "https://polygon.technology/blog/polygon-2-0" },
      { label: "Messari: POL", url: "https://messari.io/asset/polygon" },
      { label: "L2Beat: Polygon zkEVM", url: "https://l2beat.com/scaling/projects/polygon-zkevm" },
    ],
  },

  LINK: {
    type: "opinion",
    summary: {
      ko: "체인링크는 블록체인의 외부 데이터 공급(오라클) 시장에서 사실상 독점적 지위를 가진 인프라입니다. 2022년 말 스테이킹 v0.1이 출시됐고, 이후 v0.2(약 4~5% APY)로 확대됐습니다. 그러나 스테이킹 용량이 제한적이고, 프로토콜 수익이 토큰 홀더에게 직접 분배되는 구조는 아직 없습니다.",
      en: "Chainlink holds a near-monopoly position in the blockchain oracle (external data feed) market. Staking v0.1 launched in late 2022, expanded to v0.2 (~4–5% APY). However, staking capacity is limited and protocol revenue is not yet directly distributed to token holders.",
    },
    verdict: {
      ko: "독보적 인프라, 스테이킹 수익 있음. 하지만 수익 분배 구조 미완성.",
      en: "Unrivaled infrastructure, staking yield exists. But revenue distribution to holders is still incomplete.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 제한적 스테이킹", en: "① Tokenomics — Holder Return: Limited Staking" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 v0.2: 약 4~5% APY. 그러나 스테이킹 가능 한도가 제한적이라 전체 LINK 중 극히 일부만 스테이킹됩니다.", en: "Staking v0.2 offers ~4–5% APY, but capacity limits mean only a small fraction of total LINK can be staked." },
          { ko: "CCIP(크로스체인 통신 프로토콜) 수수료가 증가하고 있으나, 이 수익이 LINK 홀더에게 분배되는 구조는 현재 없습니다.", en: "CCIP (Cross-Chain Interoperability Protocol) fee revenue is growing, but there is currently no structure to distribute this to LINK holders." },
          { ko: "SmartCon 등에서 수익 공유 로드맵이 언급됐으나 구체적 시기와 방법은 미정입니다.", en: "A revenue-sharing roadmap has been mentioned at SmartCon and other events, but timing and specifics remain undefined." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "DeFi의 90% 이상이 체인링크 가격 피드를 사용합니다. 대체 불가능한 인프라 수준의 채택률입니다.", en: "Over 90% of DeFi uses Chainlink price feeds. This is infrastructure-level adoption that is effectively irreplaceable." },
          { ko: "CCIP는 은행·금융기관이 체인링크를 기업용 크로스체인 메시지 프로토콜로 채택하는 근거가 됩니다. SWIFT와의 협력도 발표됐습니다.", en: "CCIP positions Chainlink as an enterprise cross-chain messaging layer. Collaboration with SWIFT was announced." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "현재는 연결 구조가 불완전합니다. 수익 분배가 본격화되면 LINK는 강력한 매수 근거를 갖게 됩니다. 그 시점이 관건입니다.", en: "The connection is currently incomplete. When revenue sharing is fully implemented, LINK will have a strong buy thesis. The timing is the key variable." },
        ],
      },
    ],
    sources: [
      { label: "Chainlink Docs", url: "https://docs.chain.link" },
      { label: "Chainlink Staking v0.2", url: "https://chain.link/economics/staking" },
      { label: "Messari: LINK", url: "https://messari.io/asset/chainlink" },
    ],
  },

  DOT: {
    type: "opinion",
    summary: {
      ko: "폴카닷은 파라체인 경매를 통한 멀티체인 생태계를 비전으로 합니다. 스테이킹 수익률이 약 14%로 매우 높지만, 파라체인 경매 모델이 Coretime 모델로 전환되는 과도기에 있으며 생태계 성장이 기대에 미치지 못하고 있습니다.",
      en: "Polkadot's vision is a multi-chain ecosystem via parachain auctions. Staking yield is high (~14%), but the parachain auction model is transitioning to a Coretime model, and ecosystem growth has underperformed expectations.",
    },
    verdict: {
      ko: "높은 스테이킹 수익, 기술력 인정. 그러나 생태계 채택 부진이 지속되면 가치 상승 근거 약화.",
      en: "High staking yield, strong technology. But continued ecosystem underperformance weakens the appreciation thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 높은 스테이킹 수익", en: "① Tokenomics — Holder Return: High Staking Yield" },
        rating: "good",
        items: [
          { ko: "노미네이터(위임) 스테이킹 수익률 약 14% APY. 암호화폐 주요 체인 중 최상위 수준입니다.", en: "Nominator (delegated) staking yields ~14% APY — among the highest of major blockchain networks." },
          { ko: "파라체인 슬롯 경매에 DOT이 락업되어 유통량이 줄어드는 효과가 있었습니다. 단, Coretime 모델 전환 후 이 효과는 감소합니다.", en: "DOT was locked up in parachain slot auctions, reducing circulating supply. This effect decreases as Coretime replaces auctions." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "폴카닷 SDK(구 Substrate)는 다양한 블록체인 구축에 사용됩니다. 기술력 자체는 높이 평가받습니다.", en: "The Polkadot SDK (formerly Substrate) is used to build various blockchains. The technology itself is highly regarded." },
          { ko: "그러나 Moonbeam, Acala 등 주요 파라체인의 사용자 수와 TVL은 기대치를 크게 밑돌고 있습니다.", en: "However, major parachains like Moonbeam and Acala have significantly underperformed in user count and TVL." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "높은 스테이킹 APY는 단기 홀더에게 매력적이지만, 그 수익 재원은 DOT 신규 발행(인플레이션)입니다. 생태계 성장 없이는 인플레이션 희석이 발생합니다.", en: "High APY is attractive, but the source of that yield is new DOT issuance (inflation). Without ecosystem growth, this creates dilution." },
        ],
      },
    ],
    sources: [
      { label: "Polkadot Wiki", url: "https://wiki.polkadot.network" },
      { label: "Messari: DOT", url: "https://messari.io/asset/polkadot" },
      { label: "DotSama 생태계 트래커", url: "https://dotmarketcap.com" },
    ],
  },

  AVAX: {
    type: "opinion",
    summary: {
      ko: "아발란체는 수수료 전액 소각 + 스테이킹 수익(약 8~9%)을 동시에 제공하는, 토크노믹스 측면에서 주요 L1 중 가장 우수한 설계 중 하나입니다. AWS·JP모건 등 기업 채택 사례도 있습니다. 다만 수수료 소각 속도가 인플레이션 대비 아직 낮습니다.",
      en: "Avalanche offers both full transaction fee burning and staking rewards (~8–9%) — one of the best-designed tokenomics among major L1s. Enterprise adoption (AWS, JP Morgan) exists. However, burn rate still lags behind inflation.",
    },
    verdict: {
      ko: "L1 중 최상급 토크노믹스. 소각 + 스테이킹 구조가 생태계 성장과 연동됨.",
      en: "Best-tier tokenomics among L1s. Burn + staking structure is genuinely tied to ecosystem growth.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 소각 + 스테이킹", en: "① Tokenomics — Holder Return: Burn + Staking" },
        rating: "good",
        items: [
          { ko: "모든 트랜잭션 수수료가 100% 소각됩니다. 네트워크 활동이 증가할수록 AVAX 공급이 줄어드는 구조입니다.", en: "100% of transaction fees are burned. More network activity directly reduces AVAX supply." },
          { ko: "스테이킹 수익률 약 8~9% APY. 최소 스테이킹 기간은 2주입니다.", en: "Staking yield ~8–9% APY. Minimum staking period is 2 weeks." },
          { ko: "총 공급 한도: 7억 2,000만 AVAX. 소각이 충분히 쌓이면 실질적 디플레이션 코인이 됩니다.", en: "Total supply is capped at 720 million AVAX. Sufficient burn accumulation could make it deflationary." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "AWS와 파트너십으로 아발란체 서브넷 배포 서비스 제공. 기업이 커스텀 블록체인을 쉽게 구축할 수 있습니다.", en: "AWS partnership enables easy Avalanche subnet deployment. Enterprises can build custom blockchains with minimal friction." },
          { ko: "JP모건의 Onyx 프로젝트, 블랙록 펀드 토큰화 등 TradFi 채택 사례 보유.", en: "TradFi adoption includes JP Morgan's Onyx project and BlackRock fund tokenization." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 네트워크 활동 증가 → 수수료 소각 증가 → 유통량 감소 → 가격 상승 압력. 주요 L1 중 가장 명확한 가치 포착 구조입니다.", en: "Connected. More network activity → more fee burns → less supply → price appreciation pressure. The clearest value capture structure among major L1s." },
        ],
      },
    ],
    sources: [
      { label: "Avalanche Docs", url: "https://docs.avax.network" },
      { label: "Avascan (소각 현황)", url: "https://avascan.info" },
      { label: "Messari: AVAX", url: "https://messari.io/asset/avalanche" },
    ],
  },

  TRX: {
    type: "opinion",
    summary: {
      ko: "트론은 USDT 전송량 기준으로 전 세계 1위 블록체인입니다. 소각 메커니즘과 스테이킹(약 4~6% APY)이 있어 토크노믹스 설계는 나쁘지 않습니다. 그러나 저스틴 선의 중앙화 논란, SEC 고소, 불투명한 거버넌스가 장기 투자를 어렵게 합니다.",
      en: "TRON is the world's #1 blockchain by USDT transfer volume. It has burn mechanics and staking (~4–6% APY), making its tokenomics reasonable. However, Justin Sun's centralization controversies, SEC charges, and opaque governance make long-term investment difficult.",
    },
    verdict: {
      ko: "토크노믹스는 나쁘지 않음. 저스틴 선 리스크가 모든 것을 압도함.",
      en: "Tokenomics are decent. Justin Sun risk overshadows everything.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 소각 + 스테이킹", en: "① Tokenomics — Holder Return: Burn + Staking" },
        rating: "neutral",
        items: [
          { ko: "TRX를 스테이킹(프리징)하면 Energy 또는 Bandwidth 리소스를 얻어 수수료 없이 트랜잭션이 가능하고, TRON DAO 거버넌스 투표권도 얻습니다.", en: "Staking (freezing) TRX grants Energy or Bandwidth resources for fee-free transactions, plus TRON DAO governance votes." },
          { ko: "스테이킹 보상 APY는 약 4~6%. 수수료 중 일부가 소각되어 TRX 유통량이 점진적으로 감소합니다.", en: "Staking APY is ~4–6%. A portion of fees are burned, gradually reducing TRX circulating supply." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "개발도상국 중심으로 USDT 전송에 TRON이 압도적으로 사용됩니다. 이더리움 대비 수수료가 1/100 수준이기 때문입니다.", en: "TRON is overwhelmingly used for USDT transfers in developing countries due to fees ~100x cheaper than Ethereum." },
          { ko: "일일 온체인 트랜잭션 수 기준으로 전체 블록체인 중 최상위권을 유지하고 있습니다.", en: "TRON consistently ranks at the top of all blockchains by daily on-chain transaction count." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "저스틴 선이 TRX 전체 공급의 상당 부분을 직접 보유합니다. 그의 의사결정이 곧 토큰 경제입니다. 신뢰 기반 투자가 불가능합니다.", en: "Justin Sun directly controls a large share of TRX supply. His decisions ARE the token economy. Trust-based investment is impossible." },
          { ko: "SEC가 2023년 저스틴 선과 트론 재단을 증권법 위반 혐의로 기소했습니다. 법적 리스크가 상존합니다.", en: "The SEC charged Justin Sun and the Tron Foundation with securities violations in 2023. Legal risk is ongoing." },
        ],
      },
    ],
    sources: [
      { label: "TRON Network", url: "https://tron.network" },
      { label: "TronScan (온체인 통계)", url: "https://tronscan.org" },
      { label: "SEC v. Sun/Tron", url: "https://www.sec.gov/news/press-release/2023-59" },
      { label: "Messari: TRX", url: "https://messari.io/asset/tron" },
    ],
  },

  SHIB: {
    type: "opinion",
    summary: {
      ko: "시바이누는 도지코인에서 영감을 받은 밈코인입니다. ShibaSwap DEX와 소각 포털, Shibarium L2를 출시하며 생태계 구축을 시도하고 있지만, 총 공급량(589조 개) 대비 소각 속도는 무의미한 수준입니다. 순수 투기 자산입니다.",
      en: "Shiba Inu is a meme coin inspired by Dogecoin. Despite launching ShibaSwap, a burn portal, and Shibarium L2, the burn rate is negligible relative to the astronomical total supply (589 trillion tokens). Pure speculation asset.",
    },
    verdict: {
      ko: "투자 근거 없음. 소각 속도가 공급량 대비 의미 없음.",
      en: "No investment thesis. Burn rate is meaningless relative to total supply.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 사실상 0%", en: "① Tokenomics — Holder Return Rate: Effectively 0%" },
        rating: "bad",
        items: [
          { ko: "총 공급량: 589조 SHIB. 소각 포털에서 하루 수십억 개를 소각해도 전체 공급량 대비 0.001%에도 미치지 못합니다.", en: "Total supply: 589 trillion SHIB. Even burning billions per day through the burn portal doesn't dent the supply meaningfully." },
          { ko: "ShibaSwap 스테이킹은 존재하나, 실제 TVL과 거래량은 미미하고 보상 APY도 의미 있는 수준이 아닙니다.", en: "ShibaSwap staking exists, but actual TVL and volume are negligible, and APY rewards are not meaningful." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Shibarium L2는 2023년 출시됐으나 일일 트랜잭션 수가 매우 낮습니다.", en: "Shibarium L2 launched in 2023 but has very low daily transaction counts." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "연결 없음. SHIB 가격은 오로지 밈 커뮤니티의 집단 심리에 달려 있습니다.", en: "No connection. SHIB price depends entirely on meme community collective sentiment." },
        ],
      },
    ],
    sources: [
      { label: "Shiba Inu Burn Portal", url: "https://shibburn.com" },
      { label: "Shibarium Stats", url: "https://www.shibariumscan.io" },
      { label: "Messari: SHIB", url: "https://messari.io/asset/shiba-inu" },
    ],
  },

  LTC: {
    type: "opinion",
    summary: {
      ko: "라이트코인은 2011년 출시된 비트코인의 클론으로, 더 빠른 블록 생성(2.5분)과 Scrypt 알고리즘이 특징입니다. 최대 공급 8,400만 LTC, 반감기 구조. 그러나 새로운 기술 혁신 없이 'BTC보다 빠른 것'이라는 포지션은 이제 의미를 잃었습니다.",
      en: "Litecoin is a Bitcoin clone from 2011 with faster block times (2.5 min) and Scrypt algorithm. Max supply 84M LTC with a halving cycle. However, the 'faster than BTC' positioning has lost its relevance with no new technical innovation.",
    },
    verdict: {
      ko: "혁신 없음. 홀더 환원 없음. 역할이 없어진 체인.",
      en: "No innovation. No holder return. A chain that has lost its purpose.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "스테이킹 없음(PoW). 소각 없음. 바이백 없음. 마이너만 수익을 얻는 구조입니다.", en: "No staking (PoW). No burn. No buyback. Only miners earn rewards." },
          { ko: "MWEB(MimbleWimble) 프라이버시 기능이 2022년 추가됐으나, 이를 이유로 바이낸스US 등 일부 거래소에서 상장폐지됐습니다.", en: "MWEB (MimbleWimble) privacy was added in 2022, but led to delistings at exchanges like Binance US over compliance concerns." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "결제 코인으로서의 역할은 이미 USDT/USDC 스테이블코인에 대체됐습니다. 새로운 개발 방향이 보이지 않습니다.", en: "Its role as a payment coin has been replaced by USDT/USDC stablecoins. No clear new development direction." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "프로토콜 성공 시나리오 자체가 없습니다. 가격은 시장 심리와 반감기 기대에만 의존합니다.", en: "There is no protocol success scenario. Price depends only on market sentiment and halving anticipation." },
        ],
      },
    ],
    sources: [
      { label: "Litecoin.org", url: "https://litecoin.org" },
      { label: "Messari: LTC", url: "https://messari.io/asset/litecoin" },
    ],
  },

  BCH: {
    type: "opinion",
    summary: {
      ko: "비트코인 캐시는 2017년 블록 크기 논쟁으로 비트코인에서 분리된 포크입니다. 큰 블록(32MB)으로 더 많은 트랜잭션을 저렴하게 처리하는 것이 목표였으나, 개발자와 사용자 이탈로 현재는 소수 채굴자가 유지하는 레거시 체인 수준으로 전락했습니다.",
      en: "Bitcoin Cash is a Bitcoin fork from the 2017 block size debate. Its goal was cheaper, higher-throughput transactions via larger blocks (32MB), but developer and user exodus has reduced it to a legacy chain maintained by a small group of miners.",
    },
    verdict: {
      ko: "실패한 포크. 투자 근거 없음.",
      en: "Failed fork. No investment thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "PoW 채굴 구조로 스테이킹 없음. 소각 없음. 마이너 외 홀더에게 수익 없음.", en: "PoW mining structure — no staking, no burn, no yield for non-miners." },
          { ko: "2018년 BCH에서 BSV(비트코인 SV)가 다시 분리됐습니다. 이 분쟁이 커뮤니티와 개발자를 대거 이탈시켰습니다.", en: "In 2018, BSV (Bitcoin SV) split from BCH. This dispute drove away a large portion of the community and developers." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "SmartBCH(EVM 사이드체인) 프로젝트가 2023년 실질적으로 사망했습니다.", en: "The SmartBCH EVM sidechain project effectively died in 2023." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "성공 시나리오가 없습니다. BTC 반감기와 함께 단기 상승하는 패턴 외에 독립적 가치 상승 근거가 없습니다.", en: "No success scenario. No independent price appreciation thesis beyond following BTC's halving cycles." },
        ],
      },
    ],
    sources: [
      { label: "Bitcoin.com", url: "https://www.bitcoin.com" },
      { label: "Messari: BCH", url: "https://messari.io/asset/bitcoin-cash" },
    ],
  },

  ETC: {
    type: "opinion",
    summary: {
      ko: "이더리움 클래식은 2016년 DAO 해킹 복구를 거부한 세력이 이더리움에서 분리한 체인입니다. '코드는 법이다'는 철학을 고수하지만, 2020년 51% 공격을 세 차례나 당했습니다. 이더리움이 PoS로 전환한 이후 PoW 마이너들의 일부가 유입됐지만 생태계는 여전히 침체 상태입니다.",
      en: "Ethereum Classic is the chain that refused the DAO hack rollback in 2016. It upholds 'code is law' but suffered three 51% attacks in 2020. After Ethereum's PoS transition, some PoW miners migrated to ETC, but the ecosystem remains stagnant.",
    },
    verdict: {
      ko: "이념적 가치 외 투자 근거 없음. 51% 공격 취약성이 신뢰도 저해.",
      en: "No investment thesis beyond ideological value. 51% attack vulnerability undermines credibility.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "PoW 구조로 스테이킹 없음. 소각 없음. 마이너만 수익을 얻습니다.", en: "PoW structure — no staking, no burn, only miners earn." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "2020년 8월 단 한 달에 세 차례 51% 공격을 받아 수천만 달러 손실 발생. 해시레이트가 낮아 공격 비용이 저렴합니다.", en: "Three 51% attacks occurred in a single month (August 2020), causing tens of millions in losses. Low hashrate makes attacks cheap." },
          { ko: "이더리움 생태계와의 호환성 주장도 사실상 의미를 잃었습니다. 개발 활동은 거의 없습니다.", en: "Claims of Ethereum compatibility have lost practical meaning. Development activity is near zero." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "성공 시나리오 없음. ETC 가격은 ETH/BTC 시장 심리에 수동적으로 따라가는 수준입니다.", en: "No success scenario. ETC price passively follows ETH/BTC market sentiment." },
        ],
      },
    ],
    sources: [
      { label: "Ethereum Classic", url: "https://ethereumclassic.org" },
      { label: "51% 공격 분석", url: "https://blog.coinbase.com/ethereum-classic-etc-is-currently-being-51-attacked-33be13ce32de" },
      { label: "Messari: ETC", url: "https://messari.io/asset/ethereum-classic" },
    ],
  },

  ATOM: {
    type: "opinion",
    summary: {
      ko: "코스모스는 IBC(Inter-Blockchain Communication)로 연결되는 '블록체인의 인터넷'을 구현했습니다. 스테이킹 수익률은 약 14~15%로 높습니다. 그러나 코스모스 생태계의 가치가 ATOM 토큰으로 포착되지 않는다는 근본적 문제가 있습니다. IBC를 쓰는 데 ATOM이 필요하지 않기 때문입니다.",
      en: "Cosmos implemented the 'Internet of Blockchains' via IBC. Staking yield is high (~14–15%). However, there is a fundamental problem: ecosystem value does not flow to the ATOM token because IBC usage does not require ATOM.",
    },
    verdict: {
      ko: "높은 스테이킹 수익이나 인플레이션 재원. 생태계 성공이 ATOM으로 포착되지 않음.",
      en: "High staking yield but inflation-funded. Ecosystem success does not accrue to ATOM.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 높은 스테이킹, 높은 인플레이션", en: "① Tokenomics — Holder Return: High Staking, High Inflation" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 APY 약 14~15%. 단, 이 수익의 재원은 신규 ATOM 발행입니다. 스테이킹하지 않으면 보유 지분이 희석됩니다.", en: "Staking APY ~14–15%. But this is funded by new ATOM issuance. Not staking means your holdings dilute." },
          { ko: "인터체인 시큐리티(ICS): 소비자 체인이 ATOM 검증자 세트를 빌려 사용하고 ATOM으로 수수료를 냅니다. 이 수익이 스테이커에게 분배됩니다. 다만 현재 규모는 작습니다.", en: "Interchain Security (ICS): consumer chains lease ATOM validator security and pay fees in ATOM, distributed to stakers. The scale is still small." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "IBC는 100개 이상의 체인이 연결된 실제 작동하는 크로스체인 통신 표준입니다. Osmosis, dYdX 등 주요 앱이 코스모스 위에서 운영됩니다.", en: "IBC is a working cross-chain communication standard with 100+ connected chains. Major apps like Osmosis and dYdX run on Cosmos." },
          { ko: "dYdX가 코스모스 기반 독립 체인으로 이전했으나, 수수료를 ATOM이 아닌 자체 토큰으로 냈습니다. 이것이 가치 포착 문제를 드러냅니다.", en: "dYdX migrated to a Cosmos-based chain but pays fees in its own token, not ATOM — illustrating the value capture problem." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "IBC를 쓰기 위해 ATOM이 필요 없습니다. 코스모스 생태계가 성장해도 그 수익이 ATOM으로 자동 유입되지 않습니다. 이것이 ATOM의 근본적 약점입니다.", en: "Using IBC does not require ATOM. Cosmos ecosystem growth does not automatically flow value to ATOM. This is ATOM's fundamental weakness." },
        ],
      },
    ],
    sources: [
      { label: "Cosmos Network", url: "https://cosmos.network" },
      { label: "Map of Zones (IBC 통계)", url: "https://mapofzones.com" },
      { label: "Messari: ATOM", url: "https://messari.io/asset/cosmos" },
    ],
  },

  UNI: {
    type: "opinion",
    summary: {
      ko: "유니스왑은 전 세계 최대 탈중앙화 거래소(DEX)입니다. TVL과 거래량에서 압도적 1위이며, 2024년 5월 마침내 수수료 분배(Fee Switch)가 거버넌스에서 가결됐습니다. UNI 스테이커/위임자에게 프로토콜 수수료 일부가 분배됩니다. 처음으로 투자 근거가 생긴 거버넌스 토큰입니다.",
      en: "Uniswap is the world's largest DEX by TVL and volume. In May 2024, the fee switch governance vote finally passed, directing a portion of protocol fees to UNI stakers/delegates. This marks the first time a major governance token has an actual revenue-sharing mechanism.",
    },
    verdict: {
      ko: "최초로 수수료 분배를 활성화한 주요 거버넌스 토큰. 실행 여부를 주목해야 함.",
      en: "First major governance token to activate fee sharing. Watch the implementation closely.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 수수료 분배 가결", en: "① Tokenomics — Holder Return: Fee Switch Passed" },
        rating: "good",
        items: [
          { ko: "2024년 5월, Uniswap DAO에서 프로토콜 수수료의 일부를 UNI 스테이커에게 분배하는 제안이 통과됐습니다. 이는 ARB·OP와 달리 실제 수익 환원이 이루어지는 최초 사례입니다.", en: "In May 2024, Uniswap DAO passed a proposal to distribute a portion of protocol fees to UNI stakers — the first real revenue-sharing activation among major governance tokens, unlike ARB or OP." },
          { ko: "유니스왑의 연간 프로토콜 수수료는 수억 달러 수준입니다. 이 중 일부가 홀더에게 분배될 경우 UNI는 실질 수익 자산이 됩니다.", en: "Uniswap's annual protocol fees are in the hundreds of millions of dollars. A portion going to holders would make UNI a genuine yield asset." },
          { ko: "단, 구현 세부사항, 규제 리스크(수익 분배 시 증권 해석 가능성), 시행 시기는 지속 모니터링이 필요합니다.", en: "However, implementation details, regulatory risk (revenue sharing may trigger securities classification), and timing all require continued monitoring." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "UniswapX(크로스체인 스왑), Uniswap v4(훅 기능)로 기술 우위를 계속 확장 중입니다.", en: "UniswapX (cross-chain swaps) and Uniswap v4 (hooks) continue to extend its technical lead." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 수수료 분배가 실제로 이루어지면 UNI는 프로토콜 수익에 대한 구조적 권리를 가진 최초의 주요 DEX 토큰이 됩니다.", en: "Connected — if fee distribution is actually implemented, UNI becomes the first major DEX token with a structural claim on protocol revenue." },
        ],
      },
    ],
    sources: [
      { label: "Uniswap Governance Forum", url: "https://gov.uniswap.org" },
      { label: "Fee Switch 제안 (Tally)", url: "https://www.tally.xyz/gov/uniswap" },
      { label: "Token Terminal: Uniswap Revenue", url: "https://tokenterminal.com/terminal/projects/uniswap" },
      { label: "Messari: UNI", url: "https://messari.io/asset/uniswap" },
    ],
  },

  APT: {
    type: "opinion",
    summary: {
      ko: "앱토스는 메타(구 페이스북)의 Diem 프로젝트 출신 팀이 만든 L1입니다. Move 언어 기반의 기술력과 마이크로소프트 파트너십이 있습니다. 스테이킹(약 7% APY)이 있지만, 초기 물량의 높은 팀/VC 배분과 지속적 인플레이션이 토큰 가치를 희석합니다.",
      en: "Aptos is an L1 built by the former Meta (Diem/Libra) team. It has technical strength with the Move language and a Microsoft partnership. Staking (~7% APY) exists, but heavy team/VC token allocations and ongoing inflation dilute token value.",
    },
    verdict: {
      ko: "기술력과 파트너십은 있으나 팀/VC 물량 부담과 인플레이션이 장기 투자를 어렵게 함.",
      en: "Strong tech and partnerships, but team/VC supply overhang and inflation make long-term investment difficult.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹, 높은 인플레이션 상쇄", en: "① Tokenomics — Holder Return: Staking Offset by High Inflation" },
        rating: "bad",
        items: [
          { ko: "스테이킹 APY 약 7%. 그러나 연간 인플레이션율도 약 7%로, 실질 수익은 거의 0에 가깝습니다.", en: "Staking APY ~7%. But annual inflation is also ~7%, making real yield close to zero." },
          { ko: "총 공급량의 약 51%가 팀, 투자자, Aptos Foundation에 배분됐습니다. 지속적 언락으로 매도 압력이 상존합니다.", en: "~51% of total supply was allocated to team, investors, and the Aptos Foundation. Continuous unlocks create persistent sell pressure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "마이크로소프트 Azure와의 파트너십으로 기업용 블록체인 서비스를 제공하고 있습니다. 한국 카카오·SK텔레콤 파트너십도 있습니다.", en: "Microsoft Azure partnership for enterprise blockchain services. Korean partnerships with Kakao and SK Telecom also exist." },
          { ko: "Move 언어는 자원 안전성이 높아 이론적으로 보안상 우수하지만, 개발자 생태계는 Solana·Ethereum 대비 훨씬 작습니다.", en: "Move language offers superior resource safety in theory, but the developer ecosystem is far smaller than Solana or Ethereum." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "프로토콜이 성장해도 VC/팀 매도 물량이 지속되는 한 토큰 가격 상승은 제한됩니다. 완전 언락까지 수년이 걸립니다.", en: "Even with protocol growth, VC/team sell pressure will cap price appreciation until full unlock, which takes years." },
        ],
      },
    ],
    sources: [
      { label: "Aptos Labs", url: "https://aptoslabs.com" },
      { label: "Aptos Explorer (스테이킹)", url: "https://explorer.aptoslabs.com" },
      { label: "Messari: APT", url: "https://messari.io/asset/aptos" },
    ],
  },

  SUI: {
    type: "opinion",
    summary: {
      ko: "수이는 앱토스와 같은 Move 언어 계열이지만 Mysten Labs가 독자 개발한 L1입니다. 오브젝트 기반 저장 모델이 기술적 차별점이며, 생태계 성장 속도는 앱토스보다 빠릅니다. 그러나 토크노믹스 문제(팀/VC 물량, 인플레이션)는 APT와 유사합니다.",
      en: "Sui uses Move-inspired language independently developed by Mysten Labs. Its object-based storage model is a technical differentiator, and ecosystem growth is faster than Aptos. However, tokenomics concerns (team/VC allocations, inflation) are similar to APT.",
    },
    verdict: {
      ko: "APT보다 생태계 성장은 빠르나, 팀/VC 매도 압력 문제는 동일.",
      en: "Faster ecosystem growth than APT, but same team/VC sell pressure problem.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹, 인플레이션 희석", en: "① Tokenomics — Holder Return: Staking, Inflation Dilution" },
        rating: "bad",
        items: [
          { ko: "스테이킹 APY 약 3~4%. 초기 유통량이 적고 계속 언락 중이라 인플레이션 압력이 높습니다.", en: "Staking APY ~3–4%. Low initial float with ongoing unlocks creates high inflation pressure." },
          { ko: "Sui Foundation과 팀/투자자가 총 공급량의 약 52%를 보유합니다. 장기 언락 일정으로 지속적 매도 압력이 예상됩니다.", en: "Sui Foundation and team/investors hold ~52% of total supply. Long-term unlock schedule means persistent sell pressure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "2024년 DEX 거래량과 TVL 성장 속도가 주요 신규 체인 중 가장 빠른 편에 속합니다.", en: "In 2024, DEX volume and TVL growth ranked among the fastest of any new chain." },
          { ko: "zkLogin: 구글·애플 계정으로 Web3 앱 로그인 가능. 온보딩 경험 개선에서 선도적입니다.", en: "zkLogin enables Web3 app login with Google/Apple accounts — a leading UX innovation for crypto onboarding." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "수수료 소각 메커니즘이 부분적으로 존재하지만, 언락 물량 압력 때문에 생태계 성장이 토큰 가격으로 전환되는 데 시간이 걸립니다.", en: "Partial fee burn mechanism exists, but unlock supply pressure means ecosystem growth takes time to translate into price appreciation." },
        ],
      },
    ],
    sources: [
      { label: "Sui Network", url: "https://sui.io" },
      { label: "Suiscan (온체인 통계)", url: "https://suiscan.xyz" },
      { label: "Messari: SUI", url: "https://messari.io/asset/sui" },
    ],
  },

  ICP: {
    type: "opinion",
    summary: {
      ko: "인터넷 컴퓨터(ICP)는 블록체인 위에서 웹 애플리케이션 전체를 실행하겠다는 야심찬 프로젝트입니다. NNS(네트워크 신경계) 거버넌스에 잠금하면 최대 30% APY를 얻을 수 있습니다. 그러나 초기 가격 폭락(99%), Dfinity 재단의 대규모 매도, 복잡한 토크노믹스가 신뢰도를 저해합니다.",
      en: "Internet Computer (ICP) is an ambitious project to run entire web applications on blockchain. Locking in NNS governance can yield up to 30% APY. However, the initial 99% price crash, Dfinity Foundation mass selling, and overly complex tokenomics have damaged trust.",
    },
    verdict: {
      ko: "혁신적 비전이나 신뢰 문제와 복잡성으로 장기 투자 판단이 어려움.",
      en: "Innovative vision, but trust issues and excessive complexity make long-term investment assessment difficult.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 높은 스테이킹, 복잡한 구조", en: "① Tokenomics — Holder Return: High Staking, Complex Structure" },
        rating: "neutral",
        items: [
          { ko: "NNS 뉴런에 8년 잠금 시 최대 ~28% APY. 그러나 잠금 기간이 길고, ICP 신규 발행으로 보상이 이루어져 인플레이션 압력이 있습니다.", en: "Up to ~28% APY for 8-year NNS neuron lock. However, rewards are funded by new ICP issuance (inflation), and lock periods are very long." },
          { ko: "ICP는 '사이클'로 전환되어 컴퓨팅 비용으로 소각됩니다. 즉, 네트워크 사용량 증가 시 ICP 소각이 늘어나는 구조입니다.", en: "ICP is converted to 'cycles' (compute credits) which are burned. More network usage = more ICP burned." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "클라우드 서비스 없이 블록체인만으로 풀스택 앱을 운영한다는 개념은 독창적입니다. 일부 dApp이 실제로 운영 중입니다.", en: "Running full-stack apps purely on blockchain without cloud services is a genuinely original concept. Some dApps do run this way." },
          { ko: "출시 시 FDV 기준 시가총액 700억 달러로 평가됐으나 즉시 대규모 하락했습니다. 이후 Dfinity의 물량 매도 의혹이 지속됐습니다.", en: "Launched with a ~$70B FDV valuation that immediately collapsed. Ongoing allegations of Dfinity selling large amounts into the market." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "네트워크 사용량 증가 → ICP 소각 증가의 구조는 있습니다. 그러나 Dfinity 재단의 물량 관리와 신뢰 문제가 해결되지 않으면 시장 신뢰 회복이 어렵습니다.", en: "The burn mechanism (more usage → more ICP burned) is a valid value capture structure. But without resolving Dfinity's supply management and trust issues, market confidence recovery is uncertain." },
        ],
      },
    ],
    sources: [
      { label: "Internet Computer (ICP)", url: "https://internetcomputer.org" },
      { label: "NNS Dashboard", url: "https://dashboard.internetcomputer.org" },
      { label: "Messari: ICP", url: "https://messari.io/asset/internet-computer" },
    ],
  },

  FIL: {
    type: "opinion",
    summary: {
      ko: "파일코인은 탈중앙화 스토리지 네트워크로, 스토리지 제공자가 FIL을 담보로 제공하고 데이터 저장 대가로 FIL을 받습니다. 실제 사용 사례가 있는 몇 안 되는 인프라 코인이지만, 일반 토큰 홀더에게는 직접적 수익 메커니즘이 없습니다. 초기의 높은 인플레이션도 가격을 억눌렀습니다.",
      en: "Filecoin is a decentralized storage network where storage providers stake FIL as collateral and earn FIL for storing data. It's one of the few infrastructure coins with real use cases, but regular token holders have no direct yield mechanism. Early high inflation also suppressed price.",
    },
    verdict: {
      ko: "실사용 인프라지만 일반 홀더에게는 수익 없음. 스토리지 제공자만 수익.",
      en: "Real-use infrastructure, but no yield for regular holders. Only storage providers earn.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (일반 홀더 기준)", en: "① Tokenomics — Holder Return Rate: 0% (regular holders)" },
        rating: "bad",
        items: [
          { ko: "스토리지 제공자(마이너)는 FIL 담보 제공 후 저장 서비스를 제공하며 보상을 받습니다. 그러나 일반 FIL 보유자는 아무런 수익이 없습니다.", en: "Storage providers stake FIL and earn rewards for storing data. But regular FIL holders receive no yield whatsoever." },
          { ko: "초기 6년간 발행 스케줄이 매우 가팔라 극심한 인플레이션이 발생했습니다. 현재는 완화됐지만 여전히 공급 증가 중입니다.", en: "The initial 6-year vesting schedule was very steep, causing extreme inflation. It has moderated but supply continues to increase." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "20EB(엑사바이트) 이상의 스토리지 용량을 보유. NFT 메타데이터, Web3 데이터 보관에 실제로 사용됩니다.", en: "Over 20 exabytes of storage capacity. Actually used for NFT metadata storage, Web3 data archiving." },
          { ko: "FVM(파일코인 가상머신): 스마트 컨트랙트 기능 추가로 스토리지와 DeFi 결합을 시도 중입니다.", en: "FVM (Filecoin Virtual Machine): Smart contract functionality added to combine storage with DeFi." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "네트워크가 성장해도 수익이 마이너에게만 가고 토큰 홀더에게 오지 않습니다. 프로토콜 성공과 토큰 가격의 구조적 연결이 매우 약합니다.", en: "Network growth benefits miners, not token holders. The structural link between protocol success and token price is very weak." },
        ],
      },
    ],
    sources: [
      { label: "Filecoin Docs", url: "https://docs.filecoin.io" },
      { label: "Filfox (온체인 통계)", url: "https://filfox.info" },
      { label: "Messari: FIL", url: "https://messari.io/asset/filecoin" },
    ],
  },

  NEAR: {
    type: "opinion",
    summary: {
      ko: "니어 프로토콜은 샤딩(Nightshade)과 좋은 UX로 주목받는 L1입니다. 수수료의 70%를 소각하고 스테이킹 수익(약 8~10%)도 있습니다. AI 통합 전략과 Telegram 미니앱을 통한 사용자 확장을 시도 중입니다. 소각 + 스테이킹 구조는 긍정적이나 생태계 규모가 작습니다.",
      en: "NEAR Protocol is an L1 known for Nightshade sharding and good UX. It burns 70% of fees and offers staking (~8–10% APY). It's pursuing AI integration and user expansion via Telegram mini-apps. Burn + staking is positive, but ecosystem scale is small.",
    },
    verdict: {
      ko: "소각 + 스테이킹 구조는 긍정적. 생태계 확장 성공 여부가 관건.",
      en: "Burn + staking structure is positive. Success hinges on ecosystem expansion.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 소각 + 스테이킹", en: "① Tokenomics — Holder Return: Burn + Staking" },
        rating: "good",
        items: [
          { ko: "트랜잭션 수수료의 70%가 소각됩니다. 30%는 해당 스마트 컨트랙트 개발자에게 귀속됩니다.", en: "70% of transaction fees are burned. 30% goes to the smart contract developer who deployed that contract." },
          { ko: "스테이킹 APY 약 8~10%. 연간 인플레이션 약 5%를 감안해도 실질 수익이 발생합니다.", en: "Staking APY ~8–10%. Real yield remains positive after ~5% annual inflation." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "NEAR AI: 인공지능 에이전트가 NEAR 체인과 상호작용하는 프레임워크. AI × Web3 내러티브를 선점하려 합니다.", en: "NEAR AI: A framework for AI agents to interact with the NEAR chain. Attempting to capture the AI × Web3 narrative." },
          { ko: "Telegram 미니앱 통합을 통해 사용자 온보딩 장벽을 낮추는 시도를 하고 있습니다.", en: "Telegram mini-app integration aims to lower the user onboarding barrier." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "연결 구조는 있습니다. 그러나 현재 생태계 규모가 작아 수수료 소각 효과가 미미합니다. 대규모 사용자 유입이 수반되어야 의미 있는 가치 상승이 가능합니다.", en: "Value capture structure exists. But current ecosystem scale is small, so fee burns are minimal. Meaningful appreciation requires large-scale user growth." },
        ],
      },
    ],
    sources: [
      { label: "NEAR Docs", url: "https://docs.near.org" },
      { label: "NEAR Explorer", url: "https://explorer.near.org" },
      { label: "Messari: NEAR", url: "https://messari.io/asset/near-protocol" },
    ],
  },

  OP: {
    type: "opinion",
    summary: {
      ko: "옵티미즘은 이더리움 L2 중 두 번째로 큰 네트워크이며, Base(코인베이스), Zora, Worldchain 등 수십 개 체인이 OP 스택을 사용합니다. 그러나 OP 토큰은 순수 거버넌스 토큰으로 ARB와 동일한 문제를 가집니다. 시퀀서 수수료 수익이 홀더에게 돌아오지 않습니다.",
      en: "Optimism is the second-largest Ethereum L2, with dozens of chains using the OP Stack including Base (Coinbase), Zora, and Worldchain. But OP is a pure governance token with the same problem as ARB — sequencer fee revenue does not go to token holders.",
    },
    verdict: {
      ko: "ARB와 동일. 프로토콜 우수, 토큰 보유 이유 없음.",
      en: "Same as ARB. Strong protocol, no reason to hold the token.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "OP는 순수 거버넌스 토큰. 시퀀서 수익은 Optimism Foundation으로 귀속되며 홀더에게 분배되지 않습니다.", en: "OP is a pure governance token. Sequencer revenue goes to the Optimism Foundation, not token holders." },
          { ko: "RetroPGF(소급 공공재 펀딩)는 프로토콜 생태계에 기여한 개발자에게 OP를 분배합니다. 이는 홀더 수익이 아닌 생태계 보조금입니다.", en: "RetroPGF distributes OP to ecosystem contributors. This is ecosystem grants, not holder yield." },
          { ko: "소각 없음. 바이백 없음. 배당 없음.", en: "No burn. No buyback. No yield." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "Superchain: Base(코인베이스), Zora, Worldchain, Mode 등 수십 개 체인이 OP 스택을 사용합니다. 실질적인 L2 인프라 표준이 되고 있습니다.", en: "Superchain: Dozens of chains (Base, Zora, Worldchain, Mode) use the OP Stack. It is becoming a de facto L2 infrastructure standard." },
          { ko: "코인베이스가 Base를 통해 OP 스택에 기여하고 있어 장기 지속 가능성이 높습니다.", en: "Coinbase's contribution to OP Stack via Base ensures long-term sustainability." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "연결되지 않습니다. Superchain이 세계 인프라가 되어도 OP 토큰 홀더가 수익을 얻는 구조적 근거가 없습니다.", en: "Not connected. Even if the Superchain becomes global infrastructure, there is no structural basis for OP holders to benefit." },
        ],
      },
    ],
    sources: [
      { label: "Optimism Docs", url: "https://docs.optimism.io" },
      { label: "L2Beat: Optimism", url: "https://l2beat.com/scaling/projects/optimism" },
      { label: "Superchain Registry", url: "https://github.com/ethereum-optimism/superchain-registry" },
      { label: "Messari: OP", url: "https://messari.io/asset/optimism" },
    ],
  },

  SAND: {
    type: "opinion",
    summary: {
      ko: "더샌드박스는 블록체인 기반 메타버스 게임 플랫폼입니다. SAND는 가상 토지(LAND)와 게임 내 자산 구매에 사용됩니다. 2021~2022년 메타버스 버블 시기 급등했다가 현재 고점 대비 95% 이상 하락했습니다. 메타버스 내러티브 자체가 시장의 관심을 잃었습니다.",
      en: "The Sandbox is a blockchain-based metaverse gaming platform. SAND is used to purchase virtual land (LAND) and in-game assets. It surged during the 2021–2022 metaverse bubble and has since dropped 95%+ from its peak. The metaverse narrative has lost market interest.",
    },
    verdict: {
      ko: "메타버스 내러티브 붕괴. 실사용자 없음. 투자 근거 없음.",
      en: "Metaverse narrative collapsed. No real users. No investment thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "SAND는 유틸리티 토큰입니다. 게임 내 결제 수단이지만 보유만으로는 어떤 수익도 발생하지 않습니다.", en: "SAND is a utility token for in-game payments, but holding it generates zero yield." },
          { ko: "소각 없음. 스테이킹 없음. 바이백 없음.", en: "No burn. No staking. No buyback." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "MAU(월간 활성 사용자)가 버블 피크 대비 극적으로 감소했습니다. 메타버스 공간에서의 실질적인 커뮤니티 활동이 사실상 없습니다.", en: "Monthly active users dropped dramatically from the bubble peak. Actual community activity in the metaverse is near zero." },
          { ko: "Snoop Dogg, Adidas 등 유명 파트너십이 있었으나 실질적 사용자 유입으로 이어지지 않았습니다.", en: "High-profile partnerships (Snoop Dogg, Adidas) did not translate into meaningful user growth." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "플랫폼이 부활하지 않는 한 토큰 가격 회복 근거가 없습니다. 메타버스 테마 자체가 부활할지도 불분명합니다.", en: "Without a platform revival, there is no basis for token price recovery. Whether the metaverse theme itself will revive is also unclear." },
        ],
      },
    ],
    sources: [
      { label: "The Sandbox", url: "https://www.sandbox.game" },
      { label: "DappRadar: SAND", url: "https://dappradar.com/hub/token/eth/SAND" },
      { label: "Messari: SAND", url: "https://messari.io/asset/the-sandbox" },
    ],
  },

  MANA: {
    type: "opinion",
    summary: {
      ko: "디센트럴랜드는 이더리움 기반 메타버스 플랫폼으로, MANA를 소각해 LAND를 구매하는 구조입니다. DAO 트레저리는 수억 달러를 보유하고 있지만, 동시 접속자 수가 수백~수천 명 수준으로 실질적 사용자가 없는 유령 도시입니다.",
      en: "Decentraland is an Ethereum-based metaverse where MANA is burned to purchase LAND. The DAO treasury holds hundreds of millions, but concurrent users number in the hundreds to thousands, making it effectively a ghost town.",
    },
    verdict: {
      ko: "소각 메커니즘이 있으나 태울 거래가 없음. 죽은 플랫폼.",
      en: "Burn mechanism exists but no transactions to burn. Dead platform.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 소각(이론적)", en: "① Tokenomics — Holder Return: Burn (theoretical)" },
        rating: "neutral",
        items: [
          { ko: "LAND 구매 시 MANA가 소각됩니다. 그러나 LAND 거래가 거의 없어 실질 소각량이 무의미합니다.", en: "MANA is burned when purchasing LAND. However, LAND transactions are near zero, making actual burn amounts negligible." },
          { ko: "Decentraland DAO는 ETH와 MANA를 합쳐 수억 달러 규모의 트레저리를 보유합니다. 그러나 이 자산이 MANA 홀더에게 직접 돌아오는 구조는 없습니다.", en: "Decentraland DAO holds a treasury worth hundreds of millions in ETH and MANA. But there is no mechanism to distribute this to MANA holders." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "2023년 기준 동시 접속자 수가 수십~수백 명 수준으로 확인됐습니다. 가상 부동산 가격도 버블 피크 대비 90% 이상 하락했습니다.", en: "Concurrent user counts in 2023 were confirmed at tens to hundreds. Virtual real estate prices fell 90%+ from bubble peaks." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "플랫폼이 살아있지 않으므로 연결 자체가 무의미합니다.", en: "With the platform essentially dormant, the value connection is irrelevant." },
        ],
      },
    ],
    sources: [
      { label: "Decentraland", url: "https://decentraland.org" },
      { label: "Decentraland DAO", url: "https://governance.decentraland.org" },
      { label: "Messari: MANA", url: "https://messari.io/asset/decentraland" },
    ],
  },

  AXS: {
    type: "opinion",
    summary: {
      ko: "엑시 인피니티는 P2E(Play-to-Earn) 게임의 대표 주자로, 2021년 블록체인 게임 열풍을 이끌었습니다. AXS 스테이킹 수익(약 50~70% APY)이 있으나 이는 신규 발행에 의한 것입니다. Ronin 브릿지 해킹($625M)과 게임 DAU 급감으로 생태계가 크게 위축됐습니다.",
      en: "Axie Infinity was the flagship P2E (Play-to-Earn) game that led the 2021 blockchain gaming boom. AXS staking yields are high (~50–70% APY) but funded by new issuance. The $625M Ronin bridge hack and dramatic DAU decline have severely contracted the ecosystem.",
    },
    verdict: {
      ko: "P2E 버블 붕괴. 스테이킹 APY는 높지만 인플레이션 재원. 신규 사용자 유입 없으면 회복 불가.",
      en: "P2E bubble collapsed. High staking APY is inflation-funded. No recovery without new user influx.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 높은 스테이킹, 인플레이션 재원", en: "① Tokenomics — Holder Return: High Staking, Inflation-Funded" },
        rating: "neutral",
        items: [
          { ko: "AXS 스테이킹 APY는 표면상 높습니다. 그러나 이 보상의 재원이 신규 AXS 발행임을 감안하면 실질적 희석이 발생합니다.", en: "AXS staking APY appears high on surface. But rewards are funded by new AXS issuance, causing real dilution." },
          { ko: "Sky Mavis(개발사)가 초기 팀 배정 물량을 보유하며, 잠금 해제 후 매도 압력이 있습니다.", en: "Sky Mavis holds large team token allocations, creating sell pressure after unlock periods." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "2022년 3월 Ronin 브릿지 해킹으로 $625M 손실. 이는 당시 역대 최대 DeFi 해킹이었습니다. Sky Mavis가 이후 자체 보상했습니다.", en: "March 2022 Ronin bridge hack: $625M stolen — the largest DeFi hack at the time. Sky Mavis later covered losses themselves." },
          { ko: "P2E 모델의 근본적 결함: 신규 플레이어가 지속 유입되지 않으면 경제가 붕괴합니다. 게임 DAU가 피크 대비 90% 이상 감소했습니다.", en: "Fundamental flaw of P2E: Without continuous new player inflow, the economy collapses. Game DAU dropped 90%+ from peak." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "게임이 부활하면 AXS 수요가 생깁니다. 그러나 P2E 테마 자체가 시장의 신뢰를 잃었고, 게임성이 경쟁 게임 대비 약합니다.", en: "A game revival would create AXS demand. But the P2E theme has lost market trust, and gameplay quality is weak compared to competitors." },
        ],
      },
    ],
    sources: [
      { label: "Axie Infinity", url: "https://axieinfinity.com" },
      { label: "Ronin Network", url: "https://roninchain.com" },
      { label: "Ronin Bridge 해킹 보고서", url: "https://roninchain.com/blog/posts/the-attack" },
      { label: "Messari: AXS", url: "https://messari.io/asset/axie-infinity" },
    ],
  },

  XLM: {
    type: "opinion",
    summary: {
      ko: "스텔라는 국제 송금 특화 블록체인으로, 스텔라개발재단(SDF)이 총 공급량의 절반 이상을 보유합니다. 2019년 대규모 소각 이후 공급량이 줄었으나, SDF 보유 물량이 여전히 거대합니다. 스테이킹 없음, 소각 미미, 홀더 환원 없음.",
      en: "Stellar is a cross-border payment blockchain. The Stellar Development Foundation (SDF) holds over half of the total supply. After a 2019 mass burn, supply decreased, but SDF holdings remain enormous. No staking, negligible burn, no holder return.",
    },
    verdict: {
      ko: "기업용 결제 유틸리티는 있으나 홀더에게 돌아오는 것이 없음.",
      en: "Enterprise payment utility exists but nothing returns to holders.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "XLM 보유로 얻을 수 있는 것이 없습니다. 스테이킹 없음. SDF가 계속해서 생태계 보조금 명목으로 XLM을 시장에 공급합니다.", en: "Holding XLM generates nothing. No staking. SDF continuously supplies XLM to the market under the guise of ecosystem grants." },
          { ko: "트랜잭션 수수료는 소각되지만 극히 낮은 수수료(0.00001 XLM)라 의미 없는 수준입니다.", en: "Transaction fees are burned, but at 0.00001 XLM per transaction, the deflationary effect is negligible." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "MoneyGram 파트너십으로 USDC 이동에 스텔라 네트워크가 사용됩니다. 실제 결제 유틸리티가 있습니다.", en: "MoneyGram partnership uses the Stellar network for USDC transfers. Real payment utility exists." },
          { ko: "그러나 스텔라의 네트워크 성공이 XLM 토큰 수요와 연결되지 않습니다. USDC 전송에 XLM이 간접적으로만 필요합니다.", en: "But Stellar's network success doesn't create XLM demand. XLM is only indirectly needed for USDC transfers." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "연결 없음. 네트워크가 성장해도 XLM 홀더에게 수익이 오지 않습니다. SDF의 지속적 물량 방출이 장기 보유를 어렵게 합니다.", en: "No connection. Network growth doesn't benefit XLM holders. SDF's continuous supply releases make long-term holding difficult." },
        ],
      },
    ],
    sources: [
      { label: "Stellar.org", url: "https://stellar.org" },
      { label: "SDF 보고서", url: "https://stellar.org/foundation/mandate" },
      { label: "Messari: XLM", url: "https://messari.io/asset/stellar" },
    ],
  },

  HBAR: {
    type: "opinion",
    summary: {
      ko: "헤데라는 구글, IBM, 보잉 등 글로벌 대기업으로 구성된 헤데라 거버닝 카운슬이 운영하는 엔터프라이즈 블록체인입니다. 기업 채택 측면에서는 인상적이지만, 일반 HBAR 홀더는 거버넌스 참여도 수익도 얻지 못합니다. 완전한 중앙화 구조입니다.",
      en: "Hedera is an enterprise blockchain governed by the Hedera Governing Council including Google, IBM, and Boeing. Enterprise adoption is impressive, but regular HBAR holders get neither governance participation nor yield. It is a fully centralized structure.",
    },
    verdict: {
      ko: "기업 블록체인. 일반 홀더는 수익도 투표권도 없음. 중앙화 리스크.",
      en: "Enterprise blockchain. Regular holders get no yield and no governance. Centralization risk.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "HBAR는 네트워크 수수료 결제에 사용됩니다. 일반 홀더는 스테이킹 수익도, 소각 혜택도, 거버넌스 권한도 없습니다.", en: "HBAR is used to pay network fees. Regular holders get no staking yield, no burn benefit, and no governance rights." },
          { ko: "거버넌스 카운슬 멤버(구글, IBM 등)만 네트워크 노드를 운영하고 수수료 수익을 얻습니다. 완전한 허가형(permissioned) 구조입니다.", en: "Only Governing Council members (Google, IBM, etc.) run nodes and earn fee revenue. It's a fully permissioned structure." },
          { ko: "헤데라 재단은 대규모 HBAR를 보유하며 생태계 보조금으로 방출합니다. 지속적인 공급 증가 요인입니다.", en: "The Hedera Foundation holds large HBAR reserves released as ecosystem grants — a continuous supply increase factor." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "해시그래프(DAG 기반) 합의 알고리즘으로 초당 10,000+ 거래 처리. 빠르고 저렴한 수수료가 특징입니다.", en: "Hashgraph (DAG-based) consensus handles 10,000+ TPS. Fast and cheap transactions are key advantages." },
          { ko: "구글, 보잉, LG 등 글로벌 기업 39개가 거버닝 카운슬 멤버로 참여. 기업 신뢰도는 압도적입니다.", en: "39 global companies including Google, Boeing, and LG participate as council members. Enterprise credibility is outstanding." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "헤데라가 성장해도 수익은 카운슬 멤버에게 귀속됩니다. 일반 소매 투자자가 HBAR를 보유할 구조적 이유가 없습니다.", en: "As Hedera grows, revenue goes to council members. There is no structural reason for retail investors to hold HBAR." },
        ],
      },
    ],
    sources: [
      { label: "Hedera.com", url: "https://hedera.com" },
      { label: "Hedera Governing Council", url: "https://hedera.com/council" },
      { label: "Messari: HBAR", url: "https://messari.io/asset/hedera" },
    ],
  },

  GRT: {
    type: "opinion",
    summary: {
      ko: "더그래프는 블록체인 데이터를 인덱싱하고 쿼리하는 분산형 인프라입니다. GRT는 네트워크 참여자(인덱서, 큐레이터, 위임자)에게 수수료와 보상이 실제로 분배되는 몇 안 되는 유틸리티 토큰입니다. 위임자 APY는 약 5~8%입니다.",
      en: "The Graph is a decentralized infrastructure for indexing and querying blockchain data. GRT is one of the few utility tokens where fees and rewards are actually distributed to network participants (Indexers, Curators, Delegators). Delegator APY is ~5–8%.",
    },
    verdict: {
      ko: "실제 토큰 유틸리티와 수익 분배가 있는 인프라. 거버넌스 토큰 중 상위권.",
      en: "Real token utility and revenue distribution. One of the better-designed infrastructure tokens.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 위임 수익", en: "① Tokenomics — Holder Return: Delegation Yield" },
        rating: "good",
        items: [
          { ko: "GRT 위임자(Delegators)는 인덱서에게 GRT를 위임하고 쿼리 수수료와 인덱싱 보상을 공유받습니다. APY 약 5~8%.", en: "Delegators who delegate GRT to indexers share in query fees and indexing rewards. APY ~5–8%." },
          { ko: "큐레이터(Curators)는 유망한 서브그래프에 GRT를 시그널해 해당 서브그래프가 수수료를 벌면 보상을 받습니다. 토큰에 실질 유틸리티가 있습니다.", en: "Curators signal GRT on promising subgraphs and earn rewards when those subgraphs generate fees. Real token utility exists." },
          { ko: "인덱서는 GRT를 담보로 잠그고 데이터 쿼리 서비스를 제공합니다. 이 담보 요구사항이 GRT 수요를 만듭니다.", en: "Indexers stake GRT as collateral to provide data query services. This collateral requirement creates genuine GRT demand." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "Uniswap, Aave, ENS 등 주요 DeFi 프로토콜이 더그래프 서브그래프를 데이터 인프라로 사용합니다.", en: "Major DeFi protocols like Uniswap, Aave, and ENS use The Graph subgraphs as their data infrastructure." },
          { ko: "'블록체인의 구글'이라는 내러티브가 있습니다. 온체인 데이터가 증가할수록 인덱싱 수요도 증가합니다.", en: "Narrative as 'Google of blockchains.' As on-chain data grows, indexing demand grows with it." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 네트워크 사용량 증가 → 쿼리 수수료 증가 → 인덱서/위임자 수익 증가 → GRT 담보 수요 증가. 명확한 가치 포착 구조가 있습니다.", en: "Connected. More network usage → more query fees → more indexer/delegator income → more GRT collateral demand. Clear value capture structure." },
        ],
      },
    ],
    sources: [
      { label: "The Graph Docs", url: "https://thegraph.com/docs" },
      { label: "The Graph Explorer", url: "https://thegraph.com/explorer" },
      { label: "Messari: GRT", url: "https://messari.io/asset/the-graph" },
    ],
  },

  IMX: {
    type: "opinion",
    summary: {
      ko: "이뮤터블X는 NFT 게임에 특화된 이더리움 L2입니다. 가스비 없는 NFT 민팅이 핵심 기능입니다. 최근 스테이킹이 출시됐고, 일부 수수료가 IMX 스테이커에게 분배됩니다. 그러나 NFT 게임 시장 자체가 침체 중입니다.",
      en: "Immutable X is an Ethereum L2 specialized for NFT gaming. Gas-free NFT minting is its core feature. Staking was recently launched with some fees distributed to IMX stakers. However, the NFT gaming market itself is in a downturn.",
    },
    verdict: {
      ko: "스테이킹과 수수료 분배가 출시됐으나, NFT 게임 시장 부진이 발목을 잡음.",
      en: "Staking and fee distribution launched, but NFT gaming market weakness is a headwind.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 신규 스테이킹", en: "① Tokenomics — Holder Return: New Staking" },
        rating: "neutral",
        items: [
          { ko: "IMX 스테이킹이 출시됐으며, 프로토콜 수수료의 일부가 스테이커에게 분배됩니다. 단, 현재 APY는 아직 낮습니다.", en: "IMX staking launched with a portion of protocol fees distributed to stakers. However, current APY is still low." },
          { ko: "IMX는 NFT 거래 수수료(2%)의 20%를 DAO/생태계 펀드에 귀속시켜 왔습니다. 홀더 직접 분배는 최근에야 시작됐습니다.", en: "IMX has historically directed 20% of NFT trading fees (2%) to DAO/ecosystem fund. Direct holder distribution is a recent addition." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Gods Unchained, Guild of Guardians 등 자체 게임을 보유. 다른 게임사 온보딩에도 집중하고 있습니다.", en: "Has its own games (Gods Unchained, Guild of Guardians) and focuses on onboarding external game studios." },
          { ko: "Immutable zkEVM(폴리곤 zkEVM 기반)으로 스마트 컨트랙트 기능을 확장했습니다.", en: "Expanded smart contract capabilities via Immutable zkEVM (built on Polygon zkEVM)." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "수수료 분배 구조가 개선되고 있어 방향은 긍정적입니다. NFT 게임 시장이 회복되면 스테이킹 수익도 의미 있는 수준이 됩니다.", en: "Fee distribution structure is improving — a positive direction. If the NFT gaming market recovers, staking yields become meaningful." },
        ],
      },
    ],
    sources: [
      { label: "Immutable Docs", url: "https://docs.immutable.com" },
      { label: "Messari: IMX", url: "https://messari.io/asset/immutable-x" },
    ],
  },

  ALGO: {
    type: "opinion",
    summary: {
      ko: "알고랜드는 MIT 교수 실비오 미칼리가 설계한 순수 지분증명(Pure PoS) 블록체인입니다. 거버넌스 보상 프로그램으로 분기마다 투표 참여 시 약 8~10% APY를 얻을 수 있습니다. 그러나 알고랜드 재단의 대규모 물량과 생태계 침체가 장기 전망을 어둡게 합니다.",
      en: "Algorand is a Pure PoS blockchain designed by MIT professor Silvio Micali. Participating in quarterly governance votes earns ~8–10% APY. However, the Algorand Foundation's large holdings and stagnant ecosystem cloud the long-term outlook.",
    },
    verdict: {
      ko: "거버넌스 보상은 있으나 생태계 채택 부진. 재단 물량 부담 큼.",
      en: "Governance rewards exist but ecosystem adoption is poor. Foundation supply overhang is significant.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 거버넌스 보상", en: "① Tokenomics — Holder Return: Governance Rewards" },
        rating: "neutral",
        items: [
          { ko: "거버넌스 프로그램: 분기마다 ALGO를 커밋하고 투표에 참여하면 약 8~10% APY 보상. 단, 커밋 기간 동안 ALGO를 이동할 수 없습니다.", en: "Governance program: Commit ALGO quarterly and vote to earn ~8–10% APY. However, committed ALGO cannot be moved during the period." },
          { ko: "알고랜드 재단은 생태계 보조금으로 수십억 ALGO를 보유하며 지속적으로 방출 중입니다.", en: "The Algorand Foundation holds billions of ALGO for ecosystem grants with ongoing releases." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "이탈리아 국고채 토큰화, 국제결제은행(BIS) 관련 프로젝트 등 일부 기관 채택 사례가 있습니다.", en: "Some institutional adoption: Italian government bond tokenization, BIS-related projects." },
          { ko: "그러나 DeFi TVL과 개발자 활동은 주요 체인 대비 매우 낮습니다.", en: "However, DeFi TVL and developer activity are very low compared to major chains." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "거버넌스 보상은 실제 수익이지만 인플레이션 재원입니다. 생태계가 성장하지 않으면 재단 물량 방출이 가격을 지속적으로 압박합니다.", en: "Governance rewards are real but inflation-funded. Without ecosystem growth, foundation supply releases will continuously pressure prices." },
        ],
      },
    ],
    sources: [
      { label: "Algorand Foundation", url: "https://algorand.foundation" },
      { label: "Algorand Governance", url: "https://governance.algorand.foundation" },
      { label: "Messari: ALGO", url: "https://messari.io/asset/algorand" },
    ],
  },

  EOS: {
    type: "opinion",
    summary: {
      ko: "이오스는 2018년 역사상 최대 규모(40억 달러) ICO 이후 출시된 블록체인입니다. Block.one의 방치와 21개 BP(블록 프로듀서) 과두제로 인한 중앙화, 개발자 엑소더스로 현재는 사실상 실패한 프로젝트입니다. EOS 네트워크 재단이 2022년 이후 재건을 시도하고 있으나 성과는 미미합니다.",
      en: "EOS launched after the largest ICO in history ($4B) in 2018. Due to Block.one's abandonment, centralization via 21 BPs, and developer exodus, it is effectively a failed project. The EOS Network Foundation has attempted a rebuild since 2022 but results are minimal.",
    },
    verdict: {
      ko: "실패한 프로젝트. 재건 시도는 있으나 투자 근거 없음.",
      en: "Failed project. Rebuild attempts ongoing but no investment thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 사실상 0%", en: "① Tokenomics — Holder Return Rate: Effectively 0%" },
        rating: "bad",
        items: [
          { ko: "EOS 파워업(PowerUp) 모델: EOS를 파워업해 CPU/NET 리소스를 사용하는 구조지만, 일반 홀더는 의미 있는 수익이 없습니다.", en: "EOS PowerUp model: Power up EOS to use CPU/NET resources, but regular holders get no meaningful yield." },
          { ko: "Block.one은 ICO로 모금한 40억 달러를 대부분 EOS 생태계 개발에 사용하지 않고 자사 이익에 활용했습니다.", en: "Block.one used most of the $4B raised in the ICO for internal purposes rather than EOS ecosystem development." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "EOS 네트워크 재단(ENF)이 2022년 Block.one에서 분리됐으나, 생태계 회복 속도는 매우 느립니다.", en: "The EOS Network Foundation (ENF) separated from Block.one in 2022, but ecosystem recovery is extremely slow." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "시장의 신뢰를 잃은 지 오래입니다. 역대 최대 ICO에서 실패했다는 인식이 강하게 남아 있습니다.", en: "Market trust has been lost for years. The perception of failure despite the largest-ever ICO is deeply entrenched." },
        ],
      },
    ],
    sources: [
      { label: "EOS Network", url: "https://eosnetwork.com" },
      { label: "Messari: EOS", url: "https://messari.io/asset/eos" },
    ],
  },

  STX: {
    type: "opinion",
    summary: {
      ko: "스택스는 '프로그래밍 가능한 비트코인'을 지향하는 비트코인 L2입니다. 스태킹(Stacking) 메커니즘으로 STX를 잠그면 BTC 수익(약 8~12% APY in BTC)을 받습니다. 나카모토 업그레이드와 sBTC(1:1 BTC 합성자산)로 비트코인 DeFi의 핵심 인프라가 되려 합니다.",
      en: "Stacks is a Bitcoin L2 aiming to make Bitcoin programmable. Stacking STX earns BTC yield (~8–12% APY in BTC). The Nakamoto Upgrade and sBTC (1:1 BTC synthetic) position it to become core infrastructure for Bitcoin DeFi.",
    },
    verdict: {
      ko: "독보적인 비트코인 수익 메커니즘. 비트코인 DeFi가 성장하면 STX의 가장 강력한 근거가 됨.",
      en: "Unique BTC yield mechanism. If Bitcoin DeFi takes off, STX has the strongest thesis in that category.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: BTC 수익", en: "① Tokenomics — Holder Return: BTC Yield" },
        rating: "good",
        items: [
          { ko: "스태킹(Stacking): STX를 잠그면 비트코인 채굴자가 지불하는 BTC를 받습니다. APY 약 8~12% (BTC 기준). 이는 암호화폐 중 가장 독특한 수익 구조 중 하나입니다.", en: "Stacking: Lock STX to receive BTC paid by Bitcoin miners. APY ~8–12% in actual BTC — one of the most unique yield structures in crypto." },
          { ko: "sBTC: 비트코인을 1:1로 담보한 합성 BTC로, 스택스 체인에서 DeFi에 활용 가능합니다.", en: "sBTC: Synthetic BTC backed 1:1 by real Bitcoin, usable in DeFi on the Stacks chain." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "나카모토 업그레이드: 비트코인 블록마다 최종성을 얻어, 더 빠른 블록 생성과 보안성을 동시에 달성합니다.", en: "Nakamoto Upgrade: Achieves finality at every Bitcoin block, enabling faster block times with Bitcoin-level security." },
          { ko: "비트코인이 DeFi의 담보 자산으로 주목받을수록 스택스의 인프라 역할이 커집니다. 비트코인 ETF 이후 BTC를 활용하려는 수요가 증가하고 있습니다.", en: "As Bitcoin gains attention as DeFi collateral, Stacks' infrastructure role grows. Post-BTC ETF, demand to utilize BTC is increasing." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. Bitcoin DeFi TVL 증가 → 더 많은 BTC 채굴자의 STX 매수(스태킹 보상 재원) → STX 수요 증가. BTC 수익을 위한 STX 스태킹 수요도 직접적 가격 지지입니다.", en: "Connected. Bitcoin DeFi TVL grows → more BTC miners buy STX (for stacking rewards) → STX demand increases. STX stacking demand for BTC yield also directly supports price." },
        ],
      },
    ],
    sources: [
      { label: "Stacks Docs", url: "https://docs.stacks.co" },
      { label: "Stacks Explorer (스태킹)", url: "https://explorer.stacks.co" },
      { label: "sBTC 소개", url: "https://bitcoinl2labs.com/sbtc" },
      { label: "Messari: STX", url: "https://messari.io/asset/stacks" },
    ],
  },

  TON: {
    type: "opinion",
    summary: {
      ko: "톤코인은 텔레그램과 연동된 블록체인으로, 9억 명 이상의 텔레그램 사용자를 잠재적 온보딩 대상으로 삼습니다. 스테이킹(약 3~5% APY)과 텔레그램 미니앱 생태계가 성장 중입니다. 그러나 파벨 두로프(텔레그램 창업자) 체포(2024년)와 극심한 중앙화가 최대 리스크입니다.",
      en: "Toncoin is the blockchain integrated with Telegram, targeting 900M+ Telegram users as potential onboarding targets. Staking (~3–5% APY) and the Telegram mini-app ecosystem are growing. However, Pavel Durov's arrest (2024) and extreme centralization are the biggest risks.",
    },
    verdict: {
      ko: "세계 최대 온보딩 채널 보유. 하지만 두로프 리스크와 중앙화가 장기 투자의 최대 리스크.",
      en: "World's largest onboarding channel. But Durov risk and centralization are the biggest long-term investment risks.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹", en: "① Tokenomics — Holder Return: Staking" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 APY 약 3~5%. 텔레그램 미니앱에서 TON을 직접 사용하는 생태계가 형성 중입니다.", en: "Staking APY ~3–5%. An ecosystem of Telegram mini-apps that directly use TON is forming." },
          { ko: "TON 재단이 초기 공급량의 상당 부분을 보유하며, 텔레그램과의 관계가 중앙화 구조를 만들고 있습니다.", en: "The TON Foundation holds a large share of initial supply, and the Telegram relationship creates a centralized structure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "Notcoin, Hamster Kombat 등 텔레그램 미니게임이 수천만 명의 참여자를 모집했습니다. 실제 사용자 기반이 급격히 성장하고 있습니다.", en: "Telegram mini-games like Notcoin and Hamster Kombat attracted tens of millions of participants. Real user base growing rapidly." },
          { ko: "텔레그램 내 TON Space 지갑으로 TON 생태계 접근이 크게 단순화됐습니다.", en: "TON Space wallet within Telegram has significantly simplified access to the TON ecosystem." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "텔레그램 사용자 채택 증가 → TON 온체인 활동 증가 → 수수료 소각 → 토큰 가치 상승의 연결은 있습니다. 하지만 두로프 리스크가 이 모든 것을 뒤집을 수 있습니다.", en: "Telegram user adoption → TON on-chain activity → fee burns → value appreciation: the connection exists. But the Durov risk can reverse all of this." },
        ],
      },
    ],
    sources: [
      { label: "TON Docs", url: "https://docs.ton.org" },
      { label: "TONStat (온체인 통계)", url: "https://tonstat.com" },
      { label: "파벨 두로프 체포 관련", url: "https://www.bbc.com/news/articles/c9dl27djr0do" },
      { label: "Messari: TON", url: "https://messari.io/asset/toncoin" },
    ],
  },

  PEPE: {
    type: "opinion",
    summary: {
      ko: "페페는 개구리 밈을 기반으로 한 밈코인입니다. 팀도 없고, 로드맵도 없고, 유틸리티도 없습니다. 시가총액이 수십억 달러에 달하는 이유는 오직 커뮤니티와 시장 투기입니다. 순수한 투기 도박입니다.",
      en: "Pepe is a frog meme-based meme coin. No team, no roadmap, no utility. The multi-billion dollar market cap is driven solely by community and market speculation. Pure speculative gambling.",
    },
    verdict: {
      ko: "투자 근거 없음. 순수 투기 자산.",
      en: "No investment thesis. Pure speculation.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "스테이킹 없음. 소각 없음. 팀 없음. 로드맵 없음. 유틸리티 없음. 가격 상승 기대만이 유일한 보유 이유입니다.", en: "No staking. No burn. No team. No roadmap. No utility. Price appreciation hope is the only holding reason." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "성공의 정의 자체가 없습니다. 밈 코인의 '성공'은 더 많은 투기 유입뿐입니다.", en: "There is no definition of success. A meme coin's 'success' is just attracting more speculation." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "연결 없음. 가격은 오직 시장 심리에만 달려 있습니다.", en: "No connection. Price depends entirely on market sentiment." },
        ],
      },
    ],
    sources: [
      { label: "CoinGecko: PEPE", url: "https://www.coingecko.com/en/coins/pepe" },
    ],
  },

  WIF: {
    type: "opinion",
    summary: {
      ko: "도그위프햇은 솔라나 기반의 밈코인으로, 모자를 쓴 시바견 이미지에서 시작됐습니다. 커뮤니티가 라스베이거스 스피어 빌딩에 광고를 게재할 정도의 결속력이 있습니다. 그러나 근본적으로 밈코인이며 투자 근거가 없습니다.",
      en: "dogwifhat is a Solana-based meme coin featuring a Shiba Inu wearing a hat. The community's cohesion was strong enough to fund a Las Vegas Sphere advertisement. But fundamentally it is a meme coin with no investment thesis.",
    },
    verdict: {
      ko: "순수 밈. 투자 근거 없음.",
      en: "Pure meme. No investment thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "스테이킹 없음. 소각 없음. 유틸리티 없음. 투기만 있습니다.", en: "No staking. No burn. No utility. Only speculation." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "솔라나 밈코인 사이클에서 단기 주목을 받았습니다. 단, 밈 사이클은 빠르게 바뀝니다.", en: "Received short-term attention during the Solana meme coin cycle. But meme cycles change fast." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "연결 없음.", en: "No connection." },
        ],
      },
    ],
    sources: [
      { label: "CoinGecko: WIF", url: "https://www.coingecko.com/en/coins/dogwifhat" },
    ],
  },

  SEI: {
    type: "opinion",
    summary: {
      ko: "세이는 병렬 EVM 실행을 통해 트레이딩 최적화에 특화된 L1입니다. 기술적 차별점이 있으나 SEI 토큰은 현재 거버넌스 토큰 수준으로, 프로토콜 수수료가 홀더에게 분배되지 않습니다. 스테이킹(약 6~8% APY)은 있습니다.",
      en: "Sei is an L1 optimized for trading via parallel EVM execution. It has technical differentiation, but SEI is currently just a governance token — protocol fees are not distributed to holders. Staking (~6–8% APY) exists.",
    },
    verdict: {
      ko: "기술 우위는 있음. 수수료 분배가 없으면 토큰 보유 근거 약함.",
      en: "Technical advantage exists. Without fee distribution, the holding thesis is weak.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 스테이킹만", en: "① Tokenomics — Holder Return: Staking Only" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 APY 약 6~8%. 그러나 보상 재원은 신규 SEI 발행입니다. 수수료 분배 없음.", en: "Staking APY ~6–8%. But rewards are funded by new SEI issuance. No fee distribution." },
          { ko: "세이 팀과 투자자의 초기 물량이 계속 언락되고 있어 공급 압력이 있습니다.", en: "Continuous unlocks of team and investor allocations create supply pressure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "병렬 EVM: 독립적인 트랜잭션을 동시에 처리해 처리량을 대폭 높입니다. 이론적으로 초당 수만 건 처리 가능합니다.", en: "Parallel EVM processes independent transactions simultaneously, dramatically increasing throughput. Theoretically capable of tens of thousands TPS." },
          { ko: "그러나 트레이딩 특화 L1이 일반 DeFi 생태계를 유치하는 데 제약이 있을 수 있습니다.", en: "However, a trading-specialized L1 may face limitations in attracting a general DeFi ecosystem." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "현재는 연결이 약합니다. 수수료 분배 메커니즘이 추가되면 ARB·OP와 달리 투자 근거가 생깁니다.", en: "Currently weak connection. If fee distribution is added, SEI would have a thesis unlike ARB or OP." },
        ],
      },
    ],
    sources: [
      { label: "Sei Network", url: "https://www.sei.io" },
      { label: "Messari: SEI", url: "https://messari.io/asset/sei" },
    ],
  },

  AAVE: {
    type: "opinion",
    summary: {
      ko: "에이브는 전 세계 최대 DeFi 대출 프로토콜입니다. Safety Module 스테이킹(약 4~7% APY)이 있고, 2024년 Aavenomics 2.0을 통해 프로토콜 수익으로 AAVE를 바이백·소각하는 제안이 가결됐습니다. DeFi 거버넌스 토큰 중 가장 강력한 홀더 환원 구조를 갖추고 있습니다.",
      en: "Aave is the world's largest DeFi lending protocol. Safety Module staking (~4–7% APY) exists, and in 2024, Aavenomics 2.0 passed a proposal to buyback and burn AAVE using protocol revenue. It has the strongest holder return structure among DeFi governance tokens.",
    },
    verdict: {
      ko: "DeFi 거버넌스 토큰 중 최상급. 바이백+소각+스테이킹 3중 구조. 강력한 매수 근거.",
      en: "Top-tier DeFi governance token. Buyback + burn + staking triple structure. Strong buy thesis.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원: 바이백+소각+스테이킹", en: "① Tokenomics — Holder Return: Buyback + Burn + Staking" },
        rating: "good",
        items: [
          { ko: "Aavenomics 2.0 (2024년): 프로토콜 잉여 수익으로 AAVE를 시장에서 바이백해 소각합니다. 이는 UNI 수수료 분배와 함께 DeFi에서 가장 직접적인 홀더 환원 메커니즘입니다.", en: "Aavenomics 2.0 (2024): Surplus protocol revenue is used to buyback and burn AAVE. Along with UNI's fee switch, this is the most direct holder return mechanism in DeFi." },
          { ko: "Safety Module: AAVE를 스테이킹해 프로토콜 안전판 역할을 하면 약 4~7% APY를 받습니다.", en: "Safety Module: Stake AAVE as a protocol backstop and earn ~4–7% APY." },
          { ko: "Umbrella 업그레이드 (2024): Safety Module 개편으로 스테이킹 효율성을 높이고 스테이커 리스크를 낮췄습니다.", en: "Umbrella upgrade (2024): Redesigned Safety Module to improve staking efficiency and reduce staker risk." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "TVL $12~20B(시장 상황에 따라 변동)로 전체 DeFi 프로토콜 중 최상위권. Aave v3의 효율적 자본 활용 덕분입니다.", en: "TVL $12–20B (market-dependent), consistently top-ranked in all DeFi protocols. Aave v3's efficient capital utilization is key." },
          { ko: "GHO 스테이블코인 발행(2023): 에이브 프로토콜 자체 스테이블코인으로, 추가 수익원이 됩니다.", en: "GHO stablecoin launch (2023): Aave's native stablecoin becomes an additional revenue stream for the protocol." },
          { ko: "Aave v4 계획 발표: 통합 유동성 레이어로 효율성을 대폭 높일 예정입니다.", en: "Aave v4 announced: A unified liquidity layer expected to dramatically improve capital efficiency." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 프로토콜 수익 증가 → AAVE 바이백·소각 증가 → 유통량 감소 → 가격 상승 압력. 이것이 작동하는 DeFi 플라이휠입니다.", en: "Connected. More protocol revenue → more AAVE buyback/burn → less supply → price appreciation pressure. This is a functioning DeFi flywheel." },
        ],
      },
    ],
    sources: [
      { label: "Aave Governance", url: "https://governance.aave.com" },
      { label: "Aavenomics 2.0 제안", url: "https://governance.aave.com/t/temp-check-aavenomics-update/19882" },
      { label: "Token Terminal: Aave Revenue", url: "https://tokenterminal.com/terminal/projects/aave" },
      { label: "Messari: AAVE", url: "https://messari.io/asset/aave" },
    ],
  },

  BLUR: {
    type: "opinion",
    summary: {
      ko: "블러는 전문 NFT 트레이더를 위한 마켓플레이스로, 2022년 출시 직후 오픈씨를 제치고 거래량 1위에 올랐습니다. Blend(NFT 담보 대출)도 출시했습니다. 그러나 BLUR 토큰은 주로 트레이더 리워드 인센티브로 사용됐으며, NFT 시장 침체와 함께 토큰 가격도 급락했습니다.",
      en: "Blur is a marketplace for professional NFT traders that surpassed OpenSea in volume shortly after its 2022 launch. Blend (NFT-collateralized lending) was also launched. However, BLUR tokens were primarily used as trader reward incentives, and token price dropped sharply with the NFT market downturn.",
    },
    verdict: {
      ko: "NFT 트레이더 툴로 시장 점유율 있음. 토큰은 주로 인센티브 보조금 역할. NFT 시장 회복 필요.",
      en: "Market share as NFT trader tool. Token primarily acts as incentive subsidy. Requires NFT market recovery.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 미미", en: "① Tokenomics — Holder Return Rate: Minimal" },
        rating: "bad",
        items: [
          { ko: "BLUR 토큰의 주된 용도는 시즌별 거래 리워드 지급입니다. 이는 트레이더의 워시 트레이딩을 유발했다는 비판을 받습니다.", en: "BLUR's primary use is seasonal trading rewards. This has been criticized for incentivizing wash trading among traders." },
          { ko: "스테이킹 수익은 없으며, 프로토콜 수수료가 BLUR 홀더에게 직접 분배되는 구조가 없습니다.", en: "No staking yield. No mechanism to distribute protocol fees directly to BLUR holders." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Blend는 NFT를 담보로 ETH를 빌릴 수 있는 서비스로, 출시 후 NFT 담보 대출 시장의 대부분을 점유했습니다.", en: "Blend allows borrowing ETH against NFT collateral and captured most of the NFT-backed lending market at launch." },
          { ko: "그러나 전체 NFT 시장 거래량이 버블 피크 대비 90% 이상 감소해, 블러의 수익도 급감했습니다.", en: "However, total NFT market volume is down 90%+ from the bubble peak, significantly reducing Blur's revenue." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "현재 구조에서는 연결이 약합니다. 수수료 분배 메커니즘이 추가되고 NFT 시장이 회복되면 재평가 가능합니다.", en: "Weak connection with the current structure. Could be re-evaluated if fee distribution is added and the NFT market recovers." },
        ],
      },
    ],
    sources: [
      { label: "Blur.io", url: "https://blur.io" },
      { label: "Blend NFT Finance", url: "https://blend.blur.io" },
      { label: "Messari: BLUR", url: "https://messari.io/asset/blur" },
    ],
  },

  MINA: {
    type: "opinion",
    summary: {
      ko: "미나 프로토콜은 전체 블록체인 크기를 단 22KB로 유지하는 '세상에서 가장 가벼운 블록체인'입니다. ZK-SNARK 기반으로 누구나 노드를 운영할 수 있지만, 생태계 규모와 개발자 채택은 여전히 초기 단계입니다.",
      en: "Mina Protocol is the world's lightest blockchain, maintaining a constant ~22KB chain size using ZK-SNARKs. Anyone can run a node, but the ecosystem and developer adoption remain in early stages.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 12%", en: "① Tokenomics — Holder Return Rate: 12%" },
        rating: "neutral",
        items: [
          { ko: "MINA 스테이킹 APY는 약 12%로 비교적 높습니다. 위임 방식(Delegation)으로 직접 노드 운영 없이 보상을 받을 수 있습니다.", en: "MINA staking APY is approximately 12%, relatively high. Holders can earn rewards via delegation without running a node directly." },
          { ko: "다만 이 수익은 인플레이션 기반 신규 발행이 주를 이루며, 프로토콜 실제 수익 분배와는 다릅니다.", en: "However, these rewards are primarily inflation-based new issuance, not direct protocol revenue distribution." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "ZK 기술의 트렌드에 올라타 주목받고 있으며, zkApps(ZK 기반 앱)이 론칭됐습니다. 그러나 실질적인 dApp 생태계와 TVL은 매우 미미합니다.", en: "Mina has attracted attention by riding the ZK tech trend, and zkApps have launched. However, the actual dApp ecosystem and TVL remain minimal." },
          { ko: "개발자 도구 및 커뮤니티 성숙도가 이더리움·솔라나 대비 현저히 낮아, 외부 프로젝트 유치에 어려움을 겪고 있습니다.", en: "Developer tooling and community maturity are significantly lower than Ethereum or Solana, making it hard to attract external projects." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "프로토콜 성공이 MINA 가격과 연결되는 메커니즘이 약합니다. 스테이킹 수요 외에 가격을 지지할 실질적 토큰 유틸리티가 부족합니다.", en: "The mechanism linking protocol success to MINA price is weak. Beyond staking demand, there is insufficient real token utility to support the price." },
        ],
      },
    ],
    verdict: {
      ko: "ZK 기술 자체는 유망하지만, 미나 생태계는 여전히 너무 작습니다. 스테이킹 수익은 인플레이션 희석이 수반되며, 생태계가 본격적으로 성장하기 전까지는 투기적 성격이 강합니다.",
      en: "The ZK technology itself is promising, but Mina's ecosystem remains too small. Staking rewards come with inflation dilution, and the token remains largely speculative until the ecosystem meaningfully grows.",
    },
    sources: [
      { label: "Mina Protocol Official", url: "https://minaprotocol.com" },
      { label: "Messari: MINA", url: "https://messari.io/asset/mina-protocol" },
    ],
  },

  XTZ: {
    type: "opinion",
    summary: {
      ko: "테조스는 온체인 거버넌스와 자가 수정(Self-Amending) 메커니즘을 최초로 구현한 블록체인입니다. '베이킹(Baking)'이라 불리는 스테이킹 시스템으로 5~6% APY를 제공하지만, 생태계 성장은 매우 더딥니다.",
      en: "Tezos was among the first blockchains to implement on-chain governance and a self-amending mechanism. Its 'Baking' staking system offers ~5-6% APY, but ecosystem growth has been very slow.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 5~6%", en: "① Tokenomics — Holder Return Rate: 5–6%" },
        rating: "neutral",
        items: [
          { ko: "베이킹(Baking) 시스템을 통해 XTZ 보유자는 연 5~6%의 스테이킹 보상을 받을 수 있습니다. 직접 베이커가 되거나 위임(Delegation)이 가능합니다.", en: "Through the Baking system, XTZ holders can earn ~5-6% annual staking rewards. They can become bakers directly or delegate to one." },
          { ko: "인플레이션 기반 보상이지만 수익률이 지속적으로 유지되어 장기 홀더에게 일정한 인센티브를 제공합니다.", en: "Though inflation-based, the yield is stable and provides a consistent incentive for long-term holders." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "2018년 선도적인 거버넌스 체인으로 주목받았으나, 이더리움·솔라나·코스모스 등 경쟁 체인에 밀려 개발자와 사용자 모두 이탈했습니다.", en: "Once a leading governance chain in 2018, Tezos has lost developers and users to Ethereum, Solana, and Cosmos competitors." },
          { ko: "NFT 시즌에 FA2 표준으로 반짝 주목받았으나, 시장 전반 침체와 함께 관심이 급감했습니다.", en: "It got brief NFT attention with the FA2 standard, but interest dropped sharply along with the broader market downturn." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "생태계 자체가 성장하지 않고 있어, 토큰가 상승을 유인할 촉매가 부족합니다. 스테이킹 수익은 인플레이션 희석으로 실질 가치가 제한적입니다.", en: "With the ecosystem stagnating, there is little catalyst for token price appreciation. Staking yield is offset by inflation dilution, limiting real value." },
        ],
      },
    ],
    verdict: {
      ko: "온체인 거버넌스 선구자였지만 생태계 성장에 실패했습니다. 스테이킹 수익은 존재하나 인플레이션이 수반되며, 신규 촉매 없이는 장기 투자 매력이 낮습니다.",
      en: "A pioneer in on-chain governance, but failed to grow its ecosystem. Staking yield exists but is offset by inflation, and without new catalysts, long-term investment appeal is limited.",
    },
    sources: [
      { label: "Tezos Official", url: "https://tezos.com" },
      { label: "Messari: XTZ", url: "https://messari.io/asset/tezos" },
    ],
  },

  THETA: {
    type: "opinion",
    summary: {
      ko: "세타 네트워크는 영상 전송 특화 블록체인입니다. 사용자가 대역폭을 공유하면 TFUEL을 보상으로 받고, THETA를 가디언 노드에 스테이킹하면 연 5~7% APY를 얻을 수 있습니다. 틈새 시장 특화 체인입니다.",
      en: "Theta Network is a blockchain specialized for video delivery. Users earn TFUEL for sharing bandwidth, and THETA holders earn ~5-7% APY by staking as Guardian Nodes. It is a niche-use-case chain.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 5~7%", en: "① Tokenomics — Holder Return Rate: 5–7%" },
        rating: "neutral",
        items: [
          { ko: "THETA 스테이킹(가디언 노드)으로 연 5~7% APY의 TFUEL 보상을 받습니다. 이중 토큰 구조(THETA + TFUEL)는 설계 의도가 명확합니다.", en: "THETA staking via Guardian Nodes earns ~5-7% APY in TFUEL. The dual-token structure (THETA + TFUEL) has a clear design intent." },
          { ko: "TFUEL은 실제 네트워크 내 트랜잭션 연료로 사용되어, 네트워크 활성화 시 수요 증가 가능성이 있습니다.", en: "TFUEL is used as fuel for network transactions, meaning demand could increase if network activity grows." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "삼성, Google, 소니 등 대형 파트너십을 보유하고 있으며, AI 미디어 시대에 분산 CDN 개념은 여전히 유효합니다.", en: "Theta holds partnerships with Samsung, Google, and Sony. The distributed CDN concept remains valid in the AI media era." },
          { ko: "그러나 실제 영상 스트리밍 시장에서의 점유율이 미미하며, 중앙화 CDN 대비 경쟁 우위가 불명확합니다.", en: "However, its actual market share in video streaming is minimal, and its competitive advantage over centralized CDNs is unclear." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "네트워크 사용 증가 → TFUEL 소비 증가 → THETA 스테이킹 보상 증가의 연결 고리는 논리적입니다. 그러나 네트워크 사용 자체가 아직 제한적입니다.", en: "The logic of network usage → TFUEL consumption → THETA staking reward increases is sound, but actual network usage remains limited." },
        ],
      },
    ],
    verdict: {
      ko: "틈새 시장에서 명확한 유스케이스를 가진 프로젝트입니다. 스테이킹 수익이 있고 토큰 연결 구조도 합리적이나, 실질 채택이 증명되지 않아 투기적 요소가 큽니다.",
      en: "A project with a clear use case in a niche market. Staking yield exists and the token linkage is logical, but without proven real-world adoption, speculative risk remains high.",
    },
    sources: [
      { label: "Theta Network Official", url: "https://www.thetatoken.org" },
      { label: "Messari: THETA", url: "https://messari.io/asset/theta-network" },
    ],
  },

  COMP: {
    type: "opinion",
    summary: {
      ko: "컴파운드는 최초의 주요 DeFi 대출 프로토콜입니다. 연간 수억 달러의 프로토콜 수익을 창출하며, 최근 거버넌스를 통해 COMP 스테이커에게 수수료를 분배하는 방안이 통과되었습니다. 가치 포착 구조가 개선 중입니다.",
      en: "Compound is the first major DeFi lending protocol, generating hundreds of millions in annual protocol revenue. A governance vote recently passed to distribute fees to COMP stakers, improving value capture.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 개선 중", en: "① Tokenomics — Holder Return Rate: Improving" },
        rating: "good",
        items: [
          { ko: "COMP 거버넌스를 통해 프로토콜 수익을 COMP 스테이커에게 분배하는 제안이 통과되었습니다. 연간 1억 달러 이상의 프로토콜 수익 중 일부가 홀더에게 환원됩니다.", en: "A governance proposal to distribute protocol revenue to COMP stakers has passed. A portion of over $100M in annual protocol revenue will flow back to holders." },
          { ko: "기존 거버넌스 토큰에서 수익 분배 토큰으로 전환 중인 대표적 사례로, DeFi 토크노믹스 개선 트렌드를 선도합니다.", en: "Compound is a leading example of transitioning from a pure governance token to a revenue-sharing token, ahead of the DeFi tokenomics improvement trend." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "이더리움 DeFi 대출 시장에서 Aave와 함께 양강 체제를 구축하고 있습니다. 오랜 보안 트랙 레코드와 높은 TVL을 보유합니다.", en: "Compound co-dominates the Ethereum DeFi lending market alongside Aave, with a long security track record and high TVL." },
          { ko: "Compound III(Comet) 출시로 효율성과 위험 관리를 개선했습니다. 기관 투자자 대상 서비스 확대도 진행 중입니다.", en: "The launch of Compound III (Comet) improved efficiency and risk management. Expansion to institutional investor services is also underway." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "수수료 분배 메커니즘 도입으로 프로토콜 성공과 COMP 가격의 연결 고리가 강화되었습니다. 프로토콜 수익 증가 → COMP 홀더 환원 증가의 구조가 명확해졌습니다.", en: "The introduction of fee distribution has strengthened the link between protocol success and COMP price. The structure of growing protocol revenue → greater COMP holder returns is now clear." },
        ],
      },
    ],
    verdict: {
      ko: "거버넌스 토큰에서 수익 분배 토큰으로 진화 중인 DeFi 프로토콜입니다. 수익 규모와 시장 지위 모두 견고하며, 토크노믹스 개선이 가치 포착을 높이고 있습니다.",
      en: "A DeFi protocol evolving from a governance token to a revenue-sharing token. Both revenue scale and market position are solid, with improved tokenomics enhancing value capture.",
    },
    sources: [
      { label: "Compound Finance", url: "https://compound.finance" },
      { label: "Messari: COMP", url: "https://messari.io/asset/compound" },
      { label: "DeFiLlama: Compound", url: "https://defillama.com/protocol/compound" },
    ],
  },

  ENS: {
    type: "opinion",
    summary: {
      ko: "이더리움 네임 서비스(ENS)는 복잡한 이더리움 주소를 'name.eth' 같은 사람이 읽기 쉬운 도메인으로 변환하는 프로토콜입니다. 도메인 등록 수익은 ENS DAO 재무부로 들어가며, 현재 ENS 홀더에게 직접 분배되지 않습니다.",
      en: "Ethereum Name Service (ENS) converts complex Ethereum addresses into human-readable domains like 'name.eth'. Domain registration revenue flows to the ENS DAO treasury, with no direct fee sharing to ENS holders currently.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (거버넌스 전용)", en: "① Tokenomics — Holder Return Rate: 0% (Governance Only)" },
        rating: "bad",
        items: [
          { ko: "ENS 도메인 등록 수수료는 ENS DAO 재무부로 귀속됩니다. ENS 토큰 홀더는 거버넌스 권한만 가지며, 직접 수수료 수입을 받지 않습니다.", en: "ENS domain registration fees flow to the ENS DAO treasury. ENS token holders have governance rights only — they receive no direct fee income." },
          { ko: "DAO 재무부가 수천만 달러 규모로 성장했지만, 이것이 ENS 토큰 가격을 직접 지지하는 메커니즘으로 이어지지 않습니다.", en: "The DAO treasury has grown to tens of millions of dollars, but this does not directly support ENS token price through any buyback or distribution mechanism." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "ENS는 이더리움 생태계에서 사실상의 표준(De Facto Standard) 도메인 프로토콜입니다. 수백만 개의 .eth 도메인이 등록되어 실질적 유틸리티를 보유합니다.", en: "ENS is the de facto standard domain protocol in the Ethereum ecosystem. Millions of .eth domains are registered, giving it genuine utility." },
          { ko: "Web3 ID, 멀티체인 주소 확인 등으로 기능이 확대되고 있으며, 이더리움 성장과 함께 성장 가능성이 큽니다.", en: "Its functionality is expanding into Web3 ID, multi-chain address resolution, and more, with strong growth potential tied to Ethereum's expansion." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "현재 구조에서는 연결이 간접적입니다. 거버넌스 참여 수요 외에 ENS 토큰을 보유해야 할 이유가 약합니다. 향후 수수료 분배 거버넌스 제안이 통과된다면 재평가 여지가 있습니다.", en: "The connection is currently indirect. Beyond governance participation, the reason to hold ENS tokens is weak. If a fee distribution proposal passes in the future, a re-evaluation would be warranted." },
        ],
      },
    ],
    verdict: {
      ko: "강력한 유틸리티와 생태계 지위를 갖춘 프로토콜이지만, ENS 토큰 자체의 가치 포착 구조가 아직 미흡합니다. 수수료 분배 메커니즘 도입 여부가 핵심 촉매입니다.",
      en: "A protocol with strong utility and ecosystem standing, but the ENS token's value capture structure remains insufficient. Introduction of a fee distribution mechanism is the key potential catalyst.",
    },
    sources: [
      { label: "ENS Docs", url: "https://docs.ens.domains" },
      { label: "ENS DAO", url: "https://discuss.ens.domains" },
      { label: "Messari: ENS", url: "https://messari.io/asset/ethereum-name-service" },
    ],
  },

  ZIL: {
    type: "opinion",
    summary: {
      ko: "질리카는 샤딩 기술을 최초로 구현한 블록체인 중 하나입니다. ZIL 스테이킹으로 연 10~14% APY를 제공하지만, 생태계는 사실상 정체 상태이며 신규 개발 활동이 거의 없습니다.",
      en: "Zilliqa was among the first blockchains to implement sharding. ZIL staking offers ~10-14% APY, but the ecosystem is essentially stagnant with minimal new development activity.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 10~14%", en: "① Tokenomics — Holder Return Rate: 10–14%" },
        rating: "neutral",
        items: [
          { ko: "ZIL 스테이킹 APY는 10~14%로 높은 편이며, 위임형 스테이킹을 지원합니다. 그러나 높은 APY는 인플레이션 희석을 수반합니다.", en: "ZIL staking APY is high at 10-14%, supporting delegated staking. However, high APY comes with inflation dilution." },
          { ko: "스테이킹 수익이 실질적이려면 네트워크 수수료 수익이 뒷받침되어야 하는데, 생태계 침체로 수수료 수익이 미미합니다.", en: "For staking rewards to be meaningful, they need to be backed by network fee revenue — but ecosystem stagnation means fee income is minimal." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "2018~2019년 샤딩 선구자로 주목받았으나, 이더리움 레이어2·솔라나 등 고성능 체인에 밀려 사실상 존재감을 잃었습니다.", en: "Zilliqa attracted attention as a sharding pioneer in 2018-2019, but has lost its presence to Ethereum L2s and Solana." },
          { ko: "메타버스 플랫폼(Metapolis) 등으로 전환을 시도했지만 시장 반응이 미미했습니다. 신규 개발자 유입이 거의 없는 상태입니다.", en: "Attempts to pivot to metaverse platforms (Metapolis) received minimal market response. New developer inflow is nearly zero." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "생태계가 성장하지 않으면 ZIL 가격 상승을 유인할 동력이 없습니다. 높은 스테이킹 APY는 인플레이션으로 가격 하락 압력을 만들 수 있습니다.", en: "Without ecosystem growth, there is no driver for ZIL price appreciation. High staking APY can create downward price pressure through inflation." },
        ],
      },
    ],
    verdict: {
      ko: "기술적 선구자였으나 경쟁에서 뒤처진 사례입니다. 높은 스테이킹 APY가 있지만 인플레이션 기반이며, 생태계 재건 없이는 투자 매력이 낮습니다.",
      en: "A technical pioneer that fell behind in competition. High staking APY exists but is inflation-driven, and without ecosystem revival, investment appeal is low.",
    },
    sources: [
      { label: "Zilliqa Official", url: "https://www.zilliqa.com" },
      { label: "Messari: ZIL", url: "https://messari.io/asset/zilliqa" },
    ],
  },

  KAVA: {
    type: "opinion",
    summary: {
      ko: "카바는 코스모스 EVM 기반의 DeFi 체인입니다. KAVA 스테이킹으로 약 25%의 높은 APY를 제공하며, Kava Rise 프로그램으로 개발자를 유치하고 있습니다. 그러나 높은 APY는 상당한 인플레이션이 수반됩니다.",
      en: "Kava is a Cosmos EVM-based DeFi chain. KAVA staking offers ~25% APY, and the Kava Rise program incentivizes developers. However, the high APY comes with significant inflation.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: ~25% (인플레이션 주도)", en: "① Tokenomics — Holder Return Rate: ~25% (Inflation-Driven)" },
        rating: "neutral",
        items: [
          { ko: "KAVA 스테이킹 APY는 약 25%로 매우 높습니다. 그러나 이 수익의 대부분은 신규 발행(인플레이션)에서 비롯되며, 실질 프로토콜 수익 분배는 제한적입니다.", en: "KAVA staking APY is very high at ~25%. However, most of this comes from new issuance (inflation), with limited actual protocol revenue distribution." },
          { ko: "스테이킹하지 않을 경우 보유 지분의 가치가 희석되므로, 스테이킹이 사실상 강제되는 구조입니다.", en: "Not staking means your holdings get diluted, making staking effectively mandatory — a structure that inflates numbers without true yield." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Kava Rise 프로그램으로 개발자와 프로토콜을 유치하고 있으며, 크로스체인 대출 서비스도 운영 중입니다. 코스모스와 EVM 모두를 지원하는 하이브리드 구조는 차별점이 있습니다.", en: "The Kava Rise program attracts developers and protocols, with cross-chain lending services in operation. The hybrid Cosmos + EVM structure offers differentiation." },
          { ko: "그러나 경쟁이 치열한 L1/DeFi 시장에서 차별화된 킬러 앱이 부재하며, TVL과 사용자 성장이 정체 중입니다.", en: "However, there is no killer app in the highly competitive L1/DeFi market, and TVL and user growth have plateaued." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "프로토콜 성장이 KAVA 가격과 연결될 수 있지만, 높은 인플레이션이 가격 상승 여력을 제한합니다. 실질적인 수수료 기반 수익 분배가 강화될 경우 재평가 가능합니다.", en: "Protocol growth can link to KAVA price, but high inflation limits price appreciation potential. Strengthening actual fee-based revenue distribution would warrant re-evaluation." },
        ],
      },
    ],
    verdict: {
      ko: "높은 스테이킹 APY는 사실상 인플레이션 희석이 수반되는 구조입니다. 생태계 성장 잠재력은 있지만 킬러 앱 부재와 치열한 경쟁이 과제입니다.",
      en: "The high staking APY is effectively accompanied by inflation dilution. There is ecosystem growth potential, but the lack of a killer app and intense competition are key challenges.",
    },
    sources: [
      { label: "Kava Official", url: "https://www.kava.io" },
      { label: "Messari: KAVA", url: "https://messari.io/asset/kava" },
    ],
  },

  CHZ: {
    type: "opinion",
    summary: {
      ko: "칠리즈는 축구 클럽, e스포츠 팀 등 스포츠 팬 토큰 플랫폼(Socios.com)을 운영합니다. CHZ는 팬 토큰 구매 수단으로 사용되며, 직접적인 수익 분배나 스테이킹 수익은 없습니다.",
      en: "Chiliz operates the Socios.com sports fan token platform, covering football clubs and esports teams. CHZ is used to purchase fan tokens, with no direct yield or staking rewards.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (수익 없음)", en: "① Tokenomics — Holder Return Rate: 0% (No Yield)" },
        rating: "bad",
        items: [
          { ko: "CHZ 보유자에게 직접 수익이 분배되는 구조가 없습니다. 팬 토큰 판매 수익은 Socios 회사(Chiliz)와 파트너 클럽에 귀속됩니다.", en: "There is no mechanism distributing direct revenue to CHZ holders. Fan token sale proceeds go to Socios (Chiliz) and partner clubs." },
          { ko: "CHZ는 팬 토큰 구매를 위한 기축 통화 역할이지만, 팬 토큰이 인기를 얻으면 CHZ 수요가 증가하는 간접적 연결 고리가 있습니다.", en: "CHZ serves as a base currency for buying fan tokens, providing an indirect link — if fan tokens gain popularity, CHZ demand increases." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "FC 바르셀로나, 파리 생제르맹, 유벤투스 등 세계 최대 축구 클럽과 파트너십을 맺어 강력한 브랜드 인지도를 확보했습니다.", en: "Partnerships with top football clubs like FC Barcelona, PSG, and Juventus give Chiliz strong brand recognition." },
          { ko: "그러나 팬 토큰 시장 자체가 2021~2022년 버블 이후 급격히 위축되었으며, 팬들의 실질적 관심과 참여가 감소하고 있습니다.", en: "However, the fan token market contracted sharply after the 2021-2022 bubble, and real fan engagement and interest are declining." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "플랫폼 성공이 CHZ 가격과 연결되는 구조가 약합니다. 팬 토큰 수요 증가가 CHZ 수요 증가로 이어질 수 있지만, 직접적인 수익 분배 없이는 가격 지지력이 약합니다.", en: "The link between platform success and CHZ price is weak. Fan token demand can increase CHZ demand indirectly, but without direct revenue sharing, price support is limited." },
        ],
      },
    ],
    verdict: {
      ko: "스포츠 팬 토큰이라는 독특한 니치 시장을 선점했지만, CHZ 홀더에게 직접적인 수익이 없고 팬 토큰 시장 자체가 위축 중입니다. 투기적 성격이 강합니다.",
      en: "Chiliz pioneered the unique niche of sports fan tokens, but CHZ holders receive no direct yield and the fan token market is contracting. It remains largely speculative.",
    },
    sources: [
      { label: "Chiliz Official", url: "https://www.chiliz.com" },
      { label: "Socios.com", url: "https://www.socios.com" },
      { label: "Messari: CHZ", url: "https://messari.io/asset/chiliz" },
    ],
  },

  ZRO: {
    type: "opinion",
    summary: {
      ko: "레이어제로는 모든 블록체인을 연결하는 옴니체인 메시징 프로토콜입니다. ZRO는 거버넌스 토큰으로, 수수료의 일부를 기부(Donation) 형식으로 ZRO로 납부하는 선택적 메커니즘이 있지만 홀더에게 직접 분배되지는 않습니다.",
      en: "LayerZero is an omnichain messaging protocol connecting all blockchains. ZRO is its governance token with an optional fee contribution model (paying fees in ZRO as a donation), but there is no direct distribution to ZRO holders.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (거버넌스 전용)", en: "① Tokenomics — Holder Return Rate: 0% (Governance Only)" },
        rating: "bad",
        items: [
          { ko: "ZRO 토큰의 주요 기능은 거버넌스입니다. 수수료 기여(Fee Contribution) 모델이 있지만, 이는 소각이나 홀더 분배로 이어지지 않습니다.", en: "ZRO's primary function is governance. A fee contribution model exists, but it does not lead to burns or holder distributions." },
          { ko: "에어드랍 과정에서 수수료 납부를 요구해 큰 비판을 받았습니다. 토큰 초기 배분 구조도 팀과 투자자 몫이 높아 논란이 되었습니다.", en: "The airdrop requiring fee payment was heavily criticized. Token initial allocation also drew controversy for high team and investor shares." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "레이어제로는 300개 이상의 체인을 연결하며, 크로스체인 메시징 시장의 선두주자입니다. Stargate, STG 등 주요 브리지가 LayerZero 위에 구축되어 있습니다.", en: "LayerZero connects 300+ chains and is the leader in cross-chain messaging. Major bridges like Stargate (STG) are built on LayerZero." },
          { ko: "멀티체인 미래에서 옴니체인 인프라의 수요는 증가할 것으로 예상되며, 프로토콜 자체의 성장 가능성은 높습니다.", en: "In a multi-chain future, demand for omnichain infrastructure is expected to grow, and the protocol's growth potential is high." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "프로토콜이 성공해도 ZRO 홀더에게 그 성과가 귀속되는 구조가 현재 없습니다. 수수료 분배 또는 소각 메커니즘 도입이 필요합니다.", en: "Even if the protocol succeeds, there is currently no mechanism for ZRO holders to capture that value. Fee distribution or burn mechanisms need to be introduced." },
        ],
      },
    ],
    verdict: {
      ko: "프로토콜 자체는 유망하지만, ZRO 토큰의 가치 포착 구조가 매우 취약합니다. 에어드랍 논란까지 더해져 토큰 신뢰도가 낮습니다. 거버넌스 개선이 선행되어야 투자 가치가 생깁니다.",
      en: "The protocol itself is promising, but ZRO's value capture structure is very weak. The airdrop controversy has further damaged token credibility. Governance improvements must come first for investment value to materialize.",
    },
    sources: [
      { label: "LayerZero Official", url: "https://layerzero.network" },
      { label: "Messari: ZRO", url: "https://messari.io/asset/layerzero" },
    ],
  },

  PYTH: {
    type: "opinion",
    summary: {
      ko: "파이스 네트워크는 솔라나 기반의 고속 오라클 프로토콜로, 수백 개의 데이터 피드를 제공합니다. PYTH 스테이킹은 데이터 품질 거버넌스에 참여하는 방식이며, 퍼블리셔·컨슈머 수수료가 PYTH 스테이커에게 직접 분배되지는 않습니다.",
      en: "Pyth Network is a high-speed oracle protocol based on Solana, providing hundreds of data feeds. PYTH staking participates in data quality governance, but fees from publishers and consumers are not directly distributed to PYTH stakers.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 제한적 (거버넌스 중심)", en: "① Tokenomics — Holder Return Rate: Limited (Governance-Focused)" },
        rating: "neutral",
        items: [
          { ko: "PYTH 스테이킹을 통해 거버넌스 및 데이터 품질 검증에 참여할 수 있습니다. 그러나 오라클 이용 수수료가 PYTH 홀더에게 직접 분배되는 구조는 현재 없습니다.", en: "PYTH staking allows participation in governance and data quality verification. However, oracle usage fees are not currently directly distributed to PYTH holders." },
          { ko: "오라클 수요 증가가 PYTH 스테이킹 수요 증가로 이어지는 간접적 연결 고리는 있습니다.", en: "There is an indirect link where increased oracle demand leads to increased PYTH staking demand." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "파이스는 Chainlink 이후 가장 빠르게 성장하는 오라클 네트워크로, 솔라나 생태계를 중심으로 수백 개의 dApp에 데이터를 공급하고 있습니다.", en: "Pyth is the fastest-growing oracle network after Chainlink, supplying data to hundreds of dApps primarily in the Solana ecosystem." },
          { ko: "저레이턴시(400ms) 가격 피드가 차별점이며, DeFi 파생상품 시장의 성장과 함께 수요가 확대될 것으로 기대됩니다.", en: "Low-latency (400ms) price feeds are a differentiator, and demand is expected to grow with the DeFi derivatives market." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "현재는 연결이 간접적입니다. 오라클 사용 증가 → 스테이킹 수요 증가의 간접 루프는 있지만, 직접 수수료 분배 메커니즘 도입 시 가치 포착이 크게 강화될 것입니다.", en: "Currently the connection is indirect. There is a loop of oracle usage → staking demand increase, but direct fee distribution would significantly strengthen value capture." },
        ],
      },
    ],
    verdict: {
      ko: "오라클 시장에서 빠르게 성장하는 프로토콜이지만, PYTH 토큰의 직접적인 수익 분배 구조가 아직 미흡합니다. 수수료 분배 메커니즘이 추가된다면 가치 재평가가 가능합니다.",
      en: "A fast-growing oracle protocol, but PYTH's direct revenue distribution structure is still insufficient. Adding a fee distribution mechanism could enable significant re-evaluation.",
    },
    sources: [
      { label: "Pyth Network", url: "https://pyth.network" },
      { label: "Messari: PYTH", url: "https://messari.io/asset/pyth-network" },
    ],
  },

  IOTA: {
    type: "opinion",
    summary: {
      ko: "IOTA는 DAG(방향성 비순환 그래프) 기반의 무수수료 분산원장입니다. 블록체인이 아닌 탱글(Tangle) 구조를 사용하며 IoT 기기 간 마이크로페이먼트를 목표로 합니다. IOTA 2.0으로의 전환 중이며 복잡한 역사를 가집니다.",
      en: "IOTA is a feeless distributed ledger based on a DAG (Directed Acyclic Graph). It uses the Tangle structure (not a blockchain) and targets micropayments between IoT devices. Currently transitioning to IOTA 2.0 with a complex history.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (무수수료 구조)", en: "① Tokenomics — Holder Return Rate: 0% (Feeless Structure)" },
        rating: "bad",
        items: [
          { ko: "IOTA는 무수수료(Feeless) 설계로 채굴자도 없고 수수료 수익도 없습니다. 따라서 기존 스테이킹 수익 모델 자체가 존재하지 않습니다.", en: "IOTA's feeless design means no miners and no fee revenue. As a result, traditional staking yield models don't exist." },
          { ko: "Shimmer 및 Assembly 에코시스템에서 스테이킹 리워드가 도입되었지만, 이는 신규 발행 기반이며 실질 수익 분배와는 다릅니다.", en: "Staking rewards were introduced in the Shimmer and Assembly ecosystems, but these are new-issuance based, not real revenue distribution." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "IoT + 머신 이코노미라는 비전은 장기적으로 유효하며, IOTA 2.0(코디네이터 제거 + 완전한 탈중앙화)은 오랜 숙제를 해결하는 시도입니다.", en: "The IoT + machine economy vision remains valid long-term, and IOTA 2.0 (removing the Coordinator for full decentralization) addresses longstanding issues." },
          { ko: "다만 개발 지연과 코디네이터(단일 장애점) 오랜 의존이 신뢰를 하락시켰으며, 실제 IoT 채택 사례가 여전히 제한적입니다.", en: "However, development delays and prolonged reliance on the Coordinator (single point of failure) have eroded trust, and real IoT adoption cases remain limited." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "IoT 채택 증가 → IOTA 네트워크 사용 증가 → 가치 상승의 연결 고리는 논리적이지만, 무수수료 구조에서 가치 포착 메커니즘이 불명확합니다.", en: "The logic of IoT adoption → network usage → value appreciation is sound, but in a feeless structure, the value capture mechanism remains unclear." },
        ],
      },
    ],
    verdict: {
      ko: "IoT 특화 무수수료 탈중앙 원장이라는 독특한 비전이 있지만, 오랜 개발 지연과 불명확한 가치 포착 구조가 투자 매력을 저해합니다. IOTA 2.0 성공 여부가 핵심입니다.",
      en: "IOTA has a unique vision as a feeless, decentralized IoT ledger, but prolonged development delays and an unclear value capture structure undermine investment appeal. Success of IOTA 2.0 is the key determinant.",
    },
    sources: [
      { label: "IOTA Foundation", url: "https://www.iota.org" },
      { label: "Messari: IOTA", url: "https://messari.io/asset/iota" },
    ],
  },

  RAY: {
    type: "opinion",
    summary: {
      ko: "레이디엄은 솔라나 최대의 AMM/DEX 프로토콜입니다. 트레이딩 수수료에서 RAY 바이백 프로그램을 운영하며, 연간 수백억 원의 프로토콜 수익이 발생합니다. DeFi 토큰 중 가치 포착 구조가 비교적 명확한 편입니다.",
      en: "Raydium is Solana's largest AMM/DEX protocol. It operates a RAY buyback program funded by trading fees, generating hundreds of millions in annual protocol revenue. Among DeFi tokens, its value capture structure is relatively clear.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 바이백 프로그램", en: "① Tokenomics — Holder Return Rate: Buyback Program" },
        rating: "good",
        items: [
          { ko: "레이디엄은 프로토콜 수수료 일부로 RAY를 시장에서 매입(바이백)합니다. 이는 토큰 공급을 줄이고 가격을 지지하는 직접적 메커니즘입니다.", en: "Raydium uses a portion of protocol fees to buy back RAY from the market. This is a direct mechanism to reduce supply and support the price." },
          { ko: "RAY 스테이킹은 제거되었지만 바이백 구조가 대안적 가치 포착 수단으로 기능합니다. 연간 수익 규모가 바이백 효과를 실질적으로 만들어 줍니다.", en: "RAY staking was removed, but the buyback structure serves as an alternative value capture mechanism. The scale of annual revenue makes the buyback effect meaningful." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "솔라나 생태계의 핵심 DeFi 인프라로, Orca와 함께 솔라나 DEX 시장을 양분합니다. 솔라나의 성장과 함께 직접적인 수혜를 받습니다.", en: "As core DeFi infrastructure in the Solana ecosystem, Raydium co-dominates the Solana DEX market with Orca. It directly benefits from Solana's growth." },
          { ko: "LaunchPad(IDO 플랫폼) 기능도 보유하여 신규 프로젝트 토큰 발행의 허브 역할을 합니다. 밈코인 붐 시기에 거래량이 폭발적으로 증가했습니다.", en: "Raydium also has a LaunchPad (IDO platform) function, serving as a hub for new project token launches. Trading volumes exploded during the meme coin boom." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "거래량 증가 → 수수료 수익 증가 → RAY 바이백 증가 → 가격 지지의 연결 고리가 명확합니다. DeFi 프로토콜 중 가치 포착 구조가 잘 설계된 편입니다.", en: "The link of trading volume → fee revenue → RAY buyback → price support is clear. Among DeFi protocols, the value capture structure is well-designed." },
        ],
      },
    ],
    verdict: {
      ko: "솔라나 DeFi의 핵심 프로토콜로, 바이백 기반의 명확한 가치 포착 구조를 가집니다. 솔라나 생태계 성장과 직결되어 있어 솔라나 강세 시 RAY도 수혜를 받습니다.",
      en: "A core Solana DeFi protocol with a clear buyback-based value capture structure. Directly tied to Solana ecosystem growth, RAY benefits during Solana bull markets.",
    },
    sources: [
      { label: "Raydium Official", url: "https://raydium.io" },
      { label: "DeFiLlama: Raydium", url: "https://defillama.com/protocol/raydium" },
      { label: "Messari: RAY", url: "https://messari.io/asset/raydium" },
    ],
  },

  GMT: {
    type: "opinion",
    summary: {
      ko: "STEPN은 걸으면서 돈을 버는(Move-to-Earn) 앱입니다. GMT는 거버넌스 토큰, GST는 인게임 토큰으로 이원화되어 있습니다. P2E 모델 붕괴 이후 DAU가 정점 대비 급감했으며, GMT 스테이킹은 거버넌스 용도에 그칩니다.",
      en: "STEPN is a Move-to-Earn app. GMT is the governance token and GST is the in-game token. After the P2E model collapsed, DAU dropped sharply from its peak. GMT staking is limited to governance purposes.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (거버넌스 전용)", en: "① Tokenomics — Holder Return Rate: 0% (Governance Only)" },
        rating: "bad",
        items: [
          { ko: "GMT 스테이킹은 거버넌스 참여 목적이며, 앱 수익이 GMT 홀더에게 직접 분배되지 않습니다. 실질적인 홀더 환원 구조가 없습니다.", en: "GMT staking is for governance participation, and app revenue is not directly distributed to GMT holders. There is no substantial holder return structure." },
          { ko: "P2E 붕괴 이후 GST 토큰 가격도 폭락해 게임 내 경제가 무너졌으며, GMT 가격도 정점 대비 90% 이상 하락했습니다.", en: "After the P2E collapse, GST prices also crashed and the in-game economy broke down. GMT is down 90%+ from its peak." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "STEPN은 여전히 운영 중이며, 솔라나 기반 Web3 피트니스 앱 중 인지도가 가장 높습니다. 새로운 기능(STEPN Go 등)을 추가해 부활을 시도하고 있습니다.", en: "STEPN is still operating and has the highest brand recognition among Solana-based Web3 fitness apps. New features like STEPN Go attempt a revival." },
          { ko: "P2E 모델의 구조적 취약성(신규 유입 의존)은 모든 M2E/P2E 앱의 공통 과제이며, 지속 가능한 수익 모델로의 전환이 관건입니다.", en: "The structural weakness of P2E models (dependent on new entrants) is a common issue for all M2E/P2E apps. Transitioning to a sustainable revenue model is key." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "앱 부활에 성공하더라도 GMT 홀더가 그 성과를 직접 얻는 구조가 없습니다. 투기적 기대감에 의존하는 가격 구조입니다.", en: "Even if the app revives, GMT holders have no mechanism to directly capture that success. The price structure relies on speculative expectations." },
        ],
      },
    ],
    verdict: {
      ko: "P2E 버블의 대표적 피해 사례입니다. 앱은 아직 운영 중이지만 GMT 홀더에게 직접 수익이 없고, P2E 구조의 지속 가능성도 낮습니다. 반등은 투기적 기대에만 의존합니다.",
      en: "A representative victim of the P2E bubble. The app still operates but GMT holders receive no direct yield, and P2E model sustainability is low. Any rebound relies purely on speculative expectations.",
    },
    sources: [
      { label: "STEPN Official", url: "https://stepn.com" },
      { label: "Messari: GMT", url: "https://messari.io/asset/stepn" },
    ],
  },

  QTUM: {
    type: "opinion",
    summary: {
      ko: "퀀텀은 비트코인의 UTXO 모델과 이더리움의 EVM을 결합한 하이브리드 스마트 컨트랙트 체인입니다. QTUM 스테이킹으로 약 4~6% APY를 제공하며, PoS 스마트 컨트랙트 체인 중 초기 선구자이지만 현재는 시장 영향력이 미미합니다.",
      en: "Qtum is a hybrid smart contract chain combining Bitcoin's UTXO model with Ethereum's EVM. QTUM staking offers ~4-6% APY. It was an early pioneer among PoS smart contract chains, but its market influence is now minimal.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 4~6%", en: "① Tokenomics — Holder Return Rate: 4–6%" },
        rating: "neutral",
        items: [
          { ko: "QTUM PoS 스테이킹으로 연 4~6% APY를 얻을 수 있습니다. 월렛에 QTUM을 보유하는 것만으로 스테이킹이 가능한 사용자 친화적 구조입니다.", en: "QTUM PoS staking offers ~4-6% APY. Simply holding QTUM in a wallet enables staking, offering a user-friendly structure." },
          { ko: "그러나 낮은 네트워크 활동으로 실질 수수료 수익은 미미하며, 인플레이션 기반 보상이 주를 이룹니다.", en: "However, low network activity means actual fee revenue is minimal, with inflation-based rewards being primary." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "2017~2018년 중국 시장을 중심으로 이더리움 경쟁자로 주목받았으나, 현재는 이더리움·BSC·솔라나에 완전히 밀린 상태입니다.", en: "Once regarded as an Ethereum competitor in the Chinese market in 2017-2018, Qtum has been completely overshadowed by Ethereum, BSC, and Solana." },
          { ko: "신규 dApp 개발이 거의 없으며, TVL 및 개발자 활동이 사실상 정체 상태입니다.", en: "New dApp development is nearly zero, with TVL and developer activity essentially stagnant." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "생태계 성장 없이는 QTUM 가격 상승을 유인할 요인이 없습니다. 스테이킹 수익도 인플레이션 희석으로 실질 가치가 제한됩니다.", en: "Without ecosystem growth, there is no driver for QTUM price appreciation. Staking rewards are also limited in real value due to inflation dilution." },
        ],
      },
    ],
    verdict: {
      ko: "혁신적 하이브리드 설계였지만 경쟁에서 뒤처진 사례입니다. 스테이킹 수익은 있지만 생태계 성장 없이는 장기 투자 매력이 낮습니다.",
      en: "An innovative hybrid design that fell behind in competition. Staking yield exists but long-term investment appeal is low without ecosystem growth.",
    },
    sources: [
      { label: "Qtum Official", url: "https://qtum.org" },
      { label: "Messari: QTUM", url: "https://messari.io/asset/qtum" },
    ],
  },

  ZRX: {
    type: "opinion",
    summary: {
      ko: "0x 프로토콜은 DEX 인프라 레이어로, 다른 DEX들이 0x를 통해 유동성을 집계합니다. ZRX 스테이킹을 통한 수수료 분배 메커니즘이 있었으나 폐지되었고, 현재는 거버넌스 전용 토큰입니다. ZKsync 통합으로 기술적 업그레이드가 진행 중입니다.",
      en: "0x Protocol is a DEX infrastructure layer through which other DEXes aggregate liquidity. A fee distribution mechanism via ZRX staking once existed but was removed. ZRX is now governance-only, with technical upgrades via ZKsync integration ongoing.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (이전에는 있었으나 폐지)", en: "① Tokenomics — Holder Return Rate: 0% (Previously Existed, Now Removed)" },
        rating: "bad",
        items: [
          { ko: "ZRX 스테이킹을 통한 수수료 분배 메커니즘이 존재했으나, 프로토콜 업데이트를 통해 제거되었습니다. 현재는 거버넌스 기능만 남아 있습니다.", en: "A fee distribution mechanism via ZRX staking existed but was removed through a protocol update. Only governance functionality remains." },
          { ko: "기존 가치 포착 구조가 오히려 제거된 사례로, 홀더 환원에 대한 프로토콜의 의지가 의문시됩니다.", en: "This is a case where existing value capture was actually removed, raising questions about the protocol's commitment to holder returns." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "0x는 DEX 애그리게이터 인프라로서 여전히 많은 프로토콜에 사용됩니다. ZK 기술 통합과 전문 마켓메이커(PMM) 지원으로 기술적 발전을 계속하고 있습니다.", en: "0x remains widely used as DEX aggregator infrastructure. Technical progress continues with ZK integration and professional market maker (PMM) support." },
          { ko: "그러나 1inch, Paraswap 등 경쟁 애그리게이터가 성장하면서 시장 내 0x의 점유율이 줄어들고 있습니다.", en: "However, competing aggregators like 1inch and Paraswap are growing, reducing 0x's market share." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "수수료 분배 폐지로 프로토콜 성공과 ZRX 가격의 연결이 끊어졌습니다. 프로토콜이 성장해도 ZRX 홀더에게 그 가치가 귀속되지 않습니다.", en: "The removal of fee distribution severed the link between protocol success and ZRX price. Even as the protocol grows, ZRX holders do not capture that value." },
        ],
      },
    ],
    verdict: {
      ko: "기술적으로 견고한 DEX 인프라이지만, 수수료 분배 폐지로 ZRX 토큰의 가치 포착 구조가 약화되었습니다. 거버넌스 재활성화 없이는 투자 매력이 제한적입니다.",
      en: "Technically solid DEX infrastructure, but the removal of fee distribution has weakened ZRX token value capture. Investment appeal is limited without governance reactivation.",
    },
    sources: [
      { label: "0x Protocol", url: "https://0x.org" },
      { label: "Messari: ZRX", url: "https://messari.io/asset/0x" },
    ],
  },

  "1INCH": {
    type: "opinion",
    summary: {
      ko: "1인치는 이더리움 및 다중 체인의 DEX 애그리게이터입니다. st1INCH 스테이킹을 통해 스왑 수수료 일부와 Fusion 모드 잉여 수익을 분배받을 수 있습니다. DEX 애그리게이터 중 토크노믹스가 비교적 잘 설계된 편입니다.",
      en: "1inch is a DEX aggregator across Ethereum and multiple chains. Through st1INCH staking, holders receive a share of swap fees and Fusion mode surplus. Among DEX aggregators, its tokenomics are relatively well-designed.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 2~4% (수수료 분배)", en: "① Tokenomics — Holder Return Rate: 2–4% (Fee Distribution)" },
        rating: "good",
        items: [
          { ko: "st1INCH 스테이킹을 통해 스왑 수수료 수익 일부와 Fusion 모드(전문 마켓메이커 라우팅) 잉여 수익을 분배받을 수 있습니다.", en: "By staking into st1INCH, holders receive a share of swap fee revenue and Fusion mode (professional market maker routing) surplus revenue." },
          { ko: "DEX 애그리게이터 토큰 중 직접 수익 분배 메커니즘을 구현한 드문 사례이며, 스테이킹 APY는 2~4% 수준입니다.", en: "Among DEX aggregator tokens, this is a rare case of implementing a direct revenue distribution mechanism. Staking APY is approximately 2-4%." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "1인치는 이더리움 기반 DEX 애그리게이터 시장의 선도 프로토콜 중 하나로, 수십억 달러의 월별 거래량을 처리합니다.", en: "1inch is one of the leading Ethereum-based DEX aggregator protocols, processing billions of dollars in monthly trading volume." },
          { ko: "Fusion 모드(전문 마켓메이커 통합)는 기술적 혁신으로, 사용자에게 더 나은 체결 가격을 제공합니다. 다중 체인 확장도 활발합니다.", en: "Fusion mode (professional market maker integration) is a technical innovation offering users better execution prices. Multi-chain expansion is also active." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "거래량 증가 → 수수료 수익 증가 → st1INCH 스테이커 환원 증가의 연결 고리가 존재합니다. DEX 애그리게이터 중 가장 명확한 가치 포착 구조를 가집니다.", en: "A clear link exists: trading volume → fee revenue → st1INCH staker returns. This is one of the clearest value capture structures among DEX aggregators." },
        ],
      },
    ],
    verdict: {
      ko: "DEX 애그리게이터 중 직접 수수료 분배를 구현한 우수한 토크노믹스 사례입니다. 프로토콜 성장과 토큰 가치가 연결되어 있어 DeFi 토큰 중 비교적 매력적인 편입니다.",
      en: "An excellent tokenomics example implementing direct fee distribution among DEX aggregators. With protocol growth linked to token value, it is relatively attractive among DeFi tokens.",
    },
    sources: [
      { label: "1inch Official", url: "https://1inch.io" },
      { label: "DeFiLlama: 1inch", url: "https://defillama.com/protocol/1inch" },
      { label: "Messari: 1INCH", url: "https://messari.io/asset/1inch" },
    ],
  },

  CELO: {
    type: "opinion",
    summary: {
      ko: "셀로는 전화번호 기반 신원 인증으로 모바일 결제를 쉽게 만들기 위해 설계된 블록체인입니다. 기존 독립 체인에서 이더리움 L2로 마이그레이션했으며, CELO 스테이킹으로 약 6% APY를 제공합니다.",
      en: "Celo is a blockchain designed to make mobile payments easy through phone-number-based identity. It migrated from a standalone chain to an Ethereum L2. CELO staking offers approximately 6% APY.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: ~6%", en: "① Tokenomics — Holder Return Rate: ~6%" },
        rating: "neutral",
        items: [
          { ko: "CELO 스테이킹으로 약 6% APY를 얻을 수 있으며, 위임 스테이킹이 지원됩니다. 인플레이션 기반이지만 수익률은 안정적입니다.", en: "CELO staking offers approximately 6% APY with delegated staking supported. Inflation-based but with stable yield." },
          { ko: "이더리움 L2 전환 이후 이더리움 생태계의 수수료 구조와 연동이 될 수 있어, 향후 수익 분배 구조가 개선될 여지가 있습니다.", en: "After migrating to an Ethereum L2, integration with Ethereum's fee structure is possible, leaving room for improved revenue distribution in the future." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "전화번호 기반 Web3 결제라는 명확한 유스케이스가 있으며, 아프리카·라틴아메리카 등 신흥국 모바일 결제 시장을 타겟합니다.", en: "There is a clear use case of phone-number-based Web3 payments, targeting mobile payment markets in emerging economies like Africa and Latin America." },
          { ko: "이더리움 L2 전환은 보안과 유동성 접근성을 높이는 전략적 결정이었으나, 기존 셀로 체인 사용자 이탈이 발생했습니다.", en: "The migration to Ethereum L2 was a strategic decision to improve security and liquidity access, but it caused some existing Celo chain users to leave." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "모바일 결제 채택 증가 → 네트워크 활동 증가 → CELO 수요 증가의 연결 고리는 논리적입니다. L2 전환 이후 구조가 이전보다 명확해졌습니다.", en: "The link of mobile payment adoption → network activity → CELO demand is logical. The structure has become clearer after the L2 migration." },
        ],
      },
    ],
    verdict: {
      ko: "신흥국 모바일 결제라는 의미있는 유스케이스를 가진 프로젝트입니다. 이더리움 L2 전환은 긍정적 방향이지만, 실질 채택 성과가 아직 제한적입니다.",
      en: "A project with a meaningful use case in emerging market mobile payments. The Ethereum L2 migration is a positive direction, but real adoption results remain limited.",
    },
    sources: [
      { label: "Celo Official", url: "https://celo.org" },
      { label: "Messari: CELO", url: "https://messari.io/asset/celo" },
    ],
  },

  ZK: {
    type: "opinion",
    summary: {
      ko: "zkSync Era는 이더리움의 ZK 롤업 레이어2로, Matter Labs가 개발했습니다. ZK 토큰은 거버넌스 토큰으로 수수료 분배 구조가 없습니다. ARB·OP와 유사한 순수 거버넌스 토큰이며, 논란 많은 에어드랍으로 초기 신뢰를 잃었습니다.",
      en: "zkSync Era is an Ethereum ZK rollup Layer 2 developed by Matter Labs. The ZK token is a governance token with no fee distribution structure — a pure governance token similar to ARB and OP — that lost early credibility from a controversial airdrop.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (거버넌스 전용)", en: "① Tokenomics — Holder Return Rate: 0% (Governance Only)" },
        rating: "bad",
        items: [
          { ko: "ZK 토큰은 순수 거버넌스 토큰으로, zkSync Era의 시퀀서 수익이나 트랜잭션 수수료가 ZK 홀더에게 분배되지 않습니다.", en: "ZK is a pure governance token. zkSync Era sequencer revenue and transaction fees are not distributed to ZK holders." },
          { ko: "Matter Labs가 대규모 토큰을 보유하고 있으며, 에어드랍 기준이 불투명해 커뮤니티의 신뢰를 크게 손상시켰습니다.", en: "Matter Labs holds a large token allocation, and opaque airdrop criteria significantly damaged community trust." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "zkSync Era는 이더리움 ZK 롤업 시장에서 Starknet과 함께 선도 프로젝트입니다. ZK 기술 자체의 성장과 함께 프로토콜 사용량이 증가하고 있습니다.", en: "zkSync Era is a leading project in the Ethereum ZK rollup market alongside Starknet. Protocol usage is growing with ZK technology adoption." },
          { ko: "기술적으로는 Optimistic 롤업 대비 더 빠른 최종성과 이더리움 수준의 보안을 제공합니다. ZK Stack으로 다른 체인도 zkSync 기술을 활용 가능합니다.", en: "Technically, it offers faster finality and Ethereum-level security compared to Optimistic rollups. ZK Stack allows other chains to leverage zkSync technology." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "현재는 연결이 없습니다. zkSync가 아무리 성장해도 ZK 홀더에게 그 가치가 귀속되지 않습니다. 수수료 분배 메커니즘 도입이 핵심 과제입니다.", en: "Currently there is no connection. No matter how much zkSync grows, ZK holders do not capture that value. Introducing a fee distribution mechanism is the key challenge." },
        ],
      },
    ],
    verdict: {
      ko: "ZK 기술 자체는 유망하지만, ZK 토큰은 가치 포착 구조가 없는 순수 거버넌스 토큰입니다. 에어드랍 논란까지 더해져 투자 매력이 낮습니다. ARB·OP와 같은 구조적 한계를 가집니다.",
      en: "ZK technology itself is promising, but the ZK token is a pure governance token with no value capture structure. Combined with the airdrop controversy, investment appeal is low. It shares the same structural limitations as ARB and OP.",
    },
    sources: [
      { label: "zkSync Era", url: "https://zksync.io" },
      { label: "Messari: ZK", url: "https://messari.io/asset/zksync" },
    ],
  },

  ASTR: {
    type: "opinion",
    summary: {
      ko: "아스타 네트워크는 폴카닷 파라체인이자 EVM을 지원하는 멀티VM 스마트 컨트랙트 플랫폼입니다. dApp 스테이킹 메커니즘을 통해 ASTR 스테이커와 dApp 개발자 모두에게 보상이 분배되며, 약 10% APY를 제공합니다.",
      en: "Astar Network is a Polkadot parachain and multi-VM smart contract platform supporting EVM. Its dApp staking mechanism distributes rewards to both ASTR stakers and dApp developers, offering approximately 10% APY.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: ~10% (dApp 스테이킹)", en: "① Tokenomics — Holder Return Rate: ~10% (dApp Staking)" },
        rating: "good",
        items: [
          { ko: "dApp 스테이킹은 ASTR 홀더가 특정 dApp을 지지하며 스테이킹할 수 있는 독특한 메커니즘입니다. 스테이킹 보상이 홀더와 dApp 개발자에게 동시에 분배됩니다.", en: "dApp staking is a unique mechanism where ASTR holders stake to support specific dApps. Staking rewards are distributed to both holders and dApp developers simultaneously." },
          { ko: "프로토콜 수수료 일부가 스테이킹 보상으로 환류되는 구조로, 인플레이션과 실수익의 혼합 형태입니다. APY는 약 10%입니다.", en: "Protocol fees partially cycle back as staking rewards — a mix of inflation and real revenue. APY is approximately 10%." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "폴카닷 파라체인 중 가장 활발한 EVM 체인으로, 일본 시장에서 특히 강한 브랜드 인지도를 가집니다. Sony 등 기업과의 파트너십도 보유합니다.", en: "The most active EVM chain among Polkadot parachains, with particularly strong brand recognition in the Japanese market. Holds partnerships with companies like Sony." },
          { ko: "폴카닷 생태계 자체의 성장 정체가 아스타에도 제약이 되고 있습니다. 독립적인 생태계 확장이 과제입니다.", en: "Stagnant growth in the Polkadot ecosystem is a constraint for Astar as well. Independent ecosystem expansion is a key challenge." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "dApp 스테이킹 구조로 네트워크 성장 → ASTR 스테이킹 수요 증가 → 가격 지지의 연결 고리가 합리적입니다. 폴카닷 체인 중 토크노믹스가 잘 설계된 편입니다.", en: "The dApp staking structure creates a reasonable link: network growth → ASTR staking demand → price support. Among Polkadot chains, the tokenomics are well-designed." },
        ],
      },
    ],
    verdict: {
      ko: "폴카닷 파라체인 중 dApp 스테이킹이라는 독특한 홀더 환원 구조를 가진 프로젝트입니다. 폴카닷 생태계의 성장 정체가 제약이지만, 토크노믹스 설계 면에서 비교적 우수합니다.",
      en: "A Polkadot parachain with the unique dApp staking holder return structure. Growth stagnation in the Polkadot ecosystem is a constraint, but the tokenomics design is relatively strong.",
    },
    sources: [
      { label: "Astar Network", url: "https://astar.network" },
      { label: "Messari: ASTR", url: "https://messari.io/asset/astar" },
    ],
  },

  BLAST: {
    type: "opinion",
    summary: {
      ko: "블라스트는 ETH 및 스테이블코인 예치 시 기본 수익(Native Yield)을 제공하는 이더리움 L2입니다. ETH 스테이킹 수익과 T-빌 수익을 사용자에게 자동 지급하지만, BLAST 거버넌스 토큰 홀더에게 시퀀서 수익은 분배되지 않습니다.",
      en: "Blast is an Ethereum L2 offering native yield on ETH and stablecoin deposits. ETH staking rewards and T-bill yields are automatically passed to users, but sequencer revenue is not distributed to BLAST governance token holders.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (토큰 홀더 기준)", en: "① Tokenomics — Holder Return Rate: 0% (For Token Holders)" },
        rating: "bad",
        items: [
          { ko: "네이티브 수익은 BLAST 토큰 홀더가 아닌 L2에 ETH/스테이블코인을 예치한 사용자에게 돌아갑니다. BLAST 토큰을 단순 보유하는 것으로는 수익이 없습니다.", en: "Native yield goes to users who deposit ETH/stablecoins on the L2, not to BLAST token holders. Simply holding BLAST tokens generates no income." },
          { ko: "시퀀서 운영 수익도 BLAST 토큰 홀더에게 분배되지 않습니다. 거버넌스 전용 토큰 구조입니다.", en: "Sequencer operation revenue is also not distributed to BLAST token holders. It is a governance-only token structure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "네이티브 수익이라는 독특한 차별점으로 출시 초기 빠른 TVL 성장을 이뤘으나, 이더리움 L2 경쟁이 치열하고 차별성이 유지되기 어렵습니다.", en: "The unique native yield differentiator drove rapid TVL growth at launch, but Ethereum L2 competition is fierce and differentiation is hard to sustain." },
          { ko: "Pacman(창립자)의 강한 커뮤니티 마케팅이 초기 성장을 이끌었으나, 실질적인 dApp 생태계 구축이 과제입니다.", en: "Pacman's (founder) strong community marketing drove initial growth, but building a real dApp ecosystem remains a challenge." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "L2가 성공해도 BLAST 토큰 홀더에게 그 가치가 귀속되지 않습니다. 수익이 사용자에게 가고 토큰 홀더는 거버넌스 권한만 있습니다.", en: "Even if the L2 succeeds, BLAST token holders do not capture that value. Revenue goes to users, and token holders have only governance rights." },
        ],
      },
    ],
    verdict: {
      ko: "네이티브 수익이라는 독창적인 L2 혁신이지만, BLAST 토큰 홀더에게는 아무 수익이 없습니다. 프로토콜과 토큰의 성공이 분리된 구조로, 토큰 투자 매력이 낮습니다.",
      en: "An innovative L2 with native yield, but BLAST token holders receive no revenue whatsoever. Protocol and token success are decoupled, making the token a poor investment vehicle.",
    },
    sources: [
      { label: "Blast L2 Official", url: "https://blast.io" },
      { label: "DeFiLlama: Blast", url: "https://defillama.com/chain/Blast" },
    ],
  },

  ZETA: {
    type: "opinion",
    summary: {
      ko: "제타체인은 브리지 없이 모든 블록체인을 연결하는 옴니체인 L1입니다. 비트코인, 이더리움, 솔라나 등 모든 체인의 자산을 직접 처리할 수 있는 것이 핵심 차별점입니다. ZETA 스테이킹으로 약 15~20% APY를 제공하지만 높은 인플레이션이 수반됩니다.",
      en: "ZetaChain is an omnichain L1 that connects all blockchains without bridges. The key differentiator is the ability to directly handle assets from all chains including Bitcoin, Ethereum, and Solana. ZETA staking offers ~15-20% APY but comes with high inflation.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 15~20% (인플레이션 주도)", en: "① Tokenomics — Holder Return Rate: 15–20% (Inflation-Driven)" },
        rating: "neutral",
        items: [
          { ko: "ZETA 스테이킹 APY는 15~20%로 높지만, 이는 인플레이션에서 비롯된 것이 대부분입니다. 스테이킹하지 않으면 보유 가치가 빠르게 희석됩니다.", en: "ZETA staking APY is high at 15-20%, but most comes from inflation. Not staking means your holdings are rapidly diluted." },
          { ko: "교차 체인 메시지 및 트랜잭션 수수료가 ZETA로 납부되어 실질 수요가 있지만, 수수료 수익의 스테이커 분배 구조는 아직 초기 단계입니다.", en: "Cross-chain messages and transaction fees are paid in ZETA creating real demand, but the structure for distributing fee revenue to stakers is still early-stage." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "비트코인을 브리지 없이 활용할 수 있는 능력은 독보적인 차별점입니다. 레이어제로·와름홀과는 다른 접근으로 자체 L1을 통한 범용 체인 연결을 시도합니다.", en: "The ability to use Bitcoin without bridges is a unique differentiator. Its approach differs from LayerZero/Wormhole — connecting all chains via its own L1." },
          { ko: "그러나 유니버설 EVM(ZEVM)을 개발자가 이해하고 활용하기 어려운 복잡성이 있으며, 생태계 구축 속도가 느립니다.", en: "However, the Universal EVM (ZEVM) is complex for developers to understand and utilize, and ecosystem building has been slow." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "크로스체인 활동 증가 → ZETA 수수료 수요 증가의 연결 고리는 논리적입니다. 그러나 높은 인플레이션이 가격 상승을 제한합니다. 수수료 분배 구조 강화 시 재평가 가능합니다.", en: "The link of cross-chain activity → ZETA fee demand is logical. However, high inflation limits price appreciation. Re-evaluation is possible if fee distribution is strengthened." },
        ],
      },
    ],
    verdict: {
      ko: "비트코인 브리지리스 연결이라는 독특한 비전을 가진 프로젝트입니다. 그러나 높은 인플레이션 APY와 생태계 초기 단계가 투자 매력을 제한합니다. 생태계 성숙 후 재평가 대상입니다.",
      en: "A project with a unique vision of bridgeless Bitcoin connectivity. However, high inflation APY and an early-stage ecosystem limit investment appeal. A candidate for re-evaluation after ecosystem maturity.",
    },
    sources: [
      { label: "ZetaChain Official", url: "https://www.zetachain.com" },
      { label: "Messari: ZETA", url: "https://messari.io/asset/zetachain" },
    ],
  },

  ARKM: {
    type: "opinion",
    summary: {
      ko: "아캄 인텔리전스는 온체인 주소와 실제 주체(기업·개인)를 연결하는 블록체인 인텔리전스 플랫폼입니다. Intel Exchange를 통해 정보를 사고팔 수 있습니다. ARKM은 거버넌스 토큰으로, 플랫폼 수수료가 ARKM 홀더에게 분배되지 않습니다.",
      en: "Arkham Intelligence is a blockchain intelligence platform linking on-chain addresses to real-world entities (companies/individuals). Intel Exchange allows buying and selling intelligence. ARKM is a governance token — platform fees are not distributed to ARKM holders.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (거버넌스 전용)", en: "① Tokenomics — Holder Return Rate: 0% (Governance Only)" },
        rating: "bad",
        items: [
          { ko: "Intel Exchange 거래 수수료 및 플랫폼 구독 수익이 ARKM 홀더에게 직접 분배되지 않습니다. 거버넌스 기능만 존재합니다.", en: "Intel Exchange transaction fees and platform subscription revenue are not directly distributed to ARKM holders. Only governance functionality exists." },
          { ko: "ARKM은 Intel Exchange에서 거래 수단으로 사용되어 실질적인 유틸리티 수요가 있습니다. 그러나 이것이 홀더 환원으로 이어지는 구조는 아닙니다.", en: "ARKM is used as a medium of exchange on Intel Exchange, creating real utility demand. However, this does not translate into a holder return structure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "온체인 인텔리전스 시장은 규제 당국, 기관 투자자, 개인 트레이더 모두에게 수요가 증가하고 있습니다. 아캄은 이 시장에서 선도적 포지션을 확보하고 있습니다.", en: "Demand for on-chain intelligence is growing among regulators, institutional investors, and retail traders. Arkham holds a leading position in this market." },
          { ko: "도나이세이션(Doxxing) 논란에도 불구하고 플랫폼 사용자와 Intel Exchange 거래량이 꾸준히 성장하고 있습니다.", en: "Despite doxxing controversies, platform users and Intel Exchange trading volume are steadily growing." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "플랫폼 사용 증가 → ARKM 유틸리티 수요 증가의 간접 연결 고리가 있습니다. 그러나 직접 수익 분배 없이는 가격 지지력이 제한적입니다. 수수료 분배 도입 시 재평가 가능합니다.", en: "There is an indirect link of platform usage → ARKM utility demand increase. But without direct revenue distribution, price support is limited. Introduction of fee distribution would warrant re-evaluation." },
        ],
      },
    ],
    verdict: {
      ko: "블록체인 인텔리전스라는 독특하고 성장하는 시장을 선점한 프로토콜입니다. 그러나 ARKM 토큰의 직접 수익 분배 구조가 없어, 플랫폼 성공과 토큰 가치의 연결이 약합니다.",
      en: "A protocol that has captured a unique and growing blockchain intelligence market. However, without a direct revenue distribution structure, the link between platform success and ARKM token value is weak.",
    },
    sources: [
      { label: "Arkham Intelligence", url: "https://platform.arkhamintelligence.com" },
      { label: "Messari: ARKM", url: "https://messari.io/asset/arkham" },
    ],
  },

  STG: {
    type: "opinion",
    summary: {
      ko: "스타게이트 파이낸스는 레이어제로 기반의 크로스체인 유동성 프로토콜입니다. veSTG 스테이킹을 통해 브리지 수수료 수익이 분배됩니다. 크로스체인 브리지 토큰 중 홀더 환원 구조가 비교적 명확한 편입니다.",
      en: "Stargate Finance is a cross-chain liquidity protocol built on LayerZero. Bridge fee revenue is distributed via veSTG staking. Among cross-chain bridge tokens, its holder return structure is relatively clear.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 수수료 분배 (veSTG)", en: "① Tokenomics — Holder Return Rate: Fee Distribution (veSTG)" },
        rating: "good",
        items: [
          { ko: "STG를 잠금(Lock)하여 veSTG를 획득하면 프로토콜 브리지 수수료 수익의 일부를 분배받을 수 있습니다. 크로스체인 브리지 이용량이 수익과 직결됩니다.", en: "Locking STG to obtain veSTG allows receiving a share of protocol bridge fee revenue. Cross-chain bridge usage directly translates to revenue." },
          { ko: "수익 분배 APY는 브리지 거래량에 따라 변동되며, 시장 활성화 시 수익이 높아지는 구조입니다.", en: "Revenue distribution APY varies with bridge volume — higher market activity means higher yield, creating an aligned incentive structure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "스타게이트는 레이어제로 위에서 가장 큰 크로스체인 유동성 프로토콜입니다. 통합 유동성 풀(Unified Liquidity Pool) 모델로 기존 브리지의 분절된 유동성 문제를 해결합니다.", en: "Stargate is the largest cross-chain liquidity protocol on LayerZero. Its unified liquidity pool model solves the fragmented liquidity problem of traditional bridges." },
          { ko: "멀티체인 DeFi 성장과 함께 크로스체인 브리지 수요는 지속 증가할 것으로 예상됩니다. LayerZero 생태계의 성장이 직접적인 수혜가 됩니다.", en: "Cross-chain bridge demand is expected to keep growing with multi-chain DeFi expansion. LayerZero ecosystem growth directly benefits Stargate." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "브리지 거래량 증가 → STG 수수료 수익 증가 → veSTG 스테이커 환원 증가의 연결 고리가 명확합니다. 크로스체인 브리지 토큰 중 가장 명확한 가치 포착 구조를 가집니다.", en: "The link of bridge volume → STG fee revenue → veSTG staker returns is clear. Among cross-chain bridge tokens, this is the clearest value capture structure." },
        ],
      },
    ],
    verdict: {
      ko: "크로스체인 브리지 토큰 중 veSTG를 통한 수수료 분배로 가장 잘 설계된 토크노믹스를 가집니다. 멀티체인 DeFi 성장과 함께 수혜를 받으며, LayerZero 생태계 성장의 직접적 수익자입니다.",
      en: "Among cross-chain bridge tokens, STG has the best-designed tokenomics via veSTG fee distribution. It benefits from multi-chain DeFi growth and is a direct beneficiary of LayerZero ecosystem expansion.",
    },
    sources: [
      { label: "Stargate Finance", url: "https://stargate.finance" },
      { label: "DeFiLlama: Stargate", url: "https://defillama.com/protocol/stargate" },
      { label: "Messari: STG", url: "https://messari.io/asset/stargate-finance" },
    ],
  },

  BONK: {
    type: "opinion",
    summary: {
      ko: "BONK는 솔라나 생태계의 밈코인으로 2022년 말 솔라나 커뮤니티에 무료 배포되며 등장했습니다. 실용적 기능 없이 순수 커뮤니티·밈 투기 자산입니다.",
      en: "BONK is a Solana ecosystem meme coin airdropped to the Solana community in late 2022. It has no utility and is purely a community meme speculation asset.",
    },
    verdict: {
      ko: "순수 밈. 소각 이벤트 간헐적 존재하나 홀더 환원 구조 없음. 커뮤니티 모멘텀에만 의존.",
      en: "Pure meme. Occasional burn events exist but no holder return structure. Relies entirely on community momentum.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "스테이킹 없음, 수수료 분배 없음, 바이백 없음. 간헐적 소각 이벤트는 있으나 구조적 환원 메커니즘이 아닙니다.", en: "No staking, no fee distribution, no buyback. Occasional burn events exist but these are not structural return mechanisms." },
          { ko: "총 공급량의 50%가 솔라나 커뮤니티에 에어드랍됐으며, 나머지 물량 덤핑 압력이 상존합니다.", en: "50% of total supply was airdropped to the Solana community, with persistent sell pressure from remaining allocations." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "솔라나 생태계 부흥과 함께 상징적 밈코인으로 자리잡았습니다. DEX 유동성, NFT, 게임 등 일부 생태계 통합 시도가 있습니다.", en: "Established itself as the symbolic meme coin alongside Solana's ecosystem revival. Some ecosystem integrations in DEX liquidity, NFTs, and gaming." },
          { ko: "밈코인 시장 자체의 사이클 의존도가 매우 높습니다. 솔라나 생태계 침체 시 직격탄을 받습니다.", en: "Highly dependent on meme coin market cycles. Directly hit when the Solana ecosystem slows down." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "프로토콜 '성공' 개념 자체가 없습니다. 가격은 오직 투기 수요와 커뮤니티 바이럴에만 연동됩니다.", en: "There is no concept of protocol 'success.' Price is linked solely to speculative demand and community virality." },
        ],
      },
    ],
    sources: [
      { label: "BONK 공식", url: "https://bonkcoin.com" },
      { label: "CoinGecko: BONK", url: "https://www.coingecko.com/en/coins/bonk" },
    ],
  },

  JUP: {
    type: "opinion",
    summary: {
      ko: "Jupiter는 솔라나 최대 DEX 애그리게이터로, JUP 토큰 스테이커에게 수수료의 50%를 분배하는 구조를 갖추고 있습니다. 솔라나 DeFi 생태계에서 핵심 인프라 역할을 합니다.",
      en: "Jupiter is Solana's largest DEX aggregator, distributing 50% of fees to JUP token stakers. It serves as core infrastructure in the Solana DeFi ecosystem.",
    },
    verdict: {
      ko: "솔라나 DeFi 1위 포지션 + 실질 수수료 분배 구조. DeFi 중 드물게 좋은 토크노믹스.",
      en: "Top Solana DeFi position + actual fee distribution structure. Rare example of good tokenomics in DeFi.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 수수료 50% 분배", en: "① Tokenomics — Holder Return Rate: 50% Fee Share" },
        rating: "good",
        items: [
          { ko: "JUP 스테이킹 시 프로토콜 수수료의 50%를 받습니다. 실질적인 현금흐름이 토큰 홀더에게 귀속되는 구조입니다.", en: "JUP stakers receive 50% of protocol fees. A structure where actual cash flow accrues to token holders." },
          { ko: "나머지 50%는 프로토콜 개발 및 생태계 펀드로 재투자됩니다. 지속가능한 분배 비율입니다.", en: "The remaining 50% is reinvested into protocol development and ecosystem funds — a sustainable distribution ratio." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "솔라나 DEX 거래량의 70% 이상이 Jupiter를 통해 라우팅됩니다. 경쟁자가 없는 시장 지배력을 가집니다.", en: "Over 70% of Solana DEX volume routes through Jupiter. It holds dominant market share with no comparable competitor." },
          { ko: "퍼페추얼 거래소, 리밋 오더, 달러코스트 평균(DCA) 등 기능 확장으로 수익 다각화 중입니다.", en: "Expanding revenue via perpetuals exchange, limit orders, and dollar-cost averaging (DCA) features." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 거래량 증가 → 수수료 증가 → 스테이킹 APY 증가 → 토큰 수요 증가의 선순환 구조가 명확합니다.", en: "Clearly connected. Increased volume → higher fees → higher staking APY → increased token demand. A clear virtuous cycle." },
        ],
      },
    ],
    sources: [
      { label: "Jupiter 공식", url: "https://jup.ag" },
      { label: "Jupiter Tokenomics", url: "https://station.jup.ag/docs/tokenomics" },
      { label: "DefiLlama: Jupiter", url: "https://defillama.com/protocol/jupiter" },
    ],
  },

  JTO: {
    type: "opinion",
    summary: {
      ko: "Jito는 솔라나의 MEV(최대 추출 가치) 인프라 및 리퀴드 스테이킹 프로토콜입니다. JTO 홀더는 거버넌스 참여와 MEV 팁 수익의 일부를 받습니다.",
      en: "Jito is Solana's MEV infrastructure and liquid staking protocol. JTO holders receive governance rights and a share of MEV tip revenue.",
    },
    verdict: {
      ko: "솔라나 MEV 독점 인프라 + 실질 수익 분배. 강한 토크노믹스와 높은 해자.",
      en: "Monopoly MEV infrastructure on Solana + real revenue sharing. Strong tokenomics and high moat.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: MEV 수익 분배 (~3-5% APY)", en: "① Tokenomics — Holder Return Rate: MEV Revenue Share (~3-5% APY)" },
        rating: "good",
        items: [
          { ko: "JTO 스테이킹을 통해 Jito 프로토콜의 MEV 팁 수익 일부를 받습니다. 실제 네트워크 활동에서 발생하는 현금흐름입니다.", en: "JTO staking provides a share of Jito's MEV tip revenue — real cash flow derived from actual network activity." },
          { ko: "jitoSOL 리퀴드 스테이킹의 관리 수수료도 JTO 거버넌스가 통제합니다. 수익원이 다양합니다.", en: "JTO governance also controls management fees from jitoSOL liquid staking, providing diversified revenue sources." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "솔라나 MEV 번들 시장의 90%+ 점유율을 가집니다. 밸리데이터 소프트웨어로서 교체 비용이 매우 높습니다.", en: "Holds 90%+ share of the Solana MEV bundle market. As validator software, switching costs are extremely high." },
          { ko: "jitoSOL TVL은 수십억 달러 규모로, 솔라나 리퀴드 스테이킹 1~2위를 다툽니다.", en: "jitoSOL TVL is in the billions, competing for the #1-2 spot in Solana liquid staking." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 솔라나 거래량 증가 → MEV 팁 증가 → JTO 수익 증가 → 토큰 가치 상승의 구조가 직접적입니다.", en: "Connected. More Solana volume → more MEV tips → higher JTO revenue → rising token value. The link is direct." },
        ],
      },
    ],
    sources: [
      { label: "Jito 공식", url: "https://www.jito.network" },
      { label: "Jito Labs", url: "https://jito.wtf" },
      { label: "DefiLlama: Jito", url: "https://defillama.com/protocol/jito" },
    ],
  },

  ENA: {
    type: "opinion",
    summary: {
      ko: "Ethena는 합성 달러 USDe를 발행하는 프로토콜로, 영구 선물 펀딩 수익으로 sUSDe 스테이킹에 10~30% APY를 제공합니다. 혁신적이지만 펀딩 수익 의존이라는 고위험 구조입니다.",
      en: "Ethena is a synthetic dollar protocol issuing USDe, offering 10-30% APY to sUSDe stakers through perpetual futures funding income. Innovative but high-risk due to funding rate dependency.",
    },
    verdict: {
      ko: "혁신적 수익 구조이나 펀딩이 마이너스로 전환되면 수익 소멸. 불장엔 강하고 하락장엔 취약한 비대칭 리스크.",
      en: "Innovative yield structure but returns disappear if funding goes negative. Strong in bull markets, vulnerable in bear markets — asymmetric risk.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: sUSDe 10~30% APY (조건부)", en: "① Tokenomics — Holder Return Rate: sUSDe 10-30% APY (conditional)" },
        rating: "neutral",
        items: [
          { ko: "sUSDe 스테이킹 수익은 프로토콜이 숏 포지션으로 수취하는 영구 선물 펀딩 수수료에서 옵니다. 불장에서 매우 높은 수익률을 제공합니다.", en: "sUSDe staking yield comes from perpetual futures funding fees collected via the protocol's short positions. Delivers very high returns in bull markets." },
          { ko: "단, 시장이 하락장으로 전환되어 펀딩이 마이너스가 되면 수익이 0 이하로 떨어질 수 있습니다. 준비금(insurance fund)이 완충 역할을 하나 한계가 있습니다.", en: "However, if the market turns bearish and funding goes negative, yields can drop below zero. An insurance fund provides a buffer, but it has limits." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "USDe는 출시 후 빠르게 스테이블코인 시장 3~4위 규모(수십억 달러)로 성장했습니다. 시장 수요가 입증됐습니다.", en: "USDe quickly grew to become the 3rd-4th largest stablecoin (billions) after launch. Market demand is proven." },
          { ko: "거래소들이 USDe를 담보로 수용하기 시작하여 실용성이 확장 중입니다.", en: "Exchanges are beginning to accept USDe as collateral, expanding its practical utility." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "ENA 토큰은 거버넌스 역할이 주이며, 수익의 일부가 ENA 홀더에게도 분배되는 구조가 논의됩니다. 현재는 sUSDe가 수익 포착의 핵심이고 ENA는 간접적입니다.", en: "ENA tokens primarily serve governance. A portion of profits distributed to ENA holders is under discussion. Currently sUSDe captures the yield; ENA's link is indirect." },
        ],
      },
    ],
    sources: [
      { label: "Ethena 공식", url: "https://www.ethena.fi" },
      { label: "Ethena Docs", url: "https://docs.ethena.fi" },
      { label: "DefiLlama: Ethena", url: "https://defillama.com/protocol/ethena" },
    ],
  },

  PENDLE: {
    type: "opinion",
    summary: {
      ko: "Pendle은 수익률 토큰화(yield tokenization) DeFi 프로토콜로, vePENDLE 홀더가 스왑 수수료의 80%와 수익을 받습니다. TVL 20억 달러+ 규모의 탁월한 토크노믹스를 자랑합니다.",
      en: "Pendle is a yield tokenization DeFi protocol where vePENDLE holders receive 80% of swap fees plus yields. It boasts excellent tokenomics with TVL of $2B+.",
    },
    verdict: {
      ko: "DeFi 최고 수준의 토크노믹스. vePENDLE 잠금 시 실질 수익. 수익률 시장 선구자.",
      en: "Best-in-class DeFi tokenomics. Real returns for vePENDLE lockers. Pioneer of the yield rate market.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 스왑 수수료 80% 분배", en: "① Tokenomics — Holder Return Rate: 80% Swap Fee Distribution" },
        rating: "good",
        items: [
          { ko: "PENDLE을 vePENDLE로 잠그면 프로토콜 스왑 수수료의 80%를 받습니다. 업계 최고 수준의 홀더 환원율입니다.", en: "Locking PENDLE as vePENDLE grants 80% of protocol swap fees — one of the highest holder return rates in the industry." },
          { ko: "vePENDLE은 SY(Standardized Yield) 토큰 수익도 일부 수취하며, 풀 인센티브 투표권(게이지)도 보유합니다.", en: "vePENDLE also receives a portion of SY (Standardized Yield) token income and holds pool incentive voting rights (gauge)." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "TVL 20억 달러 이상. 이더리움 LSD, RWA 수익률 등 다양한 자산의 수익률을 고정/변동으로 분리하여 거래할 수 있는 독보적 시장을 만들었습니다.", en: "TVL exceeds $2B. Created a unique market for trading fixed/variable yields on diverse assets like Ethereum LSDs and RWA yields." },
          { ko: "Ethena, Renzo, EtherFi 등 주요 DeFi 프로토콜들이 Pendle에 풀을 개설하며 생태계가 확장 중입니다.", en: "Major DeFi protocols like Ethena, Renzo, and EtherFi are opening pools on Pendle, expanding its ecosystem." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "명확히 연결됩니다. TVL 증가 → 거래량 증가 → 수수료 증가 → vePENDLE 수익 증가 → 잠금 수요 증가 → 유통량 감소 → 토큰 가치 상승.", en: "Clearly connected. More TVL → more volume → higher fees → more vePENDLE income → locking demand rises → circulating supply falls → token value rises." },
        ],
      },
    ],
    sources: [
      { label: "Pendle 공식", url: "https://www.pendle.finance" },
      { label: "Pendle Docs", url: "https://docs.pendle.finance" },
      { label: "DefiLlama: Pendle", url: "https://defillama.com/protocol/pendle" },
    ],
  },

  ONDO: {
    type: "opinion",
    summary: {
      ko: "Ondo Finance는 미국 국채 등 실물 자산(RWA)을 온체인으로 토큰화하는 프로토콜입니다. BlackRock과의 협력으로 주목받지만, ONDO 토큰은 현재 거버넌스 기능만 있고 수수료 분배가 없습니다.",
      en: "Ondo Finance tokenizes real-world assets (RWA) like US Treasuries on-chain. Gaining attention through a BlackRock partnership, but the ONDO token currently only has governance utility with no fee sharing.",
    },
    verdict: {
      ko: "RWA 섹터 선두주자, 기관 신뢰도 높음. 그러나 토큰 홀더 환원 없는 것이 핵심 약점. 향후 수익 구조 추가 여부가 관건.",
      en: "Leading RWA sector player with high institutional credibility. However, no token holder return is the key weakness. Whether revenue sharing is added in the future is the key question.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (거버넌스 전용)", en: "① Tokenomics — Holder Return Rate: 0% (Governance Only)" },
        rating: "bad",
        items: [
          { ko: "ONDO 토큰은 현재 거버넌스 투표권만 있으며, 프로토콜 수수료 분배가 없습니다. 프로토콜 성장이 토큰 보유자에게 직접 귀속되지 않습니다.", en: "ONDO tokens currently only carry governance voting rights with no protocol fee distribution. Protocol growth does not directly accrue to token holders." },
          { ko: "Ondo Finance의 수익(RWA 운용 수수료)은 회사 법인에 귀속됩니다. 토큰과의 법적 분리 구조입니다.", en: "Ondo Finance's revenue (RWA management fees) accrues to the corporate entity — a legal separation structure from the token." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "BlackRock BUIDL 펀드와 협력하는 등 기관급 신뢰를 확보했습니다. RWA 온체인화는 트릴리언 달러 규모 시장으로, Ondo는 최전선에 있습니다.", en: "Has secured institutional-grade credibility by partnering with BlackRock's BUIDL fund. RWA tokenization is a trillion-dollar market, and Ondo is at the forefront." },
          { ko: "OUSG(단기 국채 펀드), USDY(수익형 달러) 등 제품이 빠르게 성장 중이며, 규제 친화적 포지션을 유지합니다.", en: "Products like OUSG (short-term treasury fund) and USDY (yield-bearing dollar) are growing rapidly while maintaining a regulation-friendly position." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "현재는 연결이 매우 약합니다. 프로토콜이 성공해도 ONDO 토큰 홀더가 직접 수혜를 받는 구조가 없습니다. 향후 수익 분배 구조 추가가 핵심 촉매가 될 것입니다.", en: "Currently very weakly connected. Even if the protocol succeeds, there is no mechanism for ONDO token holders to directly benefit. Adding a revenue sharing structure in the future would be the key catalyst." },
        ],
      },
    ],
    sources: [
      { label: "Ondo Finance 공식", url: "https://ondo.finance" },
      { label: "Ondo Docs", url: "https://docs.ondo.finance" },
      { label: "DefiLlama: Ondo", url: "https://defillama.com/protocol/ondo-finance" },
    ],
  },

  TIA: {
    type: "opinion",
    summary: {
      ko: "Celestia는 모듈러 블록체인의 데이터 가용성(DA) 레이어로, 롤업들이 데이터를 저렴하게 게시할 수 있도록 합니다. TIA 스테이킹 APY는 약 15%이나 인플레이션도 비슷한 수준입니다.",
      en: "Celestia is a data availability (DA) layer for modular blockchains, enabling rollups to post data cheaply. TIA staking APY is ~15% but inflation is at a similar rate.",
    },
    verdict: {
      ko: "모듈러 블록체인 트렌드의 핵심 인프라. 스테이킹 수익은 인플레이션 희석으로 실질 수익 낮음. 장기 DA 시장 성장에 베팅하는 자산.",
      en: "Core infrastructure for the modular blockchain trend. Staking yield is largely offset by inflation dilution. An asset for betting on long-term DA market growth.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: ~15% APY (단, 인플레이션 ~15%)", en: "① Tokenomics — Holder Return Rate: ~15% APY (but ~15% inflation)" },
        rating: "neutral",
        items: [
          { ko: "TIA 스테이킹 보상이 약 15% APY를 제공하나, 네트워크 인플레이션도 비슷한 수준입니다. 스테이킹하지 않으면 지분이 희석됩니다.", en: "TIA staking offers ~15% APY, but network inflation is at a similar rate. Not staking means your holdings get diluted." },
          { ko: "DA 수수료(롤업이 지불하는 수수료)가 아직 수익으로서 미미합니다. 진정한 수익 분배보다는 인플레이션 보상에 가깝습니다.", en: "DA fees (paid by rollups) are still minimal as actual revenue. Closer to inflationary rewards than genuine revenue sharing." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "good",
        items: [
          { ko: "모듈러 블록체인 트렌드의 선구자로, Arbitrum, Manta, dYdX 등이 Celestia DA를 채택 중입니다.", en: "Pioneer of the modular blockchain trend, with Arbitrum, Manta, dYdX and others adopting Celestia DA." },
          { ko: "Ethereum EIP-4844 이후 DA 경쟁이 심화됐지만, Celestia는 더 저렴한 가격으로 틈새를 유지 중입니다.", en: "DA competition intensified after Ethereum EIP-4844, but Celestia maintains its niche with lower pricing." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "DA 수요 증가 → TIA 가스 수요 증가의 연결은 논리적입니다. 다만 현재 DA 수수료 수익이 미미하여 실질 가치 포착까지는 시간이 필요합니다.", en: "The link of more DA demand → more TIA gas demand is logical. However, with DA fee revenue still minimal, time is needed before real value capture materializes." },
        ],
      },
    ],
    sources: [
      { label: "Celestia 공식", url: "https://celestia.org" },
      { label: "Celestia Docs", url: "https://docs.celestia.org" },
      { label: "Messari: TIA", url: "https://messari.io/asset/celestia" },
    ],
  },

  RENDER: {
    type: "opinion",
    summary: {
      ko: "Render Network는 분산형 GPU 렌더링 네트워크로, 크리에이터가 RENDER 토큰으로 렌더링 작업을 지불하면 노드 오퍼레이터가 수행합니다. AI/GPU 내러티브와 결합하여 주목받았습니다.",
      en: "Render Network is a decentralized GPU rendering network where creators pay RENDER tokens for rendering jobs processed by node operators. Gained attention tied to the AI/GPU narrative.",
    },
    verdict: {
      ko: "AI/GPU 내러티브 수혜 + 부분적 소각 구조. 그러나 홀더보다 노드 운영자가 주요 수혜자. 실질 GPU 수요 성장이 핵심.",
      en: "Benefits from AI/GPU narrative + partial burn structure. However, node operators are the primary beneficiaries over holders. Real GPU demand growth is the key.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 소각 구조 (부분적)", en: "① Tokenomics — Holder Return Rate: Burn Structure (Partial)" },
        rating: "neutral",
        items: [
          { ko: "렌더링 작업 수행 시 RENDER가 소각됩니다. 수요 증가 시 공급 감소 효과가 있으나, 직접적인 수익 분배는 아닙니다.", en: "RENDER is burned when rendering jobs are processed. This creates a supply reduction effect as demand grows, but it is not a direct revenue distribution." },
          { ko: "노드 오퍼레이터(GPU 제공자)가 주요 인센티브를 받으며, 단순 토큰 보유자의 직접 수익은 없습니다.", en: "Node operators (GPU providers) receive the main incentives, while pure token holders have no direct income." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "AI 이미지/영상 생성의 GPU 수요 증가는 실질적입니다. 단, AWS, Google Cloud 등 중앙화 GPU 제공자와의 가격 경쟁이 과제입니다.", en: "GPU demand from AI image/video generation is real. However, price competition with centralized GPU providers like AWS and Google Cloud is a challenge." },
          { ko: "Solana로 마이그레이션 후 생태계를 확장 중이며, RNDR에서 RENDER로 토큰 전환을 완료했습니다.", en: "Expanding its ecosystem after migrating to Solana, having completed the token migration from RNDR to RENDER." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "GPU 수요 증가 → RENDER 소각 증가 → 공급 감소 → 가격 상승의 간접적 연결이 있습니다. 직접 수익 분배 추가 시 더 강한 연결이 될 것입니다.", en: "There is an indirect link: more GPU demand → more RENDER burned → supply decreases → price rises. Adding direct revenue sharing would strengthen this connection." },
        ],
      },
    ],
    sources: [
      { label: "Render Network 공식", url: "https://rendernetwork.com" },
      { label: "DefiLlama: Render", url: "https://defillama.com/protocol/render-network" },
      { label: "Messari: RENDER", url: "https://messari.io/asset/render-token" },
    ],
  },

  VIRTUAL: {
    type: "opinion",
    summary: {
      ko: "Virtuals Protocol은 AI 에이전트 토큰화 플랫폼으로, 누구나 AI 에이전트를 만들고 토큰으로 수익화할 수 있습니다. VIRTUAL 스테이킹 시 AI 에이전트 수익의 일부를 받는 구조입니다.",
      en: "Virtuals Protocol is an AI agent tokenization platform where anyone can create AI agents and monetize them with tokens. VIRTUAL stakers receive a portion of AI agent revenue.",
    },
    verdict: {
      ko: "AI 에이전트 내러티브 선도. 수익 분배 구조 존재하나 초기 단계. 시장이 새로운 카테고리를 어떻게 평가하느냐가 관건.",
      en: "Leading the AI agent narrative. Revenue sharing structure exists but at early stage. How the market values this new category is the key question.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: AI 에이전트 수익 분배 (초기)", en: "① Tokenomics — Holder Return Rate: AI Agent Revenue Share (Early Stage)" },
        rating: "neutral",
        items: [
          { ko: "VIRTUAL 스테이킹 시 플랫폼 내 AI 에이전트들이 창출하는 수익의 일부를 받는 구조가 설계되어 있습니다.", en: "A structure is designed where VIRTUAL stakers receive a portion of revenue generated by AI agents on the platform." },
          { ko: "아직 초기 단계로 AI 에이전트들의 실질 수익 창출이 제한적이며, 대부분 투기적 관심에 의존합니다.", en: "Still at an early stage with limited real revenue from AI agents; most interest is speculative." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "2024년 말 AI 에이전트 붐과 함께 Base 체인에서 급성장했습니다. LUNA, aixbt 등 주요 AI 에이전트가 플랫폼에서 출시됐습니다.", en: "Experienced rapid growth on Base chain amid the AI agent boom in late 2024. Key AI agents like LUNA and aixbt launched on the platform." },
          { ko: "AI 에이전트 시장이 실질 수익을 창출하는 방향으로 발전할지, 아니면 투기 거품으로 끝날지는 아직 불확실합니다.", en: "It is still uncertain whether the AI agent market will develop toward generating real revenue or end as a speculative bubble." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "플랫폼이 성공하면 AI 에이전트 수익 → VIRTUAL 스테이킹 수익 증가의 연결이 생깁니다. 다만 현재는 내러티브 의존도가 높습니다.", en: "If the platform succeeds, a link forms: AI agent revenue → higher VIRTUAL staking returns. Currently, however, dependence on narrative is high." },
        ],
      },
    ],
    sources: [
      { label: "Virtuals Protocol 공식", url: "https://www.virtuals.io" },
      { label: "CoinGecko: VIRTUAL", url: "https://www.coingecko.com/en/coins/virtual-protocol" },
    ],
  },

  MANTRA: {
    type: "opinion",
    summary: {
      ko: "MANTRA는 RWA(실물 자산) 토큰화에 특화된 레이어1 블록체인입니다. OM 스테이킹으로 20%+ APY를 제공하나 높은 인플레이션과 팀 물량 집중, 2025년 4월 90% 급락 사태로 논란이 많습니다.",
      en: "MANTRA is a Layer 1 blockchain specializing in RWA tokenization. OM staking offers 20%+ APY, but it is controversial due to high inflation, team token concentration, and a 90% price crash in April 2025.",
    },
    verdict: {
      ko: "RWA 체인 컨셉은 유효하나 2025년 4월 90% 폭락으로 팀 신뢰도 훼손. 높은 스테이킹 APY는 인플레이션 보상에 불과. 리스크 매우 높음.",
      en: "RWA chain concept is valid, but the 90% crash in April 2025 severely damaged team credibility. High staking APY is merely inflationary compensation. Very high risk.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: ~20%+ APY (인플레이션 보상)", en: "① Tokenomics — Holder Return Rate: ~20%+ APY (Inflationary Reward)" },
        rating: "bad",
        items: [
          { ko: "높은 스테이킹 APY는 실질 프로토콜 수익이 아닌 신규 발행(인플레이션)에서 옵니다. 실질 구매력 증가는 불분명합니다.", en: "High staking APY comes from new issuance (inflation), not real protocol revenue. Real purchasing power gains are unclear." },
          { ko: "팀과 내부자가 대량의 OM 물량을 보유하고 있으며, 2025년 4월 갑작스러운 90% 폭락은 대규모 내부자 매도 의혹을 받았습니다.", en: "Team and insiders hold large OM allocations. The sudden 90% crash in April 2025 came under suspicion of large-scale insider selling." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "두바이 VARA 규제 라이선스를 취득하는 등 RWA 규제 준수 포지션을 갖추고 있습니다. 중동 RWA 시장을 겨냥합니다.", en: "Has obtained regulatory compliance positioning, including Dubai VARA license. Targets the Middle East RWA market." },
          { ko: "그러나 90% 폭락 이후 기관 파트너십 신뢰도가 크게 손상됐습니다. 회복 여부는 불확실합니다.", en: "However, institutional partnership credibility was significantly damaged after the 90% crash. Recovery is uncertain." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "2025년 4월 사태로 팀의 토큰 관리 방식에 심각한 의문이 생겼습니다. 프로토콜이 성장해도 팀 매도가 토큰 가격을 억제할 수 있는 구조적 리스크가 있습니다.", en: "The April 2025 incident raised serious questions about the team's token management. Even if the protocol grows, there is structural risk that team selling could suppress token price." },
        ],
      },
    ],
    sources: [
      { label: "MANTRA 공식", url: "https://www.mantrachain.io" },
      { label: "CoinGecko: MANTRA", url: "https://www.coingecko.com/en/coins/mantra" },
      { label: "Messari: OM", url: "https://messari.io/asset/mantra" },
    ],
  },

  WLD: {
    type: "opinion",
    summary: {
      ko: "Worldcoin은 홍채 스캔을 통한 인간 신원 증명(World ID) 프로젝트로, Sam Altman(OpenAI CEO)이 공동창업했습니다. WLD는 거버넌스 토큰이며 직접적인 수익 분배는 없습니다.",
      en: "Worldcoin is a human identity verification project (World ID) using iris scanning, co-founded by Sam Altman (OpenAI CEO). WLD is a governance token with no direct revenue sharing.",
    },
    verdict: {
      ko: "Sam Altman 브랜드와 AI 신원 증명 비전은 강렬. 그러나 프라이버시 논란, 토큰 홀더 환원 없음, 규제 리스크가 큰 투기 자산.",
      en: "Compelling Sam Altman brand and AI identity verification vision. However, it is a speculative asset with major privacy controversies, no token holder returns, and regulatory risk.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0% (그랜트 배포만)", en: "① Tokenomics — Holder Return Rate: 0% (Grant Distribution Only)" },
        rating: "bad",
        items: [
          { ko: "WLD 토큰은 거버넌스 기능만 있으며, 프로토콜 수익이 홀더에게 분배되는 구조가 없습니다.", en: "WLD tokens only have governance functionality with no structure for distributing protocol revenue to holders." },
          { ko: "World ID 사용자들에게 WLD가 무료로 지급(그랜트)되는 구조로, 대규모 물량이 지속적으로 시장에 풀립니다.", en: "WLD is distributed for free (grants) to World ID users, with large volumes continuously entering the market." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "홍채 스캔 기반 인간 신원 증명은 AI 시대에 중요한 인프라가 될 수 있습니다. 수백만 명이 이미 World ID를 등록했습니다.", en: "Iris scan-based human identity verification could become important infrastructure in the AI age. Millions have already registered World IDs." },
          { ko: "유럽(GDPR), 한국, 인도 등 여러 국가에서 생체정보 수집 관련 규제 조사 및 운영 중단 명령을 받았습니다.", en: "Has received regulatory investigations and suspension orders in multiple countries including Europe (GDPR), South Korea, and India over biometric data collection." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "프로토콜이 성공적으로 확장되어도 WLD 토큰 홀더가 직접 수혜를 받는 메커니즘이 없습니다. Sam Altman 브랜드와 AI 기대감에 의존하는 가격 구조입니다.", en: "Even if the protocol expands successfully, there is no mechanism for WLD token holders to directly benefit. Price structure depends on Sam Altman's brand and AI expectations." },
        ],
      },
    ],
    sources: [
      { label: "Worldcoin 공식", url: "https://worldcoin.org" },
      { label: "World ID Docs", url: "https://docs.worldcoin.org" },
      { label: "CoinGecko: WLD", url: "https://www.coingecko.com/en/coins/worldcoin-wld" },
    ],
  },

  PENGU: {
    type: "opinion",
    summary: {
      ko: "Pudgy Penguins는 이더리움의 대표 NFT 컬렉션으로, PENGU 토큰은 이 브랜드와 커뮤니티를 기반으로 발행됐습니다. 실질 유틸리티 없이 브랜드 충성도에만 의존하는 밈/NFT 토큰입니다.",
      en: "Pudgy Penguins is Ethereum's flagship NFT collection, and the PENGU token was issued based on this brand and community. It is a meme/NFT token relying solely on brand loyalty with no real utility.",
    },
    verdict: {
      ko: "NFT 브랜드 토큰화의 상징. 스테이킹/수익 구조 없음. Pudgy Penguins NFT 시장 분위기에 100% 연동.",
      en: "Symbol of NFT brand tokenization. No staking or revenue structure. 100% correlated with the Pudgy Penguins NFT market sentiment.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 0%", en: "① Tokenomics — Holder Return Rate: 0%" },
        rating: "bad",
        items: [
          { ko: "스테이킹 없음, 수수료 분배 없음, 바이백 없음. 토큰 보유의 경제적 이점이 없습니다.", en: "No staking, no fee distribution, no buyback. There is no economic benefit to holding the token." },
          { ko: "초기 대규모 에어드랍으로 유통량이 많으며, 지속적인 매도 압력이 존재합니다.", en: "A large initial airdrop resulted in high circulating supply, with persistent selling pressure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Pudgy Penguins NFT는 전통 IP 라이선싱(월마트 피규어 판매 등)으로 실물 세계에서도 브랜드 가치를 증명했습니다.", en: "Pudgy Penguins NFTs have proven brand value in the real world through traditional IP licensing (e.g., Walmart figure sales)." },
          { ko: "그러나 NFT 시장 전반이 침체된 상황에서 브랜드 가치가 토큰 가격을 지지하는 데 한계가 있습니다.", en: "However, with the broader NFT market in decline, there are limits to how much brand value can support the token price." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "NFT 브랜드가 성장해도 PENGU 토큰이 그 가치를 포착하는 메커니즘이 없습니다. 순수 감정적 수요에 의존합니다.", en: "Even if the NFT brand grows, there is no mechanism for PENGU tokens to capture that value. Relies purely on emotional demand." },
        ],
      },
    ],
    sources: [
      { label: "Pudgy Penguins 공식", url: "https://www.pudgypenguins.com" },
      { label: "CoinGecko: PENGU", url: "https://www.coingecko.com/en/coins/pudgy-penguins" },
    ],
  },

  MOVE: {
    type: "opinion",
    summary: {
      ko: "Movement Labs는 Move VM을 기반으로 한 레이어2/레이어1 블록체인입니다. MOVE 토큰은 스테이킹이 가능하나 높은 인플레이션과 VC 물량 집중이 우려됩니다.",
      en: "Movement Labs is a Layer 2/Layer 1 blockchain based on Move VM. The MOVE token supports staking, but high inflation and concentrated VC allocations are concerns.",
    },
    verdict: {
      ko: "Move VM 기술 유효, Aptos/Sui 대비 차별화 포인트. 그러나 높은 VC 할당 비율과 인플레이션이 토큰 가격 상승을 억제.",
      en: "Move VM technology is valid with differentiation from Aptos/Sui. However, high VC allocations and inflation suppress token price appreciation.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 스테이킹 (인플레이션 보상)", en: "① Tokenomics — Holder Return Rate: Staking (Inflationary Reward)" },
        rating: "bad",
        items: [
          { ko: "MOVE 스테이킹이 가능하나 수익은 신규 발행 인플레이션 보상입니다. 실질 네트워크 수수료 분배는 없습니다.", en: "MOVE staking is available, but rewards are from new issuance (inflation). No distribution of actual network fees." },
          { ko: "초기 토큰 배분에서 VC 및 팀 물량이 상당 비율을 차지하며, 베스팅 언락이 지속적 매도 압력을 만들 수 있습니다.", en: "VC and team allocations make up a significant portion of the initial token distribution, with vesting unlocks potentially creating sustained sell pressure." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Move 언어는 자원 안전성(resource safety)으로 스마트컨트랙트 취약점을 줄이는 데 이점이 있습니다. Aptos, Sui에 이어 세 번째 주요 Move VM 체인입니다.", en: "The Move language has advantages in reducing smart contract vulnerabilities through resource safety. It is the third major Move VM chain after Aptos and Sui." },
          { ko: "차별화가 부족한 상태에서 EVM 생태계와 Move 체인 모두와 경쟁해야 하는 어려운 포지션에 있습니다.", en: "Faces a challenging position of competing with both the EVM ecosystem and other Move chains without clear differentiation." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "체인 성공 시 가스 수요로 MOVE 토큰 가치가 올라가는 연결은 있습니다. 다만 VC 물량 언락이 이를 상쇄할 위험이 있습니다.", en: "There is a link where chain success drives MOVE value through gas demand. However, VC token unlocks risk offsetting this." },
        ],
      },
    ],
    sources: [
      { label: "Movement Labs 공식", url: "https://movementlabs.xyz" },
      { label: "CoinGecko: MOVE", url: "https://www.coingecko.com/en/coins/movement" },
    ],
  },

  BEAM: {
    type: "opinion",
    summary: {
      ko: "Beam은 Merit Circle DAO에서 만든 게이밍 특화 블록체인입니다. BEAM 토큰은 거버넌스 및 생태계 내 결제 수단으로 사용됩니다.",
      en: "Beam is a gaming-focused blockchain created by Merit Circle DAO. The BEAM token is used for governance and as a payment medium within the ecosystem.",
    },
    verdict: {
      ko: "게이밍 블록체인 트렌드에 부합. 거버넌스 토큰 구조로 직접 수익 없음. 게임 채택 성공 여부가 핵심 변수.",
      en: "Aligns with the gaming blockchain trend. Governance token structure means no direct revenue. Game adoption success is the key variable.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 거버넌스 + 생태계 인센티브", en: "① Tokenomics — Holder Return Rate: Governance + Ecosystem Incentives" },
        rating: "neutral",
        items: [
          { ko: "BEAM 스테이킹으로 거버넌스 참여가 가능하며, Merit Circle 생태계 인센티브를 받을 수 있습니다.", en: "BEAM staking enables governance participation and eligibility for Merit Circle ecosystem incentives." },
          { ko: "직접적인 프로토콜 수수료 분배 구조는 없습니다. 수익 포착보다 생태계 성장에 초점을 맞춥니다.", en: "There is no direct protocol fee distribution structure. Focus is on ecosystem growth rather than value capture." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Merit Circle은 게이밍 DAO로서 다수의 게임 프로젝트에 투자하고 있습니다. Beam은 이 포트폴리오의 체인 인프라입니다.", en: "Merit Circle is a gaming DAO invested in numerous game projects. Beam is the chain infrastructure for this portfolio." },
          { ko: "게임 블록체인 경쟁이 매우 치열합니다(Immutable X, Ronin, Polygon 등). 차별화된 게임 IP 확보가 과제입니다.", en: "Gaming blockchain competition is intense (Immutable X, Ronin, Polygon, etc.). Securing differentiated gaming IP is a challenge." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "생태계 게임들이 성공하면 BEAM 가스 수요와 생태계 내 경제활동이 늘어납니다. 간접적 연결이지만 게임 채택이 증명되면 의미있는 수준이 될 수 있습니다.", en: "If ecosystem games succeed, BEAM gas demand and economic activity within the ecosystem will grow. An indirect connection that could become meaningful if game adoption is proven." },
        ],
      },
    ],
    sources: [
      { label: "Beam 공식", url: "https://www.onbeam.com" },
      { label: "Merit Circle", url: "https://meritcircle.io" },
      { label: "CoinGecko: BEAM", url: "https://www.coingecko.com/en/coins/beam-2" },
    ],
  },

  SONIC: {
    type: "opinion",
    summary: {
      ko: "Sonic는 Fantom의 기술적 후계자로, FTM에서 S 토큰으로 전환했습니다. 수수료 수익화, 밸리데이터 스테이킹, 활동 인센티브 소각 프로그램을 통해 강력한 토크노믹스를 구축했습니다.",
      en: "Sonic is the technical successor to Fantom, transitioning from FTM to the S token. It has built strong tokenomics through fee monetization, validator staking, and an activity incentive burn program.",
    },
    verdict: {
      ko: "Fantom 대비 크게 개선된 기술+토크노믹스. 수수료 소각+스테이킹 구조. DeFi 생태계 재건 성공 여부가 관건.",
      en: "Significantly improved technology and tokenomics compared to Fantom. Fee burn + staking structure. Whether it successfully rebuilds its DeFi ecosystem is the key question.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 스테이킹 + 소각", en: "① Tokenomics — Holder Return Rate: Staking + Burn" },
        rating: "good",
        items: [
          { ko: "S 토큰 스테이킹으로 밸리데이터 보상을 받으며, 거래 수수료의 일부가 소각됩니다. 이중 디플레이션 구조입니다.", en: "S token staking earns validator rewards, and a portion of transaction fees is burned — a dual deflationary structure." },
          { ko: "Sonic의 활동 인센티브 프로그램(Sonic Gems)은 사용자 활동에 따라 토큰을 소각하는 독특한 메커니즘을 포함합니다.", en: "Sonic's activity incentive program (Sonic Gems) includes a unique mechanism that burns tokens based on user activity." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Fantom Foundation의 기술 팀이 TPS와 파이널리티를 대폭 개선했습니다. EVM 호환성 유지로 기존 DeFi 프로토콜 마이그레이션이 용이합니다.", en: "The Fantom Foundation technical team significantly improved TPS and finality. Maintaining EVM compatibility makes it easy for existing DeFi protocols to migrate." },
          { ko: "FTX 붕괴로 타격받은 Fantom 생태계의 신뢰를 회복해야 하는 과제가 있습니다. 경쟁 EVM 체인과의 생태계 경쟁도 치열합니다.", en: "Must recover the trust of the Fantom ecosystem damaged by the FTX collapse. Competition with rival EVM chains is also intense." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "good",
        items: [
          { ko: "연결됩니다. 거래량 증가 → 수수료 소각 증가 + 스테이킹 수요 증가 → 유통량 감소 → 토큰 가치 상승의 구조가 설계되어 있습니다.", en: "Connected. Increased transaction volume → more fee burning + higher staking demand → reduced circulation → rising token value. The structure is well designed." },
        ],
      },
    ],
    sources: [
      { label: "Sonic 공식", url: "https://www.soniclabs.com" },
      { label: "DefiLlama: Sonic", url: "https://defillama.com/chain/Sonic" },
      { label: "CoinGecko: Sonic", url: "https://www.coingecko.com/en/coins/sonic-3" },
    ],
  },

  ALT: {
    type: "opinion",
    summary: {
      ko: "AltLayer는 리스테이킹 기반의 롤업-서비스(RaaS) 프로토콜입니다. VALT 스테이킹(3년 잠금)으로 거버넌스에 참여하지만 토크노믹스가 복잡하고 VC 물량 비중이 높습니다.",
      en: "AltLayer is a restaking-based Rollup-as-a-Service (RaaS) protocol. VALT staking (3-year lock) provides governance participation, but tokenomics are complex and VC allocation is heavy.",
    },
    verdict: {
      ko: "리스테이킹 RaaS 인프라 독특한 포지션. 그러나 3년 잠금 구조와 높은 VC 비중, 복잡한 토크노믹스가 투자 매력을 떨어뜨림.",
      en: "Unique position as restaking RaaS infrastructure. However, the 3-year lock structure, heavy VC weight, and complex tokenomics reduce investment appeal.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 거버넌스 (3년 잠금 필요)", en: "① Tokenomics — Holder Return Rate: Governance (3-Year Lock Required)" },
        rating: "bad",
        items: [
          { ko: "ALT를 VALT로 전환(3년 잠금)해야 거버넌스 참여가 가능합니다. 수익 분배가 아닌 거버넌스 권한만 제공됩니다.", en: "ALT must be converted to VALT (3-year lock) for governance participation. Only governance rights are provided, not revenue sharing." },
          { ko: "초기 토큰 배분에서 VC와 팀 물량이 높은 비중을 차지합니다. 베스팅 언락에 따른 매도 압력이 상당합니다.", en: "VC and team allocations make up a large portion of initial token distribution. Sell pressure from vesting unlocks is significant." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "EigenLayer 리스테이킹과 결합한 롤업 인프라를 제공합니다. 롤업 수요가 증가하면 AltLayer 서비스 수요도 증가합니다.", en: "Provides rollup infrastructure combined with EigenLayer restaking. If rollup demand grows, demand for AltLayer services also increases." },
          { ko: "RaaS 시장이 성장 중이지만, Conduit, Caldera 등 경쟁자도 많습니다. 리스테이킹 차별화가 지속될지 불확실합니다.", en: "The RaaS market is growing, but there are many competitors like Conduit and Caldera. It is uncertain whether restaking differentiation will persist." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "bad",
        items: [
          { ko: "현재는 프로토콜 수익이 토큰 홀더에게 직접 귀속되는 구조가 없습니다. 거버넌스 가치에만 의존하는 한 성공과 토큰가의 연결이 약합니다.", en: "Currently there is no structure for protocol revenue to directly accrue to token holders. As long as it relies only on governance value, the link between success and token price is weak." },
        ],
      },
    ],
    sources: [
      { label: "AltLayer 공식", url: "https://altlayer.io" },
      { label: "CoinGecko: ALT", url: "https://www.coingecko.com/en/coins/altlayer" },
    ],
  },

  LAYER: {
    type: "opinion",
    summary: {
      ko: "Solayer는 솔라나의 네이티브 리스테이킹 프로토콜로, EigenLayer의 솔라나 버전으로 불립니다. 아직 초기 단계로 토큰 유틸리티가 개발 중입니다.",
      en: "Solayer is Solana's native restaking protocol, often called the EigenLayer of Solana. Still at an early stage with token utility still being developed.",
    },
    verdict: {
      ko: "솔라나 리스테이킹 트렌드의 선두 포지션. 그러나 토큰 유틸리티와 수익 포착 구조가 아직 미성숙. 초기 투자 리스크.",
      en: "Leading position in the Solana restaking trend. However, token utility and value capture structure are still immature. Early-stage investment risk.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 개발 중 (초기)", en: "① Tokenomics — Holder Return Rate: Under Development (Early Stage)" },
        rating: "bad",
        items: [
          { ko: "LAYER 토큰의 유틸리티 구조가 아직 완전히 정립되지 않았습니다. 리스테이킹 수익이 토큰 홀더에게 어떻게 귀속될지 명확하지 않습니다.", en: "The utility structure of the LAYER token has not yet been fully established. How restaking revenue will accrue to token holders is not yet clear." },
          { ko: "리스테이킹 프로토콜 특성상 AVS(Actively Validated Services) 수요가 있어야 실질 수익이 발생합니다. 솔라나 AVS 생태계는 초기입니다.", en: "As a restaking protocol, real revenue requires demand from Actively Validated Services (AVS). The Solana AVS ecosystem is in its infancy." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "솔라나 리스테이킹의 선두주자로 Jito, Marinade 등과 협력하며 생태계 구축 중입니다.", en: "As Solana's restaking pioneer, building the ecosystem in collaboration with Jito, Marinade, and others." },
          { ko: "이더리움 EigenLayer가 증명한 리스테이킹 수요가 솔라나에서도 발생할 가능성은 있으나 규모는 불확실합니다.", en: "The restaking demand proven by Ethereum's EigenLayer may materialize on Solana as well, but the scale is uncertain." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "토큰 유틸리티 구조가 명확해지면 프로토콜 성공과 토큰가의 연결이 형성될 것입니다. 현재는 기대감 기반의 가격 형성이 주를 이룹니다.", en: "Once the token utility structure becomes clear, a link between protocol success and token price will form. Currently, price formation is primarily expectation-based." },
        ],
      },
    ],
    sources: [
      { label: "Solayer 공식", url: "https://solayer.org" },
      { label: "CoinGecko: LAYER", url: "https://www.coingecko.com/en/coins/solayer" },
    ],
  },

  BERA: {
    type: "opinion",
    summary: {
      ko: "Berachain은 독자적인 Proof of Liquidity(PoL) 합의 메커니즘을 가진 EVM 호환 블록체인입니다. BERA(가스), BGT(비양도 거버넌스), HONEY(스테이블코인) 3토큰 구조가 독특하지만 복잡합니다.",
      en: "Berachain is an EVM-compatible blockchain with a unique Proof of Liquidity (PoL) consensus mechanism. Its 3-token structure — BERA (gas), BGT (non-transferable governance), HONEY (stablecoin) — is unique but complex.",
    },
    verdict: {
      ko: "독창적 PoL 메커니즘으로 유동성과 보안을 통합. 그러나 3토큰 구조의 복잡성과 높은 인플레이션이 위험 요소. 실험적 체인.",
      en: "Integrates liquidity and security through unique PoL mechanism. However, the complexity of the 3-token structure and high inflation are risk factors. An experimental chain.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 복잡한 3토큰 구조", en: "① Tokenomics — Holder Return Rate: Complex 3-Token Structure" },
        rating: "neutral",
        items: [
          { ko: "BGT(비양도 거버넌스 토큰)를 통해 프로토콜 인센티브를 받을 수 있습니다. BGT는 유동성 제공으로만 얻을 수 있으며, 이를 통해 BERA로 전환하거나 네이티브 수익을 받습니다.", en: "Protocol incentives can be received through BGT (non-transferable governance token). BGT can only be earned through liquidity provision, which can be converted to BERA or earn native yields." },
          { ko: "BERA 단순 보유자에게 직접 환원 메커니즘이 없습니다. 적극적 유동성 참여자가 주요 수혜자입니다.", en: "No direct return mechanism for simple BERA holders. Active liquidity participants are the primary beneficiaries." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "EVM 호환으로 기존 DeFi 앱 이식이 쉽습니다. PoL 개념은 유동성 부트스트래핑 문제를 창의적으로 해결합니다.", en: "EVM compatibility makes it easy to port existing DeFi apps. The PoL concept creatively addresses the liquidity bootstrapping problem." },
          { ko: "복잡한 3토큰 시스템이 신규 사용자 유입을 막을 수 있으며, BGT 인플레이션 압력 관리가 장기 과제입니다.", en: "The complex 3-token system may deter new user adoption, and managing BGT inflation pressure is a long-term challenge." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "체인 활동 증가 → BERA 가스 수요 증가의 연결이 있습니다. 다만 BGT 인플레이션과의 균형이 토큰 가치에 중요한 변수입니다.", en: "There is a link: more chain activity → higher BERA gas demand. However, the balance with BGT inflation is an important variable for token value." },
        ],
      },
    ],
    sources: [
      { label: "Berachain 공식", url: "https://www.berachain.com" },
      { label: "Berachain Docs", url: "https://docs.berachain.com" },
      { label: "DefiLlama: Berachain", url: "https://defillama.com/chain/Berachain" },
    ],
  },

  CRO: {
    type: "opinion",
    summary: {
      ko: "CRO는 Crypto.com 거래소 및 Cronos 블록체인의 네이티브 토큰입니다. Crypto.com 앱에서 CRO 스테이킹 시 카드 캐시백 등 혜택을 받으며, 거래소 토큰으로서의 유틸리티를 가집니다.",
      en: "CRO is the native token of Crypto.com exchange and the Cronos blockchain. Staking CRO in the Crypto.com app provides benefits like card cashback, giving it utility as an exchange token.",
    },
    verdict: {
      ko: "중앙화 거래소 토큰 유틸리티 존재. 그러나 Crypto.com의 중앙화 통제와 마케팅 위주 성장이 리스크. FTX 사태 이후 CEX 토큰 신뢰도 저하.",
      en: "Centralized exchange token utility exists. However, Crypto.com's centralized control and marketing-driven growth are risks. CEX token credibility declined after the FTX incident.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 수수료 할인 + 카드 캐시백", en: "① Tokenomics — Holder Return Rate: Fee Discounts + Card Cashback" },
        rating: "neutral",
        items: [
          { ko: "CRO 스테이킹 시 Crypto.com 비자 카드의 캐시백 비율이 높아지는 실용적 혜택이 있습니다.", en: "CRO staking provides practical benefits: higher cashback rates on Crypto.com Visa cards." },
          { ko: "그러나 이는 회사가 마케팅 비용으로 제공하는 것이며, 프로토콜 수익 분배가 아닙니다. 회사 수익성에 따라 혜택이 축소될 수 있습니다.", en: "However, this is provided by the company as a marketing expense, not protocol revenue distribution. Benefits can be reduced depending on company profitability." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "Crypto.com은 글로벌 상위 거래소 중 하나로 수천만 명의 사용자를 보유합니다. 브랜드 마케팅(포뮬러1, NBA 아레나)에 막대한 투자를 했습니다.", en: "Crypto.com is one of the top global exchanges with tens of millions of users. It has invested heavily in brand marketing (Formula 1, NBA Arena)." },
          { ko: "Cronos 블록체인의 DeFi 생태계는 제한적입니다. CEX 의존도가 높아 탈중앙화 가치 제안이 약합니다.", en: "The DeFi ecosystem of the Cronos blockchain is limited. High CEX dependence weakens the decentralization value proposition." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "Crypto.com 거래소 성장 → CRO 스테이킹 수요 증가의 연결이 있습니다. 다만 회사 정책 변경에 따른 리스크가 크고, 중앙화 단일 장애점이 존재합니다.", en: "Crypto.com exchange growth → higher CRO staking demand. However, risk from policy changes is significant, and centralization creates a single point of failure." },
        ],
      },
    ],
    sources: [
      { label: "Crypto.com 공식", url: "https://crypto.com" },
      { label: "Cronos 공식", url: "https://cronos.org" },
      { label: "CoinGecko: CRO", url: "https://www.coingecko.com/en/coins/cronos" },
    ],
  },

  NEO: {
    type: "opinion",
    summary: {
      ko: "NEO는 '중국의 이더리움'으로 불렸던 스마트컨트랙트 플랫폼입니다. NEO 보유 시 GAS 토큰이 자동 생성되며(약 1~2% APY), GAS는 네트워크 수수료로 사용됩니다.",
      en: "NEO was known as the 'Ethereum of China.' Holding NEO automatically generates GAS tokens (~1-2% APY), which are used for network transaction fees.",
    },
    verdict: {
      ko: "이중 토큰 모델로 실질 수익(GAS) 존재. 그러나 시장 점유율 하락, 중국 규제 리스크, 이더리움 대비 생태계 열위로 상승 동력 부족.",
      en: "Dual token model provides real income (GAS). However, declining market share, China regulatory risk, and ecosystem inferiority vs. Ethereum limit upside catalysts.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: GAS 자동 생성 (~1-2% APY)", en: "① Tokenomics — Holder Return Rate: Auto GAS Generation (~1-2% APY)" },
        rating: "neutral",
        items: [
          { ko: "NEO를 보유하면 GAS가 자동으로 생성됩니다. 스테이킹 없이 보유만 해도 수익이 발생하는 편리한 구조입니다.", en: "Holding NEO automatically generates GAS — a convenient structure that produces income without staking." },
          { ko: "그러나 GAS 수익률이 약 1~2%로 낮으며, GAS 시장 가격 변동에 따라 실질 수익이 달라집니다.", en: "However, the GAS yield is low at ~1-2%, and actual returns vary with GAS market price fluctuations." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "NEO N3 업그레이드로 기술적으로 개선됐지만, 이더리움, 솔라나 등에 비해 개발자 생태계와 TVL이 미미한 수준입니다.", en: "The NEO N3 upgrade improved the technology, but developer ecosystem and TVL are minimal compared to Ethereum, Solana, and others." },
          { ko: "중국의 암호화폐 규제 강화로 인해 원산지 시장에서의 성장이 막혀있으며, 글로벌 경쟁에서 뒤처졌습니다.", en: "China's tightening crypto regulations have blocked growth in its home market, and it has fallen behind in global competition." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "이중 토큰 구조에서 NEO 성공은 GAS 수요 증가로 이어지고, GAS 가격 상승이 NEO 보유 매력을 높입니다. 연결은 있으나 생태계 성장이 먼저 필요합니다.", en: "In the dual token structure, NEO success leads to increased GAS demand, and rising GAS prices enhance NEO holding appeal. The connection exists but ecosystem growth is required first." },
        ],
      },
    ],
    sources: [
      { label: "NEO 공식", url: "https://neo.org" },
      { label: "NEO Docs", url: "https://docs.neo.org" },
      { label: "CoinGecko: NEO", url: "https://www.coingecko.com/en/coins/neo" },
    ],
  },

  FLOW: {
    type: "opinion",
    summary: {
      ko: "Flow는 Dapper Labs(NBA TopShot, CryptoKitties 제작사)가 만든 NFT 특화 블록체인입니다. FLOW 스테이킹으로 약 7~9% APY를 받으며, NBA TopShot 등 유명 NFT가 출시됐습니다.",
      en: "Flow is an NFT-focused blockchain created by Dapper Labs (maker of NBA TopShot and CryptoKitties). FLOW staking yields ~7-9% APY, and notable NFTs like NBA TopShot were launched on it.",
    },
    verdict: {
      ko: "NFT 전성기의 선두주자였으나 NFT 시장 침체와 함께 생태계 위축. 스테이킹 수익은 있지만 생태계 부활 없이는 제한적.",
      en: "Was a leader during the NFT peak, but the ecosystem has contracted with the NFT market downturn. Staking income exists, but limited without an ecosystem revival.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 스테이킹 ~7-9% APY", en: "① Tokenomics — Holder Return Rate: Staking ~7-9% APY" },
        rating: "neutral",
        items: [
          { ko: "FLOW 스테이킹으로 약 7~9% APY를 받을 수 있습니다. 인플레이션 보상이 주이지만 상대적으로 안정적인 수준입니다.", en: "FLOW staking provides ~7-9% APY. Primarily inflation-based rewards, but at a relatively stable level." },
          { ko: "노드 운영 요건(최소 스테이킹 금액)이 존재하여 일반 홀더는 위임(delegation)을 통해 참여합니다.", en: "Node operation requirements (minimum staking amount) exist, so regular holders participate through delegation." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "bad",
        items: [
          { ko: "NBA TopShot은 한때 수억 달러 규모의 시장이었으나, 2022년 이후 거래량이 99% 이상 감소했습니다.", en: "NBA TopShot was once a market worth hundreds of millions of dollars, but volume has dropped by 99%+ since 2022." },
          { ko: "Dapper Labs는 상당한 직원 감축을 단행했습니다. 새로운 킬러 앱 없이 NFT 시장 부활에 의존하는 상황입니다.", en: "Dapper Labs made significant layoffs. It is in a position of depending on an NFT market revival without a new killer app." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "Flow 생태계 부활 → 가스 수요 증가 → FLOW 토큰 가치 상승의 연결이 있습니다. 다만 생태계 부활의 촉매가 무엇인지 불분명합니다.", en: "There is a link: Flow ecosystem revival → higher gas demand → rising FLOW token value. However, what will catalyze the ecosystem revival is unclear." },
        ],
      },
    ],
    sources: [
      { label: "Flow 공식", url: "https://flow.com" },
      { label: "Dapper Labs", url: "https://www.dapperlabs.com" },
      { label: "CoinGecko: FLOW", url: "https://www.coingecko.com/en/coins/flow" },
    ],
  },

  EGLD: {
    type: "opinion",
    summary: {
      ko: "MultiversX(구 Elrond)는 적응형 샤딩 기술을 사용하는 고성능 레이어1 블록체인입니다. EGLD 스테이킹으로 약 9~11% APY를 받으며, 유럽 팀이 이끄는 강한 기술 기반을 가집니다.",
      en: "MultiversX (formerly Elrond) is a high-performance Layer 1 blockchain using adaptive sharding technology. EGLD staking yields ~9-11% APY, with a strong technical foundation led by a European team.",
    },
    verdict: {
      ko: "기술적으로 검증된 고성능 체인. 스테이킹 수익 안정적. 그러나 생태계 규모가 상위 체인 대비 작아 성장 촉매 필요.",
      en: "Technically proven high-performance chain. Stable staking income. However, ecosystem scale is smaller than top chains, requiring growth catalysts.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원율: 스테이킹 ~9-11% APY", en: "① Tokenomics — Holder Return Rate: Staking ~9-11% APY" },
        rating: "good",
        items: [
          { ko: "EGLD 스테이킹으로 약 9~11% APY를 받습니다. 밸리데이터 위임(delegation)으로 일반 홀더도 쉽게 참여 가능합니다.", en: "EGLD staking yields ~9-11% APY. Regular holders can easily participate through validator delegation." },
          { ko: "트랜잭션 수수료의 일부가 소각되는 EIP-1559 유사 메커니즘이 있어 인플레이션을 일부 상쇄합니다.", en: "An EIP-1559-like mechanism burns a portion of transaction fees, partially offsetting inflation." },
        ],
      },
      {
        title: { ko: "② 프로토콜 성공 가능성", en: "② Protocol Success Potential" },
        rating: "neutral",
        items: [
          { ko: "적응형 샤딩으로 이론적으로 무한한 TPS 확장이 가능하며, 실제 12,000+ TPS를 달성했습니다. 기술적 완성도가 높습니다.", en: "Adaptive sharding enables theoretically unlimited TPS scaling, achieving 12,000+ TPS in practice. Technically mature." },
          { ko: "xMoney(결제), xExchange(DEX), xLaunchpad 등 자체 DeFi 생태계를 구축했지만 이더리움/솔라나 대비 TVL이 낮습니다.", en: "Has built its own DeFi ecosystem (xMoney payments, xExchange DEX, xLaunchpad), but TVL is low compared to Ethereum/Solana." },
        ],
      },
      {
        title: { ko: "③ 성공 → 토큰가 연결 여부 ← 핵심 판단", en: "③ Success → Token Price Link ← The Key Question" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 + 소각 구조로 생태계 성장이 EGLD 가치에 연결됩니다. 다만 경쟁 체인 대비 생태계 성장 속도가 느려 상대적 가치가 낮게 평가되는 경향이 있습니다.", en: "The staking + burn structure connects ecosystem growth to EGLD value. However, slower ecosystem growth compared to competing chains tends to result in relatively lower valuations." },
        ],
      },
    ],
    sources: [
      { label: "MultiversX 공식", url: "https://multiversx.com" },
      { label: "MultiversX Docs", url: "https://docs.multiversx.com" },
      { label: "CoinGecko: EGLD", url: "https://www.coingecko.com/en/coins/elrond-erd-2" },
    ],
  },

  BIGTIME: {
    type: "opinion",
    summary: {
      ko: "빅타임은 멀티플레이어 액션 RPG로 게임플레이를 통해 BIGTIME 토큰과 NFT를 획득합니다. P2E 장르 중 완성도가 높은 편이나 장르 전체에 대한 시장 관심이 크게 식었습니다.",
      en: "Big Time is a multiplayer action RPG where players earn BIGTIME tokens and NFTs. It is relatively polished for P2E but the genre has fallen sharply out of market favor.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "BIGTIME 스테이킹 보상 존재. 그러나 게임 활성 유저가 감소하면 매도 압력 증가 구조.", en: "Staking rewards exist. But sell pressure increases structurally when active player count declines." },
          { ko: "토큰 공급량이 많고 게임 인플레이션 통제가 장기 토큰 가치의 핵심 변수.", en: "Large token supply; controlling in-game inflation is the key variable for long-term token value." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "P2E 게임 중 그래픽·완성도는 높은 편. 그러나 P2E 장르 전반이 침체기이며 신규 유저 유입이 관건.", en: "High production quality for P2E. However the entire genre is in a downturn; attracting new users is critical." },
        ],
      },
    ],
    verdict: {
      ko: "완성도 있는 P2E 게임이나 장르 침체로 토큰 모멘텀 부재. 게임 흥행 없이는 가치 유지 어렵습니다.",
      en: "Polished P2E game but lacking token momentum due to genre decline. Hard to sustain value without game success.",
    },
    sources: [{ label: "Big Time", url: "https://bigtime.gg" }],
  },

  MOCA: {
    type: "opinion",
    summary: {
      ko: "모카버스는 애니모카 브랜즈의 NFT·게임 생태계 정체성 레이어입니다. MOCA 스테이킹으로 REALM 포인트를 획득하고 파트너 서비스에 접근할 수 있습니다.",
      en: "Mocaverse is Animoca Brands' NFT/gaming ecosystem identity layer. Stake MOCA to earn REALM points and access partner services.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "MOCA 스테이킹 시 REALM 포인트 획득 → 파트너 에어드랍·혜택 접근권. 직접 수익 분배는 없음.", en: "Staking earns REALM points for partner airdrops and access. No direct revenue distribution." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "애니모카 브랜즈는 Web3 게임 최대 투자사 중 하나이지만 NFT 시장 침체로 전반적 활동이 감소.", en: "Animoca Brands is one of the largest Web3 gaming investors, but NFT market downturn has reduced overall activity." },
          { ko: "토큰 가치는 NFT·게임 시장 회복과 밀접히 연동됩니다.", en: "Token value closely tied to NFT and gaming market recovery." },
        ],
      },
    ],
    verdict: {
      ko: "애니모카 생태계 접근권으로 유틸리티 있음. NFT 침체기에는 매력 제한적입니다.",
      en: "Has utility as an Animoca ecosystem access token. Limited appeal during the NFT market downturn.",
    },
    sources: [{ label: "Mocaverse", url: "https://mocaverse.xyz" }],
  },

  AGLD: {
    type: "opinion",
    summary: {
      ko: "어드벤처 골드는 Loot NFT 프로젝트의 거버넌스 토큰입니다. Loot는 2021년 텍스트 기반 아이템 NFT로 바이럴됐으나 이후 생태계 발전이 거의 없었습니다.",
      en: "Adventure Gold is the governance token for the Loot NFT project. Loot went viral in 2021 as text-based item NFTs but ecosystem development has been minimal since.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "거버넌스 기능만 있음. 스테이킹 수익·프로토콜 수수료 분배 없음.", en: "Governance only. No staking yield or protocol fee distribution." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "bad",
        items: [
          { ko: "Loot 생태계는 2021년 이후 개발이 사실상 멈춘 상태. 커뮤니티 활동도 미미.", en: "Loot ecosystem development has largely stalled since 2021. Community activity is minimal." },
        ],
      },
    ],
    verdict: {
      ko: "실질 유틸리티 없는 거버넌스 토큰. 생태계 침체로 투자 매력도 낮습니다.",
      en: "Governance token with minimal real utility. Low investment appeal due to stagnant ecosystem.",
    },
    sources: [{ label: "Loot Project", url: "https://lootproject.com" }],
  },

  YGG: {
    type: "opinion",
    summary: {
      ko: "일드 길드 게임즈는 P2E 게임 자산을 대여해 플레이어에게 수익을 나눠주는 게임 길드 DAO였습니다. P2E 버블 붕괴와 함께 사업 모델이 사실상 무너졌습니다.",
      en: "Yield Guild Games was a gaming guild DAO that rented P2E assets to players and shared revenue. The business model has essentially collapsed with the P2E bubble.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "YGG 스테이킹 기능 있으나 P2E 수익 급감으로 실질 보상이 미미해졌습니다.", en: "Staking exists but real rewards have become negligible as P2E revenue dried up." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "bad",
        items: [
          { ko: "엑시 인피니티 등 주력 P2E 게임 경제 붕괴로 길드 사업 모델도 타격. 장르 부활 없이는 회복 어렵습니다.", en: "Axie Infinity and other core P2E game economy collapses damaged the guild model. Recovery unlikely without genre revival." },
        ],
      },
    ],
    verdict: {
      ko: "P2E 버블 붕괴로 사업 모델 훼손. 토큰 회복은 P2E 장르 전체 부활에 달려 있습니다.",
      en: "Business model damaged by P2E bubble collapse. Token recovery depends on a full P2E genre revival.",
    },
    sources: [{ label: "YGG", url: "https://yieldguild.io" }],
  },

  ANIME: {
    type: "opinion",
    summary: {
      ko: "아니메는 아즈키 NFT 생태계의 토큰입니다. 아즈키는 프리미엄 NFT 프로젝트였으나 2023년 엘리멘탈 민트 논란으로 팀 신뢰도가 크게 손상됐습니다.",
      en: "ANIME is the token of the Azuki NFT ecosystem. Azuki was a premium NFT project but the 2023 Elementals mint controversy significantly damaged team trust.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "거버넌스·생태계 접근권 토큰. 직접 수익 분배나 스테이킹 수익 없음.", en: "Governance and ecosystem access token. No direct revenue sharing or staking yield." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "bad",
        items: [
          { ko: "팀이 신뢰 회복을 위해 IP 콘텐츠 확장 전략을 추진 중. NFT 시장 침체와 팀 신뢰도 손상이 이중 부담.", en: "Team pursuing IP content expansion to rebuild trust. Dual headwind: NFT market downturn and damaged team credibility." },
        ],
      },
    ],
    verdict: {
      ko: "팀 신뢰도 손상 + NFT 침체가 겹침. IP 확장 전략 실현 전까지 리스크 높습니다.",
      en: "Damaged team credibility plus NFT downturn. High risk until IP expansion strategy proves out.",
    },
    sources: [{ label: "Azuki", url: "https://azuki.com" }],
  },

  WAXP: {
    type: "opinion",
    summary: {
      ko: "WAX는 NFT 게임에 특화된 블록체인으로 Alien Worlds·Farmers World 등을 호스팅했습니다. WAXP 스테이킹으로 CPU/NET 자원을 확보합니다. NFT 게임 붐 이후 사용량이 급감했습니다.",
      en: "WAX is a blockchain specialized for NFT gaming, hosting Alien Worlds and Farmers World. Stake WAXP for CPU/NET resources. Usage has fallen sharply since the NFT gaming boom.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "WAXP 스테이킹으로 네트워크 자원 확보 및 거버넌스 참여 가능. 직접 수수료 분배는 없음.", en: "Staking secures network resources and governance. No direct fee distribution to holders." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "bad",
        items: [
          { ko: "한때 NFT 거래량에서 이더리움을 앞섰으나 NFT 게임 붐 종료 후 사용량 급감. 생태계 성장세 정체.", en: "Once surpassed Ethereum in NFT transactions, but usage dropped sharply after the NFT gaming boom ended." },
        ],
      },
    ],
    verdict: {
      ko: "NFT 게임 특화 체인이나 시장 침체로 모멘텀 상실. 명확한 반전 계기가 필요합니다.",
      en: "NFT gaming blockchain that has lost momentum. Needs a clear catalyst for reversal.",
    },
    sources: [{ label: "WAX", url: "https://on.wax.io" }],
  },

  TAIKO: {
    type: "opinion",
    summary: {
      ko: "타이코는 이더리움 기반 ZK-EVM 롤업으로, 이더리움이 시퀀서를 담당하는 'Based Rollup' 설계를 채택했습니다. 탈중앙화에 중점을 두지만 수수료 분배 메커니즘이 없습니다.",
      en: "Taiko is an Ethereum-based ZK-EVM rollup using a 'Based Rollup' design where Ethereum itself acts as sequencer. Decentralization-focused but has no fee distribution mechanism.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "TAIKO는 거버넌스 토큰. 프로토콜 수수료가 홀더에게 분배되지 않습니다.", en: "TAIKO is a governance token. Protocol fees are not distributed to holders." },
          { ko: "Based Rollup 구조상 MEV 수익은 이더리움 검증자에게 귀속됩니다.", en: "In the Based Rollup structure, MEV revenue accrues to Ethereum validators, not TAIKO holders." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "Based Rollup은 기술적으로 흥미로운 설계이나 Arbitrum·OP·Base 등 기존 L2와의 경쟁이 치열합니다.", en: "Based Rollup is technically interesting but competition from Arbitrum, OP, and Base is fierce." },
        ],
      },
    ],
    verdict: {
      ko: "기술적으로 차별화된 L2이나 토큰 홀더 환원이 없어 토큰 가치 상승 동력이 부족합니다.",
      en: "Technically differentiated L2, but lack of holder returns limits token value upside.",
    },
    sources: [{ label: "Taiko", url: "https://taiko.xyz" }],
  },

  ETHFI: {
    type: "opinion",
    summary: {
      ko: "ether.fi는 이더리움 리스테이킹 프로토콜로 eETH(리퀴드 리스테이킹 토큰)를 발행합니다. ETHFI는 거버넌스 토큰이며 수수료 분배 투표가 논의 중입니다.",
      en: "ether.fi is an Ethereum liquid restaking protocol issuing eETH. ETHFI is the governance token with fee-sharing distribution under community discussion.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "현재는 거버넌스 기능만. 프로토콜 수수료 홀더 분배는 커뮤니티 투표로 결정 예정.", en: "Currently governance only. Protocol fee distribution to holders pending community governance vote." },
          { ko: "eETH 보유자는 이더리움 스테이킹 + 리스테이킹 수익을 모두 받습니다. 토큰(ETHFI) 자체와 구분 필요.", en: "eETH holders earn both ETH staking and restaking yield — distinct from ETHFI token itself." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "good",
        items: [
          { ko: "리퀴드 리스테이킹 프로토콜 중 TVL 상위권. EigenLayer 생태계 확장과 함께 성장 중.", en: "Top TVL among liquid restaking protocols. Growing alongside the EigenLayer ecosystem expansion." },
        ],
      },
    ],
    verdict: {
      ko: "리스테이킹 인프라로 성장성 있음. ETHFI 토큰의 수익 환원 구조 확립 여부가 장기 가치의 핵심입니다.",
      en: "Strong growth potential as restaking infrastructure. Establishing fee-sharing for ETHFI holders is key to long-term value.",
    },
    sources: [{ label: "ether.fi", url: "https://ether.fi" }],
  },

  MASK: {
    type: "opinion",
    summary: {
      ko: "마스크 네트워크는 트위터·페이스북 등 기존 소셜 미디어 위에 Web3 레이어를 씌우는 프로토콜입니다. MASK는 거버넌스 및 ITO(초기 트위터 공개) 참여권 토큰입니다.",
      en: "Mask Network is a protocol that overlays a Web3 layer on top of existing social media like Twitter and Facebook. MASK is used for governance and ITO (Initial Twitter Offering) participation.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "거버넌스·ITO 참여권 외 직접적인 수익 분배 없음. ITO 빈도도 낮아 실질 유틸리티 제한적.", en: "No direct revenue distribution beyond governance and ITO access. ITO frequency is low, limiting real utility." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "bad",
        items: [
          { ko: "아이디어는 독창적이나 실제 소셜 미디어 플랫폼의 API 제한으로 활용도가 낮습니다.", en: "Original concept but limited by social media platform API restrictions. Real-world usage remains low." },
        ],
      },
    ],
    verdict: {
      ko: "독창적인 Web3 소셜 레이어 개념이나 실사용이 거의 없어 토큰 가치 뒷받침이 약합니다.",
      en: "Original Web3 social layer concept but minimal real usage provides weak token value support.",
    },
    sources: [{ label: "Mask Network", url: "https://mask.io" }],
  },

  MNT: {
    type: "opinion",
    summary: {
      ko: "맨틀은 BitDAO에서 전환된 이더리움 L2로, 대규모 DAO 재무를 기반으로 생태계를 구축하고 있습니다. MNT 스테이킹으로 Mantle LSP(리퀴드 스테이킹)에 참여 가능합니다.",
      en: "Mantle is an Ethereum L2 evolved from BitDAO, building its ecosystem backed by a large DAO treasury. MNT staking participates in Mantle LSP (liquid staking).",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "MNT 스테이킹 → mETH(리퀴드 스테이킹 토큰) 발행으로 이더리움 스테이킹 수익 수취 가능.", en: "Staking MNT enables participation in mETH (liquid staking token) to earn Ethereum staking yield." },
          { ko: "대규모 재무 자산(수십억 달러 상당)이 생태계 인센티브 재원. 토큰 희석 리스크는 있음.", en: "Large treasury (billions in assets) funds ecosystem incentives. Dilution risk exists." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "Bybit 모회사 배경의 강력한 재무력으로 생태계 지원. TVL 상위 L2 중 하나입니다.", en: "Strong treasury backed by Bybit parent company supports the ecosystem. One of the top L2s by TVL." },
        ],
      },
    ],
    verdict: {
      ko: "강력한 재무 배경의 L2로 안정적 생태계 구축 중. 토큰 유틸리티 확장이 추가 상승의 열쇠입니다.",
      en: "Treasury-backed L2 building a stable ecosystem. Expanding token utility is key to further upside.",
    },
    sources: [{ label: "Mantle", url: "https://mantle.xyz" }],
  },

  API3: {
    type: "opinion",
    summary: {
      ko: "API3는 탈중앙화 오라클 네트워크로, API 제공자가 직접 데이터를 온체인에 공급하는 dAPI 방식을 사용합니다. API3 스테이킹으로 커버리지 정책에 참여하고 보상을 받습니다.",
      en: "API3 is a decentralized oracle network where API providers directly supply data on-chain via dAPIs. Staking API3 participates in coverage policies and earns rewards.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "good",
        items: [
          { ko: "스테이킹 시 dAPI 수수료 일부를 보상으로 수취. 스테이커는 동시에 보험 커버리지 제공자 역할.", en: "Stakers receive a portion of dAPI fees as rewards while also acting as insurance coverage providers." },
          { ko: "수익 환원 구조가 있는 오라클 토큰으로 Chainlink 대비 홀더 친화적 설계.", en: "Oracle token with actual fee return structure — more holder-friendly design than Chainlink." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "Chainlink의 시장 지배력이 압도적이라 점유율 확대가 쉽지 않습니다. 틈새 시장에서 꾸준히 성장 중.", en: "Chainlink's market dominance makes share gains difficult. Growing steadily in niche segments." },
        ],
      },
    ],
    verdict: {
      ko: "오라클 중 합리적인 토크노믹스를 가진 편. Chainlink 대비 점유율 확대가 성장의 핵심 과제입니다.",
      en: "Reasonable tokenomics among oracle tokens. Gaining share from Chainlink is the core growth challenge.",
    },
    sources: [{ label: "API3", url: "https://api3.org" }],
  },

  COW: {
    type: "opinion",
    summary: {
      ko: "CoW 프로토콜은 MEV 보호에 특화된 DEX 애그리게이터로, 배치 경매 방식으로 사용자 주문을 처리합니다. vCOW 거버넌스 토큰이며 프로토콜 수수료는 CowDAO 재무에 귀속됩니다.",
      en: "CoW Protocol is an MEV-protected DEX aggregator using batch auctions to settle user orders. vCOW is the governance token; protocol fees go to the CowDAO treasury.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "프로토콜 수수료가 DAO 재무에 쌓이며 홀더에게 직접 분배되지 않습니다.", en: "Protocol fees accumulate in the DAO treasury and are not directly distributed to holders." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "good",
        items: [
          { ko: "MEV 보호·최적 가격 실행에서 실질적 차별화. 기관·대형 트레이더 수요가 꾸준합니다.", en: "Real differentiation in MEV protection and optimal price execution. Steady demand from institutional and large traders." },
          { ko: "프로토콜 성공이 토큰 가격에 직결되려면 수수료 분배 거버넌스 결정이 필요합니다.", en: "Fee distribution governance decision needed to connect protocol success to token price." },
        ],
      },
    ],
    verdict: {
      ko: "프로토콜 가치는 있으나 토큰 홀더 환원 구조 미비. 수수료 분배 거버넌스 통과 여부가 핵심입니다.",
      en: "Protocol has real value but lacks holder return structure. Fee distribution governance outcome is the key catalyst.",
    },
    sources: [{ label: "CoW Protocol", url: "https://cow.fi" }],
  },

  ORCA: {
    type: "opinion",
    summary: {
      ko: "오르카는 솔라나 생태계의 주요 DEX입니다. ORCA 거버넌스 토큰이며 프로토콜 수수료 일부로 바이백을 시행합니다.",
      en: "Orca is a leading DEX in the Solana ecosystem. ORCA is the governance token with some protocol fee buybacks.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "일부 프로토콜 수수료로 ORCA 바이백 시행. 직접 스테이킹 수익보다는 간접 환원 구조.", en: "Some protocol fee buybacks of ORCA. Indirect return structure rather than direct staking yield." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "솔라나 DEX 생태계에서 Raydium과 경쟁. 솔라나 생태계 전반의 성장과 연동됩니다.", en: "Competing with Raydium in the Solana DEX ecosystem. Growth tied to overall Solana ecosystem health." },
        ],
      },
    ],
    verdict: {
      ko: "솔라나 DEX 중 완성도 있는 프로토콜. 솔라나 생태계 성장세가 지속되면 수혜 가능합니다.",
      en: "Solid protocol among Solana DEXs. Can benefit if the Solana ecosystem continues to grow.",
    },
    sources: [{ label: "Orca", url: "https://orca.so" }],
  },

  STORJ: {
    type: "opinion",
    summary: {
      ko: "스토리지는 탈중앙화 클라우드 스토리지 프로토콜로, 스토리지 노드 운영자가 STORJ 토큰으로 보상을 받습니다. 실제 스토리지 서비스 유틸리티가 있습니다.",
      en: "Storj is a decentralized cloud storage protocol where node operators earn STORJ tokens. It has real storage service utility.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "bad",
        items: [
          { ko: "단순 보유 홀더에게 직접 수익이 없음. 스토리지 노드 운영 시에만 STORJ 보상 획득.", en: "No direct returns for passive holders. STORJ rewards only for active storage node operators." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "실제 스토리지 서비스를 제공하며 AWS S3 대비 저렴. 그러나 AWS·Google 대비 채택률이 낮습니다.", en: "Provides real storage cheaper than AWS S3, but adoption remains low compared to centralized alternatives." },
        ],
      },
    ],
    verdict: {
      ko: "실사용 유틸리티는 있으나 단순 홀더 환원 없음. 스토리지 수요 성장이 장기 가치의 핵심입니다.",
      en: "Real utility exists but no passive holder returns. Storage demand growth is key to long-term value.",
    },
    sources: [{ label: "Storj", url: "https://storj.io" }],
  },

  AKT: {
    type: "opinion",
    summary: {
      ko: "아카시 네트워크는 탈중앙화 클라우드 컴퓨팅 마켓플레이스입니다. AKT 스테이킹으로 약 15~20% APY를 수취하며, AI·GPU 수요 증가가 네트워크 성장 동력입니다.",
      en: "Akash Network is a decentralized cloud computing marketplace. AKT staking yields ~15-20% APY, with AI and GPU demand as the growth driver.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "good",
        items: [
          { ko: "AKT 스테이킹 APY 약 15~20%. 네트워크 사용료 일부가 스테이커에게 분배됩니다.", en: "AKT staking APY ~15-20%. A portion of network usage fees is distributed to stakers." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "good",
        items: [
          { ko: "AI·LLM 학습용 GPU 수요 폭증으로 탈중앙화 클라우드 수요 증가. 실제 컴퓨팅 임대 거래가 발생 중.", en: "Surging GPU demand for AI/LLM training drives decentralized cloud demand. Real compute rental transactions occurring." },
          { ko: "AWS 대비 최대 85% 저렴한 GPU 임대 비용이 경쟁 우위.", en: "GPU rental costs up to 85% cheaper than AWS is a competitive advantage." },
        ],
      },
    ],
    verdict: {
      ko: "AI 인프라 수요와 실질적 스테이킹 수익을 갖춘 탈중앙화 클라우드. 주목할 만한 유틸리티 토큰입니다.",
      en: "Decentralized cloud with AI infrastructure demand and real staking yield. A utility token worth watching.",
    },
    sources: [{ label: "Akash Network", url: "https://akash.network" }],
  },

  AXL: {
    type: "opinion",
    summary: {
      ko: "액슬라는 크로스체인 메시지 전송 인프라로, 다양한 블록체인 간 자산·데이터 이동을 지원합니다. AXL 스테이킹으로 브릿지 수수료에서 약 7~10% APY를 수취합니다.",
      en: "Axelar is cross-chain messaging infrastructure enabling asset and data transfers between blockchains. AXL staking earns ~7-10% APY from bridge fees.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "good",
        items: [
          { ko: "브릿지 수수료 일부가 AXL 스테이커에게 분배. APY 약 7~10%로 합리적입니다.", en: "Bridge fees partially distributed to AXL stakers. ~7-10% APY is reasonable." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "LayerZero·Wormhole 등 경쟁자가 많지만 Axelar는 보안·탈중앙화 측면에서 차별화됩니다.", en: "Many competitors like LayerZero and Wormhole, but Axelar differentiates on security and decentralization." },
          { ko: "멀티체인 생태계 성장과 함께 크로스체인 메시지 수요가 증가 중입니다.", en: "Cross-chain message demand growing alongside the multi-chain ecosystem." },
        ],
      },
    ],
    verdict: {
      ko: "합리적 스테이킹 수익과 실질 인프라 유틸리티를 갖춘 크로스체인 토큰. 경쟁이 치열하나 차별점 있습니다.",
      en: "Cross-chain token with reasonable staking yield and real infrastructure utility. Competitive but differentiated.",
    },
    sources: [{ label: "Axelar", url: "https://axelar.network" }],
  },

  CKB: {
    type: "opinion",
    summary: {
      ko: "너보스 네트워크(CKB)는 PoW 기반 레이어1으로, 독창적인 Cell 모델을 사용해 상태 저장에 CKB 토큰을 직접 소비하는 구조입니다. NervosDAO 스테이킹으로 약 3~5% APY 수취.",
      en: "Nervos Network (CKB) is a PoW Layer 1 using a unique Cell model where state storage directly consumes CKB tokens. NervosDAO staking earns ~3-5% APY.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "NervosDAO 스테이킹으로 인플레이션 희석 방어 + 약 3~5% APY. 독특한 상태 임대 모델로 장기 희소성 설계.", en: "NervosDAO staking defends against inflation dilution + ~3-5% APY. Unique state-rent model designed for long-term scarcity." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "기술적으로 독창적인 설계이나 채택률이 낮고 생태계가 제한적입니다. PoW 체인으로 환경 논란도 있습니다.", en: "Technically original design but low adoption and limited ecosystem. PoW chain also faces environmental criticism." },
        ],
      },
    ],
    verdict: {
      ko: "독창적 토크노믹스 설계가 있으나 실제 채택이 부족. 장기 보유자 관점에서는 흥미롭지만 단기 모멘텀은 낮습니다.",
      en: "Interesting tokenomics design but lacking real adoption. Interesting for long-term holders, low short-term momentum.",
    },
    sources: [{ label: "Nervos Network", url: "https://nervos.org" }],
  },

  CARV: {
    type: "opinion",
    summary: {
      ko: "카브 프로토콜은 게임·AI 데이터 자격증명 레이어로, 사용자 데이터 소유권을 블록체인에 기록합니다. CARV 스테이킹으로 거버넌스에 참여하는 초기 단계 프로젝트입니다.",
      en: "CARV Protocol is a gaming and AI data credentials layer recording user data ownership on-chain. CARV staking for governance. Early-stage project.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "거버넌스 스테이킹 구조. 초기 단계라 수익 분배 메커니즘이 아직 구체화되지 않았습니다.", en: "Governance staking structure. Early-stage; revenue distribution mechanisms not yet concrete." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "AI 데이터 소유권이라는 아이디어는 시의적절하나 아직 초기 단계. 실제 파트너십·채택 실적이 중요합니다.", en: "AI data ownership is a timely concept but still early. Actual partnerships and adoption traction will be critical." },
        ],
      },
    ],
    verdict: {
      ko: "아이디어는 시의적절하나 초기 단계 리스크 높음. 실제 채택 증거가 나올 때까지 관망이 적절합니다.",
      en: "Timely concept but high early-stage risk. Best to wait for concrete adoption evidence.",
    },
    sources: [{ label: "CARV", url: "https://carv.io" }],
  },

  VANA: {
    type: "opinion",
    summary: {
      ko: "바나 프로토콜은 AI 학습 데이터의 소유권을 개인에게 돌려주는 네트워크입니다. VANA 스테이킹 거버넌스 구조이며 AI 데이터 경제를 목표로 하는 초기 단계입니다.",
      en: "Vana Protocol is a network returning AI training data ownership to individuals. VANA staking governance; early-stage AI data economy.",
    },
    opinionSections: [
      {
        title: { ko: "① 토크노믹스 — 홀더 환원", en: "① Tokenomics — Holder Return" },
        rating: "neutral",
        items: [
          { ko: "거버넌스 스테이킹. 데이터 기여자에 대한 보상 구조가 핵심 유틸리티이나 아직 초기.", en: "Governance staking. Reward structure for data contributors is the core utility but still early-stage." },
        ],
      },
      {
        title: { ko: "② 프로토콜 현황과 전망", en: "② Protocol Status & Outlook" },
        rating: "neutral",
        items: [
          { ko: "AI 데이터 주권 개념은 장기적으로 중요한 분야. 그러나 실제 AI 기업들의 채택 여부가 불확실합니다.", en: "AI data sovereignty is an important long-term space. However, adoption by real AI companies remains uncertain." },
        ],
      },
    ],
    verdict: {
      ko: "장기 AI 데이터 경제 테마에 부합하나 초기 단계 리스크 높음. 장기 투기적 포지션에 적합합니다.",
      en: "Aligns with long-term AI data economy theme but high early-stage risk. Suitable only as a speculative long-term position.",
    },
    sources: [{ label: "Vana", url: "https://vana.org" }],
  },

  XEC: {
    type: "opinion",
    summary: {
      ko: "eCash(XEC)는 비트코인 캐시 ABC의 리브랜딩으로 탄생한 결제 특화 체인입니다. Avalanche 컨센서스를 도입해 빠른 결제와 스테이킹을 지향하지만 생태계 규모가 작습니다.",
      en: "eCash (XEC) is a payment-focused chain born from the Bitcoin Cash ABC rebrand. It targets fast payments and staking with Avalanche consensus, but the ecosystem remains small.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "스테이킹 보상 구조 도입 예정. 공급량이 매우 많아(21조 개) 심리적 단가 매력은 있으나 희소성 서사는 약합니다.", en: "Staking rewards structure planned. Very high supply (21 trillion) offers low unit price appeal but weak scarcity narrative." },
          { ko: "비트코인 캐시 분열 후 커뮤니티 분산으로 투자자 신뢰 회복이 과제입니다.", en: "Rebuilding investor trust remains a challenge after the Bitcoin Cash community split." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "결제 코인 경쟁이 치열한 시장에서 뚜렷한 차별점이 부족합니다. 개발 활동은 지속 중이나 채택 지표가 낮습니다.", en: "Lacks clear differentiation in a competitive payments market. Development ongoing but adoption metrics remain low." },
          { ko: "Avalanche 컨센서스 통합은 기술적으로 흥미롭지만 시장 인지도가 부족합니다.", en: "Avalanche consensus integration is technically interesting but lacks market awareness." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "결제 사용 증가가 장기적 가격 상승 동력이지만, 단기 모멘텀은 시장 사이클에 의존합니다.", en: "Increased payment adoption is the long-term price driver, but short-term momentum depends on market cycles." },
        ],
      },
    ],
    verdict: {
      ko: "비트코인 결제 유산을 잇는 프로젝트이지만 경쟁이 치열하고 생태계가 작아 단기 투자 매력이 낮습니다.",
      en: "Carries the Bitcoin payments legacy but faces stiff competition and small ecosystem, limiting short-term appeal.",
    },
    sources: [{ label: "CoinGecko - XEC", url: "https://www.coingecko.com/en/coins/ecash" }],
  },

  RVN: {
    type: "opinion",
    summary: {
      ko: "Ravencoin(RVN)은 자산 발행 특화 PoW 체인으로 실물 자산 토큰화를 목표로 합니다. GPU 채굴 친화적이며 공정 출시(프리마인 없음)로 커뮤니티 지지를 받았습니다.",
      en: "Ravencoin (RVN) is a PoW chain specialized for asset issuance targeting real-world asset tokenization. GPU mining friendly with a fair launch (no premine), earning community support.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "최대 210억 개 공급. 반감기 구조로 채굴 보상 감소. 스테이킹 수익은 없고 순수 채굴 기반입니다.", en: "Max supply of 21 billion. Halving structure reduces mining rewards. No staking yield; purely mining-based." },
          { ko: "프리마인 없는 공정 출시로 커뮤니티 신뢰는 높으나 기관 투자 유인이 낮습니다.", en: "Fair launch with no premine earns community trust but offers low institutional investment incentive." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "RWA(실물 자산 토큰화) 경쟁이 Ethereum, Polygon 등 스마트 컨트랙트 플랫폼으로 이동하며 차별성이 약해졌습니다.", en: "RWA tokenization competition has shifted to Ethereum, Polygon, and other smart contract platforms, weakening differentiation." },
          { ko: "개발 활동이 저조하고 생태계 확장이 정체 상태입니다.", en: "Development activity is low and ecosystem expansion has stagnated." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "RWA 토큰화 채택이 핵심 가격 동력이지만 경쟁 플랫폼에 밀리는 상황입니다.", en: "RWA tokenization adoption is the key price driver but losing ground to competing platforms." },
        ],
      },
    ],
    verdict: {
      ko: "공정 출시 철학은 좋으나 RWA 경쟁에서 뒤처지고 있어 장기 성장성이 불확실합니다.",
      en: "Fair launch philosophy is admirable but falling behind in the RWA competition, making long-term growth uncertain.",
    },
    sources: [{ label: "CoinGecko - RVN", url: "https://www.coingecko.com/en/coins/ravencoin" }],
  },

  IOST: {
    type: "opinion",
    summary: {
      ko: "IOST는 탈중앙 서비스 인터넷을 목표로 한 고성능 블록체인입니다. PoB(Proof of Believability) 컨센서스로 빠른 처리를 지원하지만 현재 생태계 활동이 제한적입니다.",
      en: "IOST is a high-performance blockchain targeting a decentralized internet of services. Fast throughput via PoB (Proof of Believability) consensus, but current ecosystem activity is limited.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "스테이킹(세라이즈)으로 약 3~5% APY 가능. 공급 인플레이션이 지속되어 희소성 서사는 약합니다.", en: "~3-5% APY possible via staking (Servi). Ongoing supply inflation weakens scarcity narrative." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "2018년 불장 이후 생태계 개발이 정체되었습니다. Layer 1 경쟁에서 존재감이 크게 줄었습니다.", en: "Ecosystem development has stagnated since the 2018 bull run. Presence in the Layer 1 competition has diminished significantly." },
          { ko: "고성능 블록체인 시장에서 Solana, Sui 등 신규 플랫폼에 밀렸습니다.", en: "Overshadowed by newer platforms like Solana and Sui in the high-performance blockchain market." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "dApp 채택이 가격 동력이지만 현재 채택 지표가 매우 낮습니다.", en: "dApp adoption is the price driver, but current adoption metrics are very low." },
        ],
      },
    ],
    verdict: {
      ko: "기술적 기반은 있으나 생태계가 정체되어 있어 투자 매력이 낮습니다. 강력한 촉매 없이는 반등이 어렵습니다.",
      en: "Has technical foundations but stagnant ecosystem makes it a low-appeal investment. Hard to rebound without a strong catalyst.",
    },
    sources: [{ label: "CoinGecko - IOST", url: "https://www.coingecko.com/en/coins/iost" }],
  },

  BTT: {
    type: "opinion",
    summary: {
      ko: "BitTorrent Token(BTT)은 세계 최대 P2P 파일 공유 네트워크에 토큰 인센티브를 결합한 프로젝트입니다. TRON 생태계 기반으로 대규모 사용자 기반을 보유하지만 실질적 토큰 수요는 낮습니다.",
      en: "BitTorrent Token (BTT) combines token incentives with the world's largest P2P file-sharing network. Built on TRON with a massive user base, but actual token demand remains low.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "bad",
        items: [
          { ko: "990조 개에 달하는 극대 공급량이 가장 큰 약점입니다. 인플레이션 압력이 지속적으로 가격을 억누릅니다.", en: "An extreme max supply of 990 trillion is the biggest weakness. Ongoing inflation pressure continuously suppresses price." },
          { ko: "스테이킹 수익 구조가 미약하고 토큰 소각 메커니즘이 없습니다.", en: "Weak staking yield structure and no token burn mechanism." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "BitTorrent의 브랜드와 수억 명 사용자 기반은 자산이나 실제 BTT 사용률은 낮습니다.", en: "BitTorrent brand and hundreds of millions of users are assets, but actual BTT usage rates are low." },
          { ko: "TRON 생태계 의존도가 높고 독립적인 개발 로드맵이 제한적입니다.", en: "High dependency on TRON ecosystem with limited independent development roadmap." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "거대한 사용자 기반이 있음에도 토큰 유틸리티와 가격의 연결이 약합니다. 공급 과잉이 지속됩니다.", en: "Despite large user base, the link between token utility and price is weak. Oversupply persists." },
        ],
      },
    ],
    verdict: {
      ko: "브랜드 인지도와 사용자 기반은 있으나 공급 과잉과 낮은 토큰 유틸리티로 장기 가격 상승이 어렵습니다.",
      en: "Has brand recognition and user base, but oversupply and low token utility make long-term price appreciation difficult.",
    },
    sources: [{ label: "CoinGecko - BTT", url: "https://www.coingecko.com/en/coins/bittorrent" }],
  },

  VTHO: {
    type: "opinion",
    summary: {
      ko: "VTHO는 VeChain 생태계의 가스 토큰으로 VET 보유 시 자동 생성됩니다. 기업용 공급망 추적 플랫폼인 VeChain의 실제 사용 수요와 직결됩니다.",
      en: "VTHO is the gas token of the VeChain ecosystem, automatically generated by holding VET. Directly tied to real usage demand of VeChain's enterprise supply chain platform.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "good",
        items: [
          { ko: "VET 보유만으로 VTHO가 자동 생성되어 패시브 수익 구조. 트랜잭션 70%가 소각되어 사용량 증가 시 공급 균형이 형성됩니다.", en: "VTHO auto-generated by simply holding VET, creating a passive income structure. 70% of transaction fees are burned, creating supply balance as usage increases." },
          { ko: "기업 파트너사가 VTHO를 구매해 사용하는 실수요 구조가 존재합니다.", en: "Real demand structure exists as enterprise partners purchase VTHO for use." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Walmart China, DNV 등 대형 기업 파트너십 보유. 실제 공급망 사용 사례가 가장 많은 블록체인 중 하나입니다.", en: "Has large enterprise partnerships including Walmart China and DNV. One of the blockchains with the most real supply chain use cases." },
          { ko: "기업 채택 속도가 예상보다 느리고 암호화폐 시장 내 인지도가 제한적입니다.", en: "Enterprise adoption is slower than expected and crypto market awareness remains limited." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "good",
        items: [
          { ko: "VeChain 기업 사용 증가 → VTHO 소비 증가 → 가격 상승. 명확한 가치 연결 구조입니다.", en: "Increased VeChain enterprise usage → increased VTHO consumption → price appreciation. Clear value linkage structure." },
        ],
      },
    ],
    verdict: {
      ko: "실제 기업 사용 수요와 연결된 가스 토큰으로 유틸리티가 명확합니다. VeChain 생태계 성장에 베팅하는 간접 투자로 유효합니다.",
      en: "Clear utility as a gas token linked to real enterprise demand. Valid as an indirect bet on VeChain ecosystem growth.",
    },
    sources: [{ label: "CoinGecko - VTHO", url: "https://www.coingecko.com/en/coins/vethor-token" }],
  },

  ICX: {
    type: "opinion",
    summary: {
      ko: "ICON(ICX)은 한국 블록체인 상호운용성 프로토콜로 병원, 대학, 금융기관 간 데이터 연결을 목표로 했습니다. BTP(블록체인 전송 프로토콜)로 크로스체인 기능을 강화 중입니다.",
      en: "ICON (ICX) is a Korean blockchain interoperability protocol targeting data connectivity between hospitals, universities, and financial institutions. Enhancing cross-chain capabilities with BTP (Blockchain Transmission Protocol).",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "I-Score 스테이킹 보상 및 의결권 참여 구조. 연 5~10% 내외 APY 가능합니다.", en: "I-Score staking rewards and voting participation structure. ~5-10% APY possible annually." },
          { ko: "인플레이션 보상 구조로 공급 증가가 지속되어 장기 가격 압력이 있습니다.", en: "Inflationary reward structure means continued supply growth, creating long-term price pressure." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "한국 정부기관, 병원 등과의 파트너십이 있으나 블록체인 상호운용성 시장은 Cosmos, Polkadot으로 이동했습니다.", en: "Has partnerships with Korean government agencies and hospitals, but the blockchain interoperability market has shifted to Cosmos and Polkadot." },
          { ko: "BTP 크로스체인 기술 개발은 지속적이나 시장 경쟁에서 차별화가 필요합니다.", en: "BTP cross-chain tech development continues but needs differentiation in the competitive market." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "한국 기관 파트너십 확대와 크로스체인 생태계 성장이 가격 동력입니다.", en: "Expansion of Korean institutional partnerships and cross-chain ecosystem growth are the price drivers." },
        ],
      },
    ],
    verdict: {
      ko: "한국 기관 네트워크라는 독특한 포지션이 있으나 크로스체인 경쟁에서 존재감을 키워야 합니다.",
      en: "Unique positioning with Korean institutional network, but needs to grow its presence in the cross-chain competition.",
    },
    sources: [{ label: "CoinGecko - ICX", url: "https://www.coingecko.com/en/coins/icon" }],
  },

  WAVES: {
    type: "opinion",
    summary: {
      ko: "Waves는 빠른 토큰 발행과 DEX를 제공하는 초기 블록체인 플랫폼입니다. 과거 알고리즘 스테이블코인 USDN 디페깅 사태로 신뢰에 큰 타격을 입었습니다.",
      en: "Waves is an early blockchain platform offering fast token issuance and DEX. The trust damage from the USDN algorithmic stablecoin depegging incident was significant.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "bad",
        items: [
          { ko: "리스 PoS 스테이킹 구조. USDN 사태 이후 생태계 TVL이 대폭 감소하여 실수익 기반이 약화되었습니다.", en: "Leased PoS staking structure. After the USDN incident, ecosystem TVL dropped sharply, weakening the real yield base." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "2022년 USDN 알고리즘 스테이블코인 붕괴로 생태계에 심각한 손상이 발생했습니다. 회복이 더딥니다.", en: "The 2022 USDN algorithmic stablecoin collapse caused serious damage to the ecosystem. Recovery has been slow." },
          { ko: "창립자 관련 시세 조작 의혹 등 거버넌스 신뢰 문제가 남아있습니다.", en: "Governance trust issues remain, including allegations of price manipulation by the founder." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "생태계 재건과 신뢰 회복이 선결 과제이나 단기간 내 해결이 어렵습니다.", en: "Ecosystem rebuilding and trust recovery are prerequisites but difficult to resolve in the short term." },
        ],
      },
    ],
    verdict: {
      ko: "USDN 사태 이후 신뢰 회복이 진행 중이나 리스크가 높습니다. 신중한 접근이 필요합니다.",
      en: "Trust recovery is ongoing after the USDN incident, but risk remains high. Caution is warranted.",
    },
    sources: [{ label: "CoinGecko - WAVES", url: "https://www.coingecko.com/en/coins/waves" }],
  },

  POWR: {
    type: "opinion",
    summary: {
      ko: "Power Ledger(POWR)는 재생에너지 P2P 거래 플랫폼입니다. 태양광 등 잉여 에너지를 블록체인으로 직거래하는 실사용 사례를 구축 중입니다.",
      en: "Power Ledger (POWR) is a renewable energy P2P trading platform. Building real use cases for direct blockchain-based trading of surplus solar and other energy.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "에너지 거래 플랫폼 수수료 수취 구조. 실거래량이 증가해야 토큰 가치가 올라가는 유틸리티 모델입니다.", en: "Fee collection structure from the energy trading platform. Utility model where token value rises only with increased real trading volume." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "호주, 일본, 인도 등 여러 국가에서 파일럿 프로젝트를 진행 중입니다. 실사용 사례가 꾸준히 확장되고 있습니다.", en: "Pilot projects underway in multiple countries including Australia, Japan, and India. Real use cases are steadily expanding." },
          { ko: "에너지 규제 환경이 복잡하여 대규모 상용화까지 시간이 걸립니다.", en: "Complex energy regulatory environment means large-scale commercialization takes time." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "재생에너지 P2P 거래 볼륨 증가가 직접적 가치 동력. 에너지 전환 트렌드와 부합합니다.", en: "Increased renewable energy P2P trading volume is the direct value driver. Aligns with energy transition trends." },
        ],
      },
    ],
    verdict: {
      ko: "그린에너지 트렌드와 부합하는 실사용 사례가 있으나 규제 제약과 느린 상용화 속도가 단기 가격 모멘텀을 제한합니다.",
      en: "Real use cases aligning with green energy trends, but regulatory constraints and slow commercialization limit short-term price momentum.",
    },
    sources: [{ label: "CoinGecko - POWR", url: "https://www.coingecko.com/en/coins/power-ledger" }],
  },

  CHR: {
    type: "opinion",
    summary: {
      ko: "Chromia(CHR)는 탈중앙 앱을 위한 관계형 블록체인 플랫폼입니다. 독자적 쿼리 언어 Rell을 사용하며 게임·NFT 분야에 주력하고 있습니다.",
      en: "Chromia (CHR) is a relational blockchain platform for decentralized apps. Uses its own query language Rell and focuses on gaming and NFT sectors.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "CHR 스테이킹으로 네트워크 수수료 수익 참여 가능. 게임 dApp 활성화 시 수요가 증가합니다.", en: "CHR staking allows participation in network fee revenue. Demand increases as gaming dApps become more active." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "관계형 데이터 구조로 복잡한 게임 데이터 처리에 기술적 강점. 실제 게임 파트너 확보에 집중 중입니다.", en: "Technical strength in handling complex game data with relational data structure. Focused on securing real game partners." },
          { ko: "게임 블록체인 경쟁(ImmutableX, Ronin 등)이 치열하여 차별화가 중요합니다.", en: "Intense competition in gaming blockchain (ImmutableX, Ronin, etc.) makes differentiation critical." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "히트 게임 타이틀 유치 성공 시 생태계 급성장 가능. 반대로 부진 시 모멘텀이 약해집니다.", en: "Attracting hit game titles could trigger rapid ecosystem growth. Conversely, failure to do so weakens momentum." },
        ],
      },
    ],
    verdict: {
      ko: "관계형 블록체인이라는 기술적 차별점이 있으나 게임 블록체인 경쟁에서 성공 여부는 킬러 dApp 확보에 달려 있습니다.",
      en: "Technical differentiation through relational blockchain, but success in the gaming blockchain competition hinges on securing killer dApps.",
    },
    sources: [{ label: "CoinGecko - CHR", url: "https://www.coingecko.com/en/coins/chromia" }],
  },

  ELF: {
    type: "opinion",
    summary: {
      ko: "aelf(ELF)는 병렬 처리와 사이드체인을 지원하는 비즈니스 특화 블록체인입니다. 중국 기반으로 기업용 솔루션에 집중하고 있습니다.",
      en: "aelf (ELF) is a business-oriented blockchain supporting parallel processing and side chains. China-based, focused on enterprise solutions.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "ELF 스테이킹 및 투표 보상 구조. 기업 사용 수수료가 ELF 수요를 만드는 유틸리티 모델입니다.", en: "ELF staking and voting reward structure. Enterprise usage fees create ELF demand in a utility model." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "AI 통합 블록체인으로 방향을 전환하며 새로운 성장 동력을 모색 중입니다.", en: "Pivoting toward AI-integrated blockchain, seeking new growth drivers." },
          { ko: "중국 규제 환경 불확실성이 리스크로 작용합니다. 글로벌 채택이 제한적입니다.", en: "Chinese regulatory uncertainty acts as a risk factor. Global adoption remains limited." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "기업 솔루션 채택과 AI 블록체인 전환 성공 여부가 가격 동력입니다.", en: "Enterprise solution adoption and success of the AI blockchain pivot are the price drivers." },
        ],
      },
    ],
    verdict: {
      ko: "AI 블록체인 전환 시도는 흥미롭지만 중국 규제 리스크와 글로벌 채택 한계가 불확실성을 높입니다.",
      en: "The AI blockchain pivot attempt is interesting, but Chinese regulatory risk and limited global adoption increase uncertainty.",
    },
    sources: [{ label: "CoinGecko - ELF", url: "https://www.coingecko.com/en/coins/aelf" }],
  },

  HOLO: {
    type: "opinion",
    summary: {
      ko: "Holo(HOT)는 Holochain 기반의 P2P 호스팅 네트워크로 중앙 서버 없는 탈중앙 앱 실행을 목표로 합니다. 기술적으로 독창적이지만 채택 속도가 매우 느립니다.",
      en: "Holo (HOT) is a P2P hosting network based on Holochain targeting serverless decentralized app execution. Technically innovative but adoption has been very slow.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "HOT→HoloFuel 전환 예정. 호스팅 제공자가 HoloFuel을 수취하는 실사용 경제 모델이지만 아직 전환 완료 전입니다.", en: "HOT→HoloFuel conversion planned. Real economy model where hosting providers receive HoloFuel, but conversion not yet complete." },
          { ko: "공급량이 매우 많아(177조 개) 단가가 낮고 희소성 서사가 약합니다.", en: "Very high supply (177 trillion) means low unit price and weak scarcity narrative." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "Holochain의 에이전트 중심 설계는 혁신적이지만 개발 속도가 매우 느리고 dApp 생태계가 거의 없습니다.", en: "Holochain's agent-centric design is innovative but development is very slow and the dApp ecosystem is nearly non-existent." },
          { ko: "수년간 메인넷 완전 출시가 지연되어 커뮤니티 신뢰가 하락했습니다.", en: "Years of delayed full mainnet launch have eroded community trust." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "HoloFuel 전환 완료와 실제 호스팅 수요 발생이 선결 조건이지만 일정이 불확실합니다.", en: "HoloFuel conversion completion and real hosting demand generation are prerequisites, but the timeline is uncertain." },
        ],
      },
    ],
    verdict: {
      ko: "기술적 비전은 독창적이지만 실행 속도가 너무 느리고 생태계가 미성숙합니다. 고위험 투기성 자산입니다.",
      en: "Technically visionary but execution is too slow and ecosystem is immature. High-risk speculative asset.",
    },
    sources: [{ label: "CoinGecko - HOT", url: "https://www.coingecko.com/en/coins/holo" }],
  },

  ONT: {
    type: "opinion",
    summary: {
      ko: "Ontology(ONT)는 디지털 신원과 데이터 솔루션 특화 블록체인입니다. ONG(온톨로지 가스 토큰)와 이원화된 토큰 구조를 가지며 기업용 블록체인을 목표로 합니다.",
      en: "Ontology (ONT) is a blockchain specializing in digital identity and data solutions. Has a dual-token structure with ONG (Ontology Gas) and targets enterprise blockchain use cases.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "ONT 보유 시 ONG 가스 토큰 자동 생성. VeChain/VTHO 유사한 이원 토큰 수익 구조입니다.", en: "Holding ONT automatically generates ONG gas tokens. Similar dual-token yield structure to VeChain/VTHO." },
          { ko: "기업 트랜잭션 수수료가 ONG 수요를 만드는 구조이나 실제 사용 지표가 낮습니다.", en: "Enterprise transaction fees create ONG demand, but actual usage metrics are low." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "디지털 신원 블록체인 분야에서 선도적 위치였으나 현재는 경쟁이 치열해졌습니다.", en: "Was a leader in digital identity blockchain but competition has intensified." },
          { ko: "Layer 2 온토버스 개발로 생태계 확장 시도 중이나 채택 속도가 느립니다.", en: "Attempting ecosystem expansion with Layer 2 Ontoverses, but adoption is slow." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "기업 신원 솔루션 채택 확대가 핵심 동력. Web3 신원 시장 성장에 달려 있습니다.", en: "Expansion of enterprise identity solution adoption is key. Depends on growth of the Web3 identity market." },
        ],
      },
    ],
    verdict: {
      ko: "디지털 신원 특화로 차별화 포지셔닝이 있으나 기업 채택 속도가 느리고 생태계 활동이 제한적입니다.",
      en: "Differentiated positioning in digital identity, but slow enterprise adoption and limited ecosystem activity.",
    },
    sources: [{ label: "CoinGecko - ONT", url: "https://www.coingecko.com/en/coins/ontology" }],
  },

  SUN: {
    type: "opinion",
    summary: {
      ko: "SUN은 TRON 생태계의 DeFi 거버넌스 토큰으로 SunSwap DEX와 유동성 풀을 통한 수익 창출을 지원합니다. TRON 생태계 성장과 직결된 토큰입니다.",
      en: "SUN is the DeFi governance token of the TRON ecosystem, supporting yield generation through SunSwap DEX and liquidity pools. Directly tied to TRON ecosystem growth.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "유동성 공급 및 스테이킹으로 수익 창출 가능. SunSwap 거래량 증가 시 수익이 늘어납니다.", en: "Yield generation possible through liquidity provision and staking. Revenue increases with SunSwap trading volume growth." },
          { ko: "TRON 생태계 내 USDT 거래량이 매우 많아 실질 유동성 수요가 존재합니다.", en: "Very high USDT trading volume within the TRON ecosystem creates real liquidity demand." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "TRON은 USDT 전송에서 세계 최대 볼륨을 처리합니다. SunSwap이 이 생태계의 핵심 DEX입니다.", en: "TRON processes the world's largest volume in USDT transfers. SunSwap is the core DEX of this ecosystem." },
          { ko: "저스틴 선 관련 논란과 중앙화 우려가 지속적인 리스크입니다.", en: "Ongoing controversies related to Justin Sun and centralization concerns are persistent risks." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "TRON 생태계 TVL 증가와 SunSwap 거래량 상승이 직접적 가치 동력입니다.", en: "TRON ecosystem TVL increase and SunSwap trading volume growth are direct value drivers." },
        ],
      },
    ],
    verdict: {
      ko: "TRON 생태계 DeFi의 핵심 토큰으로 실사용 기반이 있으나 중앙화 리스크와 거버넌스 논란에 주의해야 합니다.",
      en: "Core DeFi token in TRON ecosystem with real usage base, but centralization risk and governance controversies require caution.",
    },
    sources: [{ label: "CoinGecko - SUN", url: "https://www.coingecko.com/en/coins/sun-token" }],
  },

  JST: {
    type: "opinion",
    summary: {
      ko: "JUST(JST)는 TRON 기반 DeFi 프로토콜 토큰으로 USDJ 스테이블코인 발행과 JustLend 대출 프로토콜을 지원합니다. TRON 생태계 DeFi의 핵심 인프라 역할을 합니다.",
      en: "JUST (JST) is a TRON-based DeFi protocol token supporting USDJ stablecoin issuance and JustLend lending protocol. Serves as core DeFi infrastructure in the TRON ecosystem.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "JST 스테이킹으로 거버넌스 참여. USDJ 발행 수수료와 JustLend 프로토콜 수수료가 토큰 수요를 만듭니다.", en: "JST staking for governance participation. USDJ issuance fees and JustLend protocol fees create token demand." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "JustLend는 TRON DeFi에서 가장 큰 TVL을 보유 중. TRON USDT 생태계와 시너지가 있습니다.", en: "JustLend holds the largest TVL in TRON DeFi. Synergy with the TRON USDT ecosystem." },
          { ko: "SUN 토큰과 유사하게 저스틴 선 중앙화 리스크가 상존합니다.", en: "Justin Sun centralization risk persists, similar to the SUN token." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "JustLend TVL 성장과 USDJ 유통량 증가가 직접적 가치 동력입니다.", en: "JustLend TVL growth and increased USDJ circulation are direct value drivers." },
        ],
      },
    ],
    verdict: {
      ko: "TRON DeFi 생태계 내 유틸리티가 명확하나 중앙화 거버넌스 리스크와 생태계 의존성이 한계입니다.",
      en: "Clear utility within TRON DeFi ecosystem, but centralized governance risk and ecosystem dependency are limitations.",
    },
    sources: [{ label: "CoinGecko - JST", url: "https://www.coingecko.com/en/coins/just" }],
  },

  TFUEL: {
    type: "opinion",
    summary: {
      ko: "Theta Fuel(TFUEL)은 Theta Network의 가스 토큰으로 비디오 스트리밍 릴레이 노드 보상과 트랜잭션 수수료로 사용됩니다. THETA 보유 시 자동 생성됩니다.",
      en: "Theta Fuel (TFUEL) is the gas token of Theta Network, used for video streaming relay node rewards and transaction fees. Automatically generated by holding THETA.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "THETA 보유 시 TFUEL 자동 생성. 비디오 스트리밍 수요가 증가할수록 TFUEL 소비가 늘어나는 구조입니다.", en: "TFUEL auto-generated by holding THETA. Increased video streaming demand increases TFUEL consumption." },
          { ko: "연간 약 5% TFUEL 생성률로 적절한 인플레이션 설계입니다.", en: "Approximately 5% annual TFUEL generation rate makes for a reasonable inflation design." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Samsung, Sony, Google 등 대형 기업과의 파트너십이 있으나 실제 스트리밍 볼륨이 기대에 못 미칩니다.", en: "Partnerships with major companies like Samsung, Sony, and Google, but actual streaming volume falls short of expectations." },
          { ko: "AI 미디어 서비스로 사업 영역을 확장하며 새 성장 동력을 모색 중입니다.", en: "Expanding into AI media services to seek new growth drivers." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "실제 비디오 스트리밍 플랫폼 채택 증가가 핵심 가치 동력이나 현재까지 실질 트래픽이 낮습니다.", en: "Increased adoption by real video streaming platforms is the key value driver, but actual traffic remains low so far." },
        ],
      },
    ],
    verdict: {
      ko: "비디오 스트리밍 블록체인이라는 명확한 비전이 있으나 실제 채택이 기대에 못 미칩니다. AI 미디어 전환의 성공 여부가 관건입니다.",
      en: "Clear vision as a video streaming blockchain, but actual adoption falls short of expectations. Success of the AI media pivot is key.",
    },
    sources: [{ label: "CoinGecko - TFUEL", url: "https://www.coingecko.com/en/coins/theta-fuel" }],
  },

  RED: {
    type: "opinion",
    summary: {
      ko: "Red Protocol(RED)은 크로스체인 메시징과 탈중앙 소셜 인프라를 목표로 하는 초기 단계 프로젝트입니다. 구체적인 채택 지표와 생태계 발전이 필요한 상태입니다.",
      en: "Red Protocol (RED) is an early-stage project targeting cross-chain messaging and decentralized social infrastructure. Needs concrete adoption metrics and ecosystem development.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "초기 단계로 토크노믹스 구조가 구체화 중입니다. 스테이킹 및 거버넌스 메커니즘 개발 예정입니다.", en: "Early stage with tokenomics structure being defined. Staking and governance mechanisms are planned." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "크로스체인 소셜 인프라 분야는 성장 가능성이 있으나 경쟁이 치열합니다.", en: "Cross-chain social infrastructure space has growth potential but is highly competitive." },
          { ko: "초기 단계로 실제 사용 지표와 파트너십 실적이 부족합니다.", en: "Early stage with limited real usage metrics and partnership track record." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "소셜 플랫폼 채택과 크로스체인 메시징 볼륨이 가격 동력이나 아직 초기 단계입니다.", en: "Social platform adoption and cross-chain messaging volume are price drivers, but still at early stage." },
        ],
      },
    ],
    verdict: {
      ko: "초기 단계 프로젝트로 아이디어는 있으나 실행 실적이 부족합니다. 구체적 채택 증거가 나올 때까지 관망이 적절합니다.",
      en: "Early-stage project with ideas but lacking execution track record. Appropriate to wait for concrete adoption evidence.",
    },
    sources: [{ label: "CoinGecko - RED", url: "https://www.coingecko.com/en/coins/red" }],
  },

  SNT: {
    type: "opinion",
    summary: {
      ko: "Status(SNT)는 이더리움 기반 탈중앙 메신저·브라우저·지갑 앱의 네이티브 토큰입니다. 프라이버시 중심 Web3 커뮤니케이션을 목표로 하지만 채택이 제한적입니다.",
      en: "Status (SNT) is the native token of an Ethereum-based decentralized messenger, browser, and wallet app. Targets privacy-focused Web3 communication but adoption remains limited.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "bad",
        items: [
          { ko: "SNT 사용량 기반 유틸리티 모델이나 실제 앱 사용자가 적어 수요가 낮습니다.", en: "SNT usage-based utility model, but low actual app users result in low demand." },
          { ko: "스테이킹이나 수익 분배 구조가 미약합니다.", en: "Staking and revenue distribution structures are weak." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "2017년 출시 이후 수년간 개발 중이지만 일반 사용자 채택이 매우 낮습니다.", en: "In development for years since 2017 launch but mainstream user adoption remains very low." },
          { ko: "Signal, Telegram 등 전통 프라이버시 메신저와 경쟁하며 암호화폐 사용 허들도 있습니다.", en: "Competes with traditional privacy messengers like Signal and Telegram, plus crypto usage hurdle." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "실제 활성 사용자 증가가 필수이나 수년간 정체 상태입니다. 강력한 촉매 없이는 반등이 어렵습니다.", en: "Real active user growth is essential but has been stagnant for years. Hard to rebound without a strong catalyst." },
        ],
      },
    ],
    verdict: {
      ko: "프라이버시 메신저라는 의미 있는 비전이 있으나 채택이 매우 낮고 경쟁 열위에 있습니다. 현 상태에서는 투자 매력이 낮습니다.",
      en: "Meaningful privacy messenger vision but very low adoption and at a competitive disadvantage. Low investment appeal in current state.",
    },
    sources: [{ label: "CoinGecko - SNT", url: "https://www.coingecko.com/en/coins/status" }],
  },

  AUDIO: {
    type: "opinion",
    summary: {
      ko: "Audius(AUDIO)는 탈중앙 음악 스트리밍 플랫폼으로 아티스트와 팬을 직접 연결합니다. TikTok과의 파트너십 등으로 주목받았으나 실제 수익 모델이 미성숙합니다.",
      en: "Audius (AUDIO) is a decentralized music streaming platform directly connecting artists and fans. Gained attention through TikTok partnership but real revenue model is still immature.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "AUDIO 스테이킹으로 플랫폼 거버넌스 참여 및 보상 수취. 아티스트 팬 토큰 이코노미와 결합됩니다.", en: "AUDIO staking for platform governance and reward collection. Combined with artist fan token economy." },
          { ko: "실제 스트리밍 수익의 토큰 환원 구조가 아직 구체화되지 않았습니다.", en: "The structure for routing actual streaming revenue to token holders is not yet concrete." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "500만 이상 트랙, 활성 아티스트 커뮤니티 보유. 탈중앙 음악 플랫폼 중 가장 많은 실사용자를 보유합니다.", en: "Over 5 million tracks and an active artist community. Largest real user base among decentralized music platforms." },
          { ko: "Spotify, Apple Music 등 대형 플랫폼과의 경쟁과 음악 라이선스 문제가 제약 요인입니다.", en: "Competition with major platforms like Spotify and Apple Music, plus music licensing issues, are constraints." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "플랫폼 사용자 및 스트리밍 볼륨 증가가 가치 동력. 수익 모델 명확화가 핵심 과제입니다.", en: "Platform user and streaming volume growth are value drivers. Clarifying the revenue model is the key challenge." },
        ],
      },
    ],
    verdict: {
      ko: "탈중앙 음악 플랫폼 중 선두 주자로 실사용자 기반이 있으나 수익 모델과 메이저 경쟁 대응이 과제입니다.",
      en: "Leader among decentralized music platforms with real users, but revenue model and competing with majors remain challenges.",
    },
    sources: [{ label: "CoinGecko - AUDIO", url: "https://www.coingecko.com/en/coins/audius" }],
  },

  GAS: {
    type: "opinion",
    summary: {
      ko: "GAS는 NEO 블록체인의 가스 토큰으로 NEO 보유 시 자동 생성됩니다. 네트워크 트랜잭션 수수료와 스마트 컨트랙트 실행에 사용됩니다.",
      en: "GAS is the gas token of the NEO blockchain, automatically generated by holding NEO. Used for network transaction fees and smart contract execution.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "NEO 보유 시 GAS 자동 생성. NEO N3 업그레이드 이후 약 1~3% APY 수준입니다.", en: "GAS auto-generated by holding NEO. ~1-3% APY after the NEO N3 upgrade." },
          { ko: "NEO 생태계 활성화 시 GAS 소비 증가로 가격 지지가 형성됩니다.", en: "When the NEO ecosystem becomes more active, increased GAS consumption creates price support." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "NEO N3 업그레이드로 기술적 개선을 이루었으나 Ethereum, Solana 대비 생태계가 작습니다.", en: "Technical improvements through NEO N3 upgrade, but ecosystem is small compared to Ethereum and Solana." },
          { ko: "중국 배경 프로젝트로 규제 불확실성이 있으나 Onchain 법인 기반으로 적절히 분리되어 있습니다.", en: "Chinese-background project with regulatory uncertainty, but reasonably separated via Onchain corporate structure." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "NEO 생태계 dApp 활성화와 트랜잭션 볼륨이 GAS 가격 동력입니다.", en: "NEO ecosystem dApp activity and transaction volume are the GAS price drivers." },
        ],
      },
    ],
    verdict: {
      ko: "NEO 생태계 가스 토큰으로 명확한 유틸리티가 있으나 생태계 규모가 제한적입니다. NEO 생태계 성장에 베팅하는 간접 투자로 적합합니다.",
      en: "Clear utility as NEO ecosystem gas token, but limited ecosystem scale. Suitable as an indirect bet on NEO ecosystem growth.",
    },
    sources: [{ label: "CoinGecko - GAS", url: "https://www.coingecko.com/en/coins/gas" }],
  },

  PUNDIX: {
    type: "opinion",
    summary: {
      ko: "Pundi X(PUNDIX)는 오프라인 POS 단말기를 통한 암호화폐 결제 인프라를 구축하는 프로젝트입니다. 실물 하드웨어와 블록체인을 결합한 접근법이 독특합니다.",
      en: "Pundi X (PUNDIX) is a project building cryptocurrency payment infrastructure through offline POS terminals. Its approach combining physical hardware with blockchain is unique.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "PUNDIX는 네트워크 수수료 및 스테이킹 보상 구조. POS 단말기 거래량이 토큰 수요와 직결됩니다.", en: "PUNDIX has network fee and staking reward structure. POS terminal transaction volume directly linked to token demand." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "동남아시아 편의점 등 실제 매장에 단말기를 배치한 실사용 사례가 있습니다.", en: "Real use cases with terminals deployed in actual stores like Southeast Asian convenience stores." },
          { ko: "암호화폐 결제 채택이 예상보다 느리고 대형 결제사 경쟁이 치열합니다.", en: "Cryptocurrency payment adoption is slower than expected and competition with major payment companies is fierce." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "POS 단말기 확산과 실제 결제 볼륨 증가가 직접적 가치 동력입니다.", en: "POS terminal expansion and increased real payment volume are direct value drivers." },
        ],
      },
    ],
    verdict: {
      ko: "실물 결제 인프라라는 차별화된 접근이 있으나 암호화폐 결제 채택 속도가 느려 단기 모멘텀이 낮습니다.",
      en: "Differentiated approach with real payment infrastructure, but slow crypto payment adoption limits short-term momentum.",
    },
    sources: [{ label: "CoinGecko - PUNDIX", url: "https://www.coingecko.com/en/coins/pundi-x-2" }],
  },

  LSK: {
    type: "opinion",
    summary: {
      ko: "Lisk(LSK)는 JavaScript 기반 사이드체인 플랫폼으로 개발자 친화적 블록체인을 목표로 합니다. Optimism 기반 L2로 전환하며 새로운 방향을 모색 중입니다.",
      en: "Lisk (LSK) is a JavaScript-based sidechain platform targeting developer-friendly blockchain. Currently pivoting to an Optimism-based L2 and seeking new direction.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "PoS 스테이킹 보상 구조. L2 전환 후 새로운 토크노믹스 모델 적용 예정입니다.", en: "PoS staking reward structure. New tokenomics model planned after L2 transition." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Optimism 생태계로 전환으로 기존 사이드체인 모델을 탈피. 개발자 기반 확장에 유리한 환경을 만들고 있습니다.", en: "Transition to the Optimism ecosystem abandons the old sidechain model. Creating a favorable environment for expanding the developer base." },
          { ko: "L2 경쟁이 치열하고 Optimism, Arbitrum 등 기존 강자들이 많아 차별화가 중요합니다.", en: "L2 competition is fierce with established players like Optimism and Arbitrum, making differentiation important." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "L2 전환 성공과 개발자 채택이 핵심 가격 동력입니다. 전환 리스크는 존재하지만 방향성은 긍정적입니다.", en: "L2 transition success and developer adoption are the key price drivers. Transition risk exists but direction is positive." },
        ],
      },
    ],
    verdict: {
      ko: "L2 전환이라는 전략적 방향 전환이 긍정적이나 치열한 경쟁 시장에서 자리 잡기까지 시간이 필요합니다.",
      en: "Strategic pivot to L2 is positive but takes time to establish in a competitive market.",
    },
    sources: [{ label: "CoinGecko - LSK", url: "https://www.coingecko.com/en/coins/lisk" }],
  },

  QKC: {
    type: "opinion",
    summary: {
      ko: "QuarkChain(QKC)은 샤딩 기반 고성능 블록체인으로 초당 100만 건 이상의 트랜잭션을 목표로 합니다. 이론적 확장성은 뛰어나지만 실제 채택이 낮습니다.",
      en: "QuarkChain (QKC) is a sharding-based high-performance blockchain targeting over 1 million transactions per second. Theoretically excellent scalability but real adoption is low.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "채굴 보상 및 스테이킹 구조. 네트워크 사용 수요가 낮아 실질 수익 기반이 약합니다.", en: "Mining rewards and staking structure. Low network usage demand weakens the real yield base." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "샤딩 기술은 있으나 2018년 이후 생태계 성장이 정체되었습니다. 이론과 실제 채택 간 간극이 큽니다.", en: "Has sharding technology but ecosystem growth has stagnated since 2018. Large gap between theory and real adoption." },
          { ko: "고성능 블록체인 시장에서 Solana, Sui 등에 밀려 존재감이 낮습니다.", en: "Overshadowed by Solana, Sui, and others in the high-performance blockchain market." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "생태계 재활성화와 실제 dApp 채택이 필요하지만 시장 관심이 매우 낮습니다.", en: "Ecosystem reactivation and real dApp adoption needed, but market interest is very low." },
        ],
      },
    ],
    verdict: {
      ko: "기술적 잠재력은 있으나 생태계가 정체되어 있고 시장 경쟁에서 뒤처져 있습니다. 투자 매력이 낮습니다.",
      en: "Technical potential exists but ecosystem is stagnant and falling behind in market competition. Low investment appeal.",
    },
    sources: [{ label: "CoinGecko - QKC", url: "https://www.coingecko.com/en/coins/quarkchain" }],
  },

  ARDR: {
    type: "opinion",
    summary: {
      ko: "Ardor(ARDR)는 자식 체인(Child Chain) 구조로 기업이 자체 블록체인을 쉽게 배포할 수 있는 플랫폼입니다. Jelurida가 개발하며 IGNIS가 첫 번째 자식 체인입니다.",
      en: "Ardor (ARDR) is a platform with a child chain structure that allows enterprises to easily deploy their own blockchain. Developed by Jelurida, with IGNIS as the first child chain.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "PoS 스테이킹으로 자식 체인 수수료 수익 참여. 자식 체인 활성화 시 ARDR 수요가 증가합니다.", en: "PoS staking for participation in child chain fee revenue. ARDR demand increases as child chains become active." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "기업용 자식 체인 개념은 유효하나 Hyperledger, Ethereum 기업 솔루션 등에 밀렸습니다.", en: "Enterprise child chain concept is valid but overshadowed by Hyperledger, Ethereum enterprise solutions." },
          { ko: "커뮤니티 규모가 작고 개발자 생태계 성장이 정체되었습니다.", en: "Small community size and stagnant developer ecosystem growth." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "새로운 자식 체인 런칭과 기업 파트너십이 가격 동력이지만 모멘텀이 낮습니다.", en: "New child chain launches and enterprise partnerships are price drivers, but momentum is low." },
        ],
      },
    ],
    verdict: {
      ko: "기업 블록체인 배포 플랫폼이라는 유효한 아이디어가 있으나 시장 경쟁에서 존재감이 약해 투자 매력이 낮습니다.",
      en: "Valid idea as an enterprise blockchain deployment platform but weak market presence makes it low-appeal.",
    },
    sources: [{ label: "CoinGecko - ARDR", url: "https://www.coingecko.com/en/coins/ardor" }],
  },

  ONG: {
    type: "opinion",
    summary: {
      ko: "Ontology Gas(ONG)는 Ontology 블록체인의 가스 토큰으로 ONT 보유 시 자동 생성됩니다. 디지털 신원 트랜잭션 처리에 사용됩니다.",
      en: "Ontology Gas (ONG) is the gas token of the Ontology blockchain, automatically generated by holding ONT. Used for processing digital identity transactions.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "ONT 보유 시 ONG 자동 생성. Ontology 네트워크 트랜잭션이 증가할수록 ONG 소비가 늘어납니다.", en: "ONG auto-generated by holding ONT. ONG consumption increases as Ontology network transactions grow." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Ontology 신원 솔루션 확장이 ONG 수요 증가의 핵심. 현재 채택이 낮아 거래량이 제한적입니다.", en: "Expansion of Ontology identity solutions is key to ONG demand growth. Currently low adoption limits transaction volume." },
          { ko: "ONT와 연동되어 ONT 생태계 성패에 직접 영향을 받습니다.", en: "Directly affected by the success or failure of the ONT ecosystem due to its linkage." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "Ontology 신원 플랫폼 실사용 증가가 ONG 가격의 직접적 동력입니다.", en: "Increased real use of the Ontology identity platform is the direct driver of ONG price." },
        ],
      },
    ],
    verdict: {
      ko: "ONT 생태계 가스 토큰으로 명확한 유틸리티가 있으나 Ontology 채택률이 낮아 현재 투자 매력이 제한적입니다.",
      en: "Clear utility as ONT ecosystem gas token, but low Ontology adoption limits current investment appeal.",
    },
    sources: [{ label: "CoinGecko - ONG", url: "https://www.coingecko.com/en/coins/ontology-gas" }],
  },

  STEEM: {
    type: "opinion",
    summary: {
      ko: "Steem은 콘텐츠 크리에이터에게 보상을 주는 블록체인 기반 소셜 미디어 플랫폼 Steemit의 토큰입니다. 2020년 Justin Sun의 Steem 인수 시도 후 Hive로 커뮤니티가 분열됐습니다.",
      en: "Steem is the token of Steemit, a blockchain-based social media platform that rewards content creators. The community split into Hive after Justin Sun's 2020 Steem takeover attempt.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "bad",
        items: [
          { ko: "콘텐츠 보상 및 스테이킹(SP) 구조. 그러나 2020년 포크 이후 핵심 커뮤니티가 Hive로 이탈했습니다.", en: "Content rewards and staking (SP) structure. However, the core community migrated to Hive after the 2020 fork." },
          { ko: "지속적인 인플레이션 구조로 토큰 가격 압박이 있습니다.", en: "Ongoing inflationary structure creates continuous price pressure on the token." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "bad",
        items: [
          { ko: "커뮤니티 분열 후 Steem은 Tron 산하로 넘어갔습니다. 원래 개발팀과 커뮤니티는 Hive에서 활동 중입니다.", en: "After the community split, Steem fell under Tron. The original dev team and community are active on Hive." },
          { ko: "탈중앙 소셜 미디어 분야에서 Hive, Lens Protocol 등에 경쟁 열위에 있습니다.", en: "At a competitive disadvantage against Hive, Lens Protocol, and others in the decentralized social media space." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "bad",
        items: [
          { ko: "커뮤니티 복귀와 플랫폼 재활성화가 필요하지만 Hive 분열 이후 회복이 어렵습니다.", en: "Community return and platform reactivation needed, but recovery is difficult after the Hive split." },
        ],
      },
    ],
    verdict: {
      ko: "커뮤니티 분열과 Tron 인수 이후 근본적 신뢰 손상이 있습니다. Hive가 원래 비전을 더 잘 계승하고 있어 STEEM 투자 매력이 낮습니다.",
      en: "Fundamental trust damage after community split and Tron takeover. Hive better carries the original vision, making STEEM a low-appeal investment.",
    },
    sources: [{ label: "CoinGecko - STEEM", url: "https://www.coingecko.com/en/coins/steem" }],
  },

  AERGO: {
    type: "opinion",
    summary: {
      ko: "에어고(AERGO)는 한국 블록체인 기업 Blocko가 개발한 하이브리드 블록체인 플랫폼입니다. 삼성, 현대 등 대기업과의 파트너십이 있는 한국 기업 블록체인 프로젝트입니다.",
      en: "AERGO is a hybrid blockchain platform developed by Korean blockchain company Blocko. A Korean enterprise blockchain project with partnerships with major companies like Samsung and Hyundai.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "PoS 스테이킹 보상 구조. 기업 솔루션 사용 수수료가 AERGO 수요와 연결됩니다.", en: "PoS staking reward structure. Enterprise solution usage fees are linked to AERGO demand." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Blocko는 실제 기업 고객(삼성SDS 등)을 보유한 한국 블록체인 전문 기업입니다. 실사용 기반이 있습니다.", en: "Blocko is a Korean blockchain specialist company with real enterprise customers (Samsung SDS, etc.). Has a real usage base." },
          { ko: "한국 기업 시장에 집중하여 글로벌 암호화폐 생태계 내 인지도가 낮습니다.", en: "Focused on the Korean enterprise market, resulting in low profile in the global crypto ecosystem." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "기업 블록체인 파트너십 확대가 직접적 가치 동력이나 퍼블릭 시장 연결이 약합니다.", en: "Expansion of enterprise blockchain partnerships is the direct value driver, but connection to the public market is weak." },
        ],
      },
    ],
    verdict: {
      ko: "한국 기업 블록체인 실사용 기반이 있는 안정적 프로젝트이나 글로벌 인지도 부족으로 투자 모멘텀이 낮습니다.",
      en: "Stable project with real Korean enterprise blockchain usage, but lack of global recognition limits investment momentum.",
    },
    sources: [{ label: "CoinGecko - AERGO", url: "https://www.coingecko.com/en/coins/aergo" }],
  },

  MBL: {
    type: "opinion",
    summary: {
      ko: "무비블록(MBL)은 한국 블록체인 기반 영화 투자·배급 플랫폼입니다. 일반 투자자가 영화에 소액 투자하고 수익을 공유하는 모델로 국내 영화 산업과 연계되어 있습니다.",
      en: "MovieBloc (MBL) is a Korean blockchain-based film investment and distribution platform. Allows retail investors to make small investments in films and share profits, connected to the domestic film industry.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "영화 투자 참여 및 스트리밍 플랫폼 수익 공유 구조. 실제 영화 흥행에 따른 수익이 토큰 보유자에게 배분됩니다.", en: "Film investment participation and streaming platform profit-sharing structure. Revenue from actual film performance is distributed to token holders." },
          { ko: "한국 영화 산업과 직접 연계된 유틸리티가 독특하나 시장 규모가 제한적입니다.", en: "Unique utility directly linked to the Korean film industry, but market size is limited." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "한국 업비트 상장 및 국내 영화 투자자들의 관심으로 실사용 커뮤니티가 있습니다.", en: "Listed on Korean Upbit with a real user community from domestic film investors." },
          { ko: "영화 산업 디지털화 트렌드와 부합하지만 글로벌 확장이 제한적입니다.", en: "Aligns with film industry digitization trends but global expansion is limited." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "투자 영화 흥행과 스트리밍 플랫폼 성장이 직접적 가치 동력입니다.", en: "Box office success of invested films and streaming platform growth are direct value drivers." },
        ],
      },
    ],
    verdict: {
      ko: "한국 영화 투자 플랫폼이라는 독특한 포지션이 있으나 시장 규모와 글로벌 확장성이 제한적입니다.",
      en: "Unique positioning as a Korean film investment platform, but limited market size and global scalability.",
    },
    sources: [{ label: "CoinGecko - MBL", url: "https://www.coingecko.com/en/coins/moviebloc" }],
  },

  MLK: {
    type: "opinion",
    summary: {
      ko: "밀크(MLK)는 한국 마일리지·포인트 통합 블록체인 플랫폼입니다. 야놀자, 티웨이항공 등 국내 주요 기업들의 포인트를 통합해 교환할 수 있는 실사용 생태계를 구축했습니다.",
      en: "MiL.k (MLK) is a Korean mileage and points integration blockchain platform. Built a real-use ecosystem integrating points from major Korean companies like Yanolja and T'way Air.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "good",
        items: [
          { ko: "포인트 교환 수수료가 MLK 소각으로 연결되는 디플레이션 구조. 파트너사 증가 시 소각량이 늘어납니다.", en: "Point exchange fees are linked to MLK burns in a deflationary structure. Burns increase as partner companies grow." },
          { ko: "스테이킹 보상과 거버넌스 참여 구조도 갖추고 있습니다.", en: "Also has staking rewards and governance participation structure." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "good",
        items: [
          { ko: "야놀자, 티웨이항공, GS25 등 실제 한국 대기업 파트너십 보유. 일상 생활과 연계된 실사용 사례가 강점입니다.", en: "Real partnerships with major Korean companies including Yanolja, T'way Air, and GS25. Real-world daily life use cases are a strength." },
          { ko: "포인트 통합 시장은 한국에서 규모가 크고 성장 가능성이 있습니다.", en: "The points integration market is large and has growth potential in Korea." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "good",
        items: [
          { ko: "파트너사 확대와 포인트 교환 볼륨 증가가 MLK 소각을 늘려 가격 상승 압력을 만듭니다.", en: "Partner expansion and increased point exchange volume increase MLK burns, creating upward price pressure." },
        ],
      },
    ],
    verdict: {
      ko: "한국 일상 서비스와 연계된 실사용 기반이 탄탄하고 소각 구조도 양호합니다. 한국 중심 성장이 한계이나 국내 시장 내 가장 실용적인 블록체인 프로젝트 중 하나입니다.",
      en: "Solid real-use base connected to Korean daily services with a good burn structure. Korea-centric growth is a limitation, but one of the most practical blockchain projects in the domestic market.",
    },
    sources: [{ label: "CoinGecko - MLK", url: "https://www.coingecko.com/en/coins/milk-alliance" }],
  },

  HUNT: {
    type: "opinion",
    summary: {
      ko: "헌트(HUNT)는 스팀 블록체인 기반으로 시작한 커뮤니티 제품 발굴 플랫폼 Hunt의 토큰입니다. Product Hunt와 유사한 모델로 커뮤니티가 새 제품을 발굴하고 투표합니다.",
      en: "HUNT is the token of Hunt, a community-driven product discovery platform that started on the Steem blockchain. Similar to Product Hunt, the community discovers and votes on new products.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "커뮤니티 활동 보상 구조. 제품 발굴·투표 참여 시 HUNT 보상을 수취합니다.", en: "Community activity reward structure. HUNT rewards received for product discovery and voting participation." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Product Hunt 유사 모델을 블록체인에 구현한 독특한 포지션. 실제 제품 커뮤니티 활동이 있습니다.", en: "Unique positioning implementing a Product Hunt-like model on blockchain. Has real product community activity." },
          { ko: "글로벌 시장보다 한국 암호화폐 커뮤니티 중심으로 생태계가 형성되어 있습니다.", en: "Ecosystem centered around the Korean crypto community rather than the global market." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "커뮤니티 성장과 플랫폼 활성화가 가치 동력이나 틈새 시장에 머물러 있습니다.", en: "Community growth and platform activation are value drivers, but remains in a niche market." },
        ],
      },
    ],
    verdict: {
      ko: "독특한 커뮤니티 제품 발굴 모델이 있으나 틈새 시장에 머물러 있어 대규모 성장 기대가 어렵습니다.",
      en: "Unique community product discovery model, but remains in a niche market making large-scale growth difficult.",
    },
    sources: [{ label: "CoinGecko - HUNT", url: "https://www.coingecko.com/en/coins/hunt" }],
  },

  MED: {
    type: "opinion",
    summary: {
      ko: "메디블록(MED)은 한국 블록체인 헬스케어 데이터 플랫폼입니다. 환자 중심 의료 데이터 관리와 병원 간 기록 공유를 블록체인으로 구현하는 실사용 프로젝트입니다.",
      en: "Medibloc (MED) is a Korean blockchain healthcare data platform. A real-use project implementing patient-centered medical data management and inter-hospital record sharing via blockchain.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "MED 스테이킹으로 네트워크 검증 및 거버넌스 참여. 의료 데이터 거래 수수료가 토큰 수요와 연결됩니다.", en: "MED staking for network validation and governance participation. Medical data transaction fees are linked to token demand." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "한국 주요 병원들과의 파트너십을 통해 실제 의료 데이터 파일럿 프로젝트를 진행 중입니다.", en: "Conducting real medical data pilot projects through partnerships with major Korean hospitals." },
          { ko: "의료 데이터 규제가 엄격하여 상용화 속도가 느리지만 개인 건강 기록 관리 분야는 중요한 시장입니다.", en: "Strict medical data regulations slow commercialization, but personal health record management is an important market." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "병원 네트워크 확산과 환자 데이터 활용 증가가 MED 수요 동력입니다.", en: "Hospital network expansion and increased patient data utilization are MED demand drivers." },
        ],
      },
    ],
    verdict: {
      ko: "한국 헬스케어 블록체인 선두 주자로 실사용 파트너십이 있습니다. 의료 규제 극복이 관건이며 장기적 전망은 긍정적입니다.",
      en: "Leading Korean healthcare blockchain with real-use partnerships. Overcoming medical regulations is key, and long-term prospects are positive.",
    },
    sources: [{ label: "CoinGecko - MED", url: "https://www.coingecko.com/en/coins/medibloc" }],
  },

  BORA: {
    type: "opinion",
    summary: {
      ko: "보라(BORA)는 한국 카카오 계열사 카카오게임즈가 지원하는 게임·엔터테인먼트 특화 블록체인 플랫폼입니다. 카카오 생태계와 연결되어 한국 게임 시장에서 강력한 인프라를 구축 중입니다.",
      en: "BORA is a gaming and entertainment-focused blockchain platform backed by Kakao Games, a Kakao subsidiary. Connected to the Kakao ecosystem, building strong infrastructure in the Korean gaming market.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "게임 내 아이템 거래 수수료 및 스테이킹 보상 구조. 카카오 게임 생태계 활성화 시 수요가 증가합니다.", en: "In-game item trading fee and staking reward structure. Demand increases as the Kakao game ecosystem becomes more active." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "good",
        items: [
          { ko: "카카오게임즈 지원으로 한국 최대 게임 퍼블리셔들과의 협력 관계가 강점입니다.", en: "Backed by Kakao Games, with strong relationships with Korea's largest game publishers." },
          { ko: "클레이튼(Klaytn) 기반에서 자체 체인으로 발전하며 기술 자립도를 높이고 있습니다.", en: "Evolving from Klaytn-based to its own chain, increasing technical independence." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "good",
        items: [
          { ko: "카카오게임즈 신규 게임 출시와 NFT 생태계 확장이 BORA 수요 증가로 직결됩니다.", en: "Kakao Games new game launches and NFT ecosystem expansion directly translate to increased BORA demand." },
        ],
      },
    ],
    verdict: {
      ko: "카카오 게임 생태계 지원이라는 강력한 백킹이 있어 한국 게임 블록체인 중 가장 주목할 만한 프로젝트입니다. 글로벌 확장이 과제입니다.",
      en: "Strong backing from the Kakao gaming ecosystem makes it the most notable project in Korean game blockchain. Global expansion remains the challenge.",
    },
    sources: [{ label: "CoinGecko - BORA", url: "https://www.coingecko.com/en/coins/bora" }],
  },

  POLYX: {
    type: "opinion",
    summary: {
      ko: "Polymesh(POLYX)는 증권형 토큰(Security Token) 특화 퍼블릭 블록체인입니다. 규제 준수를 내장한 설계로 기관급 RWA(실물자산 토큰화) 인프라를 목표로 합니다.",
      en: "Polymesh (POLYX) is a public blockchain specialized for security tokens. With compliance built into its design, it targets institutional-grade RWA (real-world asset tokenization) infrastructure.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "네트워크 운영자 및 노드 오퍼레이터 스테이킹 보상. 증권 토큰 발행 수수료가 POLYX 수요를 만듭니다.", en: "Network operator and node operator staking rewards. Security token issuance fees create POLYX demand." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "good",
        items: [
          { ko: "규제 준수 내장 설계는 기관 투자자에게 필수적인 요소. 증권형 토큰 시장에서 독보적 포지션을 확보했습니다.", en: "Built-in regulatory compliance design is essential for institutional investors. Secured a unique position in the security token market." },
          { ko: "Tokeny, Archax 등 주요 증권 토큰 인프라 파트너십 보유. RWA 성장 트렌드와 완벽하게 부합합니다.", en: "Key security token infrastructure partnerships with Tokeny, Archax, and others. Perfectly aligns with the RWA growth trend." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "good",
        items: [
          { ko: "기관 RWA 토큰화 시장 성장이 직접적 POLYX 수요 증가로 연결됩니다. 규제 명확화가 성장 가속 촉매입니다.", en: "Institutional RWA tokenization market growth directly translates to increased POLYX demand. Regulatory clarity is the growth accelerator." },
        ],
      },
    ],
    verdict: {
      ko: "RWA 토큰화 트렌드에 가장 잘 대응한 규제 준수 블록체인입니다. 기관 채택이 늘어날수록 가치가 올라가는 구조로 중장기 전망이 긍정적입니다.",
      en: "The most well-positioned regulatory-compliant blockchain for the RWA tokenization trend. Positive medium-to-long-term outlook as value increases with growing institutional adoption.",
    },
    sources: [{ label: "CoinGecko - POLYX", url: "https://www.coingecko.com/en/coins/polymesh" }],
  },

  TRUST: {
    type: "opinion",
    summary: {
      ko: "Trust Wallet Token(TRUST)은 바이낸스 산하 Trust Wallet의 네이티브 토큰입니다. 수백만 사용자를 보유한 멀티체인 지갑과 연계된 토큰으로 DeFi 생태계 참여 도구입니다.",
      en: "Trust Wallet Token (TRUST) is the native token of Trust Wallet, a Binance subsidiary. Connected to a multi-chain wallet with millions of users and serves as a DeFi ecosystem participation tool.",
    },
    opinionSections: [
      {
        title: { ko: "토크노믹스 & 홀더 수익", en: "Tokenomics & Holder Returns" },
        rating: "neutral",
        items: [
          { ko: "TRUST 스테이킹으로 지갑 내 수수료 할인 및 독점 기능 접근. 바이낸스 생태계 연계 혜택이 있습니다.", en: "TRUST staking for wallet fee discounts and exclusive feature access. Benefits from Binance ecosystem linkage." },
          { ko: "토큰 소각 계획이 있으나 구체적 일정과 규모가 불명확합니다.", en: "Token burn plans exist but specific timeline and scale are unclear." },
        ],
      },
      {
        title: { ko: "프로토콜 성과 & 경쟁력", en: "Protocol Performance & Competitiveness" },
        rating: "neutral",
        items: [
          { ko: "Trust Wallet은 전 세계 수천만 활성 사용자를 보유한 메이저 지갑. 바이낸스 지원이 강점입니다.", en: "Trust Wallet has tens of millions of active users worldwide and is a major wallet. Binance backing is a strength." },
          { ko: "MetaMask 등 경쟁 지갑이 강하고 TRUST 토큰의 필수 유틸리티가 제한적입니다.", en: "Competition from MetaMask and other wallets is strong, and TRUST token's essential utility is limited." },
        ],
      },
      {
        title: { ko: "성공 → 가격 연결고리", en: "Success → Price Link" },
        rating: "neutral",
        items: [
          { ko: "지갑 사용자 증가와 DeFi 활동 확대가 TRUST 수요를 늘리지만 필수 토큰 여부가 불명확합니다.", en: "Increased wallet users and DeFi activity growth increase TRUST demand, but whether it's an essential token is unclear." },
        ],
      },
    ],
    verdict: {
      ko: "바이낸스 지원의 메이저 지갑 토큰이지만 필수 유틸리티가 제한적입니다. 바이낸스 생태계 확장에 따른 간접 수혜를 기대할 수 있습니다.",
      en: "Major wallet token with Binance backing, but limited essential utility. Can expect indirect benefits from Binance ecosystem expansion.",
    },
    sources: [{ label: "CoinGecko - TRUST", url: "https://www.coingecko.com/en/coins/trust-wallet-token" }],
  },
};
