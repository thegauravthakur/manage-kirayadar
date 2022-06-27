import { generateOTP } from '../../controller/otp/generate';

const express = require('express');
const router = express.Router();

router.post('/generate', generateOTP);

export default router;
