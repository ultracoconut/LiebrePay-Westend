const { BN, BN_ZERO } = polkadotUtil;
        
import { account } from './connect_wallet.js';
import { DEC_PREC } from './constants.js';
import { validateAccount } from './utils/account_verification.js';
import { validateAmount } from './utils/amount_verification.js';
   

//Function to validate both Fields
export function validateFields(){
  
  //Verify is in single payment page  
  const spBeneficiary = document.getElementById('destination-wallet');      
  if (!spBeneficiary) {
    return;
  }
  
  //DOM elements
  const beneficiary = document.getElementById('destination-wallet').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const currency = document.getElementById('currency').value;
  const beneficiaryInput = document.getElementById('destination-wallet');
  const amountInput = document.getElementById('amount');
  let sendButton = document.getElementById('button-single-payment'); 

  //bn amount
  const amountBn = amount && !isNaN(amount) ? new BN(amount).mul(DEC_PREC) : BN_ZERO;

  //Set validation to false at start
  let isValidBeneficiary = false; 
  let isValidAmount = false;

  //Enable inputs at start
  beneficiaryInput.disabled = false;
  amountInput.disabled = false;      

  //Reset styles for both fields
  beneficiaryInput.classList.remove('valid', 'invalid');
  amountInput.classList.remove('valid', 'invalid');

  if (!account) {//If there is not account
    //Disable inputs and send button
    beneficiaryInput.disabled = true;
    amountInput.disabled = true;
    sendButton.disabled = true;

    //Reset input values
    beneficiaryInput.value = '';
    amountInput.value = '';
    return; // Stop further validation
  }

  //Validate beneficiary only if it's not empty
  if (beneficiary) {
    isValidBeneficiary = validateAccount(beneficiary) && beneficiary !== account.address;
     beneficiaryInput.classList.add(isValidBeneficiary ? 'valid' : 'invalid');
 }

  //Validate amount only if it's not empty
  if (amount) {
   isValidAmount = validateAmount(amountBn, currency);
   amountInput.classList.add(isValidAmount ? 'valid' : 'invalid');
 }

  //Enable the send button only if both fields are valid and not empty
  sendButton.disabled = !(isValidBeneficiary && isValidAmount);
}
