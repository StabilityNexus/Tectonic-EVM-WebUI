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
  { id:"tusd-local",  name:"TUSD on Local (Anvil)",         chain:"Hardhat",  chainShort:"LOCAL",chainColor:"#f3f3f3", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:325, totalReserve:"$14.82M", stableSupply:"1.2M",  equitySupply:"45K", equityLeverage:"3.25×", equityYield:6.2, tvl:"$4.56M",  status:"healthy", reserveAsset:"ETH",  pegAsset:"USD" },
  { id:"tusd-sepolia",name:"TUSD on Sepolia",               chain:"Sepolia",  chainShort:"SEP",  chainColor:"#cfb53b", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:410, totalReserve:"$13.28M", stableSupply:"850K", equitySupply:"22K", equityLeverage:"4.1×",  equityYield:5.8, tvl:"$3.24M",  status:"healthy", reserveAsset:"ETH", pegAsset:"USD" },
  { id:"usdp-amoy",   name:"USDP on Polygon Amoy",          chain:"Polygon",  chainShort:"AMOY", chainColor:"#8247e5", stablecoin:"USDP",  equityCoin:"PEQT",  reserveRatio:155, totalReserve:"$3.19M",  stableSupply:"2.1M",  equitySupply:"18K", equityLeverage:"1.55×", equityYield:4.1, tvl:"$2.06M",  status:"warning", reserveAsset:"MATIC",pegAsset:"USD" },
  { id:"tusd-classic",name:"TUSD on Ethereum Classic",      chain:"Classic",  chainShort:"ETC",  chainColor:"#34fa99", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:280, totalReserve:"$5.12M",  stableSupply:"600K",  equitySupply:"15K", equityLeverage:"2.8×",  equityYield:7.4, tvl:"$2.15M",  status:"healthy", reserveAsset:"ETC", pegAsset:"USD" },
  { id:"tusd-base",   name:"TUSD on Base",                  chain:"Base",     chainShort:"BASE", chainColor:"#0052ff", stablecoin:"TUSD",  equityCoin:"TEQT",  reserveRatio:315, totalReserve:"$8.45M",  stableSupply:"2.6M",  equitySupply:"85K", equityLeverage:"3.15×", equityYield:5.2, tvl:"$6.21M",  status:"healthy", reserveAsset:"ETH", pegAsset:"USD" },
];
