/*This file leverages PapaParse for parsing CSV files containing payment instructions.
   See the full license in the LICENSE file at the root of this project and also at the end of this file.*/

const { decodeAddress, encodeAddress } = polkadotKeyring;
const { hexToU8a, isHex } = polkadotUtil;

import { DEC_PREC, MIN_BAL_FREE, ASSETS_ID, MAX_ROWS } from '../constants.js'
import { balances } from '../subscribe_balances.js';
import { apiAH, initializeApi } from '../init_apis.js';
import { injector } from '../connect_wallet.js';


export async function multiPayment(account, file) {
  return new Promise(async (resolve, reject) => {
    try {
     //Verify that the API have been created
     if (!apiAH) {
       await initializeApi(); //Create API if they haven't been created
       }

     //Wait for API to be ready
     await apiAH.isReady;  
  
   } catch (error) {
     console.error('Error initializing or waiting for API to be ready:', error);
     reject(error);
   }


    //DOM elements
    const overlay = document.getElementById('overlay');
    const statusBox = document.getElementById('transaction-status');
    const statusMessage = document.getElementById('status-message');

    //Variables
    let results = [];
    let group = [];
    let rowCount = 0;
    let beneficiary;
    let amount_csv;
    let currency;
    let tx;
    let totalAmounts = { WND: 0, UCOCO: 0, COCOUSD: 0 };
    let WalletsSet = new Set();
    let abortTriggered = false; //Flag to check if abort() was called

  
    //Read the CSV file from the user's input
    console.log("Reading .csv file...");
    if (file) {
      Papa.parse(file, {
        header: true, //First row as header
        skipEmptyLines: true, 
        delimiter: ';', 
        comments: '#', //Skip lines starting with '#'

step: function (row, parser) { //Process row by row
     
    try{
  
      const data = row.data;

      //Verify missing data in rows
      if (!data.Beneficiary || !data.Amount || !data.Currency) {
         reject(`Row has missing data at row: ${rowCount + 2}`);
         abortTriggered = true; //Active flag
         parser.abort();//Stop parsing
         return;
      }

      //Verify valid beneficiary address
      try {
          encodeAddress(
              isHex(data.Beneficiary)
                  ? hexToU8a(data.Beneficiary)
                  : decodeAddress(data.Beneficiary)
          );
      //If no error, valid address
      } catch (error) {
        reject(`Invalid beneficiary address: "${data.Beneficiary}" at row ${rowCount + 2}`);
        abortTriggered = true; //Active flag
        parser.abort();
        return;
        }

      //Verify beneficiary address is not the same as sender address
      if(data.Beneficiary === account){
        reject(`Beneficiary address is the same as the sender address: "${data.Beneficiary}" at row ${rowCount + 2}`);
        abortTriggered = true; //Active flag
        parser.abort();
        return;
      }

      //Verify beneficiary address duplicate
      if (WalletsSet.has(data.Beneficiary)) {
        reject(`Duplicate beneficiary address: "${data.Beneficiary}" at row ${rowCount + 2}`);
        abortTriggered = true;
        parser.abort();
        return;
      }

      //Verify correct data in currency
      if (data.Currency !== "WND" && data.Currency !== "UCOCO" && data.Currency !== "COCOUSD") {
          reject(`Unknown currency: "${data.Currency}" at row ${rowCount + 2}`);
          abortTriggered = true; //Active flag
          parser.abort();
          return;
      }

      //Verify amount is a valid number
      if (isNaN(data.Amount) || Number(data.Amount) <= 0) {
          reject(`Invalid amount data: "${data.Amount}" at row ${rowCount + 2}`);
          abortTriggered = true; //Active flag
          parser.abort();
          return;
      }

      //Verify max rows & push row in array results
      if (rowCount < MAX_ROWS) {
          results.push(data);
          rowCount++;
          totalAmounts[data.Currency] += parseFloat(data.Amount); //Add amount to total amounts
          WalletsSet.add(data.Beneficiary); //Add wallet to set
      } else {
          reject(`The .csv file has more than ${MAX_ROWS} payment rows. Please reduce the number of payment rows in your .csv file`);
          abortTriggered = true; //Active flag
          parser.abort();
          return;
      }

    }catch(error){
      reject(error);
    }


  },

complete: async function () {

    try{ 

      if (abortTriggered) {
      //Exit if parsing was aborted
      return;
       }

      console.log(".csv parsing complete");

      if (results.length === 0) {
          reject("The .csv file does not contain any payment row");
          return;
      }
      
      //Verify each asset balance for transaction batch
      for (let curr in totalAmounts) {
          if (totalAmounts[curr] > 0 && balances[curr] < totalAmounts[curr] + MIN_BAL_FREE [curr]) {
              reject(`Insufficient funds for ${curr}`);
              return;
          }
      }

      //Construct batch 
        for (let i = 0; i < results.length; i++) {
         beneficiary = results[i].Beneficiary;
         amount_csv = parseFloat(results[i].Amount);//convert string to number
         currency = results[i].Currency;

         switch (currency) {
          case "WND":
              tx = apiAH.tx.balances.transferKeepAlive(beneficiary, amount_csv * DEC_PREC);
              group.push(tx);
              break;
          case "UCOCO":
              tx = apiAH.tx.assets.transferKeepAlive(ASSETS_ID['UCOCO'], beneficiary, amount_csv * DEC_PREC);
              group.push(tx);
              break;
          case "COCOUSD":
              tx = apiAH.tx.assets.transferKeepAlive(ASSETS_ID['COCOUSD'], beneficiary, amount_csv * DEC_PREC);
              group.push(tx);
              break;
         }
      }        

      //Show batch in console
      console.log(`Transaction batch: ${group}`);

      //Retrieve transaction batch fee info
      let {partialFee:txFee} = await apiAH.tx.utility.batch(group).paymentInfo(account);
      let feeBatch = txFee / DEC_PREC;

      //Verify sufficient WND balance for fees
      if (balances['WND'] < totalAmounts['WND'] + MIN_BAL_FREE['WND'] + feeBatch*2){
        reject("Insufficient WND for fees");
        return;
      }

      //Show summary and confirm option
      let summaryMessage = `Multi Payment Summary:

      - Total number of payments: ${rowCount}
      - Total Multi payment amount: 
        ${totalAmounts['WND']} WND
        ${totalAmounts['UCOCO']} UCOCO 
        ${totalAmounts['COCOUSD']} COCOUSD
      - Estimated Multi Payment fee: ${(feeBatch).toFixed(4)} WND
      
      Do you want to continue?`;
      
      let userConfirmed = confirm(summaryMessage);
      
      if (!userConfirmed) {
          reject("Multi payment cancelled");
          return;
      }

     //Construct extrinsic
     let extrinsic = apiAH.tx.utility.batch(group);

     //Sign & send the extrinsic
     const extrinsicUnsub = await extrinsic.signAndSend(account, { signer: injector.signer }, ({events = [], status, txHash})=>{
      
     //Show the status box and overlay when the transaction starts
     overlay.style.display = 'flex';
     statusBox.style.display = 'flex';

     //Update the status in the status box
     statusMessage.textContent = 'Multi payment in progress, please wait...';
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
          resolve(`Successful Multi payment with hash ${txHash}`);
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
  
  } catch(error){
    reject(error);
  }

 },


error: function (error) {
 console.error('Error processing .csv file:', error);
 reject(error);
          }
       });
    }


 });
}



/*****************************************PapaParse License*****************************************************

The MIT License (MIT)

Copyright (c) 2015 Matthew Holt

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS 
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


****************************************************************************************************************/