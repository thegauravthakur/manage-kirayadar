import { createUser } from '../../controller/user/create';

const express = require('express');
const router = express.Router();

router.post('/create', createUser);

export default router;
