import { createUser } from '../../controller/user/create';
import { loginUser } from '../../controller/user/login';

const express = require('express');
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);

export default router;
