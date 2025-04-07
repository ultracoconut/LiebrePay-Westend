export const ASSETS_ID = {
  UCOCO: 333,
  COCOUSD: 400,
};

export const MAX_ROWS = 100;
export const URL_PROVIDER = 'wss://westend-asset-hub-rpc.polkadot.io';
export let MIN_BAL_FREE = null;

//Initializes constants requiring BN from polkadotUtil
export function initializeConstants() {

try{

if (!polkadotUtil?.BN) {
  throw new Error("polkadotUtil or BN is not available");
}

const BN = polkadotUtil.BN;
const DEC_PREC = new BN(10).pow(new BN(12));
MIN_BAL_FREE = { 
  WND: DEC_PREC.div(new BN(10)),
  UCOCO: DEC_PREC.div(new BN(10)),
  COCOUSD: DEC_PREC.div(new BN(10)),
};
return true;

}catch(error){
console.error("Error initializing constants:", error);
return false;
}
}
