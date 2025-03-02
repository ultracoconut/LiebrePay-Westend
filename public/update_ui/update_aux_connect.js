import { account } from '../connect_wallet.js';

   export function updateAuxConnect(){
    if (account === null) {
      document.querySelectorAll('.aux-connect').forEach(button => {
        button.style.visibility = 'visible';
        button.style.pointerEvents = 'auto';});
  
      document.querySelectorAll('.button-send').forEach(button => {
        button.style.visibility = 'hidden';
        button.style.pointerEvents = 'none';});
    } else {
      document.querySelectorAll('.aux-connect').forEach(button => {
        button.style.visibility = 'hidden';
        button.style.pointerEvents = 'none';});
  
      document.querySelectorAll('.button-send').forEach(button => {
        button.style.visibility = 'visible';
        button.style.pointerEvents = 'auto';});
      }
  } 
  
