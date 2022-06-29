import userRoute from './user.route';
import otpRoute from './otp.route';

const express = require('express');
const router = express.Router();

router.use('/user', userRoute);
router.use('/otp', otpRoute);

export default router;
