import Crypto from "../models";
import axios from "axios";
import {Type as T} from '@sinclair/typebox'

export async function updateCryptoData(req:any, res: any) {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=false');
      const cryptoList = response.data;
      await Crypto.deleteMany({});
      await Crypto.insertMany(cryptoList);
      console.log('Crypto data updated successfully.');
    } catch (error) {
      console.error('Error updating crypto data:', error);
    }
  };
  
  setInterval(updateCryptoData, 3600000);

export async function cryptoPrice( req: typeof cryptoPriceSchema, res: any){
  try {
    const { fromCurrency, toCurrency, date } = req.body;

    // Format date as required by Coingecko API (DD-MM-YYYY)
    const formattedDate = formatDate(date);

    // Fetch historical price data from Coingecko API
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${formattedDate}`);

    // Extract the price of the "toCurrency" from the response
    const price = response.data.market_data.current_price[toCurrency.toLowerCase()];

    if (!price) {
      return res.status(404).json({ error: 'Currency pair not found' });
    }

    return res.json({ price });
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 

const cryptoPriceSchema = T.Object({
  fromCurrency: T.String(),
  toCurrency: T.String(),
  date: T.String()
});

const formatDate = (date: string) => {
  const [day, month, year] = date.split('-');
  return `${day}-${month}-${year}`;
};

export async function companiesHoldingCrypto(req: typeof companiesSchema, res: any) {
  try {
    // Extract the cryptocurrency parameter from the request query
    const { currency } = req.body;

    // Check if the cryptocurrency parameter is provided
    if (!currency) {
      return res.status(400).json({ error: 'Invalid or missing currency parameter. Possible values are "bitcoin" or "ethereum".' });
    }

    // Make a GET request to Coingecko API to fetch companies holding the cryptocurrency
    const response = await axios.get(`https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`);

    // Extract the list of companies from the response
    const companies = response.data;

    // Return the list of companies in the API response
    return res.json({ companies });
  } catch (error) {
    console.error('Error fetching companies holding cryptocurrency:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const companiesSchema = T.Object({
  currency: T.String()
});


export default { updateCryptoData, cryptoPrice, companiesHoldingCrypto };
