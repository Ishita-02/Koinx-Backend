import { updateCryptoData, cryptoPrice, companiesHoldingCrypto } from "../controllers";
import { Router } from "express";

const router = Router();

router.get('/getList', updateCryptoData);
router.get('/getPrice', cryptoPrice);
router.get('/getCompanies', companiesHoldingCrypto);

export default router;