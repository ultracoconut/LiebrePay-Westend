import { account } from '../connect_wallet.js';

export function updateMultiPayment(){

    //DOM elements
    const selBut = document.getElementById('select-csv-button');
    
    if (!selBut) {
        return; //Verify multi payment page
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

}


