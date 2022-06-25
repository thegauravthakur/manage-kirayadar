import userRoutes from './user';
import emailRoutes from './otp';

const express = require('express');
const router = express.Router();

router.use('/user', userRoutes);
router.use('/otp', emailRoutes);

export default router;
