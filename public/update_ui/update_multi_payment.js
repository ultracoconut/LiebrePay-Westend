import { account } from '../connect_wallet.js';

export function updateMultiPayment() {
  try {
    //DOM elements
    const selBut = document.getElementById('select-csv-button');

    if (!selBut) {// Verify multi payment page
      return; 
    }

    //Disable the button if no account is connected
    if (!account) {
      selBut.disabled = true;
      selBut.textContent = 'Please connect a Wallet';
      return;
    }

    //Enable the button if account connected
    selBut.disabled = false;
    selBut.textContent = '📤 Upload .csv File';

  } catch (error) {
    console.error('Error updating multi payment ui:', error);
  }
}