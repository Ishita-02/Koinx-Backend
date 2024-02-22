# Price Conversion API Documentation

This document provides information about the Price Conversion API endpoints and their usage.

## Technologies Used
- TypeScript
- Express
- Node.js
- MongoDB

## Deployed Link
[https://koinx-backend-ywwr.onrender.com](https://koinx-backend-ywwr.onrender.com)

## Endpoints

### 1. /getList
- **Method:** GET
- **Description:** Retrieves the list of all cryptocurrencies. The list is updated every one hour.
- **Query Parameters:**
  - `page`: Specifies the page number of the results.
- **Sample Request:** [https://koinx-backend-ywwr.onrender.com/getList?page=5](https://koinx-backend-ywwr.onrender.com/getList?page=5)

### 2. /getPrice
- **Method:** GET
- **Description:** Retrieves the price of one cryptocurrency in another on a particular date.
- **Query Parameters:**
  - `fromCurrency`: Coingecko ID of the cryptocurrency from which the price is to be obtained.
  - `toCurrency`: Coingecko ID of the cryptocurrency to which the price is to be converted.
  - `date`: Date for which the price is requested (format: DD-MM-YYYY).
- **Sample Request:** [https://koinx-backend-ywwr.onrender.com/getPrice?fromCurrency=bitcoin&toCurrency=basic-attention-token&date=12-01-2023](https://koinx-backend-ywwr.onrender.com/getPrice?fromCurrency=bitcoin&toCurrency=basic-attention-token&date=12-01-2023)

### 3. /getCompanies
- **Method:** GET
- **Description:** Retrieves the list of companies that hold a particular cryptocurrency.
- **Query Parameters:**
  - `currency`: Name of the cryptocurrency.
- **Sample Request:** [https://koinx-backend-ywwr.onrender.com/getCompanies?currency=bitcoin](https://koinx-backend-ywwr.onrender.com/getCompanies?currency=bitcoin)
