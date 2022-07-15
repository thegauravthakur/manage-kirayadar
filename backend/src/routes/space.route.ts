import { addNewSpace } from '../controller/space/addNewSpace';
import { getAllSpaces } from '../controller/space/getAllSpaces';

const express = require('express');
const router = express.Router();

router.post('/add', addNewSpace);
router.post('/get', getAllSpaces);

export default router;
