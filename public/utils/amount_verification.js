import { MIN_BAL_FREE } from '../constants.js';
import { balances } from '../subscribe_balances.js';

//Function to Validate Amount
export function validateAmount(amount,currency){

    if (isNaN(amount) || amount <= 0 || balances[currency] < amount + MIN_BAL_FREE[currency]){ 
      return false; 
      } 
      
  return true;
  }
