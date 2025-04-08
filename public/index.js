import { initializeApi } from './init_apis.js';
import { connectWallet } from './connect_wallet.js';
import { pageHandlers } from './page_handlers.js';
import { updateAuxConnect } from './update_ui/update_aux_connect.js';
import { initializeConstants } from './constants.js';
import { checkDependencies } from './check_dependencies.js';

  
  //LOAD EXTERNAL HTML TEMPLATE FUNCTION
  async function loadTemplate(pageId) {
   try {
    const response = await fetch(`templates/${pageId}.html`);
    if (!response.ok) throw new Error(`Failed to load ${pageId}.html`);
    return await response.text();
 } catch (error) {
   console.error(error);
   return '';
    }
}


  //UPDATE PAGE FUNCTION
  async function updatePage(pageId) {
  const mainContainer = document.getElementById('main-container');
  const pageContent = await loadTemplate(pageId);
  
  if (!pageContent) {
   console.error(`Error: Could not load content for pageId: ${pageId}`);
   return;
 }
   mainContainer.innerHTML = pageContent;

  //Event listeners for general UI components
  document.querySelectorAll('.aux-connect').forEach(button => {
  button.addEventListener('click', (event) => {
     event.stopPropagation(); // Stop event propagation
     connectWallet();
   });
 });

  //Execute specific initialization for the page
  const handler = pageHandlers[pageId];
  if (handler) {
    handler(); //Call the specific function for this page
  } else {
    console.warn(`No specific handler found for pageId: ${pageId}`);
  }
  
  //Visibility and pointer events based on wallet connection state
  updateAuxConnect();

    }

   
   //MENU SELECTION
   const menuItems = document.querySelectorAll('.menu-item');
   menuItems.forEach(item => {
     item.addEventListener('click', () => {
       menuItems.forEach(i => i.classList.remove('selected'));
       item.classList.add('selected');
       updatePage(item.id);
     });
   });

     
   //Initialize with the first page
   updatePage('single-payment');
     
   //Event listener for button-connect
   document.querySelector('.button-connect').addEventListener('click', connectWallet);

   //Waits for the window to fully load, then initializes constants and the API.
   window.addEventListener('load', async () => {
     try {

       //Check dependencies
       if (!checkDependencies()) {
         throw new Error('Missing external libraries');
       }

       // Initialize constants, and if successful, initialize the API
       const constantsInitialized = initializeConstants();
       if (!constantsInitialized) {
         throw new Error('Failed to initialize constants');
       }
       
       await initializeApi();    
       
     } catch (error) {
       console.error("Error during initialization:", error);
     }
   });