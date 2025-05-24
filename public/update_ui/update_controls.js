import { paginationState } from '../payment_history/pagination_state.js';

export function updateControls() {

    //Dom Elements
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageDisplay = document.getElementById('page-display');
    
    pageDisplay.textContent = `${paginationState.currentPage + 1} of ${paginationState.totalPages}`;
    prevBtn.disabled = paginationState.currentPage === 0;
    nextBtn.disabled = paginationState.currentPage >= paginationState.totalPages - 1;
 
    }