import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';

export function updateAccountInfo() {
  
  try {
   const address = document.getElementById('address-info');

   //Verify account info page
   if (!address) return;

    //DOM elements
    const name = document.getElementById('name-info');
    const balanceFreeWND = document.getElementById('balance-free-WND-info');
    const balanceResWND = document.getElementById('balance-reserved-WND-info');
    const balanceUCOCO = document.getElementById('balance-UCOCO-info');
    const balanceCOCOUSD = document.getElementById('balance-COCOUSD-info');
    const buttonLiquidate = document.getElementById('button-liquidate');
    
    
    //Enable/disable button liquidate
    if(!account){
      buttonLiquidate.disabled = true;
    } else buttonLiquidate.disabled = false;

    
    //Update content
    name.textContent = account?.meta?.name || 'Not selected account';
    address.textContent = account?.address || 'Not selected account';
    balanceFreeWND.textContent = account ? `Free: ${formatConversionOut(balances['WND'], 12)}` : 'Not available';
    balanceResWND.textContent = account ? `Reserved: ${formatConversionOut(balances['WNDRes'], 12)}` : 'Not available';
    balanceUCOCO.textContent = account ? formatConversionOut(balances['UCOCO'], 12) : 'Not available';
    balanceCOCOUSD.textContent = account ? formatConversionOut(balances['COCOUSD'], 12) : 'Not available';

  } catch (error) {
    console.error('Error updating account info:', error);
  }
}