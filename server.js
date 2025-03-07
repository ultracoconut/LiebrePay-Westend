//Import Express
const express = require('express');
//Import bodyParser
const bodyParser = require('body-parser');
//Import fs
const fs = require('fs');

const app = express();
const port = 3001;

app.use(bodyParser.json());

//Serve static files from the 'public' folder
app.use(express.static('public'));

//Handling the root route to serve the HTML file from the 'public' folder
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
     


//Transaction history endpoint
app.post('/api/transactionHistory', async (req, res) => {
  const address = req.body.address;
  const page = req.body.page || 0; //Dynamic page with default value 0

  //Read config.json file
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  const apiKey = config.SUBSCAN_API_KEY;
    if (!apiKey) {
        return res.status(400).json({ error: 'API key not configured. Please set SUBSCAN_API_KEY in the config.json file.' });
    }

  const myHeaders = new Headers();
  myHeaders.append("X-API-Key", apiKey); //API Key from config.json
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "address": address,
    "page": page,
    "row": 20,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
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
      code: error.code || 'UNKNOWN_ERROR',
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
