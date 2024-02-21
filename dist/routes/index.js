"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/getList', controllers_1.updateCryptoData);
router.get('/getPrice', controllers_1.cryptoPrice);
router.get('/getCompanies', controllers_1.companiesHoldingCrypto);
exports.default = router;
