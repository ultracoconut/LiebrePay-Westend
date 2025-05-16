import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';

//UPDATE BALANCE DISPLAY FUNCTION
export function updateBalanceDisplay() {
    const balanceDisplay = document.getElementById('balance-display');
    
    if(!balanceDisplay){
      return;
    }

    let balance;
    const currency = document.getElementById('currency').value;
  
    switch (currency) {
      case 'WND':
        balance = balances["WND"];
        break;
      case 'UCOCO':
        balance = balances["UCOCO"];
        break;
      case 'COCOUSD':
        balance = balances["COCOUSD"];
        break;
    }
    //Display formatted balances
    balanceDisplay.textContent = account ? `Balance free: ${formatConversionOut(balance, 12) } ${currency}` : `Balance free: Not available`;
    }

  