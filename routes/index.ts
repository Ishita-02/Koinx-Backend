import { Router } from "express";
import updateCryptoData from "../controllers";

const router = Router();

router.get('/getList', updateCryptoData);

export default router;