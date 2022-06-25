import { createUser } from '../../controller/user/create';
import { loginUser } from '../../controller/user/login';
import { currentUser } from '../../controller/user/current';

const express = require('express');
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.post('/current', currentUser);

export default router;
