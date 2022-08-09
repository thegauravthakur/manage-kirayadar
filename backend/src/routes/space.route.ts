import { addNewSpace } from '../controller/space/addNewSpace';
import { fetchSpaces } from '../controller/space/fetchSpaces';

const express = require('express');
const router = express.Router();

router.post('/add', addNewSpace);
router.post('/get', fetchSpaces);

export default router;
