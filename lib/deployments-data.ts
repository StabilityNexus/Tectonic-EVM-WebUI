/* ─────────────────────────────────────────────────────────────────────────────
   Pure data — no "use client", safe to import from both server and client code
───────────────────────────────────────────────────────────────────────────── */

export type RatioStatus = "healthy" | "warning" | "danger";

export interface Deployment {
  id: string;
  name: string;
  chain: string;
  chainShort: string;
  chainColor: string;
  stablecoin: string;
  equityCoin: string;
  reserveRatio: number;
  totalReserve: string;
  stableSupply: string;
  equitySupply: string;
  equityLeverage: string;
  equityYield: number;
  tvl: string;
  status: RatioStatus;
  reserveAsset: string;
  pegAsset: string;
}

export const DEPLOYMENTS: Deployment[] = [
  { id:"tusd-eth",    name:"TUSD on Ethereum",              chain:"Ethereum", chainShort:"ETH",  chainColor:"#627eea", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:325, totalReserve:"$14.82M", stableSupply:"1.2M",  equitySupply:"45K", equityLeverage:"3.25×", equityYield:6.2, tvl:"$4.56M",  status:"healthy", reserveAsset:"ETH",  pegAsset:"USD" },
  { id:"tusd-eth-v2", name:"TUSD on Ethereum (WBTC Reserve)", chain:"Ethereum", chainShort:"ETH",  chainColor:"#627eea", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:410, totalReserve:"$13.28M", stableSupply:"850K", equitySupply:"22K", equityLeverage:"4.1×",  equityYield:5.8, tvl:"$3.24M",  status:"healthy", reserveAsset:"WBTC", pegAsset:"USD" },
  { id:"usdp-poly",   name:"USDP on Polygon",               chain:"Polygon",  chainShort:"MATIC",chainColor:"#8247e5", stablecoin:"USDP",  equityCoin:"PEQT",  reserveRatio:155, totalReserve:"$3.19M",  stableSupply:"2.1M",  equitySupply:"18K", equityLeverage:"1.55×", equityYield:4.1, tvl:"$2.06M",  status:"warning", reserveAsset:"MATIC",pegAsset:"USD" },
  { id:"usdb-base",   name:"USDB on Base",                  chain:"Base",     chainShort:"BASE", chainColor:"#0052ff", stablecoin:"USDB",  equityCoin:"BEQT",  reserveRatio:287, totalReserve:"$28.01M", stableSupply:"3.4M",  equitySupply:"31K", equityLeverage:"2.87×", equityYield:7.0, tvl:"$9.76M",  status:"healthy", reserveAsset:"ETH",  pegAsset:"USD" },
  { id:"usdbn-bsc",   name:"USDBN on BSC",                  chain:"BSC",      chainShort:"BNB",  chainColor:"#f0b90b", stablecoin:"USDBN", equityCoin:"BEQT2", reserveRatio:120, totalReserve:"$1.08M",  stableSupply:"900K", equitySupply:"4K",  equityLeverage:"1.2×",  equityYield:0.0, tvl:"$0.56M",  status:"danger",  reserveAsset:"BNB",  pegAsset:"USD" },
];
