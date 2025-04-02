//Import Express
const express = require('express');

//Import fs
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

//Serve static files from the 'public' folder
app.use(express.static('public'));

//Handling the root route to serve the HTML file from the 'public' folder
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
     

//Transaction history endpoint
app.post('/api/transactionHistory', async (req, res) => {
  const { address, page = 0 } = req.body;

  //Read config.json file
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  const apiKey = config.SUBSCAN_API_KEY;
    if (!apiKey) {
        return res.status(400).json({ error: 'API key not configured. Please set SUBSCAN_API_KEY in the config.json file.' });
    }
    
  
  //Configure request options
  const requestOptions = {
    method: 'POST',
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json"
      },
    body: JSON.stringify({
       address, 
       page, 
       row: 20 
      }),
    redirect: 'follow' 
    };


   try {
    const response = await fetch("https://assethub-westend.api.subscan.io/api/v2/scan/transfers", requestOptions);
    const result = await response.json();
    res.json(result); //Send result JSON to the frontend
  } catch (error) {
    console.error('Error:', error);
    
    const errorResponse = {
      message: error.message || 'Error retrieving transaction history',
      code: error.cause?.code || 'UNKNOWN_ERROR',
    };

    res.status(500).json(errorResponse);
  }
  
});



  async function startServer() {
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer().catch(console.error);