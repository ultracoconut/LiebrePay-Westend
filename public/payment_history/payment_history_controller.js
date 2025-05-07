import { updateHistory } from './update_history.js';

export async function paymentHistoryController() {  

    //DOM Elements
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageDisplay = document.getElementById('page-display');
    const container = document.getElementById('pagination');

    if(!container) return;

    let currentPage = 0;
    let totalPages = 1;

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
    totalPages = Math.ceil(transferCount / 20);
    updateControls();
    setupButtons();

   } catch (error) {
      console.error('Error in Payment history controller:', error);
      pageDisplay.textContent = 'Failed to load payment history.';
    }

    function setupButtons() {
     
        prevBtn.addEventListener('click', async () => {
          try {

            if (currentPage > 0) {
                currentPage--;
                await updateHistory(currentPage);
                updateControls();
            }

           } catch (error) {
            console.error('Error loading previous page:', error);
             }
         });


        nextBtn.addEventListener('click', async () => {
          try {
            
            if (currentPage < totalPages - 1) {
                currentPage++;
                await updateHistory(currentPage);
                updateControls();
            }
           } catch (error) {
            console.error('Error loading next page:', error);
             }
        });
    }

    function updateControls(state = 'flex') {
        pageDisplay.textContent = `${currentPage + 1} of ${totalPages}`;
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= totalPages - 1;
        container.style.display = state;
 
    }
}