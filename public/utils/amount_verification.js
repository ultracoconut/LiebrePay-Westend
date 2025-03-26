const { BN, BN_ZERO } = polkadotUtil;

import { MIN_BAL_FREE } from '../constants.js';
import { balances } from '../subscribe_balances.js';
import { formatConversionIn } from './format_conversion_input.js';

//Function to Validate Amount
export function validateAmount(amount, currency){

  let amountBn;

  try{
    
    amountBn = formatConversionIn(amount, 12);
    
    // Verify amount is a valid BN and greater than 0
    if (!BN.isBN(amountBn) || amountBn.lte(BN_ZERO)) { 
      return false; 
    } 

  // Validate required balance
  if (balances[currency].lt(amountBn.add(MIN_BAL_FREE[currency]))) {
      return false;
    } 

      return true;

  } catch {
      return false;
  }
}