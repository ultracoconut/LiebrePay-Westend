const { BN, BN_ZERO, BN_ONE } = polkadotUtil;
 
 export const URL_PROVIDER = 'wss://westend-asset-hub-rpc.polkadot.io' //Westend AH provider
 export const DEC_PREC = 1e12 //Westend decimal precision 10^12
 export const MIN_BAL_FREE = { WND: 0.1, UCOCO: 0.1, COCOUSD: 0.1 }; //Minimum balance free in LiebrePay
 export const ASSETS_ID = { UCOCO:333, COCOUSD:400 }//Asset IDS
 export const MAX_ROWS = 100 //Max payment rows in CSV file
 
 
