export const ASSETS_ID = {
    UCOCO: 333,
    COCOUSD: 400,
  };

export const MAX_ROWS = 100;
export const URL_PROVIDER = 'wss://westend-asset-hub-rpc.polkadot.io';
export let MIN_BAL_FREE = null;
export let MIN_PAY_AMOUNT = null;

//Initializes constants requiring BN from polkadotUtil
export function initializeConstants() {

 try{
 
 if (!polkadotUtil?.BN) {
    throw new Error("polkadotUtil or BN is not available");
  }
  
  const BN = polkadotUtil.BN;
  
  //Decimal precision (bn)
  const DEC_PREC = new BN(10).pow(new BN(12));
  
  //Minimum free balance required in LiebrePay westend (bn)
  MIN_BAL_FREE = { 
    WND: DEC_PREC.muln(2).divn(10), //0.2
    UCOCO: DEC_PREC.muln(2).divn(10), //0.2
    COCOUSD: DEC_PREC.muln(2).divn(10), //0.2
  };

//Minimum amount to pay in LiebrePay (bn)
 MIN_PAY_AMOUNT = {
    WND: DEC_PREC.divn(10), //0.1
    UCOCO: DEC_PREC.divn(10), //0.1
    COCOUSD: DEC_PREC.divn(10), //0.1
  };

  return true;

  }catch(error){
  console.error("Error initializing constants:", error);
  return false;
  }
}
 