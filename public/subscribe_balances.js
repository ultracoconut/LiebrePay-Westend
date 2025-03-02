
import { ASSETS_ID, DEC_PREC } from './constants.js'
import { apiAH, initializeApi } from './init_apis.js';
import { account } from './connect_wallet.js';
import { updateBalanceDisplay } from './update_ui/update_balance_display.js';
import { updateAccountInfo } from './update_ui/update_account_info.js';

export let balances = { WND: 0, WNDRes:0, UCOCO: 0, COCOUSD: 0 };

let unsubWND = 0;
let unsubWNDRes = 0;
let unsubUCOCO = 0;
let unsubCOCOUSD = 0;

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
        const newBalance = balance.free / DEC_PREC;
        if (balances["WND"] !== newBalance) {
          balances["WND"] = newBalance;
          updateBalanceDisplay();
          updateAccountInfo(); 
        }
      });

      unsubWNDRes = await apiAH.query.system.account(account.address, ({ data: balance }) => {
        const newBalance = balance.reserved / DEC_PREC;
        if (balances["WNDRes"] !== newBalance) {
          balances["WNDRes"] = newBalance;
          updateAccountInfo(); 
        }
      });

      unsubUCOCO = await apiAH.query.assets.account(ASSETS_ID['UCOCO'], account.address, (result) => {
        const newBalance = result.isSome ? result.unwrap().balance / DEC_PREC : 0;
        if (balances["UCOCO"] !== newBalance) {
          balances["UCOCO"] = newBalance;
          updateBalanceDisplay();
          updateAccountInfo(); 
        }
      });

      unsubCOCOUSD = await apiAH.query.assets.account(ASSETS_ID['COCOUSD'], account.address, (result) => {
        const newBalance = result.isSome ? result.unwrap().balance / DEC_PREC : 0;
        if (balances["COCOUSD"] !== newBalance) {
          balances["COCOUSD"] = newBalance;
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
        if(unsubWNDRes) unsubWNDRes();
        if(unsubUCOCO) unsubUCOCO();
        if(unsubCOCOUSD) unsubCOCOUSD();
        balances = { WND: 0, WNDRes:0, UCOCO: 0, COCOUSD: 0 };

        console.log('Unsubscribed from balance changes');

       } catch (error) {
        console.error("Error during unsubscribe:", error);
      }
    }