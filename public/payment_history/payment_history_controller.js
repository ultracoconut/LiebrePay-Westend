import { updateHistory } from './update_history.js';
import { updateControls } from '../update_ui/update_controls.js';
import { paginationState } from './pagination_state.js';

export async function paymentHistoryController() {  

    //DOM Elements
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageDisplay = document.getElementById('page-display');
    const container = document.getElementById('pagination');

    if(!container) return;

    //Clear pagination state
    paginationState.currentPage = 0;
    paginationState.totalPages = 1;
    
    //Clean page display
    pageDisplay.textContent = '';

    //Disabled pagination buttons
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    
    //Hide container at start
    container.style.display = 'none';

  try {

    //Initial call to fetch transfers and set up pagination
    const transferCount = await updateHistory(0); //Display first page and retrieve transfer count
    if (!transferCount){
     updateControls('none');
     return;
    } 

    paginationState.totalPages = Math.ceil(transferCount / 20);
    updateControls();

   } catch (error) {
      console.error('Error in Payment history controller:', error);
      pageDisplay.textContent = 'Failed to load payment history.';
    }  
    
}