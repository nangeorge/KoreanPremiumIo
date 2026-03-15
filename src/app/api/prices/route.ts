import { NextResponse } from "next/server";
import { fetchUpbitPrices } from "@/lib/api/upbit";
import { fetchBinancePrices } from "@/lib/api/binance";
import { fetchCoinbasePrices } from "@/lib/api/coinbase";
import { fetchUsdKrwRate } from "@/lib/api/exchangeRate";
import { SUPPORTED_COINS } from "@/types";
import type { CoinPrice, PriceResponse } from "@/types";

export const revalidate = 5;

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
  // CoinGecko fallback (403 on download, still works via browser cache)
  JTO:     "https://assets.coingecko.com/coins/images/33367/thumb/jto.png",
  VIRTUAL: "https://assets.coingecko.com/coins/images/34057/thumb/VIRTUAL_200x200.png",
  MANTRA:  "https://assets.coingecko.com/coins/images/36478/thumb/mantra_logo.png",
  PENGU:   "https://assets.coingecko.com/coins/images/35718/thumb/pengu.png",
  MOVE:    "https://assets.coingecko.com/coins/images/39488/thumb/move.png",
  BEAM:    "https://assets.coingecko.com/coins/images/32417/thumb/beam-token-logo.png",
  SONIC:   "https://assets.coingecko.com/coins/images/38108/thumb/200x200.png",
  ALT:     "https://assets.coingecko.com/coins/images/34688/thumb/altlayer.png",
  LAYER:   "https://assets.coingecko.com/coins/images/39010/thumb/solayer.png",
  BERA:    "https://assets.coingecko.com/coins/images/36417/thumb/bera.png",
  PYTH:    "https://assets.coingecko.com/coins/images/31950/thumb/pyth.png",
  BLAST:   "https://assets.coingecko.com/coins/images/35494/thumb/blast.png",
  ZETA:    "https://assets.coingecko.com/coins/images/26718/thumb/zetachain.jpg",
  ARKM:    "https://assets.coingecko.com/coins/images/30929/thumb/lukka_5f7e9756-9ab5-4ad1-a095-c9bc84b37c43_200x200.png",
  BIGTIME: "https://assets.coingecko.com/coins/images/32895/thumb/bigtime200x200.png",
  MOCA:    "https://assets.coingecko.com/coins/images/34491/thumb/moca.jpg",
  TAIKO:   "https://assets.coingecko.com/coins/images/35968/thumb/taiko.png",
  ETHFI:   "https://assets.coingecko.com/coins/images/35958/thumb/ethfi.png",
  XEC:     "https://assets.coingecko.com/coins/images/16646/thumb/Logo_Final_CoinGecko.png",
  RVN:     "https://assets.coingecko.com/coins/images/3412/thumb/ravencoin%402x.png",
  IOST:    "https://assets.coingecko.com/coins/images/2523/thumb/IOST.jpg",
  VTHO:    "https://assets.coingecko.com/coins/images/1167/thumb/VeThor_Token.png",
  HOLO:    "https://assets.coingecko.com/coins/images/3348/thumb/Holo_token.png",
  SUN:     "https://assets.coingecko.com/coins/images/13395/thumb/sun.png",
  TFUEL:   "https://assets.coingecko.com/coins/images/8029/thumb/1_0YusgngOrriVg4ZYx4Wm5Q.png",
  RED:     "https://assets.coingecko.com/coins/images/35069/thumb/red.png",
  POWR:    "https://assets.coingecko.com/coins/images/1369/thumb/Power_Ledger.png",
  YGG:     "https://assets.coingecko.com/coins/images/18367/thumb/ygg_logo.png",
  SNT:     "https://assets.coingecko.com/coins/images/779/thumb/status-logo.png",
  AUDIO:   "https://assets.coingecko.com/coins/images/12913/thumb/audius.jpg",
  ARDR:    "https://assets.coingecko.com/coins/images/557/thumb/ardor-logo.png",
  ANIME:   "https://assets.coingecko.com/coins/images/37049/thumb/anime.png",
  AKT:     "https://assets.coingecko.com/coins/images/20585/thumb/akash-logo.png",
  CARV:    "https://assets.coingecko.com/coins/images/37659/thumb/carv.png",
  VANA:    "https://assets.coingecko.com/coins/images/35374/thumb/vana.png",
  MED:     "https://assets.coingecko.com/coins/images/5725/thumb/Medibloc.png",
  DRIFT:   "https://assets.coingecko.com/coins/images/34688/thumb/drift.png",
  MLK:     "https://assets.coingecko.com/coins/images/11793/thumb/MiL.k_Logo.png",
  BORA:    "https://assets.coingecko.com/coins/images/7346/thumb/bora.png",
  POLYX:   "https://assets.coingecko.com/coins/images/23496/thumb/polymesh.png",
  MBL:     "https://assets.coingecko.com/coins/images/9752/thumb/MBL_Logo_100x100.png",
  HUNT:    "https://assets.coingecko.com/coins/images/7809/thumb/HUNT.png",
};

export async function GET() {
  try {
    const upbitMarkets = SUPPORTED_COINS.map((c) => c.upbitPair).filter(Boolean);
    const binanceSymbols = SUPPORTED_COINS.map((c) => c.binancePair).filter(Boolean);
    const coinbasePairs = SUPPORTED_COINS
      .filter((c) => c.coinbasePair)
      .map((c) => ({ symbol: c.symbol, pair: c.coinbasePair }));

    const [upbitResult, binanceResult, coinbaseResult, exchangeRate] = await Promise.all([
      fetchUpbitPrices(upbitMarkets).catch(() => []),
      fetchBinancePrices(binanceSymbols).catch(() => []),
      fetchCoinbasePrices(coinbasePairs).catch(() => []),
      fetchUsdKrwRate(),
    ]);

    const upbitData = upbitResult;
    const binanceData = binanceResult;
    const coinbaseData = coinbaseResult;

    const upbitMap = new Map(upbitData.map((t) => [t.market, t]));
    const binanceMap = new Map(binanceData.map((t) => [t.symbol, t]));
    const coinbaseMap = new Map(coinbaseData.map((t) => [t.symbol, t]));

    const coins: CoinPrice[] = SUPPORTED_COINS.flatMap((coin) => {
      const upbit = upbitMap.get(coin.upbitPair);

      // 업비트에 데이터 없음 = 상장폐지 또는 API 오류 → 목록에서 제외
      if (!upbit) return [];

      const binance = binanceMap.get(coin.binancePair);
      const coinbase = coinbaseMap.get(coin.symbol);

      const upbitPrice = upbit.trade_price;
      const binancePrice = parseFloat(binance?.lastPrice ?? "0");
      const binancePriceKrw = binancePrice * exchangeRate;
      const coinbasePrice = coinbase?.usdPrice ?? 0;
      const coinbasePriceKrw = coinbasePrice * exchangeRate;

      const premium = (upbitPrice > 0 && binancePriceKrw > 0)
        ? ((upbitPrice - binancePriceKrw) / binancePriceKrw) * 100 : null;
      const coinbasePremium = (upbitPrice > 0 && coinbasePriceKrw > 0)
        ? ((upbitPrice - coinbasePriceKrw) / coinbasePriceKrw) * 100 : null;
      const change24h = upbit.signed_change_rate * 100;
      const volume24h = upbit.acc_trade_price_24h;

      return [{
        symbol: coin.symbol,
        name: coin.name,
        nameKo: coin.nameKo,
        nameZh: coin.nameZh,
        upbitPrice,
        binancePrice,
        binancePriceKrw,
        coinbasePrice,
        coinbasePriceKrw,
        premium: premium !== null ? parseFloat(premium.toFixed(2)) : null,
        coinbasePremium: coinbasePremium !== null ? parseFloat(coinbasePremium.toFixed(2)) : null,
        change24h: parseFloat(change24h.toFixed(2)),
        volume24h,
        logoUrl: COIN_LOGOS[coin.symbol] ?? "",
      }];
    });

    const response: PriceResponse = {
      coins,
      exchangeRate: { usdKrw: exchangeRate, timestamp: Date.now() },
      updatedAt: Date.now(),
    };

    const origin = process.env.NEXT_PUBLIC_BASE_URL || "https://kimchipremium.com";
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
        "Access-Control-Allow-Origin": origin,
        "Vary": "Origin",
      },
    });
  } catch (error) {
    console.error("Price API error:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
