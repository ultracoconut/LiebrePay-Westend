const { BN, BN_ZERO } = polkadotUtil;

import { MIN_BAL_FREE } from '../constants.js';
import { balances } from '../subscribe_balances.js';

//Function to Validate Amount
export function validateAmount(amount, currency){

  // Verify amount is a valid BN and greater than 0
   if (!BN.isBN(amount) || amount.lte(BN_ZERO)) { 
    return false; 
} 

 // Validate required balance
 if (balances[currency].lt(amount.add(MIN_BAL_FREE[currency]))) {
  return false;
} 

  return true;
  }