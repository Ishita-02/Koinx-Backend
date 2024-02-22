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

    if (!fromCurrency || !toCurrency || !date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const fromCurrencyPriceResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${date}`);
    const fromCurrencyPrice = fromCurrencyPriceResponse.data.market_data.current_price.usd;

    const toCurrencyPriceResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${toCurrency}/history?date=${date}`);
    const toCurrencyPrice = toCurrencyPriceResponse.data.market_data.current_price.usd;

    const rate = fromCurrencyPrice / toCurrencyPrice;

    return res.json({ rate });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Currency not found on Coingecko' });
    }
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
    const { currency } = req.body;

    if (!currency) {
      return res.status(400).json({ error: 'Invalid or missing currency parameter. Possible values are "bitcoin" or "ethereum".' });
    }

    const response = await axios.get(`https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`);

    const companies = response.data;
    
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
