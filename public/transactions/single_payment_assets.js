const { BN, BN_ZERO, BN_ONE } = polkadotUtil;

import { DEC_PREC, MIN_BAL_FREE, ASSETS_ID } from '../constants.js'
import { balances } from '../subscribe_balances.js';
import { apiAH, initializeApi } from '../init_apis.js';
import { injector } from '../connect_wallet.js';


export async function singlePaymentAssets (currency, account, destination, value) {
    return new Promise(async (resolve, reject) => { 
      try {
       //Verify that the API have been created
       if (!apiAH) {
         await initializeApi(); //Create APIs if they haven't been created
         }
  
       //Wait API to be ready
       await apiAH.isReady;  
    
     } catch (error) {
       console.error('Error initializing or waiting for API to be ready:', error);
       reject(error);
     }
    
     try {

      //DOM elements
      const overlay = document.getElementById('overlay');
      const statusBox = document.getElementById('transaction-status');
      const statusMessage = document.getElementById('status-message');
      
      //Retrieve transaction fee info
      let extrinsic = apiAH.tx.assets.transferKeepAlive(ASSETS_ID[currency], destination, value*DEC_PREC); 
      let {partialFee:txFee} = await extrinsic.paymentInfo(account);
      let transactionFee = txFee/DEC_PREC;
  
      //Confirmation message
      let userConfirmed = confirm(`Please, confirm payment of ${value} ${currency} to beneficiary ${destination}
      Estimated fee: ${transactionFee.toFixed(4)} WND`);
    
      //User cancel transaction
      if (!userConfirmed) {
          reject("Payment cancelled");
          return;
          }
      
      //Verify sufficient WND balance for fees
      if (balances['WND'] < transactionFee*2){
        reject("Insufficient WND for fees");
        return;
      }
      
      //Verify asset balance for transaction
      if (balances[currency] < value + MIN_BAL_FREE[currency]){
        reject("Insufficient balance");
        return;
      }
       
      //Sign & send the extrinsic
      const extrinsicUnsub = await extrinsic.signAndSend(account, { signer: injector.signer }, ({events = [], status, txHash})=>{
  
        //Show the status box and overlay when the transaction starts
        overlay.style.display = 'flex';
        statusBox.style.display = 'flex';
  
         //Update the status in the status box
         statusMessage.textContent = 'Payment in progress, please wait...';
         statusMessage.appendChild(document.createElement('br'));
         statusMessage.appendChild(document.createTextNode(`Current status in blockchain: ${status.type}`));
         console.log(`Transaction current status is ${status.type}`);
    
        if (status.isFinalized){
           //Loop through Vec<EventRecord> to get ExtrinsicSuccess/Failed
           events.forEach(({ event: {method} }) => {
                            
            if (method === 'ExtrinsicSuccess') {
              
            //Delay the closing of the status box
            setTimeout(() => {
              overlay.style.display = 'none';
              statusBox.style.display = 'none';
              resolve(`Successful payment with hash ${txHash}`);
              return;  
            }, 2000);  
  
            
            } else if (method === 'ExtrinsicFailed') {
  
            //Delay the closing of the status box
            setTimeout(() => {
              overlay.style.display = 'none';
              statusBox.style.display = 'none';
              reject("failed");
              return;  
            }, 2000);  
            }
          });
          extrinsicUnsub();
        }
      });
  
    } catch (error) {
      reject(error);
      }
    });  
   }