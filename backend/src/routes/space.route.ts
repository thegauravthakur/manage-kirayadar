import { addNewSpace } from '../controller/space/addNewSpace';
import { getAllSpaces } from '../controller/space/getAllSpaces.controller';

const express = require('express');
const router = express.Router();

// todo: add a auth middleware
router.post('/add', addNewSpace);
router.post('/get', getAllSpaces);

export default router;
