# Liebre Pay (Westend) - Docker Setup Instructions

Follow these steps to set up the project with Docker.

## 1. Clone the repository:
```bash
git clone https://github.com/ultracoconut/LiebrePay-Westend
cd LiebrePay-Westend
```
## 2. Configure Subscan key:
To retrieve the payment history, you need to configure a Subscan API key.  

- Go to Subscan API and get a free API key:  
https://pro.subscan.io/pricing  

- Copy the `config.example.json` file in the root of the project and rename it to `config.json`:  
    ```bash
    cp config.example.json config.json
    ```
- Open the config.json file and add your Subscan API key:  
    ```json
    {  

    "SUBSCAN_API_KEY": "your_api_key_here" 

    }  
    ```

## 3.  Install Polkadot.js browser extension:
- Download and install Polkadot.js Wallet:  
 https://polkadot.js.org/extension/

- Open the extension and create a new account. 

## 4. Obtain the native currency of Westend and assets:
- Get some WND (westies) from:  
https://faucet.polkadot.io/westend

- Get some UCOCO (id:333) and COCOUSD (id:400) by swapping on:  
https://app.dotacp.mvpworkshop.co/swap

## 5. Build and run the application with Docker:
Run the following commands **in the root of the project**:
```bash 
docker build -t liebrepay-app .
docker run -p 3000:3000 liebrepay-app
```  
## 6. Access the application:
The application should now be running on [http://localhost:3000](http://localhost:3000).
