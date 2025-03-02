import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';

export  function updateAccountInfo(){
   
   const address = document.getElementById('address-info');

   if(!address){//Verify account info page
   return;
   }

   const balanceFreeWND = document.getElementById('balance-free-WND-info');
   const balanceResWND = document.getElementById('balance-reserved-WND-info');
   const balanceUCOCO = document.getElementById('balance-UCOCO-info');
   const balanceCOCOUSD = document.getElementById('balance-COCOUSD-info');

   
   address.textContent = account ? account.address : 'Not selected account';
   balanceFreeWND.textContent = account ? `Free: ${balances['WND'].toFixed(4)}` : 'Not available';
   balanceResWND.textContent = account ? `Reserved: ${balances['WNDRes'].toFixed(4)}` : 'Not available';
   balanceUCOCO.textContent = account ? balances['UCOCO'].toFixed(4) : 'Not available';
   balanceCOCOUSD.textContent = account ? balances['COCOUSD'].toFixed(4) : 'Not available';

}