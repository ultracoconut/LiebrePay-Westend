import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js'

//UPDATE BALANCE DISPLAY FUNCTION
export function updateBalanceDisplay() {
    const balanceDisplay = document.getElementById('balance-display');
    
    if(!balanceDisplay){
      return;
    }

    let balance = 0;
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
    balanceDisplay.textContent = account ? `Balance free: ${balance.toFixed(4)} ${currency}` : `Balance free: 0.0000 ${currency}`;
    }

  