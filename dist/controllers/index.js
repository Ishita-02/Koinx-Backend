"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companiesHoldingCrypto = exports.cryptoPrice = exports.updateCryptoData = void 0;
const models_1 = __importDefault(require("../models"));
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const typebox_1 = require("@sinclair/typebox");
function updateCryptoData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastEntry = yield models_1.default.findOne().sort({ _id: -1 }).limit(1);
            let startId = '';
            if (lastEntry) {
                startId = lastEntry.id;
            }
            const response = yield axios_1.default.get('https://api.coingecko.com/api/v3/coins/list?include_platform=false');
            const cryptoList = response.data;
            const lastIndex = cryptoList.findIndex((crypto) => crypto.id === startId);
            const newCryptoList = lastIndex === -1 ? cryptoList : cryptoList.slice(lastIndex + 1);
            if (newCryptoList.length === 0) {
                console.log('No new entries to update.');
                return res.json({ success: true, message: 'No new entries to update' });
            }
            yield models_1.default.insertMany(newCryptoList);
            console.log('Crypto data updated successfully.');
            return res.json({ success: true, message: 'Crypto data updated successfully', cryptoList: newCryptoList });
        }
        catch (error) {
            console.error('Error updating crypto data:', error);
        }
    });
}
exports.updateCryptoData = updateCryptoData;
;
setInterval(updateCryptoData, 3600000);
function cryptoPrice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fromCurrency, toCurrency, date } = req.query;
            if (!fromCurrency || !toCurrency || !date) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }
            const parsedDate = (0, date_fns_1.parse)(date, 'dd-MM-yyyy', new Date());
            if (!(0, date_fns_1.isValid)(parsedDate) || date.indexOf('-') === -1) {
                return res.status(400).json({ error: 'Please provide the date in dd-mm-yyyy format' });
            }
            const fromCurrencyPriceResponse = yield axios_1.default.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${date}`);
            const fromCurrencyPrice = fromCurrencyPriceResponse.data.market_data.current_price.usd;
            const toCurrencyPriceResponse = yield axios_1.default.get(`https://api.coingecko.com/api/v3/coins/${toCurrency}/history?date=${date}`);
            const toCurrencyPrice = toCurrencyPriceResponse.data.market_data.current_price.usd;
            const rate = fromCurrencyPrice / toCurrencyPrice;
            return res.json({ rate });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response && error.response.status === 404) {
                return res.status(404).json({ error: 'Currency not found on Coingecko' });
            }
            console.error('Error fetching crypto price:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.cryptoPrice = cryptoPrice;
const cryptoPriceSchema = typebox_1.Type.Object({
    querystring: typebox_1.Type.Object({
        fromCurrency: typebox_1.Type.String(),
        toCurrency: typebox_1.Type.String(),
        date: typebox_1.Type.Date()
    })
});
function companiesHoldingCrypto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { currency } = req.query;
            if (!currency) {
                return res.status(400).json({ error: 'Invalid or missing currency parameter. Possible values are "bitcoin" or "ethereum".' });
            }
            const response = yield axios_1.default.get(`https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`);
            const companies = response.data;
            return res.json({ companies });
        }
        catch (error) {
            console.error('Error fetching companies holding cryptocurrency:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.companiesHoldingCrypto = companiesHoldingCrypto;
const companiesSchema = typebox_1.Type.Object({
    querystring: typebox_1.Type.Object({
        currency: typebox_1.Type.String()
    })
});
exports.default = { updateCryptoData, cryptoPrice, companiesHoldingCrypto };
