import { ASSETS_ID } from './constants.js'
import { apiAH, initializeApi } from './init_apis.js';
import { account } from './connect_wallet.js';
import { updateBalanceDisplay } from './update_ui/update_balance_display.js';
import { updateAccountInfo } from './update_ui/update_account_info.js';

export let balances = { 
  WND: null,
  WNDRes: null,
  WNDLock: null,
  UCOCO: null,
  COCOUSD: null
};

let unsubWND = null;
let unsubUCOCO = null;
let unsubCOCOUSD = null;

export function subscribeBalanceChanges() {
  return new Promise(async (resolve, reject) => {
    
    try {
      
      //Verify that the API has been created
      if (!apiAH) {
        await initializeApi();
      }

      //Wait for API to be ready
      await apiAH.isReady;

      console.log('Subscribing to balance changes...');
      const { BN_ZERO } = polkadotUtil;
     
      balances = { 
        WND: BN_ZERO,
        WNDRes: BN_ZERO,
        WNDLock: BN_ZERO,
        UCOCO: BN_ZERO,
        COCOUSD: BN_ZERO
      };

      //WND balance (using derive)
      unsubWND = await apiAH.derive.balances.all(account.address, ( balance ) => { 
        if (!balances['WND'].eq(balance.availableBalance)) {
          balances['WND'] = balance.availableBalance;
          updateBalanceDisplay();
          updateAccountInfo();
        }
        if (!balances['WNDRes'].eq(balance.reservedBalance)) {
          balances['WNDRes'] = balance.reservedBalance;
          updateAccountInfo();
        }
        if (!balances['WNDLock'].eq(balance.lockedBalance)) {
          balances['WNDLock'] = balance.lockedBalance;
          updateAccountInfo();
        }
      });

      unsubUCOCO = await apiAH.query.assets.account(ASSETS_ID['UCOCO'], account.address, (result) => {
        const newBalance = result.isSome ? result.unwrap().balance : BN_ZERO;
        if (!balances['UCOCO'].eq(newBalance)) {
          balances['UCOCO'] = newBalance;
          updateBalanceDisplay();
          updateAccountInfo(); 
        }
      });

      unsubCOCOUSD = await apiAH.query.assets.account(ASSETS_ID['COCOUSD'], account.address, (result) => {
        const newBalance = result.isSome ? result.unwrap().balance : BN_ZERO;
        if (!balances['COCOUSD'].eq(newBalance)) {
          balances['COCOUSD'] = newBalance;
          updateBalanceDisplay();
          updateAccountInfo(); 
        }
      });

      console.log('Subscribed to balance changes');
      resolve();
      
    } catch (error) {
      console.error("Error configuring subscriptions:", error);
      reject(error);
    }
  });
}
  
  
      //UNSUBSCRIBE BALANCE CHANGES FUNCTION
      export function unsubscribeBalanceChanges() {
       try {

        console.log('Unsubscribing from balance changes...');
        const { BN_ZERO } = polkadotUtil;

        if(unsubWND) unsubWND();
        if(unsubUCOCO) unsubUCOCO();
        if(unsubCOCOUSD) unsubCOCOUSD();

        balances = {
          WND: BN_ZERO,
          WNDRes: BN_ZERO,
          WNDLock: BN_ZERO,
          UCOCO: BN_ZERO,
          COCOUSD: BN_ZERO
    };

        console.log('Unsubscribed from balance changes');

       } catch (error) {
        console.error("Error during unsubscribe:", error);
      }
    }