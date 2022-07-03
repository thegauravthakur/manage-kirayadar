import { addNewProperty } from '../controller/property/newProperty.controller';
import { getAllProperties } from '../controller/property/getAllProperties.controller';

const express = require('express');
const router = express.Router();

router.post('/add', addNewProperty);
router.get('/get', getAllProperties);

export default router;
