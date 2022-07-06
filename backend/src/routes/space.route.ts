import { addNewSpace } from '../controller/space/newSpace.controller';

const express = require('express');
const router = express.Router();

router.post('/add', addNewSpace);

export default router;
