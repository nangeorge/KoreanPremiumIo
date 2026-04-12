export type Exchange = "binance" | "coinbase";

export interface CoinPrice {
  symbol: string;
  name: string;
  nameKo: string;
  nameZh: string;
  upbitPrice: number; // KRW
  binancePrice: number | null; // USD (바이낸스 미상장 시 null)
  binancePriceKrw: number; // USD * exchangeRate
  coinbasePrice: number | null; // USD (Coinbase 미상장 시 null)
  coinbasePriceKrw: number; // USD * exchangeRate
  premium: number | null; // vs binance, percentage (null = not listed on one exchange)
  coinbasePremium: number | null; // vs coinbase, percentage
  change24h: number; // percentage
  volume24h: number; // KRW
  marketCap: number | null; // USD
  logoUrl: string;
}

export interface ExchangeRate {
  usdKrw: number;
  timestamp: number;
}

export interface PriceResponse {
  coins: CoinPrice[];
  exchangeRate: ExchangeRate;
  updatedAt: number;
}

export interface PremiumHistoryPoint {
  timestamp: number;
  premium: number;
  symbol: string;
}

export type SortField = "default" | "marketCap" | "symbol" | "upbitPrice" | "premium" | "change24h" | "volume24h";
export type SortDirection = "asc" | "desc";

export type Locale = "ko" | "en" | "zh";

export interface AlertConfig {
  enabled: boolean;
  symbol: string;
  threshold: number;
  direction: "above" | "below";
}

export const SUPPORTED_COINS = [
  // ── 기존 10개 ──────────────────────────────────────────────────────────────
  { symbol: "BTC",  name: "Bitcoin",          nameKo: "비트코인",      nameZh: "比特币",       upbitPair: "KRW-BTC",  binancePair: "BTCUSDT",  coinbasePair: "BTC-USD"  },
  { symbol: "ETH",  name: "Ethereum",         nameKo: "이더리움",      nameZh: "以太坊",       upbitPair: "KRW-ETH",  binancePair: "ETHUSDT",  coinbasePair: "ETH-USD"  },
  { symbol: "XRP",  name: "XRP",              nameKo: "리플",          nameZh: "瑞波币",       upbitPair: "KRW-XRP",  binancePair: "XRPUSDT",  coinbasePair: "XRP-USD"  },
  { symbol: "SOL",  name: "Solana",           nameKo: "솔라나",        nameZh: "索拉纳",       upbitPair: "KRW-SOL",  binancePair: "SOLUSDT",  coinbasePair: "SOL-USD"  },
  { symbol: "ADA",  name: "Cardano",          nameKo: "에이다",        nameZh: "卡尔达诺",     upbitPair: "KRW-ADA",  binancePair: "ADAUSDT",  coinbasePair: "ADA-USD"  },
  { symbol: "DOGE", name: "Dogecoin",         nameKo: "도지코인",      nameZh: "狗狗币",       upbitPair: "KRW-DOGE", binancePair: "DOGEUSDT", coinbasePair: "DOGE-USD" },
  { symbol: "POL",  name: "Polygon",          nameKo: "폴리곤",        nameZh: "Polygon",      upbitPair: "KRW-POL",  binancePair: "POLUSDT",  coinbasePair: "POL-USD"  },
  { symbol: "LINK", name: "Chainlink",        nameKo: "체인링크",      nameZh: "链环",         upbitPair: "KRW-LINK", binancePair: "LINKUSDT", coinbasePair: "LINK-USD" },
  { symbol: "DOT",  name: "Polkadot",         nameKo: "폴카닷",        nameZh: "波卡",         upbitPair: "KRW-DOT",  binancePair: "DOTUSDT",  coinbasePair: "DOT-USD"  },
  { symbol: "AVAX", name: "Avalanche",        nameKo: "아발란체",      nameZh: "雪崩",         upbitPair: "KRW-AVAX", binancePair: "AVAXUSDT", coinbasePair: "AVAX-USD" },
  // ── 추가 30개 ──────────────────────────────────────────────────────────────
  { symbol: "TRX",  name: "TRON",             nameKo: "트론",          nameZh: "波场",         upbitPair: "KRW-TRX",  binancePair: "TRXUSDT",  coinbasePair: "TRX-USD"  },
  { symbol: "SHIB", name: "Shiba Inu",        nameKo: "시바이누",      nameZh: "柴犬币",       upbitPair: "KRW-SHIB", binancePair: "SHIBUSDT", coinbasePair: "SHIB-USD" },
  { symbol: "LTC",  name: "Litecoin",         nameKo: "라이트코인",    nameZh: "莱特币",       upbitPair: "KRW-LTC",  binancePair: "LTCUSDT",  coinbasePair: "LTC-USD"  },
  { symbol: "BCH",  name: "Bitcoin Cash",     nameKo: "비트코인 캐시", nameZh: "比特币现金",   upbitPair: "KRW-BCH",  binancePair: "BCHUSDT",  coinbasePair: "BCH-USD"  },
  { symbol: "ETC",  name: "Ethereum Classic", nameKo: "이더리움 클래식",nameZh: "以太坊经典",  upbitPair: "KRW-ETC",  binancePair: "ETCUSDT",  coinbasePair: "ETC-USD"  },
  { symbol: "ATOM", name: "Cosmos",           nameKo: "코스모스",      nameZh: "Cosmos",       upbitPair: "KRW-ATOM", binancePair: "ATOMUSDT", coinbasePair: "ATOM-USD" },
  { symbol: "UNI",  name: "Uniswap",          nameKo: "유니스왑",      nameZh: "Uniswap",      upbitPair: "KRW-UNI",  binancePair: "UNIUSDT",  coinbasePair: "UNI-USD"  },
  { symbol: "APT",  name: "Aptos",            nameKo: "앱토스",        nameZh: "Aptos",        upbitPair: "KRW-APT",  binancePair: "APTUSDT",  coinbasePair: "APT-USD"  },
  { symbol: "SUI",  name: "Sui",              nameKo: "수이",          nameZh: "Sui",          upbitPair: "KRW-SUI",  binancePair: "SUIUSDT",  coinbasePair: "SUI-USD"  },
  { symbol: "ICP",  name: "Internet Computer",nameKo: "인터넷 컴퓨터", nameZh: "互联网计算机", upbitPair: "KRW-ICP",  binancePair: "ICPUSDT",  coinbasePair: "ICP-USD"  },
  { symbol: "FIL",  name: "Filecoin",         nameKo: "파일코인",      nameZh: "文件币",       upbitPair: "KRW-FIL",  binancePair: "FILUSDT",  coinbasePair: "FIL-USD"  },
  { symbol: "NEAR", name: "NEAR Protocol",    nameKo: "니어 프로토콜", nameZh: "NEAR协议",     upbitPair: "KRW-NEAR", binancePair: "NEARUSDT", coinbasePair: "NEAR-USD" },
  { symbol: "OP",   name: "Optimism",         nameKo: "옵티미즘",      nameZh: "Optimism",     upbitPair: "KRW-OP",   binancePair: "OPUSDT",   coinbasePair: "OP-USD"   },
  { symbol: "ARB",  name: "Arbitrum",         nameKo: "아비트럼",      nameZh: "Arbitrum",     upbitPair: "KRW-ARB",  binancePair: "ARBUSDT",  coinbasePair: "ARB-USD"  },
  { symbol: "SAND", name: "The Sandbox",      nameKo: "더샌드박스",    nameZh: "沙盒",         upbitPair: "KRW-SAND", binancePair: "SANDUSDT", coinbasePair: "SAND-USD" },
  { symbol: "MANA", name: "Decentraland",     nameKo: "디센트럴랜드",  nameZh: "去中心化之地", upbitPair: "KRW-MANA", binancePair: "MANAUSDT", coinbasePair: "MANA-USD" },
  { symbol: "AXS",  name: "Axie Infinity",    nameKo: "엑시인피니티",  nameZh: "Axie Infinity",upbitPair: "KRW-AXS",  binancePair: "AXSUSDT",  coinbasePair: "AXS-USD"  },
  { symbol: "XLM",  name: "Stellar",          nameKo: "스텔라",        nameZh: "恒星币",       upbitPair: "KRW-XLM",  binancePair: "XLMUSDT",  coinbasePair: "XLM-USD"  },
  { symbol: "HBAR", name: "Hedera",           nameKo: "헤데라",        nameZh: "Hedera",       upbitPair: "KRW-HBAR", binancePair: "HBARUSDT", coinbasePair: "HBAR-USD" },
  { symbol: "GRT",  name: "The Graph",        nameKo: "더그래프",      nameZh: "The Graph",    upbitPair: "KRW-GRT",  binancePair: "GRTUSDT",  coinbasePair: "GRT-USD"  },
  { symbol: "IMX",  name: "Immutable X",      nameKo: "이뮤터블X",     nameZh: "Immutable X",  upbitPair: "KRW-IMX",  binancePair: "IMXUSDT",  coinbasePair: "IMX-USD"  },
  { symbol: "ALGO", name: "Algorand",         nameKo: "알고랜드",      nameZh: "Algorand",     upbitPair: "KRW-ALGO", binancePair: "ALGOUSDT", coinbasePair: "ALGO-USD" },
  { symbol: "EOS",  name: "EOS",              nameKo: "이오스",        nameZh: "柚子",         upbitPair: "KRW-EOS",  binancePair: "EOSUSDT",  coinbasePair: "EOS-USD"  },
  { symbol: "STX",  name: "Stacks",           nameKo: "스택스",        nameZh: "Stacks",       upbitPair: "KRW-STX",  binancePair: "STXUSDT",  coinbasePair: "STX-USD"  },
  { symbol: "TON",  name: "Toncoin",          nameKo: "톤코인",        nameZh: "Toncoin",      upbitPair: "KRW-TON",  binancePair: "TONUSDT",  coinbasePair: "TON-USD"  },
  { symbol: "PEPE", name: "Pepe",             nameKo: "페페",          nameZh: "青蛙币",       upbitPair: "KRW-PEPE", binancePair: "PEPEUSDT", coinbasePair: "PEPE-USD" },
  { symbol: "WIF",  name: "dogwifhat",        nameKo: "도그위프햇",    nameZh: "狗头帽",       upbitPair: "KRW-WIF",  binancePair: "WIFUSDT",  coinbasePair: "WIF-USD"  },
  { symbol: "SEI",  name: "Sei",              nameKo: "세이",          nameZh: "Sei",          upbitPair: "KRW-SEI",  binancePair: "SEIUSDT",  coinbasePair: "SEI-USD"  },
  { symbol: "AAVE", name: "Aave",             nameKo: "에이브",        nameZh: "Aave",         upbitPair: "KRW-AAVE", binancePair: "AAVEUSDT", coinbasePair: "AAVE-USD" },
  { symbol: "BLUR",    name: "Blur",              nameKo: "블러",           nameZh: "Blur",           upbitPair: "KRW-BLUR",    binancePair: "BLURUSDT",    coinbasePair: "BLUR-USD"   },
  // ── 업비트 추가 코인 ────────────────────────────────────────────────────────
  { symbol: "BONK",    name: "Bonk",              nameKo: "봉크",           nameZh: "Bonk",           upbitPair: "KRW-BONK",    binancePair: "BONKUSDT",    coinbasePair: "BONK-USD"   },
  { symbol: "JUP",     name: "Jupiter",           nameKo: "주피터",          nameZh: "Jupiter",        upbitPair: "KRW-JUP",     binancePair: "JUPUSDT",     coinbasePair: "JUP-USD"    },
  { symbol: "JTO",     name: "Jito",              nameKo: "지토",           nameZh: "Jito",           upbitPair: "KRW-JTO",     binancePair: "JTOUSDT",     coinbasePair: "JTO-USD"    },
  { symbol: "ENA",     name: "Ethena",            nameKo: "에테나",          nameZh: "Ethena",         upbitPair: "KRW-ENA",     binancePair: "ENAUSDT",     coinbasePair: "ENA-USD"    },
  { symbol: "PENDLE",  name: "Pendle",            nameKo: "펜들",           nameZh: "Pendle",         upbitPair: "KRW-PENDLE",  binancePair: "PENDLEUSDT",  coinbasePair: "PENDLE-USD" },
  { symbol: "ONDO",    name: "Ondo Finance",      nameKo: "온도 파이낸스",    nameZh: "Ondo",           upbitPair: "KRW-ONDO",    binancePair: "ONDOUSDT",    coinbasePair: "ONDO-USD"   },
  { symbol: "TIA",     name: "Celestia",          nameKo: "셀레스티아",       nameZh: "Celestia",       upbitPair: "KRW-TIA",     binancePair: "TIAUSDT",     coinbasePair: "TIA-USD"    },
  { symbol: "RENDER",  name: "Render",            nameKo: "렌더",           nameZh: "Render",         upbitPair: "KRW-RENDER",  binancePair: "RENDERUSDT",  coinbasePair: "RENDER-USD" },
  { symbol: "VIRTUAL", name: "Virtual Protocol",  nameKo: "버추얼 프로토콜",  nameZh: "Virtual",        upbitPair: "KRW-VIRTUAL", binancePair: "VIRTUALUSDT", coinbasePair: "VIRTUAL-USD"},
  { symbol: "MANTRA",  name: "MANTRA",            nameKo: "만트라",          nameZh: "MANTRA",         upbitPair: "KRW-MANTRA",  binancePair: "OMUSDT",      coinbasePair: ""           },
  { symbol: "WLD",     name: "Worldcoin",         nameKo: "월드코인",         nameZh: "Worldcoin",      upbitPair: "KRW-WLD",     binancePair: "WLDUSDT",     coinbasePair: "WLD-USD"    },
  { symbol: "PENGU",   name: "Pudgy Penguins",    nameKo: "퍼지 펭귄",       nameZh: "Pudgy Penguins", upbitPair: "KRW-PENGU",   binancePair: "PENGUUSDT",   coinbasePair: "PENGU-USD"  },
  { symbol: "MOVE",    name: "Movement",          nameKo: "무브먼트",         nameZh: "Movement",       upbitPair: "KRW-MOVE",    binancePair: "MOVEUSDT",    coinbasePair: "MOVE-USD"   },
  { symbol: "BEAM",    name: "Beam",              nameKo: "빔",             nameZh: "Beam",           upbitPair: "KRW-BEAM",    binancePair: "BEAMUSDT",    coinbasePair: "BEAM-USD"   },
  { symbol: "SONIC",   name: "Sonic",             nameKo: "소닉",           nameZh: "Sonic",          upbitPair: "KRW-SONIC",   binancePair: "SUSDT",       coinbasePair: "S-USD"      },
  { symbol: "ALT",     name: "Altlayer",          nameKo: "알트레이어",       nameZh: "Altlayer",       upbitPair: "KRW-ALT",     binancePair: "ALTUSDT",     coinbasePair: ""           },
  { symbol: "LAYER",   name: "Solayer",           nameKo: "솔레이어",         nameZh: "Solayer",        upbitPair: "KRW-LAYER",   binancePair: "LAYERUSDT",   coinbasePair: ""           },
  { symbol: "BERA",    name: "Berachain",         nameKo: "베라체인",         nameZh: "Berachain",      upbitPair: "KRW-BERA",    binancePair: "BERAUSDT",    coinbasePair: "BERA-USD"   },
  { symbol: "CRO",     name: "Cronos",            nameKo: "크로노스",         nameZh: "Cronos",         upbitPair: "KRW-CRO",     binancePair: "CROUSDT",     coinbasePair: "CRO-USD"    },
  { symbol: "NEO",     name: "Neo",               nameKo: "네오",           nameZh: "Neo",            upbitPair: "KRW-NEO",     binancePair: "NEOUSDT",     coinbasePair: "NEO-USD"    },
  { symbol: "FLOW",    name: "Flow",              nameKo: "플로우",          nameZh: "Flow",           upbitPair: "KRW-FLOW",    binancePair: "FLOWUSDT",    coinbasePair: "FLOW-USD"   },
  { symbol: "EGLD",    name: "MultiversX",        nameKo: "멀티버스X",        nameZh: "MultiversX",     upbitPair: "KRW-EGLD",    binancePair: "EGLDUSDT",    coinbasePair: "EGLD-USD"   },
  { symbol: "MINA",    name: "Mina Protocol",     nameKo: "미나 프로토콜",    nameZh: "Mina",           upbitPair: "KRW-MINA",    binancePair: "MINAUSDT",    coinbasePair: "MINA-USD"   },
  { symbol: "XTZ",     name: "Tezos",             nameKo: "테조스",          nameZh: "Tezos",          upbitPair: "KRW-XTZ",     binancePair: "XTZUSDT",     coinbasePair: "XTZ-USD"    },
  { symbol: "THETA",   name: "Theta Network",     nameKo: "쎄타 네트워크",    nameZh: "Theta",          upbitPair: "KRW-THETA",   binancePair: "THETAUSDT",   coinbasePair: "THETA-USD"  },
  { symbol: "COMP",    name: "Compound",          nameKo: "컴파운드",         nameZh: "Compound",       upbitPair: "KRW-COMP",    binancePair: "COMPUSDT",    coinbasePair: "COMP-USD"   },
  { symbol: "ENS",     name: "ENS",               nameKo: "ENS 도메인",       nameZh: "ENS",            upbitPair: "KRW-ENS",     binancePair: "ENSUSDT",     coinbasePair: "ENS-USD"    },
  { symbol: "ZIL",     name: "Zilliqa",           nameKo: "질리카",          nameZh: "Zilliqa",        upbitPair: "KRW-ZIL",     binancePair: "ZILUSDT",     coinbasePair: "ZIL-USD"    },
  { symbol: "KAVA",    name: "Kava",              nameKo: "카바",           nameZh: "Kava",           upbitPair: "KRW-KAVA",    binancePair: "KAVAUSDT",    coinbasePair: "KAVA-USD"   },
  { symbol: "CHZ",     name: "Chiliz",            nameKo: "칠리즈",          nameZh: "Chiliz",         upbitPair: "KRW-CHZ",     binancePair: "CHZUSDT",     coinbasePair: "CHZ-USD"    },
  { symbol: "ZRO",     name: "LayerZero",         nameKo: "레이어제로",       nameZh: "LayerZero",      upbitPair: "KRW-ZRO",     binancePair: "ZROUSDT",     coinbasePair: "ZRO-USD"    },
  { symbol: "PYTH",    name: "Pyth Network",      nameKo: "파이스 네트워크",   nameZh: "Pyth",           upbitPair: "KRW-PYTH",    binancePair: "PYTHUSDT",    coinbasePair: "PYTH-USD"   },
  { symbol: "IOTA",    name: "IOTA",              nameKo: "아이오타",         nameZh: "IOTA",           upbitPair: "KRW-IOTA",    binancePair: "IOTAUSDT",    coinbasePair: ""           },
  { symbol: "RAY",     name: "Raydium",           nameKo: "레이디움",         nameZh: "Raydium",        upbitPair: "KRW-RAY",     binancePair: "RAYUSDT",     coinbasePair: "RAY-USD"    },
  { symbol: "GMT",     name: "STEPN",             nameKo: "스테픈",          nameZh: "STEPN",          upbitPair: "KRW-GMT",     binancePair: "GMTUSDT",     coinbasePair: "GMT-USD"    },
  { symbol: "QTUM",    name: "Qtum",              nameKo: "퀀텀",           nameZh: "Qtum",           upbitPair: "KRW-QTUM",    binancePair: "QTUMUSDT",    coinbasePair: "QTUM-USD"   },
  { symbol: "ZRX",     name: "0x Protocol",       nameKo: "제로엑스",         nameZh: "0x",             upbitPair: "KRW-ZRX",     binancePair: "ZRXUSDT",     coinbasePair: "ZRX-USD"    },
  { symbol: "1INCH",   name: "1inch",             nameKo: "1인치",          nameZh: "1inch",          upbitPair: "KRW-1INCH",   binancePair: "1INCHUSDT",   coinbasePair: "1INCH-USD"  },
  { symbol: "CELO",    name: "Celo",              nameKo: "셀로",           nameZh: "Celo",           upbitPair: "KRW-CELO",    binancePair: "CELOUSDT",    coinbasePair: "CELO-USD"   },
  { symbol: "ZK",      name: "zkSync",            nameKo: "지케이싱크",       nameZh: "zkSync",         upbitPair: "KRW-ZK",      binancePair: "ZKUSDT",      coinbasePair: "ZK-USD"     },
  { symbol: "ASTR",    name: "Astar Network",     nameKo: "아스타 네트워크",   nameZh: "Astar",          upbitPair: "KRW-ASTR",    binancePair: "ASTRUSDT",    coinbasePair: ""           },
  { symbol: "BLAST",   name: "Blast",             nameKo: "블라스트",         nameZh: "Blast",          upbitPair: "KRW-BLAST",   binancePair: "BLASTUSDT",   coinbasePair: "BLAST-USD"  },
  { symbol: "ZETA",    name: "ZetaChain",         nameKo: "제타체인",         nameZh: "ZetaChain",      upbitPair: "KRW-ZETA",    binancePair: "ZETAUSDT",    coinbasePair: ""           },
  { symbol: "ARKM",    name: "Arkham",            nameKo: "아캄",           nameZh: "Arkham",         upbitPair: "KRW-ARKM",    binancePair: "ARKMUSDT",    coinbasePair: "ARKM-USD"   },
  { symbol: "STG",     name: "Stargate",          nameKo: "스타게이트",       nameZh: "Stargate",       upbitPair: "KRW-STG",     binancePair: "STGUSDT",     coinbasePair: "STG-USD"    },
  { symbol: "BIGTIME", name: "Big Time",          nameKo: "빅타임",          nameZh: "Big Time",       upbitPair: "KRW-BIGTIME", binancePair: "BIGTIMEUSDT", coinbasePair: ""           },
  { symbol: "MOCA",    name: "Mocaverse",         nameKo: "모카버스",         nameZh: "Mocaverse",      upbitPair: "KRW-MOCA",    binancePair: "MOCAUSDT",    coinbasePair: ""           },
  { symbol: "API3",    name: "API3",              nameKo: "API3",           nameZh: "API3",           upbitPair: "KRW-API3",    binancePair: "API3USDT",    coinbasePair: ""           },
  { symbol: "AGLD",    name: "Adventure Gold",    nameKo: "어드벤처골드",      nameZh: "Adventure Gold", upbitPair: "KRW-AGLD",    binancePair: "AGLDUSDT",    coinbasePair: "AGLD-USD"   },
  { symbol: "TAIKO",   name: "Taiko",             nameKo: "타이코",          nameZh: "Taiko",          upbitPair: "KRW-TAIKO",   binancePair: "TAIKOUSDT",   coinbasePair: ""           },
  { symbol: "ETHFI",   name: "ether.fi",          nameKo: "이더파이",         nameZh: "ether.fi",       upbitPair: "KRW-ETHFI",   binancePair: "ETHFIUSDT",   coinbasePair: "ETHFI-USD"  },
  { symbol: "MASK",    name: "Mask Network",      nameKo: "마스크 네트워크",   nameZh: "Mask Network",   upbitPair: "KRW-MASK",    binancePair: "MASKUSDT",    coinbasePair: "MASK-USD"   },
  { symbol: "MNT",     name: "Mantle",            nameKo: "맨틀",           nameZh: "Mantle",         upbitPair: "KRW-MNT",     binancePair: "MNTUSDT",     coinbasePair: "MNT-USD"    },
  { symbol: "XEC",     name: "eCash",             nameKo: "이캐시",          nameZh: "eCash",          upbitPair: "KRW-XEC",     binancePair: "XECUSDT",     coinbasePair: ""           },
  { symbol: "RVN",     name: "Ravencoin",         nameKo: "레이븐코인",       nameZh: "Ravencoin",      upbitPair: "KRW-RVN",     binancePair: "RVNUSDT",     coinbasePair: ""           },
  { symbol: "IOST",    name: "IOST",              nameKo: "IOST",           nameZh: "IOST",           upbitPair: "KRW-IOST",    binancePair: "IOSTUSDT",    coinbasePair: ""           },
  { symbol: "BTT",     name: "BitTorrent",        nameKo: "비트토렌트",       nameZh: "BitTorrent",     upbitPair: "KRW-BTT",     binancePair: "BTTCUSDT",    coinbasePair: ""           },
  { symbol: "VTHO",    name: "VeThor Token",      nameKo: "비소르 토큰",      nameZh: "VeThor",         upbitPair: "KRW-VTHO",    binancePair: "VTHOUSDT",    coinbasePair: ""           },
  { symbol: "ICX",     name: "ICON",              nameKo: "아이콘",          nameZh: "ICON",           upbitPair: "KRW-ICX",     binancePair: "ICXUSDT",     coinbasePair: ""           },
  { symbol: "STORJ",   name: "Storj",             nameKo: "스토리지",         nameZh: "Storj",          upbitPair: "KRW-STORJ",   binancePair: "STORJUSDT",   coinbasePair: "STORJ-USD"  },
  { symbol: "WAVES",   name: "Waves",             nameKo: "웨이브스",         nameZh: "Waves",          upbitPair: "KRW-WAVES",   binancePair: "WAVESUSDT",   coinbasePair: ""           },
  { symbol: "POWR",    name: "Power Ledger",      nameKo: "파워레저",         nameZh: "Power Ledger",   upbitPair: "KRW-POWR",    binancePair: "POWRUSDT",    coinbasePair: ""           },
  { symbol: "CHR",     name: "Chromia",           nameKo: "크로미아",         nameZh: "Chromia",        upbitPair: "KRW-CHR",     binancePair: "CHRUSDT",     coinbasePair: "CHR-USD"    },
  { symbol: "ELF",     name: "aelf",              nameKo: "엘프",           nameZh: "aelf",           upbitPair: "KRW-ELF",     binancePair: "ELFUSDT",     coinbasePair: ""           },
  { symbol: "HOLO",    name: "Holo",              nameKo: "홀로",           nameZh: "Holo",           upbitPair: "KRW-HOLO",    binancePair: "HOTUSDT",     coinbasePair: ""           },
  { symbol: "ONT",     name: "Ontology",          nameKo: "온톨로지",         nameZh: "Ontology",       upbitPair: "KRW-ONT",     binancePair: "ONTUSDT",     coinbasePair: ""           },
  { symbol: "SUN",     name: "Sun Token",         nameKo: "선 토큰",          nameZh: "Sun",            upbitPair: "KRW-SUN",     binancePair: "SUNUSDT",     coinbasePair: ""           },
  { symbol: "JST",     name: "JUST",              nameKo: "저스트",          nameZh: "JUST",           upbitPair: "KRW-JST",     binancePair: "JSTUSDT",     coinbasePair: ""           },
  { symbol: "TFUEL",   name: "Theta Fuel",        nameKo: "쎄타퓨얼",         nameZh: "Theta Fuel",     upbitPair: "KRW-TFUEL",   binancePair: "TFUELUSDT",   coinbasePair: ""           },
  { symbol: "RED",     name: "Red",               nameKo: "레드",           nameZh: "Red",            upbitPair: "KRW-RED",     binancePair: "REDUSDT",     coinbasePair: ""           },
  { symbol: "YGG",     name: "Yield Guild Games", nameKo: "일드길드게임즈",    nameZh: "Yield Guild",    upbitPair: "KRW-YGG",     binancePair: "YGGUSDT",     coinbasePair: ""           },
  { symbol: "SNT",     name: "Status",            nameKo: "스테이터스",       nameZh: "Status",         upbitPair: "KRW-SNT",     binancePair: "SNTUSDT",     coinbasePair: ""           },
  { symbol: "AUDIO",   name: "Audius",            nameKo: "오디우스",         nameZh: "Audius",         upbitPair: "KRW-AUDIO",   binancePair: "AUDIOUSDT",   coinbasePair: "AUDIO-USD"  },
  { symbol: "GAS",     name: "GAS",               nameKo: "가스",           nameZh: "GAS",            upbitPair: "KRW-GAS",     binancePair: "GASUSDT",     coinbasePair: ""           },
  { symbol: "PUNDIX",  name: "Pundi X",           nameKo: "펀디X",          nameZh: "Pundi X",        upbitPair: "KRW-PUNDIX",  binancePair: "PUNDIXUSDT",  coinbasePair: ""           },
  { symbol: "LSK",     name: "Lisk",              nameKo: "리스크",          nameZh: "Lisk",           upbitPair: "KRW-LSK",     binancePair: "LSKUSDT",     coinbasePair: ""           },
  { symbol: "QKC",     name: "QuarkChain",        nameKo: "쿼크체인",         nameZh: "QuarkChain",     upbitPair: "KRW-QKC",     binancePair: "QKCUSDT",     coinbasePair: ""           },
  { symbol: "ARDR",    name: "Ardor",             nameKo: "아더",           nameZh: "Ardor",          upbitPair: "KRW-ARDR",    binancePair: "ARDRUSDT",    coinbasePair: ""           },
  { symbol: "ONG",     name: "Ontology Gas",      nameKo: "온톨로지 가스",    nameZh: "Ontology Gas",   upbitPair: "KRW-ONG",     binancePair: "ONGUSDT",     coinbasePair: ""           },
  { symbol: "CKB",     name: "Nervos Network",    nameKo: "너보스 네트워크",   nameZh: "Nervos",         upbitPair: "KRW-CKB",     binancePair: "CKBUSDT",     coinbasePair: ""           },
  { symbol: "AKT",     name: "Akash Network",     nameKo: "아카시 네트워크",   nameZh: "Akash",          upbitPair: "KRW-AKT",     binancePair: "AKTUSDT",     coinbasePair: "AKT-USD"    },
  { symbol: "AXL",     name: "Axelar",            nameKo: "액슬러",          nameZh: "Axelar",         upbitPair: "KRW-AXL",     binancePair: "AXLUSDT",     coinbasePair: "AXL-USD"    },
  { symbol: "COW",     name: "CoW Protocol",      nameKo: "카우 프로토콜",    nameZh: "CoW Protocol",   upbitPair: "KRW-COW",     binancePair: "COWUSDT",     coinbasePair: "COW-USD"    },
  { symbol: "ORCA",    name: "Orca",              nameKo: "오르카",          nameZh: "Orca",           upbitPair: "KRW-ORCA",    binancePair: "ORCAUSDT",    coinbasePair: ""           },
  { symbol: "WAXP",    name: "WAX",               nameKo: "왁스",           nameZh: "WAX",            upbitPair: "KRW-WAXP",    binancePair: "WAXPUSDT",    coinbasePair: ""           },
  { symbol: "CARV",    name: "Carv",              nameKo: "카브",           nameZh: "Carv",           upbitPair: "KRW-CARV",    binancePair: "CARVUSDT",    coinbasePair: ""           },
  { symbol: "STEEM",   name: "Steem",             nameKo: "스팀",           nameZh: "Steem",          upbitPair: "KRW-STEEM",   binancePair: "STEEMUSDT",   coinbasePair: ""           },
  { symbol: "VANA",    name: "Vana",              nameKo: "바나",           nameZh: "Vana",           upbitPair: "KRW-VANA",    binancePair: "VANAUSDT",    coinbasePair: "VANA-USD"   },
  { symbol: "AERGO",   name: "Aergo",             nameKo: "에어고",          nameZh: "Aergo",          upbitPair: "KRW-AERGO",   binancePair: "AERGOUSDT",   coinbasePair: ""           },
  { symbol: "ANIME",   name: "Anime",             nameKo: "애니메",          nameZh: "Anime",          upbitPair: "KRW-ANIME",   binancePair: "ANIMEUSDT",   coinbasePair: ""           },
  { symbol: "TRUST",   name: "Trust Wallet Token",nameKo: "트러스트 월렛",    nameZh: "Trust Wallet",   upbitPair: "KRW-TRUST",   binancePair: "TRUSTUSDT",   coinbasePair: ""           },
  { symbol: "POLYX",   name: "Polymesh",          nameKo: "폴리메시",         nameZh: "Polymesh",       upbitPair: "KRW-POLYX",   binancePair: "POLYXUSDT",   coinbasePair: ""           },
  { symbol: "DRIFT",   name: "Drift",             nameKo: "드리프트",         nameZh: "Drift",          upbitPair: "KRW-DRIFT",   binancePair: "",            coinbasePair: "DRIFT-USD"  },
  // ── 한국 전용 코인 (업비트 위주, Binance 상장 없음) ─────────────────────────
  { symbol: "BORA",    name: "BORA",              nameKo: "보라",           nameZh: "BORA",           upbitPair: "KRW-BORA",    binancePair: "",            coinbasePair: ""           },
  { symbol: "MBL",     name: "MovieBloc",         nameKo: "무비블록",         nameZh: "MovieBloc",      upbitPair: "KRW-MBL",     binancePair: "",            coinbasePair: ""           },
  { symbol: "MLK",     name: "MiL.k",             nameKo: "밀크",           nameZh: "MiL.k",          upbitPair: "KRW-MLK",     binancePair: "",            coinbasePair: ""           },
  { symbol: "HUNT",    name: "Hunt",              nameKo: "헌트",           nameZh: "Hunt",           upbitPair: "KRW-HUNT",    binancePair: "",            coinbasePair: ""           },
  { symbol: "MED",     name: "MediBloc",          nameKo: "메디블록",         nameZh: "MediBloc",       upbitPair: "KRW-MED",     binancePair: "",            coinbasePair: ""           },
] as const;
