import { updateHistory } from './payment_history/update_history.js';
import { subscribeBalanceChanges, unsubscribeBalanceChanges } from './subscribe_balances.js';
import { validateFields } from './validate_fields.js';
import { updateAuxConnect } from './update_ui/update_aux_connect.js';
import { updateBalanceDisplay } from './update_ui/update_balance_display.js';
import { updateMultiPayment } from './update_ui/update_multi_payment.js';
import { updateAccountInfo } from './update_ui/update_account_info.js';

const { web3Enable, web3Accounts, web3FromAddress } = polkadotExtensionDapp;

export let account = null;
export let injector = null;

let polkadotJsAccounts = [];


//CONNECT WALLET FUNCTION
  export async function connectWallet() {
    
   try {
  
    //There is an account connected
    if(account !== null){//Disconnect the walllet
        
      //Unsubscribe Balance changes 
      unsubscribeBalanceChanges();

      account = null;
      injector = null;
      console.log('Wallet disconnected');

      //Update UI
      document.getElementById('button-connect').textContent = 'Connect Wallet';
      updateAuxConnect();
      updateBalanceDisplay();
      updateHistory(0);
      updateAccountInfo();
      updateMultiPayment();
      validateFields();//Disable inputs single payment

      return;
      }

      //There is no account connected
      console.log('Connecting wallet...');

      //Call for extensions 
      const extensions = await web3Enable('Liebre Pay');
      if (extensions.length === 0) {
        console.log('No extension installed, or the authorization was not accepted');
        alert('No extension installed, or the authorization was not accepted');
        return;
      }

      //Verify Polkadotjs extension is installed 
      const hasPolkadotJs = extensions.some(ext => ext.name === 'polkadot-js');
      if(!hasPolkadotJs){
       console.log('polkadot.js extension is not installed, or the authorization was not accepted');
       alert('polkadot.js extension is not installed, or the authorization was not accepted.');
      return;
     }

      //Call for accounts
      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        console.log('No accounts available');
        alert('No accounts available')
        return;
      }

      //Filter Polkadotjs accounts
      polkadotJsAccounts = accounts.filter(acc => acc.meta.source === 'polkadot-js');

      displayAccountList(polkadotJsAccounts);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`An error occurred while connecting the wallet: ${error.message || error}`);
      }

  }
    
    
  //DISPLAY ACCOUNT LIST FUNCTION
    function displayAccountList(filteredAccounts) {

    try {  
      const accountList = document.getElementById('account-list');
      
      //Clear existing content
      accountList.innerHTML = '';
      
      //Create the <li> elements dynamically
      filteredAccounts.forEach((acc, index) => {
      const li = document.createElement('li');
      li.textContent = `${acc.meta.name} (${acc.address})`;

      //Add dynamic click event
      li.addEventListener('click', () => selectAccount(index));

      //Add the <li> to the list
      accountList.appendChild(li);
    });

    //Show the list and the overlay
    accountList.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
      
    } catch (error) {
      console.error('Error displaying account list:', error);
      alert(`An error occurred while displaying the account list: ${error.message || error}`);
    }
  }

     
    //SELECT ACCOUNT FUNCTION
    async function selectAccount(index) {

    try {
      account = polkadotJsAccounts[index];
      injector = await web3FromAddress(account.address);
      console.log('Account Connected');
      console.log(`Got injector for account ${account.address}`);
      
      //Button-connect account info
      let connect = document.getElementById('button-connect');
      connect.textContent = `${account.meta.name} (${account.address.substr(0, 6)}...${account.address.substr(-6)})`;
      connect.appendChild(document.createElement('br'));
      connect.appendChild(document.createTextNode('Click to Disconnect'));
      
      //Hide account list
      document.getElementById('account-list').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
     
      //Subscribe balance changes
      await subscribeBalanceChanges();
      
      //Update UI
      updateAuxConnect();
      updateHistory(0);
      validateFields();
      updateMultiPayment();

    } catch (error) {
      console.error('Error selecting account:', error);
      alert(`An error occurred while selecting the account: ${error.message || error}`);
   }
  }
