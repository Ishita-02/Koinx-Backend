import Crypto from "../models";
import axios from "axios";

const updateCryptoData = async () => {
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

  export default updateCryptoData;