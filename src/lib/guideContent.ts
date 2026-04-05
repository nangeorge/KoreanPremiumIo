export type GuideSlug =
  | "bitcoin-standard"
  | "self-custody"
  | "full-node"
  | "lightning"
  | "nostr"
  | "mining";

export interface GuideConcept {
  term: string;
  termEn: string;
  desc: string;
  descEn: string;
}

export interface GuideSection {
  title: string;
  titleEn: string;
  points: string[];
  pointsEn: string[];
}

export interface GuideChecklist {
  label: string;
  labelEn: string;
}

export interface GuideData {
  slug: GuideSlug;
  emoji: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  difficulty: "입문" | "초급" | "중급" | "고급";
  difficultyEn: "Beginner" | "Basic" | "Intermediate" | "Advanced";
  timeRead: string;
  summary: string;
  summaryEn: string;
  whyMatters: string[];
  whyMattersEn: string[];
  concepts: GuideConcept[];
  sections: GuideSection[];
  checklist: GuideChecklist[];
  pdfFile?: string;
  pdfLabel?: string;
}

export const GUIDES: GuideData[] = [
  {
    slug: "bitcoin-standard",
    emoji: "₿",
    title: "비트코인 스탠다드",
    titleEn: "The Bitcoin Standard",
    subtitle: "건전 화폐의 원리와 비트코인이 그 해답인 이유",
    subtitleEn: "The principles of sound money and why Bitcoin is the answer",
    difficulty: "입문",
    difficultyEn: "Beginner",
    timeRead: "10분",
    summary:
      "비트코인은 단순한 투자 자산이 아닙니다. 수천 년 역사에서 검증된 '건전 화폐'의 속성을 디지털 세계에 구현한 최초의 화폐입니다. 화폐가 왜 중요한지, 현재 법정화폐 시스템의 문제는 무엇인지, 비트코인이 어떻게 그 문제를 해결하는지 이해하면 비트코인의 본질이 보입니다.",
    summaryEn:
      "Bitcoin is more than an investment asset. It's the first digital implementation of 'sound money' — properties validated over thousands of years of history. Understanding why money matters, what's broken in today's fiat system, and how Bitcoin solves it reveals Bitcoin's true nature.",
    whyMatters: [
      "1975년 자장면 한 그릇 138원, 2025년 7,500원. 자장면 가치가 50배 오른 게 아니라 돈의 구매력이 50분의 1로 폭락한 겁니다. 비트코인은 이 구조를 수학적으로 차단합니다.",
      "2022년 캐나다 정부는 트럭 시위대의 은행 계좌를 동결했습니다. 비트코인은 어떤 정부도, 어떤 은행도 거래를 막을 수 없는 '검열 저항성'을 갖춘 유일한 화폐입니다.",
      "저량-유량 비율(S2F): 원화 14.4, 달러 29.7, 금 70, 비트코인 121. 반감기마다 유량이 절반으로 줄어 비트코인은 인류 역사상 최초로 구매력을 온전히 보존할 수 있는 화폐에 수렴합니다.",
    ],
    whyMattersEn: [
      "In 1975 a bowl of jajangmyeon cost 138 KRW; by 2025 it's 7,500 KRW. Jajangmyeon didn't become 50x more valuable — the purchasing power of money collapsed 50x. Bitcoin mathematically prevents this.",
      "In 2022 the Canadian government froze bank accounts of truck protestors. Bitcoin is the only currency no government or bank can censor or block.",
      "Stock-to-Flow ratios: Korean won 14.4, USD 29.7, Gold 70, Bitcoin 121. Each halving cuts new supply in half — Bitcoin converges toward the first money in human history that can fully preserve purchasing power.",
    ],
    concepts: [
      {
        term: "건전 화폐",
        termEn: "Sound Money",
        desc: "희소성, 내구성, 분할 가능성, 이동성, 균일성을 갖춘 화폐. 금이 수천 년간 화폐로 쓰인 이유이기도 합니다.",
        descEn: "Money with scarcity, durability, divisibility, portability, and fungibility. The same properties that made gold the money of choice for millennia.",
      },
      {
        term: "반감기",
        termEn: "Halving",
        desc: "약 4년마다 채굴 보상이 절반으로 줄어드는 이벤트. 공급 증가율이 꾸준히 감소해 결국 0에 수렴합니다.",
        descEn: "Every ~4 years, mining rewards are cut in half. Supply growth rate steadily decreases toward zero.",
      },
      {
        term: "시간 선호",
        termEn: "Time Preference",
        desc: "미래보다 현재를 얼마나 선호하는지의 척도. 건전 화폐는 낮은 시간 선호(저축·투자)를 장려합니다.",
        descEn: "How much you prefer the present over the future. Sound money encourages low time preference — saving and investing.",
      },
      {
        term: "화폐 프리미엄",
        termEn: "Monetary Premium",
        desc: "실용적 가치 이상으로 화폐가 갖는 추가 가치. 비트코인의 가격 상당 부분은 이 화폐 프리미엄입니다.",
        descEn: "The extra value money commands beyond its utility. Much of Bitcoin's price reflects this monetary premium.",
      },
      {
        term: "인플레이션 세금",
        termEn: "Inflation Tax",
        desc: "화폐를 추가 발행하면 기존 보유자의 구매력이 하락합니다. 은행 계좌에서 눈에 보이지 않게 빠져나가는 세금입니다.",
        descEn: "When new money is printed, purchasing power of existing holders falls. An invisible tax draining your bank account.",
      },
      {
        term: "스톡-투-플로우",
        termEn: "Stock-to-Flow",
        desc: "현재 재고량 ÷ 연간 신규 생산량. 비율이 높을수록 희소성이 높습니다. 현재 비트코인(S2F=121)은 금(S2F=70)을 이미 추월했으며, 반감기마다 더 높아집니다.",
        descEn: "Current stock ÷ annual new supply. Higher ratio = more scarce. Bitcoin (S2F=121) has already surpassed gold (S2F=70) and rises further with each halving.",
      },
      {
        term: "검열 저항성",
        termEn: "Censorship Resistance",
        desc: "어떤 정부, 은행, 기업도 비트코인 거래를 막을 수 없습니다. 개인키만 있으면 지구 어디서든 인터넷만으로 송금이 가능합니다. 2022년 캐나다 트럭 시위 때 은행 계좌는 동결됐지만 비트코인은 막을 수 없었습니다.",
        descEn: "No government, bank, or corporation can block a Bitcoin transaction. With only a private key and internet, you can send money from anywhere on Earth. In 2022, Canadian truck protestors had bank accounts frozen — Bitcoin cannot be frozen.",
      },
      {
        term: "레이어 구조",
        termEn: "Layer Structure",
        desc: "비트코인은 레이어1(온체인)에서 10분 평균 정산으로 최종 결제를 처리하고, 레이어2(라이트닝)에서는 수수료 거의 0으로 초당 수백만~수십억 건 결제를 처리합니다. 카드 결제가 2~3일 뒤 실제 정산되는 것과 비교하면 레이어1도 훨씬 빠릅니다.",
        descEn: "Layer 1 (on-chain) handles final settlement averaging 10 minutes. Layer 2 (Lightning) processes millions to billions of transactions per second at near-zero fees. Even Layer 1 settles faster than card payments (which actually settle 2-3 days later).",
      },
    ],
    sections: [
      {
        title: "역사 속 화폐의 진화",
        titleEn: "The Evolution of Money Through History",
        points: [
          "조개껍질, 유리구슬, 소금 — 희소성을 잃는 순간 화폐 기능을 상실했습니다",
          "금은 채굴 비용이 높아 임의 발행이 불가능해 수천 년간 가치를 유지했습니다",
          "브레튼우즈 체제 붕괴(1971) 후 달러는 금 뒷받침을 잃고 순수 신뢰 기반 화폐가 됐습니다",
          "중앙은행들은 2008년 이후 수십 조 달러를 발행하며 전 세계 자산 가격을 왜곡했습니다",
        ],
        pointsEn: [
          "Shells, glass beads, salt — the moment scarcity was lost, their monetary function disappeared",
          "Gold's high mining cost prevented arbitrary issuance, preserving value for millennia",
          "After Bretton Woods collapsed (1971), the dollar lost gold backing and became pure trust-based money",
          "Central banks have printed tens of trillions since 2008, distorting global asset prices",
        ],
      },
      {
        title: "비트코인의 희소성은 수학적으로 보장된다",
        titleEn: "Bitcoin's Scarcity is Mathematically Guaranteed",
        points: [
          "총 공급량 2,100만 BTC — 코드로 고정되어 있으며 어떤 권력도 변경할 수 없습니다",
          "채굴 보상은 약 4년마다 반감기를 거쳐 2140년경 0에 수렴합니다",
          "현재까지 약 1,950만 BTC가 채굴됐으며 나머지는 점점 더 느리게 공급됩니다",
          "이미 잃어버린 약 300~400만 BTC를 고려하면 실제 순환 공급량은 더 적습니다",
        ],
        pointsEn: [
          "Total supply capped at 21M BTC — fixed in code, changeable by no authority",
          "Mining rewards halve every ~4 years, converging to 0 around 2140",
          "~19.5M BTC mined so far; the rest is released at an ever-slower rate",
          "~3-4M BTC already lost forever, meaning circulating supply is even scarcer",
        ],
      },
      {
        title: "비트코인과 금의 비교",
        titleEn: "Bitcoin vs Gold",
        points: [
          "금: 자연 희소성 / 비트코인: 수학적 희소성 → 비트코인이 더 예측 가능합니다",
          "금: 물리적 이동 어려움 / 비트코인: 인터넷만 있으면 즉시 전 세계 이동",
          "금: 분할 및 합산 복잡 / 비트코인: 소수점 8자리까지 분할 가능(1사토시 = 0.00000001 BTC)",
          "금: 진위 확인 어려움 / 비트코인: 네트워크가 자동으로 검증, 위조 불가능",
          "금: 검열 가능(국가가 압수 가능) / 비트코인: 개인키만 머릿속에 기억하면 누구도 빼앗을 수 없음",
        ],
        pointsEn: [
          "Gold: natural scarcity / Bitcoin: mathematical scarcity — Bitcoin is more predictable",
          "Gold: hard to move physically / Bitcoin: instant global transfer with internet only",
          "Gold: complex to divide / Bitcoin: divisible to 8 decimal places (1 satoshi = 0.00000001 BTC)",
          "Gold: hard to verify / Bitcoin: network verifies automatically, unforgeable",
          "Gold: censorable (governments can confiscate) / Bitcoin: memorize your key and no one can take it",
        ],
      },
      {
        title: "비트코인의 레이어 구조와 결제 실용성",
        titleEn: "Bitcoin's Layer Structure and Payment Practicality",
        points: [
          "레이어1(온체인): 평균 10분 정산. 카드 결제는 편의상 즉시처럼 보이지만 실제 정산은 2~3일 후입니다. 비트코인 6컨펌 후에는 되돌릴 수 없는 최종 정산",
          "레이어2(라이트닝): 초당 수백만~수십억 건 처리 가능. VISA의 초당 65,000건, 마스터카드의 5,000건을 압도",
          "라이트닝 수탁 지갑(월렛 오브 사토시, 블링크 등): 이메일만으로 시작 가능, 소액 결제에 편리",
          "볼츠(Boltz.exchange): 온체인↔라이트닝 스와프 서비스. 온체인→라이트닝 수수료 0.1%, 라이트닝→온체인 0.5%",
          "btcmap.kr에서 주변 비트코인 결제 매장 검색 가능. 라이트닝으로 커피 한 잔부터 경험해보세요",
        ],
        pointsEn: [
          "Layer 1 (on-chain): ~10 min settlement. Cards seem instant but actually settle 2-3 days later. Bitcoin is final and irreversible after 6 confirmations",
          "Layer 2 (Lightning): millions to billions of TPS. Dwarfs Visa (65,000 TPS) and Mastercard (5,000 TPS)",
          "Custodial Lightning wallets (Wallet of Satoshi, Blink, etc.): start with just email, convenient for small payments",
          "Boltz.exchange: on-chain↔Lightning swap service. On-chain→Lightning fee 0.1%, Lightning→on-chain 0.5%",
          "Find Bitcoin-accepting stores near you at btcmap.org. Try buying a coffee with Lightning to experience it firsthand",
        ],
      },
    ],
    checklist: [
      { label: "화폐의 3가지 기능(교환 매체·가치 저장·계산 단위)을 이해했다", labelEn: "Understand the 3 functions of money (medium of exchange, store of value, unit of account)" },
      { label: "1971년 이후 달러가 금 본위제를 벗어난 이유를 설명할 수 있다", labelEn: "Can explain why the dollar left the gold standard after 1971" },
      { label: "비트코인 총 공급량과 반감기 구조를 이해했다", labelEn: "Understand Bitcoin's total supply cap and halving structure" },
      { label: "저량-유량 비율(S2F)로 원화·달러·금·비트코인의 희소성을 비교할 수 있다", labelEn: "Can compare scarcity of KRW, USD, gold, and Bitcoin using Stock-to-Flow ratios" },
      { label: "라이트닝 수탁 지갑을 설치하고 실제 결제를 체험해봤다", labelEn: "Installed a custodial Lightning wallet and made a real payment" },
      { label: "사토시가 얼마인지, 1BTC를 사토시로 환산하면 얼마인지 안다", labelEn: "Know what a satoshi is and how many are in 1 BTC" },
    ],
    pdfFile: "/2._비트코인_스탠다드_가이드_v.2.1__2025._9._1._.pdf",
    pdfLabel: "비트코인 스탠다드 가이드 PDF",
  },
  {
    slug: "self-custody",
    emoji: "🔑",
    title: "셀프 커스터디",
    titleEn: "Self-Custody",
    subtitle: "내 비트코인을 스스로 지키는 법 — Not your keys, not your coins",
    subtitleEn: "Protecting your own Bitcoin — Not your keys, not your coins",
    difficulty: "초급",
    difficultyEn: "Basic",
    timeRead: "20분",
    summary:
      "거래소에 비트코인을 맡겨두는 것은 은행에 금을 맡기는 것과 같습니다. 거래소가 파산하거나 해킹당하면 당신의 비트코인은 사라질 수 있습니다. 비트코인 세계에는 '당신의 키가 아니면, 당신의 비트코인이 아니다(Not Your Keys, Not Your Bitcoin)'라는 격언이 있습니다. 셀프 커스터디란 개인키를 직접 보유해 비트코인의 진정한 소유권을 확보하는 것입니다. 이 가이드에서는 UTXO 모델의 원리, 에어-갭 지갑과 워치-온리 지갑의 조합, 니모닉 생성과 백업 원칙, 수수료와 UTXO 관리, 패스프레이즈, 그리고 한국의 KYC·트래블 룰까지 셀프 커스터디에 필요한 모든 지식을 다룹니다.",
    summaryEn:
      "Leaving Bitcoin on an exchange is like leaving gold at a bank. If the exchange goes bankrupt or gets hacked, your Bitcoin can disappear. Bitcoin's most important maxim: 'Not Your Keys, Not Your Bitcoin.' Self-custody means holding your own private keys — true ownership. This guide covers the UTXO model, air-gapped + watch-only wallet pairing, mnemonic generation and backup, fee and UTXO management, passphrase, and Korea's KYC/travel rule realities.",
    whyMatters: [
      "FTX(2022) 파산으로 수십만 명이 비트코인을 잃었습니다. 거래소에 맡긴 비트코인은 법적으로 거래소의 자산이며, 파산 시 당신은 채권자 순번을 기다려야 합니다. 거래소가 갑이고 당신은 을인 관계입니다.",
      "비트코인의 핵심 가치는 누구의 허가도 필요 없이 사용할 수 있는 돈입니다. 거래소에 맡기는 순간 출금 승인권이 거래소로 넘어가 이 특성이 사라집니다. 출금 제한, KYC 요구, 계정 동결 등의 위험에 항상 노출됩니다.",
      "개인키를 직접 보유하면 전 세계 어디서든 인터넷만 있으면 자신의 비트코인에 즉시 접근할 수 있습니다. 은행 점검 시간도, 영업 시간도, 제3자의 허가도 필요 없습니다. 이것이 비트코인이 설계된 본래의 방식입니다.",
    ],
    whyMattersEn: [
      "FTX's 2022 bankruptcy wiped out hundreds of thousands of users. Bitcoin on an exchange is legally the exchange's asset — in bankruptcy, you wait in line as a creditor. The exchange holds all the power.",
      "Bitcoin's core value is permissionless money. The moment you leave it on an exchange, the withdrawal authority transfers to them. You become exposed to withdrawal limits, KYC demands, and account freezes.",
      "Holding your own keys means instant access to your Bitcoin from anywhere in the world with internet. No bank hours, no maintenance windows, no third-party permission required. This is how Bitcoin was designed to work.",
    ],
    concepts: [
      {
        term: "개인키 / 주소",
        termEn: "Private Key / Address",
        desc: "개인키는 비밀번호, 주소는 계좌번호입니다. 비트코인 장부에는 '주소 A에서 주소 B로 이동'이라는 데이터만 있습니다. 개인키로 서명해야 비트코인을 다른 주소로 보낼 수 있습니다. 개인키 → (타원곡선암호) → 공개키 → (해시함수) → 주소 순서로 일방향 생성됩니다.",
        descEn: "Private key = password, address = account number. Bitcoin's ledger only records 'moved from address A to address B.' You must sign with the private key to send Bitcoin. Flow: private key → (elliptic curve) → public key → (hash function) → address. One-way only.",
      },
      {
        term: "니모닉 (시드)",
        termEn: "Mnemonic (Seed)",
        desc: "12~24개의 영어 단어로 구성된 마스터 키. 니모닉 하나로 42억 개의 개인키와 주소를 파생할 수 있습니다. 마치 열쇠 꾸러미와 같습니다. 절대 디지털 기기에 저장하거나 사진 찍으면 안 됩니다. 니모닉을 잃으면 비트코인에 영원히 접근 불가능합니다.",
        descEn: "12-24 English words forming a master key. One mnemonic can derive 4.2 billion private keys and addresses — like a master key ring. NEVER store digitally or photograph. Losing the mnemonic means permanently losing access to all Bitcoin.",
      },
      {
        term: "UTXO 모델",
        termEn: "UTXO Model",
        desc: "비트코인에는 '잔액'이라는 데이터가 없습니다. '앨리스 주소에서 밥 주소로 이동'처럼 소유권 이전 기록만 있습니다. 아직 다른 곳으로 보내지 않은 출력(Unspent Transaction Output)들의 합이 내 잔액입니다. 현금 지폐처럼 금액이 다른 UTXO를 조합해 사용합니다.",
        descEn: "Bitcoin has no 'balance' data. Only ownership transfer records exist, like 'Alice's address sent to Bob's address.' Your balance is the sum of Unspent Transaction Outputs (UTXOs) not yet sent elsewhere — like combining cash bills of different denominations.",
      },
      {
        term: "에어-갭 지갑",
        termEn: "Air-Gapped Wallet",
        desc: "와이파이, 블루투스, NFC, USB 등 모든 연결이 물리적으로 차단된 콜드월렛. 개인키가 절대 인터넷에 노출되지 않습니다. 데이터 입출력은 QR코드로만 합니다. 키스톤, 시드사이너(Raspberry Pi 조립)가 대표적입니다.",
        descEn: "A cold wallet with all connections physically severed — WiFi, Bluetooth, NFC, USB. Private keys never touch the internet. Data in/out only via QR codes. Keystone and SeedSigner (assembled on Raspberry Pi) are popular examples.",
      },
      {
        term: "워치-온리 지갑",
        termEn: "Watch-Only Wallet",
        desc: "개인키 없이 주소만 알고 잔액을 조회하는 앱. 에어-갭 지갑과 짝을 이뤄 사용합니다. 비트코인을 보낼 때는 워치-온리가 거래를 구성(PSBT)하고, 에어-갭 지갑이 QR코드로 서명, 워치-온리가 네트워크에 전파합니다. BlueWallet, Nunchuk, Sparrow가 대표적.",
        descEn: "An app that knows addresses but not private keys — only displays balances. Paired with an air-gapped wallet. To send: watch-only constructs the transaction (PSBT), air-gapped wallet signs via QR code, watch-only broadcasts to the network. BlueWallet, Nunchuk, and Sparrow are popular.",
      },
      {
        term: "PSBT",
        termEn: "PSBT (Partially Signed Bitcoin Transaction)",
        desc: "워치-온리 지갑이 구성한 '서명되지 않은 거래'를 QR코드로 에어-갭 지갑에 전달하면, 에어-갭 지갑이 개인키로 서명해 '서명된 PSBT'를 QR코드로 돌려줍니다. 인터넷 없이 서명을 완성하는 방식입니다.",
        descEn: "The watch-only wallet constructs an 'unsigned transaction' sent via QR to the air-gapped wallet, which signs it with the private key and returns a 'signed PSBT' via QR. This completes the signing without any internet exposure.",
      },
      {
        term: "확장 공개키 (xpub)",
        termEn: "Extended Public Key (xpub)",
        desc: "개인키 없이 수많은 주소를 파생할 수 있는 값. 에어-갭 지갑에서 QR코드로 내보내 워치-온리 지갑에 등록합니다. xpub만 있으면 누구든 내 모든 주소를 계산할 수 있으므로 신뢰할 수 있는 기기에만 등록하세요.",
        descEn: "A value that derives many addresses without the private key. Exported as QR from air-gapped wallet and registered in the watch-only wallet. Anyone with your xpub can calculate all your addresses — only register on trusted devices.",
      },
      {
        term: "MFP (마스터 핑거프린트)",
        termEn: "MFP (Master Fingerprint)",
        desc: "지갑의 고유 식별자. 마스터 공개키를 해시해 8자리 HEX로 표현합니다. 복구 후 MFP가 동일하면 같은 지갑입니다. 패스프레이즈 사용 시 대소문자·공백 하나 차이도 완전히 다른 MFP가 나오므로, MFP를 함께 백업해 패스프레이즈 오입력을 방지합니다.",
        descEn: "A wallet's unique identifier — master public key hashed to an 8-digit HEX. Same MFP after recovery = same wallet. When using a passphrase, even one character difference creates a completely different MFP, so always back up the MFP alongside your passphrase.",
      },
      {
        term: "패스프레이즈",
        termEn: "Passphrase",
        desc: "니모닉에 추가하는 '25번째 단어'. 같은 니모닉이어도 패스프레이즈가 다르면 완전히 다른 지갑이 생성됩니다. 입문자에게는 권장하지 않습니다. 제대로 이해하지 않으면 비트코인을 영구히 잃을 수 있습니다. 활용법: 패스프레이즈 없는 지갑에 소량, 패스프레이즈 있는 지갑에 대부분 보관 → 강도가 와도 니모닉만 내주면 됩니다.",
        descEn: "A '25th word' added to the mnemonic. Same mnemonic with a different passphrase = completely different wallet. NOT recommended for beginners — misuse can permanently lose Bitcoin. Practical use: keep a small amount in the no-passphrase wallet, the bulk in the passphrase wallet. If threatened, hand over only the mnemonic.",
      },
      {
        term: "멀티시그",
        termEn: "Multisig",
        desc: "여러 개의 키 중 일정 수(예: 2-of-3)의 서명이 있어야 비트코인을 이동할 수 있는 고급 보안 방식. 키 하나를 잃어도 비트코인을 복구할 수 있고, 공격자가 하나의 키를 탈취해도 이동이 불가능합니다. BlueWallet, Nunchuk, Sparrow에서 설정 가능합니다.",
        descEn: "Advanced security requiring a threshold of keys (e.g., 2-of-3 signatures). Losing one key doesn't lose your Bitcoin; stealing one key doesn't compromise your Bitcoin. Configurable in BlueWallet, Nunchuk, and Sparrow.",
      },
    ],
    sections: [
      {
        title: "UTXO 모델: 비트코인에는 잔액이 없다",
        titleEn: "UTXO Model: Bitcoin Has No Balance",
        points: [
          "은행은 '앨리스 계좌에 100만 원'이라는 잔고 데이터를 저장합니다. 해커가 이 숫자를 바꾸면 끝입니다. 그래서 은행은 매일 밤 정산을 합니다.",
          "비트코인은 잔고를 저장하지 않습니다. '주소 A에서 주소 B로 50만 sats 이동'처럼 소유권 이전 기록만 저장합니다. 이 기록이 전 세계 2만 개 이상의 풀 노드에 똑같이 저장됩니다.",
          "아직 사용하지 않은 거래 출력(UTXO)들의 합이 잔액입니다. 지갑 앱이 UTXO들을 더해 화면에 잔액으로 보여주는 것입니다. 비트코인 자체는 어디에도 '저장'되지 않습니다.",
          "UTXO는 현금 지폐와 같습니다. 10만 sats짜리 UTXO 하나를 쓰거나, 2만·3만·5만 sats짜리 UTXO 세 개를 묶어서 쓸 수 있습니다. 잔돈은 새로운 UTXO로 내 지갑에 돌아옵니다.",
          "UTXO는 너무 크면(거래 시 자산 규모 노출) 나쁘고, 너무 잘게 쪼개면(입력이 많아져 수수료 증가) 나쁩니다. 하나당 100만~200만 sats 정도로 분할하는 것이 권장됩니다.",
          "같은 주소를 반복 사용하면 모든 과거 거래가 연결되어 추적이 쉬워집니다. 지갑 앱이 자동으로 새 주소를 생성하므로, 반드시 새 주소를 사용하세요.",
        ],
        pointsEn: [
          "Banks store a balance like 'Alice's account: 1,000,000 KRW.' Change that number and it's done — that's why banks run nightly reconciliations.",
          "Bitcoin stores no balance. Only ownership transfer records like 'address A sent 500,000 sats to address B.' These records are identically stored on 20,000+ full nodes worldwide.",
          "The sum of your Unspent Transaction Outputs (UTXOs) is your balance. Wallet apps add up your UTXOs and display the total. Bitcoin itself is not 'stored' anywhere.",
          "UTXOs are like cash bills. You can spend one 100,000 sat UTXO, or combine three UTXOs of 20K, 30K, and 50K sats. Change returns as a new UTXO to your wallet.",
          "UTXOs that are too large expose your wealth when spending. Too small means more inputs per transaction = higher fees. Splitting to roughly 1M-2M sats each is recommended.",
          "Reusing the same address links all past transactions and makes tracking easy. Wallet apps auto-generate new addresses — always use a fresh one.",
        ],
      },
      {
        title: "에어-갭 지갑과 워치-온리 지갑: 최고의 보안 조합",
        titleEn: "Air-Gapped + Watch-Only: The Most Secure Combination",
        points: [
          "핫월렛은 인터넷에 연결된 지갑입니다. 편리하지만 해커가 인터넷을 통해 개인키를 탈취할 수 있습니다. 콜드월렛은 인터넷과 단절된 지갑이며, 에어-갭 지갑은 그중에서도 블루투스·USB·NFC까지 모든 연결이 차단된 최고 수준의 콜드월렛입니다.",
          "에어-갭 지갑은 인터넷이 없으므로 잔액 조회나 거래 전송을 직접 할 수 없습니다. 그래서 워치-온리 지갑 앱(BlueWallet, Nunchuk, Sparrow)과 함께 사용합니다.",
          "처음 설정 시 에어-갭 지갑이 확장 공개키(xpub)를 QR코드로 내보내고, 워치-온리 앱이 이를 스캔합니다. 이후 워치-온리 앱이 모든 주소를 계산해 잔액을 보여줍니다.",
          "비트코인을 보낼 때 흐름: ① 워치-온리 앱이 '서명 안 된 PSBT'를 QR로 표시 → ② 에어-갭 지갑이 QR 스캔 후 개인키로 서명 → ③ '서명된 PSBT'를 QR로 내보냄 → ④ 워치-온리 앱이 QR 스캔 후 네트워크에 전파.",
          "한국에서 입문자에게 가장 인기 있는 에어-갭 지갑은 키스톤(Keystone 3 Pro)입니다. 터치스크린으로 사용이 편리하고 QR 인식률이 높습니다. 시드사이너(SeedSigner)는 라즈베리 파이 제로를 직접 조립하는 오픈소스 방식으로 최고 수준의 보안을 제공합니다.",
          "반드시 공식 홈페이지나 공인 판매처에서만 구매하세요. 중고 에어-갭 지갑은 절대 구매하지 마세요. 처음 설정 시 기기가 제안하는 니모닉을 쓰지 말고, 반드시 주사위를 직접 굴려 니모닉을 생성하세요.",
        ],
        pointsEn: [
          "Hot wallets are internet-connected and convenient but expose private keys to hackers. Cold wallets are offline. Air-gapped wallets are the highest-tier cold wallet — all connections (Bluetooth, USB, NFC) physically severed.",
          "Air-gapped wallets have no internet, so they can't check balances or broadcast transactions directly. They're always paired with a watch-only app (BlueWallet, Nunchuk, Sparrow).",
          "Initial setup: air-gapped wallet exports the xpub as QR, watch-only app scans it. Afterward, the watch-only app computes all addresses and displays your balance.",
          "Sending Bitcoin flow: ① Watch-only app displays unsigned PSBT as QR → ② Air-gapped wallet scans QR and signs with private key → ③ Exports signed PSBT as QR → ④ Watch-only app scans and broadcasts to network.",
          "The most popular air-gapped wallet for Korean beginners is Keystone 3 Pro — touchscreen, easy to use, reliable QR scanning. SeedSigner is an open-source option (assembled on Raspberry Pi Zero) for maximum security.",
          "Only buy from official websites or authorized resellers. Never buy used air-gapped wallets. During first setup, don't use the device-suggested mnemonic — always roll dice yourself to generate it.",
        ],
      },
      {
        title: "니모닉 생성과 백업 원칙",
        titleEn: "Mnemonic Generation and Backup Principles",
        points: [
          "니모닉은 주사위를 굴려 생성하는 것을 강력 권장합니다. 기계가 만들어주는 난수를 그대로 쓰면 그 기계를 신뢰해야 하는 문제가 생깁니다. 주사위를 직접 굴리면 누구도 신뢰할 필요가 없습니다.",
          "니모닉 생성 시 주변에 카메라가 없는지 반드시 확인하세요. 스마트폰을 포함한 모든 전자기기 근처에서 소리 내어 읽지 마세요. 인터넷이 연결된 기기는 마이크·카메라를 통해 항상 도청 가능성이 있습니다.",
          "절대 디지털 기기(스마트폰, 컴퓨터, 클라우드, 메모 앱)에 저장하거나 사진 찍지 마세요. 종이에 손으로 쓰거나, 금속 플레이트에 각인해 화재·수해에 대비하세요.",
          "최소 2곳 이상의 물리적으로 분리된 안전한 장소에 보관하세요. 집 금고와 은행 금고를 병용하거나, 신뢰할 수 있는 가족에게 한 부를 맡기는 방식을 권장합니다.",
          "니모닉 2,048개 단어 목록에서 앞 4글자가 겹치는 단어는 없습니다. 따라서 백업할 때 단어 앞 4자리만 써도 충분합니다. 또한 마지막 단어에는 체크섬 정보가 담겨 있어 오기입 여부를 확인할 수 있습니다.",
          "지갑을 처음 사용한 뒤 반드시 복구 테스트를 하세요. 지갑을 초기화하거나 다른 기기에 니모닉을 입력해 복구가 정상적으로 되는지 확인한 뒤에야 비트코인을 실제로 입금하세요.",
        ],
        pointsEn: [
          "Strongly recommended: generate your mnemonic by rolling dice. Using a machine-generated random number requires trusting that machine. Rolling dice requires trusting no one.",
          "Before generating a mnemonic, ensure no cameras are nearby. Don't read it aloud near any electronic device including smartphones — internet-connected devices can always record via microphone or camera.",
          "NEVER store on digital devices (phone, computer, cloud, notes app) or photograph. Write by hand on paper, or engrave on metal plates to survive fire and water.",
          "Store in at least 2 physically separate secure locations. Common approach: home safe + bank vault, or leave one copy with a trusted family member.",
          "No two words in the 2,048-word BIP-39 list share the same first 4 characters, so writing just the first 4 letters per word is sufficient for backup. The last word also contains a checksum to detect typos.",
          "After initial wallet setup, always do a recovery test — reset the wallet or enter the mnemonic on a different device and verify it restores correctly before sending any real Bitcoin.",
        ],
      },
      {
        title: "거래 수수료와 온체인 거래 이해",
        titleEn: "Transaction Fees and Understanding On-Chain Transactions",
        points: [
          "비트코인 온체인 거래는 채굴자에게 수수료를 지불합니다. 수수료는 데이터 크기 대비(sat/vByte)로 측정하며, 블록 공간은 한정되어 있어 수수료가 높을수록 빨리 처리됩니다.",
          "mempool.space에서 현재 네트워크 혼잡도와 권장 수수료를 실시간으로 확인할 수 있습니다. 급하지 않으면 낮은 수수료를, 빨리 처리하려면 높은 수수료를 설정하세요.",
          "수수료를 너무 낮게 설정하면 거래가 며칠씩 미확정(unconfirmed) 상태로 멤풀에 남을 수 있습니다. 이 경우 RBF(Replace By Fee)로 수수료를 높여 대체하거나, CPFP(Child Pays for Parent)로 해결할 수 있습니다.",
          "입력(UTXO)이 많을수록 거래 데이터 크기가 커져 수수료가 올라갑니다. 수수료가 낮을 때 미리 UTXO를 정리해 두면(통합) 나중에 수수료를 절약할 수 있습니다.",
          "거래가 블록에 포함되면 '1컨펌', 그 위에 블록이 하나 더 쌓이면 '2컨펌'이라고 합니다. 6컨펌이면 실질적으로 되돌릴 수 없는 거래로 간주합니다. 평균 10분에 블록 하나가 생성됩니다.",
        ],
        pointsEn: [
          "Bitcoin on-chain transactions pay fees to miners. Fees are measured per data size (sat/vByte). Block space is limited, so higher fee = faster confirmation.",
          "Check mempool.space for real-time network congestion and recommended fee rates. Set low fees when not urgent, higher when speed matters.",
          "Setting fees too low can leave a transaction unconfirmed in the mempool for days. Solutions: RBF (Replace By Fee) to replace with a higher fee transaction, or CPFP (Child Pays for Parent) to speed up confirmation.",
          "More inputs (UTXOs) = larger transaction data = higher fees. Consolidating UTXOs during low-fee periods saves fees later when you need to spend.",
          "When a transaction enters a block, it has '1 confirmation.' Each subsequent block adds another confirmation. 6 confirmations is considered practically irreversible. Blocks are produced ~every 10 minutes on average.",
        ],
      },
      {
        title: "패스프레이즈와 MFP: 고급 보안",
        titleEn: "Passphrase and MFP: Advanced Security",
        points: [
          "패스프레이즈는 니모닉에 추가하는 25번째 단어입니다. 같은 니모닉이어도 패스프레이즈가 다르면 완전히 다른 지갑이 생성됩니다. '틀린다'는 개념이 없어 오타 하나도 다른 지갑을 만듭니다.",
          "입문자에게는 강력히 권장하지 않습니다. 원리를 완전히 이해하지 않은 상태에서 설정했다가 비트코인을 영구히 잃은 사례가 많습니다. 먼저 패스프레이즈 없이 충분히 경험을 쌓은 후에 도입하세요.",
          "패스프레이즈의 실용적 활용법: 패스프레이즈 없는 지갑에는 소량만 보관하고, 패스프레이즈 있는 지갑에 대부분을 보관합니다. 강제로 니모닉을 빼앗기더라도 공격자는 소량만 가져갑니다. 이것이 '5달러 렌치 공격(물리적 협박)'에 대응하는 방법입니다.",
          "MFP(마스터 핑거프린트)는 지갑의 고유 식별자입니다. 패스프레이즈를 사용할 경우 MFP를 반드시 함께 백업하세요. 패스프레이즈 오기입 시 MFP가 달라지므로 즉시 확인할 수 있습니다.",
          "패스프레이즈를 사용한다면 니모닉 백업본에 패스프레이즈를 함께 적지 마세요. 니모닉과 패스프레이즈를 별도의 장소에 보관해 두 가지가 동시에 노출되지 않도록 해야 합니다.",
        ],
        pointsEn: [
          "A passphrase is a '25th word' added to the mnemonic. Same mnemonic + different passphrase = completely different wallet. There's no concept of 'wrong' — even a single typo creates a different wallet.",
          "Strongly NOT recommended for beginners. Many have permanently lost Bitcoin by setting a passphrase without fully understanding it. Gain experience without one first, then introduce it.",
          "Practical passphrase strategy: keep a small amount in the no-passphrase wallet, the bulk in the passphrase wallet. Even if forced to give up your mnemonic, the attacker only gets the decoy amount. This counters the '$5 wrench attack' (physical coercion).",
          "MFP (Master Fingerprint) is the wallet's unique identifier. When using a passphrase, always back up the MFP alongside it. A passphrase typo produces a different MFP, letting you detect the error immediately.",
          "If using a passphrase, don't write it on the same backup as your mnemonic. Store them in separate locations so both are never exposed simultaneously.",
        ],
      },
      {
        title: "한국의 KYC·트래블 룰과 비트코인 인출 방법",
        titleEn: "Korea's KYC, Travel Rule, and Withdrawal Flow",
        points: [
          "비트코인의 프라이버시는 주소와 실제 신원이 연결되지 않는 데서 옵니다. 국가는 거래소에 KYC(고객 확인)를 의무화해 주소와 신원을 연결하려 합니다. 이것이 국가가 거래소를 규제하는 핵심 이유 중 하나입니다.",
          "한국의 트래블 룰 때문에 국내 거래소(업비트, 빗썸)에서 직접 개인 지갑으로 비트코인을 인출할 수 없습니다. 반드시 동일 신원이 인증된 해외 거래소를 경유해야 합니다.",
          "실용적인 인출 경로: ① 원화로 국내 거래소에서 USDT 구매 → ② 해외 거래소(바이낸스 등)로 USDT 전송(국내 거래소의 BTC 출금 수수료가 비싸기 때문) → ③ 해외 거래소에서 BTC 구매 → ④ 개인 에어-갭 지갑으로 전송.",
          "반대 방향(개인 지갑 → 원화 출금): ① 개인 지갑 → 해외 거래소(온체인 또는 라이트닝+Boltz 스왑) → ② 해외 거래소에서 USDT로 전환 → ③ 국내 거래소로 USDT 전송 → ④ 원화 환전 후 은행 출금.",
          "일부 국내 거래소는 개인 지갑 인출 시 자금 출처 확인, 머그샷 촬영 등 과도한 요구를 하기도 합니다. 라이트닝 네트워크와 Boltz 스왑 서비스를 이용하면 온체인 수수료를 절약하고 더 빠르게 처리할 수 있습니다.",
        ],
        pointsEn: [
          "Bitcoin's privacy comes from addresses not being linked to real identities. Governments mandate KYC at exchanges to create that link — one of the core reasons exchanges are so heavily regulated.",
          "Due to Korea's Travel Rule, you cannot directly withdraw Bitcoin from domestic exchanges (Upbit, Bithumb) to a personal wallet. You must route through an overseas exchange with the same KYC identity.",
          "Practical withdrawal path: ① Buy USDT on domestic exchange with KRW → ② Send USDT to overseas exchange (cheaper than BTC transfer fees) → ③ Buy BTC on overseas exchange → ④ Send to personal air-gapped wallet.",
          "Reverse path (personal wallet → KRW): ① Personal wallet → overseas exchange (on-chain or Lightning + Boltz swap) → ② Convert to USDT → ③ Send USDT to domestic exchange → ④ Convert to KRW and withdraw to bank.",
          "Some Korean exchanges demand excessive documentation (proof of funds, identity photos) for personal wallet withdrawals. Using Lightning Network with Boltz swap services reduces on-chain fees and speeds up the process.",
        ],
      },
      {
        title: "5달러 렌치 공격과 수량 보안",
        titleEn: "The $5 Wrench Attack and Wealth Privacy",
        points: [
          "잘 보관된 비트코인을 컴퓨터로 해킹하는 것은 사실상 불가능합니다. 무차별 대입 공격에 우리 태양계 전체의 에너지를 써도 개인키를 깨뜨릴 수 없습니다.",
          "그래서 가장 저렴한 해킹 방법은 '5달러짜리 렌치로 당신을 협박하는 것'입니다. 비트코인을 많이 가졌다고 알려진 사람을 납치하거나 협박해 니모닉과 패스프레이즈를 말하게 합니다.",
          "비트코인 세계에서는 보유량을 절대 공개하지 않는 것이 암묵적 규칙입니다. 자산을 자랑하는 것은 물리적 보안 위협을 스스로 초대하는 행위입니다.",
          "패스프레이즈를 활용해 '미끼 지갑'을 만드세요. 니모닉만으로 접근 가능한 지갑에는 소액을, 패스프레이즈가 있어야 열리는 지갑에 대부분을 보관합니다. 강제 상황에서 니모닉만 넘겨도 공격자는 소액밖에 얻지 못합니다.",
          "평단가를 묻는 질문에 답하지 마세요. 평단가를 안다는 것은 거래소에 비트코인이 있다는 뜻입니다. 개인 지갑을 사용하면 UTXO별로 다른 시점에 구매했으므로 단일 평단가가 없습니다.",
        ],
        pointsEn: [
          "Hacking a well-secured Bitcoin wallet via computer is effectively impossible. A brute-force attack would require more energy than our entire solar system produces to crack a private key.",
          "The cheapest hack is the '$5 wrench attack' — physically threatening you to reveal your mnemonic and passphrase. People known to hold large amounts of Bitcoin are targets for kidnapping or coercion.",
          "In Bitcoin culture, never disclosing your holdings is an unwritten rule. Boasting about your stack is literally inviting a physical security threat.",
          "Create a 'decoy wallet' using the passphrase strategy. Keep a small amount in the no-passphrase wallet (accessible with mnemonic alone), the bulk in the passphrase wallet. Under coercion, surrendering just the mnemonic gives the attacker only the decoy.",
          "Don't answer questions about your average cost basis. Knowing it implies you hold Bitcoin on an exchange. With a personal wallet, each UTXO was purchased at a different time — there is no single average cost.",
        ],
      },
    ],
    checklist: [
      { label: "UTXO 모델이 잔고 모델과 다른 이유를 설명할 수 있다", labelEn: "Can explain why the UTXO model differs from the balance model" },
      { label: "에어-갭 지갑과 워치-온리 지갑의 역할 분담을 이해했다", labelEn: "Understand the role division between air-gapped and watch-only wallets" },
      { label: "주사위를 굴려 니모닉을 생성하고, 카메라 없는 곳에서 기록했다", labelEn: "Generated mnemonic by rolling dice and recorded it in a camera-free location" },
      { label: "니모닉을 종이 또는 금속에 손으로 기록하고 2곳 이상에 보관했다", labelEn: "Written mnemonic by hand on paper or metal and stored in 2+ locations" },
      { label: "복구 테스트를 완료했다 (지갑 초기화 후 니모닉으로 복구 성공)", labelEn: "Completed recovery test (reset wallet and successfully restored from mnemonic)" },
      { label: "MFP를 니모닉 백업본 옆에 함께 기록해뒀다", labelEn: "Recorded MFP alongside the mnemonic backup" },
      { label: "에어-갭 지갑으로 소액 수신 및 전송을 성공적으로 완료했다", labelEn: "Successfully received and sent a small amount using the air-gapped wallet" },
      { label: "mempool.space에서 현재 수수료를 확인하고 적정 수수료를 설정해봤다", labelEn: "Checked mempool.space for current fees and set an appropriate fee rate" },
      { label: "자신의 보유량을 타인에게 절대 공개하지 않기로 결심했다", labelEn: "Committed to never disclosing holdings to others" },
    ],
    pdfFile: "/1._셀프_커스터디_가이드_1__v.2.1__2025._9._1.pdf",
    pdfLabel: "셀프 커스터디 가이드 PDF",
  },
  {
    slug: "full-node",
    emoji: "🖥️",
    title: "풀 노드 운영",
    titleEn: "Running a Full Node",
    subtitle: "비트코인 네트워크의 진정한 참여자가 되는 법",
    subtitleEn: "Becoming a true participant in the Bitcoin network",
    difficulty: "중급",
    difficultyEn: "Intermediate",
    timeRead: "15분",
    summary:
      "풀 노드는 비트코인의 전체 거래 내역을 직접 검증하는 소프트웨어입니다. 남의 노드를 믿는 대신 스스로 규칙을 집행함으로써 진정한 금융 주권을 얻습니다. 라즈베리 파이 수준의 하드웨어로도 운영 가능하며, 자신의 트랜잭션 프라이버시도 크게 강화됩니다.",
    summaryEn:
      "A full node is software that independently verifies the entire Bitcoin transaction history. Instead of trusting someone else's node, you enforce the rules yourself — true financial sovereignty. Runs on hardware as small as a Raspberry Pi, and greatly enhances your transaction privacy.",
    whyMatters: [
      "풀 노드 없이는 다른 노드의 말을 믿어야 합니다 — 비트코인의 신뢰 없는 시스템에서 신뢰를 재도입하는 것입니다.",
      "거래소나 지갑 앱은 당신의 모든 트랜잭션과 잔액을 볼 수 있습니다. 풀 노드를 통하면 이런 정보 노출을 차단합니다.",
      "네트워크에 노드가 많을수록 공격·검열에 더 강해집니다. 당신의 노드 하나가 비트코인을 더 강하게 만듭니다.",
    ],
    whyMattersEn: [
      "Without a full node you must trust another node — reintroducing trust into a trustless system.",
      "Exchanges and wallet apps can see all your transactions and balances. A full node blocks this data exposure.",
      "More nodes = stronger resistance to attacks and censorship. Your single node makes Bitcoin stronger.",
    ],
    concepts: [
      {
        term: "검증 노드",
        termEn: "Validating Node",
        desc: "비트코인 합의 규칙을 직접 검증하는 노드. 블록을 받으면 모든 규칙(공급량, 서명 등)을 독립적으로 확인합니다.",
        descEn: "A node that independently verifies Bitcoin consensus rules. Every received block is checked against all rules (supply, signatures, etc.).",
      },
      {
        term: "UTXO 세트",
        termEn: "UTXO Set",
        desc: "아직 사용되지 않은 모든 비트코인 출력값의 집합. 현재 약 5GB이며 이것이 실제 '잔액 데이터베이스'입니다.",
        descEn: "The set of all unspent Bitcoin outputs. Currently ~5GB — the actual 'balance database' of Bitcoin.",
      },
      {
        term: "IBD",
        termEn: "Initial Block Download",
        desc: "처음 노드를 실행할 때 제네시스 블록부터 현재까지 모든 블록을 동기화하는 과정. 보통 1~3일 소요됩니다.",
        descEn: "The process of syncing all blocks from genesis to present when first running a node. Takes 1-3 days typically.",
      },
      {
        term: "Tor 연동",
        termEn: "Tor Integration",
        desc: "비트코인 트래픽을 Tor 네트워크를 통해 라우팅해 IP 주소를 숨기고 프라이버시를 강화합니다.",
        descEn: "Routes Bitcoin traffic through the Tor network, hiding your IP address and enhancing privacy.",
      },
      {
        term: "Electrum 서버",
        termEn: "Electrum Server",
        desc: "자신의 풀 노드에서 직접 지갑 조회를 가능하게 하는 인터페이스. Electrs, Fulcrum 등이 있습니다.",
        descEn: "An interface enabling wallet queries directly against your own full node. Examples: Electrs, Fulcrum.",
      },
      {
        term: "mempool",
        termEn: "Mempool",
        desc: "아직 블록에 포함되지 않은 대기 중인 트랜잭션의 임시 저장소. 자신의 mempool을 보면 수수료 추정이 정확해집니다.",
        descEn: "A temporary pool of unconfirmed transactions waiting to be included in a block. Watching your own mempool improves fee estimation.",
      },
    ],
    sections: [
      {
        title: "풀 노드가 하는 일",
        titleEn: "What a Full Node Does",
        points: [
          "네트워크의 모든 트랜잭션과 블록을 다운로드하고 독립적으로 검증합니다",
          "비트코인 규칙에 어긋나는 블록은 자동으로 거부합니다 (2,100만 BTC 초과 발행 불가능)",
          "검증된 트랜잭션을 다른 노드에 중계해 네트워크를 유지합니다",
          "자신의 지갑에서 트랜잭션을 직접 브로드캐스트해 제3자 의존을 제거합니다",
        ],
        pointsEn: [
          "Downloads and independently verifies every transaction and block on the network",
          "Automatically rejects blocks violating Bitcoin rules (no issuing beyond 21M BTC)",
          "Relays verified transactions to other nodes, maintaining the network",
          "Broadcasts transactions from your own wallet directly, eliminating third-party reliance",
        ],
      },
      {
        title: "하드웨어 요구사항",
        titleEn: "Hardware Requirements",
        points: [
          "저장 공간: SSD 최소 700GB 이상 (블록체인 현재 ~650GB, 계속 증가)",
          "RAM: 최소 4GB, 권장 8GB",
          "CPU: 라즈베리 파이 4 이상이면 충분 (저전력으로 24/7 운영 가능)",
          "인터넷: 안정적인 인터넷 연결, 월 약 200~400GB 트래픽 예상",
          "추천 기기: 라즈베리 파이 4, 미니 PC(Intel NUC), 또는 일반 노트북",
        ],
        pointsEn: [
          "Storage: SSD minimum 700GB (blockchain currently ~650GB and growing)",
          "RAM: minimum 4GB, recommended 8GB",
          "CPU: Raspberry Pi 4 or equivalent sufficient (24/7 low-power operation)",
          "Internet: stable connection; expect ~200-400GB traffic per month",
          "Recommended: Raspberry Pi 4, mini PC (Intel NUC), or a spare laptop",
        ],
      },
      {
        title: "추천 소프트웨어 스택",
        titleEn: "Recommended Software Stack",
        points: [
          "Bitcoin Core: 공식 비트코인 전체 노드 소프트웨어 (bitcoin.org)",
          "Umbrel/RaspiBlitz/Start9: 라즈베리 파이용 원클릭 노드 운영체제 — 비개발자에게 추천",
          "Electrs/Fulcrum: 지갑 연결을 위한 Electrum 서버",
          "Mempool.space 자체 호스팅: 자신의 mempool 대시보드 운영",
          "Tor: 프라이버시 강화를 위한 네트워크 라우팅",
        ],
        pointsEn: [
          "Bitcoin Core: official full node software (bitcoin.org)",
          "Umbrel/RaspiBlitz/Start9: one-click node OS for Raspberry Pi — recommended for non-developers",
          "Electrs/Fulcrum: Electrum server for wallet connectivity",
          "Self-hosted mempool.space: run your own mempool dashboard",
          "Tor: network routing for privacy enhancement",
        ],
      },
    ],
    checklist: [
      { label: "풀 노드와 라이트 노드(SPV)의 차이를 이해했다", labelEn: "Understand the difference between a full node and light node (SPV)" },
      { label: "비트코인 코어 또는 Umbrel을 설치했다", labelEn: "Installed Bitcoin Core or Umbrel" },
      { label: "블록체인 동기화를 완료했다(IBD)", labelEn: "Completed blockchain synchronization (IBD)" },
      { label: "자신의 노드에 지갑을 연결했다", labelEn: "Connected a wallet to your own node" },
      { label: "Tor를 통해 노드를 운영하고 있다", labelEn: "Running node over Tor" },
    ],
    pdfFile: "/3._풀_노드_운영_가이드_v.2.1__2025._9._1._.pdf",
    pdfLabel: "풀 노드 운영 가이드 PDF",
  },
  {
    slug: "lightning",
    emoji: "⚡",
    title: "라이트닝 네트워크",
    titleEn: "Lightning Network",
    subtitle: "비트코인으로 커피 한 잔을 사는 법",
    subtitleEn: "How to buy a coffee with Bitcoin",
    difficulty: "중급",
    difficultyEn: "Intermediate",
    timeRead: "13분",
    summary:
      "비트코인 온체인 거래는 느리고 수수료가 비쌉니다. 라이트닝 네트워크는 비트코인 위에 구축된 2계층 결제 프로토콜로, 초 단위 결제와 거의 무료에 가까운 수수료를 실현합니다. 결제 채널의 원리부터 실제 노드 운영까지 알아봅니다.",
    summaryEn:
      "Bitcoin on-chain transactions are slow and expensive. The Lightning Network is a Layer 2 payment protocol built on Bitcoin, enabling sub-second payments with near-zero fees. We explore payment channel mechanics through to running your own Lightning node.",
    whyMatters: [
      "온체인 비트코인 거래는 평균 10분 대기, 수천 원의 수수료 — 소액 결제에는 부적합합니다.",
      "라이트닝은 초당 수백만 건의 거래를 처리할 수 있어 비자/마스터카드보다 빠릅니다.",
      "엘살바도르, 아르헨티나 등에서는 라이트닝을 통한 비트코인 결제가 일상에서 이미 사용됩니다.",
    ],
    whyMattersEn: [
      "On-chain Bitcoin: ~10 min wait, fees in the thousands of won — unsuitable for small payments.",
      "Lightning can process millions of transactions per second — faster than Visa/Mastercard.",
      "In El Salvador, Argentina and elsewhere, Lightning Bitcoin payments are already used daily.",
    ],
    concepts: [
      {
        term: "결제 채널",
        termEn: "Payment Channel",
        desc: "두 당사자 간의 오프체인 비트코인 잔액 관계. 채널 개설·종료 시만 온체인 거래가 발생하고 중간의 모든 결제는 즉시 처리됩니다.",
        descEn: "An off-chain Bitcoin balance relationship between two parties. On-chain transactions only occur when opening/closing the channel; all payments in between are instant.",
      },
      {
        term: "HTLC",
        termEn: "HTLC (Hash Time-Locked Contract)",
        desc: "직접 채널이 없어도 여러 노드를 거쳐 안전하게 결제를 라우팅하는 암호학적 계약.",
        descEn: "A cryptographic contract that routes payments safely through multiple nodes even without a direct channel.",
      },
      {
        term: "인보이스",
        termEn: "Invoice",
        desc: "결제 요청서. QR코드나 텍스트 문자열로 표현되며 금액, 수신자, 만료 시간 등이 포함됩니다.",
        descEn: "A payment request. Expressed as a QR code or text string, containing amount, recipient, and expiry time.",
      },
      {
        term: "채널 유동성",
        termEn: "Channel Liquidity",
        desc: "채널을 통해 보낼 수 있는 최대 금액. 인바운드 유동성(받을 수 있는 양)과 아웃바운드(보낼 수 있는 양)로 나뉩니다.",
        descEn: "The maximum amount sendable through a channel. Split into inbound liquidity (receivable) and outbound liquidity (sendable).",
      },
      {
        term: "라우팅 수수료",
        termEn: "Routing Fee",
        desc: "결제를 중계해주는 노드에게 지불하는 소액 수수료. 일반적으로 0.0001~0.001% 수준으로 극히 작습니다.",
        descEn: "A tiny fee paid to nodes that relay your payment. Typically 0.0001–0.001% — extremely small.",
      },
      {
        term: "워치타워",
        termEn: "Watchtower",
        desc: "노드가 오프라인 상태일 때 채널 상대방의 사기 시도를 감시하고 자동으로 대응하는 서비스.",
        descEn: "A service that monitors for fraudulent channel closure attempts while your node is offline, responding automatically.",
      },
    ],
    sections: [
      {
        title: "라이트닝은 어떻게 동작하는가",
        titleEn: "How Lightning Works",
        points: [
          "두 노드가 온체인 트랜잭션으로 멀티시그 지갑에 비트코인을 잠그면 채널이 개설됩니다",
          "이후 두 노드 사이의 모든 결제는 채널 내 잔액 재배분으로만 처리됩니다 (온체인 불필요)",
          "직접 채널이 없어도 중간 노드를 통해 HTLC 방식으로 안전하게 라우팅됩니다",
          "채널을 닫을 때 최종 잔액 상태가 온체인에 기록되어 비트코인으로 정산됩니다",
        ],
        pointsEn: [
          "Two nodes open a channel by locking Bitcoin in a multisig wallet via on-chain transaction",
          "All subsequent payments between them are just balance redistributions within the channel (no on-chain needed)",
          "No direct channel? Payments route through intermediate nodes safely via HTLC",
          "When closing a channel, the final balance state is recorded on-chain and settled in Bitcoin",
        ],
      },
      {
        title: "라이트닝 지갑 선택",
        titleEn: "Choosing a Lightning Wallet",
        points: [
          "Phoenix Wallet: 비수탁형, 사용이 매우 쉬움 — 라이트닝 입문자 최우선 추천",
          "Breez Wallet: 비수탁형, POS 기능 포함 — 소규모 사업자에게 적합",
          "Muun Wallet: 온체인+라이트닝 통합, 백업이 쉬움",
          "Zeus Wallet: 자신의 노드에 연결 가능, 고급 사용자용",
          "수탁형(Wallet of Satoshi 등)은 편리하지만 개인키를 직접 보유하지 않아 셀프 커스터디 원칙에 어긋납니다",
        ],
        pointsEn: [
          "Phoenix Wallet: non-custodial, very easy to use — #1 recommendation for Lightning beginners",
          "Breez Wallet: non-custodial, includes POS features — great for small businesses",
          "Muun Wallet: unified on-chain + Lightning, easy backup",
          "Zeus Wallet: can connect to your own node, for advanced users",
          "Custodial wallets (Wallet of Satoshi, etc.) are convenient but violate self-custody principles",
        ],
      },
      {
        title: "라이트닝 노드 운영하기",
        titleEn: "Running a Lightning Node",
        points: [
          "풀 노드가 먼저 필요합니다 — 라이트닝 노드는 비트코인 풀 노드 위에서 실행됩니다",
          "LND, CLN(Core Lightning), Eclair 중 LND가 가장 널리 쓰이고 도구 지원이 풍부합니다",
          "Umbrel, RaspiBlitz 등을 사용하면 라이트닝 노드를 간편하게 같이 실행할 수 있습니다",
          "채널 파트너를 잘 선택해야 합니다 — 네트워크 중앙에 가까운 노드와 채널을 여는 것이 유리합니다",
          "인바운드 유동성 확보가 초보자의 가장 큰 과제입니다",
        ],
        pointsEn: [
          "A full node is required first — Lightning runs on top of a Bitcoin full node",
          "LND, CLN (Core Lightning), Eclair — LND is most widely used with richest tooling",
          "Umbrel, RaspiBlitz, etc. let you run a Lightning node alongside your full node easily",
          "Choose channel partners wisely — opening channels with well-connected nodes is advantageous",
          "Acquiring inbound liquidity is the biggest challenge for beginners",
        ],
      },
    ],
    checklist: [
      { label: "결제 채널의 개설-사용-종료 흐름을 이해했다", labelEn: "Understand the open-use-close flow of payment channels" },
      { label: "라이트닝 지갑을 설치하고 소액을 충전했다", labelEn: "Installed a Lightning wallet and loaded a small amount" },
      { label: "라이트닝으로 실제 결제를 해봤다 (예: Bitcoin Beach, Bitrefill)", labelEn: "Made a real Lightning payment (e.g., Bitcoin Beach, Bitrefill)" },
      { label: "인바운드/아웃바운드 유동성 개념을 이해했다", labelEn: "Understand inbound/outbound liquidity concepts" },
      { label: "라이트닝 주소(user@domain.com 형식)를 만들었다", labelEn: "Created a Lightning address (user@domain.com format)" },
    ],
    pdfFile: "/4._라이트닝_노드_운영_가이드_v.2.1__2025._9._1._.pdf",
    pdfLabel: "라이트닝 노드 운영 가이드 PDF",
  },
  {
    slug: "nostr",
    emoji: "🌐",
    title: "노스터(Nostr)",
    titleEn: "Nostr",
    subtitle: "검열 불가능한 탈중앙화 소셜 네트워크",
    subtitleEn: "A censorship-resistant decentralized social network",
    difficulty: "초급",
    difficultyEn: "Basic",
    timeRead: "10분",
    summary:
      "트위터, 페이스북 등 중앙화된 플랫폼은 계정을 삭제하거나 콘텐츠를 검열할 수 있습니다. Nostr(Notes and Other Stuff Transmitted by Relays)는 암호학적 키 쌍을 기반으로 한 탈중앙화 소셜 프로토콜입니다. 아무도 당신의 계정을 빼앗거나 게시물을 삭제할 수 없습니다.",
    summaryEn:
      "Centralized platforms like Twitter and Facebook can delete accounts and censor content. Nostr (Notes and Other Stuff Transmitted by Relays) is a decentralized social protocol based on cryptographic key pairs. No one can take your account or delete your posts.",
    whyMatters: [
      "트위터·페이스북 등 기존 소셜 미디어의 3가지 문제: ① 검열(정부·운영자가 계정 삭제), ② 데이터 판매('서비스가 무료라면 당신은 고객이 아니라 상품이다'), ③ 개인정보 유출(정부 요구 또는 해킹). Nostr는 이 세 가지를 모두 해결합니다.",
      "Nostr에서 당신의 신원은 암호학적 키 쌍으로 정의됩니다. 플랫폼이 아무리 원해도 당신의 계정을 빼앗거나 게시물을 삭제할 수 없습니다.",
      "라이트닝 네트워크와 통합된 '잽(Zap)' 기능으로 마음에 드는 글에 실제 비트코인을 직접 보낼 수 있습니다. 광고 없이 창작자가 수익을 올리는 새로운 인터넷 경제입니다.",
    ],
    whyMattersEn: [
      "3 problems with centralized social media: ① Censorship (government/operator can delete accounts), ② Data selling ('if the service is free, you are the product'), ③ Data breach (government demands or hacking). Nostr solves all three.",
      "Your identity on Nostr is defined by cryptographic key pairs. No platform can take your account or delete your posts no matter how much they want to.",
      "The 'Zap' feature integrated with Lightning Network lets you send actual Bitcoin directly to posts you like. A new internet economy where creators earn without ads.",
    ],
    concepts: [
      {
        term: "공개키/비밀키 (npub/nsec)",
        termEn: "Public Key / Secret Key (npub/nsec)",
        desc: "Nostr의 신원은 암호학적 키 쌍으로 정의됩니다. 공개키(npub)는 주소, 비밀키(nsec)는 비밀번호입니다. 비트코인과 동일한 타원곡선 암호학(secp256k1)을 사용합니다. nsec를 잃으면 계정을 영구 상실합니다 — 비밀키처럼 오프라인에 안전하게 보관하세요.",
        descEn: "Nostr identity is defined by a cryptographic key pair. Public key (npub) is your address; secret key (nsec) is your password. Uses the same elliptic curve cryptography (secp256k1) as Bitcoin. Lose the nsec and the account is permanently gone — store it offline safely like a seed phrase.",
      },
      {
        term: "릴레이와 이벤트",
        termEn: "Relays and Events",
        desc: "모든 게시물·댓글·DM·팔로우는 JSON 형태의 '이벤트'로 표현됩니다. 릴레이는 이 이벤트를 저장·배포하는 서버로 누구나 운영할 수 있습니다. 여러 릴레이에 동시 연결하면 어떤 릴레이가 차단해도 다른 경로로 메시지가 전달됩니다.",
        descEn: "Every post, comment, DM, and follow is expressed as a JSON 'event.' Relays are servers that store and distribute these events — anyone can run one. Connect to multiple relays simultaneously so your messages reach others even if one relay blocks you.",
      },
      {
        term: "Zap (잽)",
        termEn: "Zap",
        desc: "라이트닝 결제를 통해 게시물이나 사용자에게 직접 보내는 실제 비트코인 팁. 잽 영수증 이벤트가 릴레이에 공개되어 누구나 확인 가능합니다. 광고 없이 창작자가 직접 수익을 올리는 인터넷 네이티브 후원 방식입니다.",
        descEn: "Real Bitcoin tips sent directly to posts or users via Lightning payments. Zap receipt events are publicly posted to relays for anyone to verify. An internet-native patronage model where creators earn directly without advertising.",
      },
      {
        term: "NWC (노스터 지갑 연결)",
        termEn: "NWC (Nostr Wallet Connect, NIP-47)",
        desc: "라이트닝 지갑과 Nostr 클라이언트를 연결하는 표준 프로토콜. 결제 요청 시 개인키 서명으로 승인·거부하며, 릴레이도 내용을 변조할 수 없습니다. 자신의 라이트닝 노드와 연결하면 완전한 금융 주권을 유지하면서 잽을 보낼 수 있습니다.",
        descEn: "Standard protocol for connecting Lightning wallets to Nostr clients. Payments are approved/rejected via private key signature — relays cannot tamper with content. Connect your own Lightning node to maintain full financial sovereignty while sending Zaps.",
      },
      {
        term: "NIP",
        termEn: "NIP (Nostr Implementation Possibility)",
        desc: "Nostr 프로토콜 확장 제안서. NIP-04/17: 종단간 암호화 DM, NIP-05: user@domain.com 형식 주소, NIP-23: 블로그 긴 글, NIP-47(NWC): 지갑 연결, NIP-57: 잽 기능을 각각 정의합니다.",
        descEn: "Nostr protocol extension proposals. NIP-04/17: end-to-end encrypted DM, NIP-05: user@domain.com address format, NIP-23: long-form blog posts, NIP-47 (NWC): wallet connect, NIP-57: Zap functionality.",
      },
      {
        term: "종단간 암호화 DM",
        termEn: "End-to-End Encrypted DM",
        desc: "ECDH(타원곡선 디피-헬만) 방식으로 암호화. 발신자 개인키 + 수신자 공개키로 암호키를 생성하며, 수신자도 자신의 개인키 + 발신자 공개키로 동일한 암호키를 도출합니다. 릴레이도 메시지 내용을 볼 수 없습니다.",
        descEn: "Encrypted using ECDH (Elliptic Curve Diffie-Hellman). The encryption key is derived from sender's private key + recipient's public key; the recipient derives the same key using their private key + sender's public key. Even relays cannot read message contents.",
      },
    ],
    sections: [
      {
        title: "클라이언트 선택 가이드",
        titleEn: "Choosing a Client",
        points: [
          "프라이멀(Primal): 처음 시작할 때 가장 권장. 자체 라이트닝 지갑 내장으로 즉시 잽 송수신 가능. 웹/iOS/Android 지원",
          "다무스(Damus): iOS·macOS 전용. NWC로 자신의 라이트닝 노드를 연결할 수 있어 라이트닝 노드 운영자에게 추천",
          "애머시스트(Amethyst): Android 전용. 고급 기능이 풍부하며 비트코이너들이 많이 사용",
          "알비 익스텐션(Alby Extension): 크롬/파이어폭스 브라우저 확장. 웹에서 nsec를 직접 입력하지 않고 안전하게 서명 가능",
          "하블라(Habla.news): 블로그·긴 글 작성용 웹 클라이언트. NIP-23 기반으로 검열 없는 블로그 운영 가능",
        ],
        pointsEn: [
          "Primal: most recommended for beginners. Built-in Lightning wallet for instant Zaps. Supports web/iOS/Android",
          "Damus: iOS/macOS only. Connect your own Lightning node via NWC — recommended for Lightning node operators",
          "Amethyst: Android only. Feature-rich, popular among Bitcoiners",
          "Alby Extension: Chrome/Firefox browser extension. Sign events safely without pasting nsec directly into websites",
          "Habla.news: web client for long-form blog posts. Run a censorship-resistant blog via NIP-23",
        ],
      },
      {
        title: "첫 설정과 보안",
        titleEn: "Initial Setup and Security",
        points: [
          "앱이 키 쌍을 자동 생성합니다 — 비밀키(nsec)를 종이에 적어 오프라인으로 안전하게 보관하세요. 시드 문구와 같은 중요도입니다",
          "여러 릴레이에 연결하세요. 릴레이 하나가 차단해도 다른 릴레이로 메시지가 전달됩니다",
          "NIP-05 주소(user@domain.com) 설정으로 사람이 읽기 쉬운 Nostr 주소를 만들 수 있습니다",
          "스팸봇 댓글은 NIP-51 뮤트 리스트로 관리할 수 있습니다 — 중앙 관리자가 없는 만큼 사용자가 직접 필터링합니다",
          "한국인 비트코이너 팔로우 리스트: following.space 에서 검색하면 국내 커뮤니티를 빠르게 찾을 수 있습니다",
        ],
        pointsEn: [
          "The app auto-generates your key pair — write your nsec on paper and store it offline. Treat it like a seed phrase",
          "Connect to multiple relays. Even if one relay blocks you, others still deliver your messages",
          "Set up a NIP-05 address (user@domain.com) to create a human-readable Nostr identity",
          "Spam bot comments can be managed with NIP-51 mute lists — without a central admin, users filter themselves",
          "Find Korean Bitcoiners to follow on following.space — discover the domestic community quickly",
        ],
      },
      {
        title: "Nostr와 비트코인의 연결",
        titleEn: "Nostr and Bitcoin Together",
        points: [
          "Nostr의 키 쌍은 비트코인과 동일한 타원곡선 암호학(secp256k1) 사용 — 하나의 암호학 체계로 통합",
          "Zap: 라이트닝 인보이스로 즉시, 거의 무료 결제. 잽 영수증이 릴레이에 공개 게시되어 투명한 후원 문화 형성",
          "NWC(NIP-47): 자신의 라이트닝 노드를 Nostr 클라이언트에 연결. 피닉스 지갑, LND 노드 등과 연결 가능",
          "잽 기반 창작자 후원: 알고리즘이 아닌 독자가 직접 결정. 광고 없이 수익 창출 가능",
          "비트코인(가치 저장·이전) + 노스터(검열 저항 소통) = 완전한 탈중앙 인터넷 경제의 기반",
        ],
        pointsEn: [
          "Nostr key pairs use the same elliptic curve cryptography (secp256k1) as Bitcoin — unified under one cryptographic system",
          "Zap: instant near-zero-fee payments via Lightning invoices. Zap receipts are publicly posted to relays, creating transparent patronage culture",
          "NWC (NIP-47): connect your own Lightning node to Nostr clients. Works with Phoenix wallet, LND nodes, and more",
          "Creator support via Zaps: readers decide directly, not algorithms. Earn revenue without advertising",
          "Bitcoin (store/transfer of value) + Nostr (censorship-resistant communication) = foundation of a fully decentralized internet economy",
        ],
      },
    ],
    checklist: [
      { label: "Nostr 클라이언트를 설치하고 키 쌍을 생성했다", labelEn: "Installed a Nostr client and generated a key pair" },
      { label: "비밀키(nsec)를 안전한 오프라인 장소에 백업했다", labelEn: "Backed up secret key (nsec) in a safe offline location" },
      { label: "프로필을 설정하고 첫 게시물을 작성했다", labelEn: "Set up a profile and posted for the first time" },
      { label: "NIP-05 주소(user@domain.com)를 설정했다", labelEn: "Set up a NIP-05 address (user@domain.com format)" },
      { label: "라이트닝 지갑을 연결하고 Zap을 보내거나 받았다", labelEn: "Connected a Lightning wallet and sent or received a Zap" },
      { label: "DM을 보내고 종단간 암호화가 작동하는지 확인했다", labelEn: "Sent a DM and confirmed end-to-end encryption is working" },
    ],
    pdfFile: "/5._노스터_가이드_v.2.1__2025._9._1._.pdf",
    pdfLabel: "노스터 가이드 PDF",
  },
  {
    slug: "mining",
    emoji: "⛏️",
    title: "홈 채굴",
    titleEn: "Home Mining",
    subtitle: "비트코인 네트워크를 지탱하는 작업증명의 이해",
    subtitleEn: "Understanding Proof-of-Work that secures the Bitcoin network",
    difficulty: "중급",
    difficultyEn: "Intermediate",
    timeRead: "14분",
    summary:
      "비트코인 채굴은 에너지를 사용해 수학 퍼즐을 풀고 새 블록을 생성하는 과정입니다. 수익성만의 문제가 아니라 비트코인 네트워크의 보안을 물리적 에너지로 뒷받침하는 과정이기도 합니다. 가정에서 소규모로 채굴하는 법과 그 의미를 알아봅니다.",
    summaryEn:
      "Bitcoin mining is the process of using energy to solve math puzzles and create new blocks. It's not just about profitability — it's about securing the Bitcoin network with physical energy. We explore small-scale home mining and what it means.",
    whyMatters: [
      "채굴 보상으로 받는 비트코인은 처음 만들어지는 BTC입니다. 거래소 KYC 이력이 전혀 없는 non-KYC 비트코인을 합법적으로 획득하는 유일한 방법입니다.",
      "채굴기는 발열이 큽니다. 겨울철 난방 대용으로 활용하거나 재생에너지 자가발전과 연계하면 손실을 크게 줄일 수 있습니다.",
      "홈 채굴자들이 악의적인 채굴 풀에서 이탈할 수 있다는 사실 자체가 풀 운영자에 대한 견제력이 됩니다. 다텀(DATUM) 연결 시 채굴 분산화에 직접 기여합니다.",
    ],
    whyMattersEn: [
      "Mining rewards are freshly created BTC with zero exchange KYC history. It's the only legal way to acquire non-KYC Bitcoin.",
      "Mining rigs generate significant heat. Use them for winter heating or combine with self-generated renewable energy to dramatically cut losses.",
      "The ability of home miners to exit malicious pools is itself a check on pool operators. Connecting via DATUM directly contributes to mining decentralization.",
    ],
    concepts: [
      {
        term: "작업증명(PoW)",
        termEn: "Proof-of-Work",
        desc: "논스값을 바꿔가며 목푯값보다 작은 해시값을 찾는 계산 작업. 0~9999 카드 중 10 이하를 뽑는 제비뽑기와 같습니다. 블록을 만들려면 막대한 에너지가 필요하므로 과거 블록을 조작하려면 그 이후 모든 블록을 혼자 재채굴해야 해 사실상 불가능합니다.",
        descEn: "The computational work of finding a hash below a target value by changing a nonce — like drawing a card numbered 10 or below from 0-9999. Forging a past block requires re-mining all subsequent blocks alone, which is practically impossible.",
      },
      {
        term: "해시레이트",
        termEn: "Hashrate",
        desc: "초당 해시 함수를 몇 번 수행할 수 있는지의 척도. 네트워크 전체 해시레이트가 높을수록 공격 비용이 높아져 보안이 강화됩니다. 단위: TH/s(테라), EH/s(엑사), ZH/s(제타).",
        descEn: "Measures how many hash computations can be performed per second. Higher network hashrate = higher attack cost = stronger security. Units: TH/s (tera), EH/s (exa), ZH/s (zetta).",
      },
      {
        term: "채굴 풀 보상 방식",
        termEn: "Mining Pool Reward Methods",
        desc: "PPS: 셰어 제출 즉시 고정 보상 (안정적, 수수료 높음). FPPS(PPS+): PPS + 트랜잭션 수수료까지 포함 (가장 안정적). PPLNS: 블록 발견 시에만 최근 N개 셰어 기여도로 분배 (불안정하지만 수수료 낮음). TIDES: PPLNS 개선형, 오션 풀 사용.",
        descEn: "PPS: fixed reward per share submitted (stable, higher pool fee). FPPS/PPS+: PPS including transaction fees (most stable). PPLNS: paid only when block found, based on recent N shares (unstable but lower fee). TIDES: improved PPLNS used by Ocean Pool.",
      },
      {
        term: "DATUM (다텀)",
        termEn: "DATUM",
        desc: "채굴 풀에 참여하면서도 블록 구성 권한은 자신의 풀 노드가 갖는 방식. 내 풀 노드가 블록 템플릿 구성 → 오션 풀이 코인베이스 보상 주소만 수정 → 다시 내 노드로 전달 → 채굴기가 채굴. 현재 오션 풀만 지원.",
        descEn: "A method where you join a mining pool but your own full node retains block construction authority. Your node builds the block template → Ocean Pool only modifies the coinbase reward address → returns to your node → your miner mines it. Currently only Ocean Pool supports DATUM.",
      },
      {
        term: "ASIC",
        termEn: "ASIC (Application-Specific Integrated Circuit)",
        desc: "비트코인 채굴 전용 칩. CPU/GPU 대비 수천 배 효율적이지만 다른 용도는 없습니다. 입문용: 비트엑스(Bitaxe) 시리즈 (5~30W 소형), 아발론 나노 3. 전문용: 앤트마이너 S21 시리즈, 왓츠마이너 M60 시리즈.",
        descEn: "Chips designed exclusively for Bitcoin mining — thousands of times more efficient than CPUs/GPUs but useless for other tasks. Beginner: Bitaxe series (5-30W compact), Avalon Nano 3. Professional: Antminer S21 series, Whatsminer M60 series.",
      },
      {
        term: "스트라텀(Stratum)",
        termEn: "Stratum Protocol",
        desc: "채굴기와 채굴 풀 서버 간 통신 프로토콜. TCP 연결로 블록 템플릿 수신 + 셰어 제출. v1은 암호화 없고 블록 구성 권한 없음. v2(DATUM 포함)에서 채굴자가 트랜잭션을 독립적으로 선택 가능해집니다.",
        descEn: "Communication protocol between mining rigs and pool servers. TCP connection for receiving block templates and submitting shares. v1 has no encryption and no block construction control. v2 (including DATUM) lets miners independently select transactions.",
      },
    ],
    sections: [
      {
        title: "채굴 수익성 계산하기",
        titleEn: "Calculating Mining Profitability",
        points: [
          "보상 = (내 해시레이트 ÷ 총 해시레이트) × 블록보상 × 6 × 24 × 30 × BTC환율",
          "비용 = (소모전력(W) × 전기료(원/kWh) ÷ 1000) × 24 × 30",
          "실전 예시: 총 해시레이트 1 ZH/s, 내 장비 1 TH/s, 전기료 120원/kWh, BTC 1.5억원 → 한 달 보상 기댓값 약 2,025원, 전기료 약 1,555원(18W 기준) → 순이익 약 470원/월",
          "같은 조건에서 장비 가격 20만원이면 손익분기점 약 30년 이상 → 순수 수익 목적으로는 부적합",
          "수익성만이 아닌 non-KYC BTC 획득, 난방 대용, 네트워크 기여 관점으로도 평가하세요",
        ],
        pointsEn: [
          "Revenue = (your hashrate ÷ total hashrate) × block reward × 6 × 24 × 30 × BTC price",
          "Cost = (power draw (W) × electricity rate (KRW/kWh) ÷ 1000) × 24 × 30",
          "Real example: network 1 ZH/s, your rig 1 TH/s, 120 KRW/kWh, BTC 150M KRW → monthly expected ~2,025 KRW, electricity ~1,555 KRW (18W) → net profit ~470 KRW/month",
          "At those numbers, a 200K KRW device takes 30+ years to break even → not suitable for pure profit",
          "Evaluate also from non-KYC BTC acquisition, heating substitute, and network contribution perspectives",
        ],
      },
      {
        title: "채굴 풀의 한계와 채굴 주권",
        titleEn: "Pool Limitations and Mining Sovereignty",
        points: [
          "채굴 풀에 참여하면 블록 구성 권한이 풀 운영자에게 집중됩니다 — 간접민주주의의 약점과 같습니다",
          "운영자가 악의적 트랜잭션을 포함하거나 특정 거래를 검열해도 채굴자들이 알아채기 어렵습니다",
          "다텀(DATUM): 채굴 풀에 참여하면서도 블록 구성 권한은 자신의 풀 노드가 갖는 방식. 현재 오션 풀(Ocean Pool)만 지원",
          "솔로 채굴(Solo Mining): ckpool.org 등에서 완전 독립 채굴. 블록 당첨 시 3.125 BTC 전액 획득. 극히 낮은 확률이지만 복권처럼 즐길 수 있음",
          "브레인스 풀(Braiins Pool): 라이트닝으로 채굴 보상 지급 가능한 유일한 풀",
        ],
        pointsEn: [
          "Joining a mining pool centralizes block construction authority with the pool operator — like the weakness of indirect democracy",
          "If the operator includes malicious transactions or censors specific ones, it's hard for miners to notice",
          "DATUM: participate in a pool while your own full node retains block construction authority. Currently only Ocean Pool supports this",
          "Solo mining: fully independent via ckpool.org. Win an entire block reward (3.125 BTC) when you find one. Extremely rare, but fun as a lottery",
          "Braiins Pool: the only pool that can pay mining rewards via Lightning",
        ],
      },
      {
        title: "입문용 장비와 실습",
        titleEn: "Beginner Hardware and Getting Started",
        points: [
          "비트엑스 감마 601 (Bitaxe Gamma 601): 5V 30W 이상 전원(5V 6A 어댑터 권장), 2.4GHz 와이파이 연결. 오픈소스. 교육·실험에 최적",
          "아발론 나노 3 (Avalon Nano 3): 소형 USB 형태. USB-C 전원으로 간편하게 시작 가능",
          "입문자 채굴 풀 권장: 오션 풀(TIDES 보상방식 + 다텀 지원) 또는 ckpool(솔로 채굴 체험)",
          "소음·발열 주의: 가정 내 운영 시 방음 케이스 또는 물냉각 솔루션 고려. 겨울 난방 대용으로 활용하면 전기료 손실 최소화",
          "채굴 보상은 반드시 자신의 하드웨어 지갑으로 인출하세요 — 채굴 풀에 장기 보관 금지",
        ],
        pointsEn: [
          "Bitaxe Gamma 601: 5V 30W+ power supply (5V 6A adapter recommended), 2.4GHz WiFi. Open-source. Ideal for education and experimentation",
          "Avalon Nano 3: compact USB-style device. Easy start with USB-C power",
          "Recommended beginner pools: Ocean Pool (TIDES rewards + DATUM support) or ckpool (solo mining experience)",
          "Note noise and heat: consider soundproofing cases or water cooling for home use. Use as winter heating to minimize electricity cost losses",
          "Always withdraw mining rewards to your own hardware wallet — never leave them in the mining pool long-term",
        ],
      },
    ],
    checklist: [
      { label: "작업증명과 채굴 난이도 조정 메커니즘을 이해했다", labelEn: "Understand Proof-of-Work and the difficulty adjustment mechanism" },
      { label: "자신의 전기 요금과 BTC 환율로 수익성을 직접 계산해봤다", labelEn: "Calculated profitability directly using your own electricity rate and BTC price" },
      { label: "Bitaxe 또는 아발론 나노로 채굴을 체험해봤다", labelEn: "Tried mining with a Bitaxe or Avalon Nano" },
      { label: "채굴 풀에 연결하고 대시보드에서 해시레이트를 확인했다", labelEn: "Connected to a mining pool and verified hashrate on the dashboard" },
      { label: "다텀(DATUM)의 원리와 오션 풀 연결 방법을 이해했다", labelEn: "Understand DATUM's principle and how to connect to Ocean Pool" },
      { label: "채굴 보상을 자신의 하드웨어 지갑으로 인출했다", labelEn: "Withdrew mining rewards to your own hardware wallet" },
    ],
    pdfFile: "/6._홈_채굴_가이드_v.2.1__2025._9._1._.pdf",
    pdfLabel: "홈 채굴 가이드 PDF",
  },
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);

export function getGuide(slug: string): GuideData | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
