import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';

export  function updateAccountInfo(){
   
   const address = document.getElementById('address-info');

   if(!address){//Verify account info page
   return;
   }

   //DOM elements
   const balanceFreeWND = document.getElementById('balance-free-WND-info');
   const balanceResWND = document.getElementById('balance-reserved-WND-info');
   const balanceUCOCO = document.getElementById('balance-UCOCO-info');
   const balanceCOCOUSD = document.getElementById('balance-COCOUSD-info');

   //Display formatted balances
   address.textContent = account ? account.address : 'Not selected account';
   balanceFreeWND.textContent = account ? `Free: ${parseFloat(balances['WND'].toString() / 10 ** 12).toFixed(4)}` : 'Not available';
   balanceResWND.textContent = account ? `Reserved: ${parseFloat(balances['WNDRes'].toString() / 10 ** 12).toFixed(4)}` : 'Not available';
   balanceUCOCO.textContent = account ? parseFloat(balances['UCOCO'].toString() / 10 ** 12).toFixed(4) : 'Not available';
   balanceCOCOUSD.textContent = account ? parseFloat(balances['COCOUSD'].toString() / 10 ** 12).toFixed(4) : 'Not available';

}