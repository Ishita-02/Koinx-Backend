import Crypto from "../models";
import axios from "axios";
import { parse, isValid } from 'date-fns';
import {Type as T} from '@sinclair/typebox'

export async function updateCryptoData(req:any, res: any) {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=false');
      const cryptoList = response.data;
      await Crypto.deleteMany({});
      await Crypto.insertMany(cryptoList);
      console.log('Crypto data updated successfully.');
      return res.json({ success: true, message: 'Crypto data updated successfully', cryptoList });
    } catch (error: any) {
      console.error('Error updating crypto data:', error);
    }
  };
  
  setInterval(updateCryptoData, 3600000);

export async function cryptoPrice( req: typeof cryptoPriceSchema, res: any){
  try {
    const { fromCurrency, toCurrency, date } = req.query;

    if (!fromCurrency || !toCurrency || !date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedDate) || date.indexOf('-') === -1) {
      return res.status(400).json({ error: 'Please provide the date in dd-mm-yyyy format' });
    }

    const fromCurrencyPriceResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${date}`);
    const fromCurrencyPrice = fromCurrencyPriceResponse.data.market_data.current_price.usd;

    const toCurrencyPriceResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${toCurrency}/history?date=${date}`);
    const toCurrencyPrice = toCurrencyPriceResponse.data.market_data.current_price.usd;

    const rate = fromCurrencyPrice / toCurrencyPrice;

    return res.json({ rate });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Currency not found on Coingecko' });
    }
    console.error('Error fetching crypto price:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 

const cryptoPriceSchema = T.Object({
  querystring: T.Object({
    fromCurrency: T.String(),
    toCurrency: T.String(),
    date: T.Date()
  })
});

export async function companiesHoldingCrypto(req: typeof companiesSchema, res: any) {
  try {
    const { currency } = req.query;

    if (!currency) {
      return res.status(400).json({ error: 'Invalid or missing currency parameter. Possible values are "bitcoin" or "ethereum".' });
    }

    const response = await axios.get(`https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`);

    const companies = response.data;
    
    return res.json({ companies });
  } catch (error: any) {
    console.error('Error fetching companies holding cryptocurrency:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const companiesSchema = T.Object({
  querystring: T.Object({
    currency: T.String()
  })
});


export default { updateCryptoData, cryptoPrice, companiesHoldingCrypto };
