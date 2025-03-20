import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';

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
   balanceFreeWND.textContent = account ? `Free: ${formatConversionOut(balances['WND'], 12)}` : 'Not available';
   balanceResWND.textContent = account ? `Reserved: ${formatConversionOut(balances['WNDRes'], 12)}` : 'Not available';
   balanceUCOCO.textContent = account ? formatConversionOut(balances['UCOCO'], 12) : 'Not available';
   balanceCOCOUSD.textContent = account ? formatConversionOut(balances['COCOUSD'], 12) : 'Not available';

}