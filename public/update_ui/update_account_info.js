import { balances } from '../subscribe_balances.js';
import { walletState } from '../wallet/wallet_state.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';
import { DECIMAL } from '../constants.js';

export function updateAccountInfo() {
  
  try {
   const address = document.getElementById('address-info');

   //Verify account info page
   if (!address) return;

    //DOM elements
    const name = document.getElementById('name-info');
    const balanceFreeWND = document.getElementById('balance-free-WND-info');
    const balanceResWND = document.getElementById('balance-reserved-WND-info');
    const balanceLockWND = document.getElementById('balance-locked-WND-info');
    const balanceUCOCO = document.getElementById('balance-UCOCO-info');
    const balanceCOCOUSD = document.getElementById('balance-COCOUSD-info');
    
    //Update content
    name.textContent = walletState.account?.meta?.name || 'Not selected account';
    address.textContent = walletState.account?.address || 'Not selected account';
    balanceFreeWND.textContent = walletState.account ? `Free: ${formatConversionOut(balances['WND'], DECIMAL['WND'])}` : 'Not available';
    balanceResWND.textContent = walletState.account ? `Reserved: ${formatConversionOut(balances['WNDRes'], DECIMAL['WND'])}` : 'Not available';
    balanceLockWND.textContent = walletState.account ? `Locked: ${formatConversionOut(balances['WNDLock'], DECIMAL['WND'])}` : 'Not available';
    balanceUCOCO.textContent = walletState.account ? formatConversionOut(balances['UCOCO'], DECIMAL['UCOCO']) : 'Not available';
    balanceCOCOUSD.textContent = walletState.account ? formatConversionOut(balances['COCOUSD'], DECIMAL['COCOUSD']) : 'Not available';

  } catch (error) {
    console.error('Error updating account info:', error);
  }
}