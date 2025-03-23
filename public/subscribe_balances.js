const { BN_ZERO } = polkadotUtil;

import { ASSETS_ID } from './constants.js'
import { apiAH, initializeApi } from './init_apis.js';
import { account } from './connect_wallet.js';
import { updateBalanceDisplay } from './update_ui/update_balance_display.js';
import { updateAccountInfo } from './update_ui/update_account_info.js';

export let balances = { 
  WND: BN_ZERO,
  WNDRes: BN_ZERO,
  UCOCO: BN_ZERO,
  COCOUSD: BN_ZERO
};

let unsubWND = null;
let unsubUCOCO = null;
let unsubCOCOUSD = null;

export function subscribeBalanceChanges() {
  return new Promise(async (resolve, reject) => {
    
    try {
      //Verify that the API have been created
      if (!apiAH) {
        await initializeApi();
      }

      //Wait for API to be ready
      await apiAH.isReady;
      console.log('Subscribing to balance changes...');

      unsubWND = await apiAH.query.system.account(account.address, ({ data: balance }) => {
        if (!balances['WND'].eq(balance.free)) {
          balances['WND'] = balance.free;
          updateBalanceDisplay();
          updateAccountInfo();
        }
        if (!balances['WNDRes'].eq(balance.reserved)) {
          balances['WNDRes'] = balance.reserved;
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

        if(unsubWND) unsubWND();
        if(unsubUCOCO) unsubUCOCO();
        if(unsubCOCOUSD) unsubCOCOUSD();

        balances = {
          WND: BN_ZERO,
          WNDRes: BN_ZERO,
          UCOCO: BN_ZERO,
          COCOUSD: BN_ZERO
    };

        console.log('Unsubscribed from balance changes');

       } catch (error) {
        console.error("Error during unsubscribe:", error);
      }
    }