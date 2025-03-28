const { BN } = polkadotUtil;
 
 //Westend AH provider
 export const URL_PROVIDER = 'wss://westend-asset-hub-rpc.polkadot.io';
 
 //Westend decimal precision bn 10^12
 const DEC_PREC = new BN(10).pow(new BN(12));
 
 //Minimum balance free in LiebrePay bn
 export const MIN_BAL_FREE = { 
    WND: DEC_PREC.div(new BN(10)), // 0.1 * 10^12 = 100000000000
    UCOCO: DEC_PREC.div(new BN(10)),
    COCOUSD: DEC_PREC.div(new BN(10)),
  }; 

//Asset IDS
 export const ASSETS_ID = { 
  UCOCO:333, 
  COCOUSD:400 
};
 
 //Max payment rows in CSV file
 export const MAX_ROWS = 100;
 
 
