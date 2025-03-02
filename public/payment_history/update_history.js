import { account } from '../connect_wallet.js';
import { fetchTransfers } from './fetch.js';
import { paymentList } from './list.js';

export async function updateHistory(page) {
    const message = document.getElementById('history-message');
    const listContainer = document.getElementById('transferList');
    
    if (!message || !listContainer) return;

    if (!account) {
        message.textContent = 'Connect Wallet to show payment history';
        listContainer.innerHTML = '';
        return;
    }

    try {
        message.textContent = 'Loading...';

        const transfers = await fetchTransfers(account.address, page);
        paymentList(transfers, listContainer, message);
        
    } catch (error) {
        message.textContent = `An error occurred while fetching the payment history: ${error.message}`;
    }
}

