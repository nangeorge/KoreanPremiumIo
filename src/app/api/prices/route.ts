import { NextResponse } from "next/server";
import { fetchUpbitPrices, fetchUpbitMarkets } from "@/lib/api/upbit";
import { fetchBinancePrices } from "@/lib/api/binance";
import { fetchCoinbasePrices } from "@/lib/api/coinbase";
import { fetchUsdKrwRate } from "@/lib/api/exchangeRate";
import type { CoinPrice, PriceResponse } from "@/types";

// 업비트 심볼 → 바이낸스 심볼 특수 매핑
const BINANCE_SYMBOL_MAP: Record<string, string> = {
  SONIC:  "S",
  MANTRA: "OM",
  BTT:    "BTTC",
  HOLO:   "HOT",
};

// 업비트 심볼 → Coinbase 페어 특수 매핑
const COINBASE_PAIR_MAP: Record<string, string> = {
  BTC: "BTC-USD", ETH: "ETH-USD", XRP: "XRP-USD", SOL: "SOL-USD",
  ADA: "ADA-USD", DOGE: "DOGE-USD", LINK: "LINK-USD", DOT: "DOT-USD",
  AVAX: "AVAX-USD", LTC: "LTC-USD", BCH: "BCH-USD", UNI: "UNI-USD",
  ATOM: "ATOM-USD", NEAR: "NEAR-USD", APT: "APT-USD", SUI: "SUI-USD",
  ICP: "ICP-USD", FIL: "FIL-USD", OP: "OP-USD", ARB: "ARB-USD",
  SHIB: "SHIB-USD", TRX: "TRX-USD", POL: "POL-USD", ETC: "ETC-USD",
};

export const revalidate = 5;

// CoinGecko symbol → market cap (USD), 5분 캐시
async function fetchMarketCaps(): Promise<Map<string, number>> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false",
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return new Map();
    const data: Array<{ symbol: string; market_cap: number }> = await res.json();
    const map = new Map<string, number>();
    for (const coin of data) {
      map.set(coin.symbol.toUpperCase(), coin.market_cap ?? 0);
    }
    return map;
  } catch {
    return new Map();
  }
}

const COIN_LOGOS: Record<string, string> = {
  // locally cached logos
  BTC:     "/logos/BTC.png",
  ETH:     "/logos/ETH.png",
  XRP:     "/logos/XRP.png",
  SOL:     "/logos/SOL.png",
  ADA:     "/logos/ADA.png",
  DOGE:    "/logos/DOGE.png",
  POL:     "/logos/POL.png",
  LINK:    "/logos/LINK.png",
  DOT:     "/logos/DOT.png",
  AVAX:    "/logos/AVAX.png",
  TRX:     "/logos/TRX.png",
  SHIB:    "/logos/SHIB.png",
  LTC:     "/logos/LTC.png",
  BCH:     "/logos/BCH.png",
  ETC:     "/logos/ETC.png",
  ATOM:    "/logos/ATOM.png",
  UNI:     "/logos/UNI.png",
  APT:     "/logos/APT.png",
  SUI:     "/logos/SUI.jpg",
  ICP:     "/logos/ICP.png",
  FIL:     "/logos/FIL.png",
  NEAR:    "/logos/NEAR.jpg",
  OP:      "/logos/OP.png",
  ARB:     "/logos/ARB.jpg",
  SAND:    "/logos/SAND.jpg",
  MANA:    "/logos/MANA.png",
  AXS:     "/logos/AXS.png",
  XLM:     "/logos/XLM.png",
  HBAR:    "/logos/HBAR.png",
  GRT:     "/logos/GRT.png",
  IMX:     "/logos/IMX.png",
  ALGO:    "/logos/ALGO.png",
  EOS:     "/logos/EOS.png",
  STX:     "/logos/STX.png",
  TON:     "/logos/TON.png",
  PEPE:    "/logos/PEPE.jpg",
  WIF:     "/logos/WIF.jpg",
  SEI:     "/logos/SEI.png",
  AAVE:    "/logos/AAVE.png",
  BLUR:    "/logos/BLUR.png",
  BONK:    "/logos/BONK.jpg",
  JUP:     "/logos/JUP.png",
  ENA:     "/logos/ENA.png",
  PENDLE:  "/logos/PENDLE.png",
  ONDO:    "/logos/ONDO.png",
  TIA:     "/logos/TIA.jpg",
  RENDER:  "/logos/RENDER.png",
  WLD:     "/logos/WLD.jpg",
  CRO:     "/logos/CRO.png",
  NEO:     "/logos/NEO.png",
  FLOW:    "/logos/FLOW.png",
  EGLD:    "/logos/EGLD.png",
  MINA:    "/logos/MINA.png",
  XTZ:     "/logos/XTZ.png",
  THETA:   "/logos/THETA.png",
  COMP:    "/logos/COMP.png",
  ENS:     "/logos/ENS.jpg",
  ZIL:     "/logos/ZIL.png",
  KAVA:    "/logos/KAVA.png",
  CHZ:     "/logos/CHZ.png",
  ZRO:     "/logos/ZRO.jpg",
  IOTA:    "/logos/IOTA.png",
  RAY:     "/logos/RAY.jpg",
  GMT:     "/logos/GMT.png",
  QTUM:    "/logos/QTUM.png",
  ZRX:     "/logos/ZRX.png",
  "1INCH": "/logos/1INCH.png",
  CELO:    "/logos/CELO.jpg",
  ZK:      "/logos/ZK.png",
  ASTR:    "/logos/ASTR.png",
  STG:     "/logos/STG.png",
  API3:    "/logos/API3.jpg",
  AGLD:    "/logos/AGLD.jpg",
  MASK:    "/logos/MASK.jpg",
  MNT:     "/logos/MNT.png",
  BTT:     "/logos/BTT.png",
  ICX:     "/logos/ICX.png",
  STORJ:   "/logos/STORJ.png",
  WAVES:   "/logos/WAVES.png",
  CHR:     "/logos/CHR.png",
  ELF:     "/logos/ELF.png",
  ONT:     "/logos/ONT.png",
  JST:     "/logos/JST.jpg",
  QKC:     "/logos/QKC.png",
  PUNDIX:  "/logos/PUNDIX.jpg",
  LSK:     "/logos/LSK.png",
  GAS:     "/logos/GAS.png",
  ONG:     "/logos/ONG.png",
  CKB:     "/logos/CKB.png",
  AERGO:   "/logos/AERGO.png",
  ORCA:    "/logos/ORCA.png",
  WAXP:    "/logos/WAXP.png",
  AXL:     "/logos/AXL.jpg",
  COW:     "/logos/COW.png",
  STEEM:   "/logos/STEEM.png",
  TRUST:   "/logos/TRUST.png",
  // Upbit CDN에서 로컬로 다운로드한 로고
  JTO:     "/logos/JTO.png",
  VIRTUAL: "/logos/VIRTUAL.png",
  MANTRA:  "/logos/MANTRA.png",
  PENGU:   "/logos/PENGU.png",
  MOVE:    "/logos/MOVE.png",
  BEAM:    "/logos/BEAM.png",
  SONIC:   "/logos/SONIC.png",
  ALT:     "/logos/ALT.png",
  LAYER:   "/logos/LAYER.png",
  BERA:    "/logos/BERA.png",
  PYTH:    "/logos/PYTH.png",
  BLAST:   "/logos/BLAST.png",
  ZETA:    "/logos/ZETA.jpg",
  ARKM:    "/logos/ARKM.png",
  BIGTIME: "/logos/BIGTIME.png",
  MOCA:    "/logos/MOCA.png",
  TAIKO:   "/logos/TAIKO.png",
  ETHFI:   "/logos/ETHFI.png",
  XEC:     "/logos/XEC.png",
  RVN:     "/logos/RVN.png",
  IOST:    "/logos/IOST.png",
  VTHO:    "/logos/VTHO.png",
  HOLO:    "/logos/HOLO.png",
  SUN:     "/logos/SUN.png",
  TFUEL:   "/logos/TFUEL.png",
  RED:     "/logos/RED.png",
  POWR:    "/logos/POWR.png",
  YGG:     "/logos/YGG.png",
  SNT:     "/logos/SNT.png",
  AUDIO:   "/logos/AUDIO.png",
  ARDR:    "/logos/ARDR.png",
  ANIME:   "/logos/ANIME.png",
  AKT:     "/logos/AKT.png",
  CARV:    "/logos/CARV.png",
  VANA:    "/logos/VANA.png",
  MED:     "/logos/MED.png",
  DRIFT:   "/logos/DRIFT.png",
  MLK:     "/logos/MLK.png",
  BORA:    "/logos/BORA.png",
  POLYX:   "/logos/POLYX.png",
  MBL:     "/logos/MBL.png",
  HUNT:    "/logos/HUNT.png",
};

export async function GET(request: Request) {
  try {
    // 업비트 KRW 마켓 동적 조회 (신규 상장 자동 반영)
    const upbitMarketList = await fetchUpbitMarkets().catch(() => []);
    const upbitMarkets = upbitMarketList.map((m) => m.market);

    // 심볼 → 마켓 정보 맵
    const marketInfoMap = new Map(
      upbitMarketList.map((m) => [m.market.replace("KRW-", ""), m])
    );

    // 바이낸스 심볼 목록 (특수 매핑 적용)
    const binanceSymbols = upbitMarketList.map((m) => {
      const symbol = m.market.replace("KRW-", "");
      const binanceSymbol = BINANCE_SYMBOL_MAP[symbol] ?? symbol;
      return `${binanceSymbol}USDT`;
    });

    // Coinbase 페어 목록 (매핑된 것만)
    const coinbasePairs = upbitMarketList
      .filter((m) => COINBASE_PAIR_MAP[m.market.replace("KRW-", "")])
      .map((m) => {
        const symbol = m.market.replace("KRW-", "");
        return { symbol, pair: COINBASE_PAIR_MAP[symbol] };
      });

    const [upbitResult, binanceResult, coinbaseResult, exchangeRate, marketCapMap] = await Promise.all([
      fetchUpbitPrices(upbitMarkets).catch(() => []),
      fetchBinancePrices(binanceSymbols).catch(() => []),
      fetchCoinbasePrices(coinbasePairs).catch(() => []),
      fetchUsdKrwRate(),
      fetchMarketCaps().catch(() => new Map<string, number>()),
    ]);

    const upbitMap = new Map(upbitResult.map((t) => [t.market, t]));
    const binanceMap = new Map(binanceResult.map((t) => [t.symbol, t]));
    const coinbaseMap = new Map(coinbaseResult.map((t) => [t.symbol, t]));

    const coins: CoinPrice[] = upbitMarketList.flatMap((marketInfo) => {
      const symbol = marketInfo.market.replace("KRW-", "");
      const upbit = upbitMap.get(marketInfo.market);
      if (!upbit) return [];

      const binanceSymbol = BINANCE_SYMBOL_MAP[symbol] ?? symbol;
      const binancePair = `${binanceSymbol}USDT`;
      const binance = binanceMap.get(binancePair);
      const coinbase = coinbaseMap.get(symbol);

      const upbitPrice = upbit.trade_price;
      const binancePrice = parseFloat(binance?.lastPrice ?? "0");
      const binancePriceKrw = binancePrice * exchangeRate;
      const coinbasePrice = coinbase?.usdPrice ?? 0;
      const coinbasePriceKrw = coinbasePrice * exchangeRate;

      const rawPremium = (upbitPrice > 0 && binancePriceKrw > 0)
        ? ((upbitPrice - binancePriceKrw) / binancePriceKrw) * 100 : null;
      const rawCoinbasePremium = (upbitPrice > 0 && coinbasePriceKrw > 0)
        ? ((upbitPrice - coinbasePriceKrw) / coinbasePriceKrw) * 100 : null;

      const premium = rawPremium !== null && Math.abs(rawPremium) <= 100 ? rawPremium : null;
      const coinbasePremium = rawCoinbasePremium !== null && Math.abs(rawCoinbasePremium) <= 100 ? rawCoinbasePremium : null;
      const change24h = upbit.signed_change_rate * 100;
      const volume24h = upbit.acc_trade_price_24h;
      const marketCap = marketCapMap.get(symbol) ?? null;
      const info = marketInfoMap.get(symbol);

      return [{
        symbol,
        name: info?.english_name ?? symbol,
        nameKo: info?.korean_name ?? symbol,
        nameZh: info?.english_name ?? symbol, // 중국어명은 업비트 미제공 → 영문으로 fallback
        upbitPrice,
        binancePrice,
        binancePriceKrw,
        coinbasePrice,
        coinbasePriceKrw,
        premium: premium !== null ? parseFloat(premium.toFixed(2)) : null,
        coinbasePremium: coinbasePremium !== null ? parseFloat(coinbasePremium.toFixed(2)) : null,
        change24h: parseFloat(change24h.toFixed(2)),
        volume24h,
        marketCap: marketCap && marketCap > 0 ? marketCap : null,
        logoUrl: COIN_LOGOS[symbol] ?? "",
      }];
    });

    const response: PriceResponse = {
      coins,
      exchangeRate: { usdKrw: exchangeRate, timestamp: Date.now() },
      updatedAt: Date.now(),
    };

    const ALLOWED_ORIGINS = ["https://koreanpremium.io", "https://kimchipremium.com", "http://localhost:3000"];
    const requestOrigin = request.headers.get("origin") ?? "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGINS[0];
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
        "Access-Control-Allow-Origin": allowedOrigin,
        "Vary": "Origin",
      },
    });
  } catch (error) {
    console.error("Price API error:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
