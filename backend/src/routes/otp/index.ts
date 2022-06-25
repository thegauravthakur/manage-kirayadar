import { sendEmail } from '../../controller/otp/send';

const express = require('express');
const router = express.Router();

router.post('/send', sendEmail);

export default router;
