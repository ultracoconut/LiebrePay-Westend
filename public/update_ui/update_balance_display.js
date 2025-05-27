import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';

//UPDATE BALANCE DISPLAY FUNCTION
export function updateBalanceDisplay() {
    const balanceDisplay = document.getElementById('balance-display');
    if (!balanceDisplay) return;

    try {
        if (!account) {
            balanceDisplay.textContent = 'Balance free: Not available';
            return;
        }

        const currency = document.getElementById('currency').value;
        const balance = balances[currency];

        if (balance === null || balance === undefined) {
            balanceDisplay.textContent = 'Balance free: Not available';
            return;
        }

        balanceDisplay.textContent = `Balance free: ${formatConversionOut(balance, 12)} ${currency}`;
        
    } catch (error) {
        console.error("Error updating balance display:", error);
        balanceDisplay.textContent = `Balance free: Error retrieving balance`;
    }
}