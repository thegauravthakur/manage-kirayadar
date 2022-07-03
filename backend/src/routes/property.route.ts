import { addNewProperty } from '../controller/property/newProperty.controller';

const express = require('express');
const router = express.Router();

router.post('/add', addNewProperty);

export default router;
