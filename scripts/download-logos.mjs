import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/logos");

const COIN_LOGOS = {
  BTC:  "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
  ETH:  "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
  XRP:  "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png",
  SOL:  "https://assets.coingecko.com/coins/images/4128/thumb/solana.png",
  ADA:  "https://assets.coingecko.com/coins/images/975/thumb/cardano.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png",
  POL:  "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png",
  LINK: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png",
  DOT:  "https://assets.coingecko.com/coins/images/12171/thumb/polkadot.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png",
  TRX:  "https://assets.coingecko.com/coins/images/1094/thumb/tron-logo.png",
  SHIB: "https://assets.coingecko.com/coins/images/11939/thumb/shiba.png",
  LTC:  "https://assets.coingecko.com/coins/images/2/thumb/litecoin.png",
  BCH:  "https://assets.coingecko.com/coins/images/780/thumb/bitcoin-cash-circle.png",
  ETC:  "https://assets.coingecko.com/coins/images/453/thumb/ethereum-classic-logo.png",
  ATOM: "https://assets.coingecko.com/coins/images/1481/thumb/cosmos_hub.png",
  UNI:  "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png",
  APT:  "https://assets.coingecko.com/coins/images/26455/thumb/aptos_round.png",
  SUI:  "https://assets.coingecko.com/coins/images/26375/thumb/sui_asset.jpeg",
  ICP:  "https://assets.coingecko.com/coins/images/14495/thumb/Internet_Computer_logo.png",
  FIL:  "https://assets.coingecko.com/coins/images/12817/thumb/filecoin.png",
  NEAR: "https://assets.coingecko.com/coins/images/10365/thumb/near.jpg",
  OP:   "https://assets.coingecko.com/coins/images/25244/thumb/Optimism.png",
  ARB:  "https://assets.coingecko.com/coins/images/16547/thumb/photo_2023-03-29_21.47.00.jpeg",
  SAND: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg",
  MANA: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png",
  AXS:  "https://assets.coingecko.com/coins/images/13029/thumb/axie_infinity_logo.png",
  XLM:  "https://assets.coingecko.com/coins/images/100/thumb/Stellar_symbol_black_RGB.png",
  HBAR: "https://assets.coingecko.com/coins/images/3688/thumb/hbar.png",
  GRT:  "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png",
  IMX:  "https://assets.coingecko.com/coins/images/17233/thumb/immutableX-symbol-BLK-RGB.png",
  ALGO: "https://assets.coingecko.com/coins/images/4380/thumb/download.png",
  EOS:  "https://assets.coingecko.com/coins/images/738/thumb/eos-eos-logo.png",
  STX:  "https://assets.coingecko.com/coins/images/2069/thumb/Stacks_logo_full.png",
  TON:  "https://assets.coingecko.com/coins/images/17980/thumb/ton_symbol.png",
  PEPE: "https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg",
  WIF:  "https://assets.coingecko.com/coins/images/33566/thumb/dogwifhat.jpg",
  SEI:  "https://assets.coingecko.com/coins/images/28205/thumb/Sei_Logo_-_Transparent.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png",
  BLUR: "https://assets.coingecko.com/coins/images/28453/thumb/blur.png",
  BONK:    "https://assets.coingecko.com/coins/images/28600/thumb/bonk.jpg",
  JUP:     "https://assets.coingecko.com/coins/images/34188/thumb/jup.png",
  JTO:     "https://assets.coingecko.com/coins/images/33367/thumb/jto.png",
  ENA:     "https://assets.coingecko.com/coins/images/36530/thumb/ethena.png",
  PENDLE:  "https://assets.coingecko.com/coins/images/15069/thumb/Pendle_Logo_Normal-03.png",
  ONDO:    "https://assets.coingecko.com/coins/images/26580/thumb/ONDO.png",
  TIA:     "https://assets.coingecko.com/coins/images/31967/thumb/tia.jpg",
  RENDER:  "https://assets.coingecko.com/coins/images/11636/thumb/rndr.png",
  VIRTUAL: "https://assets.coingecko.com/coins/images/34057/thumb/VIRTUAL_200x200.png",
  MANTRA:  "https://assets.coingecko.com/coins/images/36478/thumb/mantra_logo.png",
  WLD:     "https://assets.coingecko.com/coins/images/31069/thumb/worldcoin.jpeg",
  PENGU:   "https://assets.coingecko.com/coins/images/35718/thumb/pengu.png",
  MOVE:    "https://assets.coingecko.com/coins/images/39488/thumb/move.png",
  BEAM:    "https://assets.coingecko.com/coins/images/32417/thumb/beam-token-logo.png",
  SONIC:   "https://assets.coingecko.com/coins/images/38108/thumb/200x200.png",
  ALT:     "https://assets.coingecko.com/coins/images/34688/thumb/altlayer.png",
  LAYER:   "https://assets.coingecko.com/coins/images/39010/thumb/solayer.png",
  BERA:    "https://assets.coingecko.com/coins/images/36417/thumb/bera.png",
  CRO:     "https://assets.coingecko.com/coins/images/7310/thumb/cro_token_logo.png",
  NEO:     "https://assets.coingecko.com/coins/images/480/thumb/NEO_512_512.png",
  FLOW:    "https://assets.coingecko.com/coins/images/13446/thumb/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png",
  EGLD:    "https://assets.coingecko.com/coins/images/12335/thumb/egld-token-logo.png",
  MINA:    "https://assets.coingecko.com/coins/images/15628/thumb/JM4_vQ34_400x400.png",
  XTZ:     "https://assets.coingecko.com/coins/images/976/thumb/Tezos-logo.png",
  THETA:   "https://assets.coingecko.com/coins/images/2538/thumb/theta-token-logo.png",
  COMP:    "https://assets.coingecko.com/coins/images/10775/thumb/COMP.png",
  ENS:     "https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg",
  ZIL:     "https://assets.coingecko.com/coins/images/2687/thumb/Zilliqa-logo.png",
  KAVA:    "https://assets.coingecko.com/coins/images/9761/thumb/kava.png",
  CHZ:     "https://assets.coingecko.com/coins/images/8834/thumb/Chiliz.png",
  ZRO:     "https://assets.coingecko.com/coins/images/28206/thumb/ftxG9_TJ_400x400.jpeg",
  PYTH:    "https://assets.coingecko.com/coins/images/31950/thumb/pyth.png",
  IOTA:    "https://assets.coingecko.com/coins/images/692/thumb/IOTA_Swirl.png",
  RAY:     "https://assets.coingecko.com/coins/images/13928/thumb/PSigc4ie_400x400.jpg",
  GMT:     "https://assets.coingecko.com/coins/images/23597/thumb/gmt.png",
  QTUM:    "https://assets.coingecko.com/coins/images/684/thumb/Qtum_Logo_blue_CG.png",
  ZRX:     "https://assets.coingecko.com/coins/images/863/thumb/0x.png",
  "1INCH": "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png",
  CELO:    "https://assets.coingecko.com/coins/images/11090/thumb/InjXBNx9_400x400.jpg",
  ZK:      "https://assets.coingecko.com/coins/images/38043/thumb/ZKTokenBlack.png",
  ASTR:    "https://assets.coingecko.com/coins/images/22617/thumb/astr.png",
  BLAST:   "https://assets.coingecko.com/coins/images/35494/thumb/blast.png",
  ZETA:    "https://assets.coingecko.com/coins/images/26718/thumb/zetachain.jpg",
  ARKM:    "https://assets.coingecko.com/coins/images/30929/thumb/lukka_5f7e9756-9ab5-4ad1-a095-c9bc84b37c43_200x200.png",
  STG:     "https://assets.coingecko.com/coins/images/24413/thumb/STG_LOGO.png",
  BIGTIME: "https://assets.coingecko.com/coins/images/32895/thumb/bigtime200x200.png",
  MOCA:    "https://assets.coingecko.com/coins/images/34491/thumb/moca.jpg",
  API3:    "https://assets.coingecko.com/coins/images/13256/thumb/api3.jpg",
  AGLD:    "https://assets.coingecko.com/coins/images/18125/thumb/lpgblc4h_400x400.jpg",
  TAIKO:   "https://assets.coingecko.com/coins/images/35968/thumb/taiko.png",
  ETHFI:   "https://assets.coingecko.com/coins/images/35958/thumb/ethfi.png",
  MASK:    "https://assets.coingecko.com/coins/images/14051/thumb/Mask_Network.jpg",
  MNT:     "https://assets.coingecko.com/coins/images/30980/thumb/token-logo.png",
  XEC:     "https://assets.coingecko.com/coins/images/16646/thumb/Logo_Final_CoinGecko.png",
  RVN:     "https://assets.coingecko.com/coins/images/3412/thumb/ravencoin%402x.png",
  IOST:    "https://assets.coingecko.com/coins/images/2523/thumb/IOST.jpg",
  BTT:     "https://assets.coingecko.com/coins/images/22457/thumb/btt_logo.png",
  VTHO:    "https://assets.coingecko.com/coins/images/1167/thumb/VeThor_Token.png",
  ICX:     "https://assets.coingecko.com/coins/images/1060/thumb/icon-icx-logo.png",
  STORJ:   "https://assets.coingecko.com/coins/images/949/thumb/storj.png",
  WAVES:   "https://assets.coingecko.com/coins/images/425/thumb/waves.png",
  POWR:    "https://assets.coingecko.com/coins/images/1369/thumb/Power_Ledger.png",
  CHR:     "https://assets.coingecko.com/coins/images/5000/thumb/Chromia.png",
  ELF:     "https://assets.coingecko.com/coins/images/1371/thumb/aelf-logo.png",
  HOLO:    "https://assets.coingecko.com/coins/images/3348/thumb/Holo_token.png",
  ONT:     "https://assets.coingecko.com/coins/images/3447/thumb/ONT.png",
  SUN:     "https://assets.coingecko.com/coins/images/13395/thumb/sun.png",
  JST:     "https://assets.coingecko.com/coins/images/11095/thumb/JUST.jpg",
  TFUEL:   "https://assets.coingecko.com/coins/images/8029/thumb/1_0YusgngOrriVg4ZYx4Wm5Q.png",
  RED:     "https://assets.coingecko.com/coins/images/35069/thumb/red.png",
  YGG:     "https://assets.coingecko.com/coins/images/18367/thumb/ygg_logo.png",
  SNT:     "https://assets.coingecko.com/coins/images/779/thumb/status-logo.png",
  AUDIO:   "https://assets.coingecko.com/coins/images/12913/thumb/audius.jpg",
  GAS:     "https://assets.coingecko.com/coins/images/858/thumb/GAS_512_512.png",
  PUNDIX:  "https://assets.coingecko.com/coins/images/14571/thumb/vDyefsXq_400x400.jpg",
  LSK:     "https://assets.coingecko.com/coins/images/385/thumb/Lisk_Symbol_-_Blue.png",
  QKC:     "https://assets.coingecko.com/coins/images/3849/thumb/quarkchain.png",
  ARDR:    "https://assets.coingecko.com/coins/images/557/thumb/ardor-logo.png",
  ONG:     "https://assets.coingecko.com/coins/images/3447/thumb/ONT.png",
  CKB:     "https://assets.coingecko.com/coins/images/9566/thumb/Nervos_White.png",
  AKT:     "https://assets.coingecko.com/coins/images/20585/thumb/akash-logo.png",
  AXL:     "https://assets.coingecko.com/coins/images/27277/thumb/V-65_xQ1_400x400.jpeg",
  COW:     "https://assets.coingecko.com/coins/images/24384/thumb/cow.png",
  ORCA:    "https://assets.coingecko.com/coins/images/17547/thumb/Orca_Logo.png",
  WAXP:    "https://assets.coingecko.com/coins/images/1372/thumb/WAX_Coin_Tickers_P_512px.png",
  CARV:    "https://assets.coingecko.com/coins/images/37659/thumb/carv.png",
  STEEM:   "https://assets.coingecko.com/coins/images/398/thumb/steem.png",
  VANA:    "https://assets.coingecko.com/coins/images/35374/thumb/vana.png",
  AERGO:   "https://assets.coingecko.com/coins/images/4490/thumb/aergo.png",
  ANIME:   "https://assets.coingecko.com/coins/images/37049/thumb/anime.png",
  TRUST:   "https://assets.coingecko.com/coins/images/25244/thumb/Optimism.png",
  POLYX:   "https://assets.coingecko.com/coins/images/23496/thumb/polymesh.png",
  BORA:    "https://assets.coingecko.com/coins/images/7346/thumb/bora.png",
  MBL:     "https://assets.coingecko.com/coins/images/9752/thumb/MBL_Logo_100x100.png",
  MLK:     "https://assets.coingecko.com/coins/images/11793/thumb/MiL.k_Logo.png",
  HUNT:    "https://assets.coingecko.com/coins/images/7809/thumb/HUNT.png",
  MED:     "https://assets.coingecko.com/coins/images/5725/thumb/Medibloc.png",
  DRIFT:   "https://assets.coingecko.com/coins/images/34688/thumb/drift.png",
};

async function downloadLogo(symbol, url) {
  // Determine extension from URL
  const ext = url.endsWith(".jpg") || url.endsWith(".jpeg") ? "jpg" : "png";
  const filename = `${symbol}.${ext}`;
  const filepath = path.join(OUTPUT_DIR, filename);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 KimchiPremium/1.0" },
    });
    if (!res.ok) {
      console.error(`  ✗ ${symbol}: HTTP ${res.status}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(filepath, buf);
    console.log(`  ✓ ${symbol} → ${filename}`);
    return filename;
  } catch (e) {
    console.error(`  ✗ ${symbol}: ${e.message}`);
    return null;
  }
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Downloading ${Object.keys(COIN_LOGOS).length} logos to public/logos/...\n`);

  // Download in batches of 10 to avoid rate limiting
  const entries = Object.entries(COIN_LOGOS);
  const BATCH = 10;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    await Promise.all(batch.map(([symbol, url]) => downloadLogo(symbol, url)));
    if (i + BATCH < entries.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log("\nDone!");
}

main();
