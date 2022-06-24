import userRoutes from './user';

const express = require('express');
const router = express.Router();

router.use('/user', userRoutes);

export default router;
