import { createUser } from '../controller/user/createNewUser';
import { loginUser } from '../controller/user/login.controller';
import { currentUser } from '../controller/user/current.controller';

const express = require('express');
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/current', currentUser);

export default router;
