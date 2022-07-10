import { addNewTenant } from '../controller/tenant/addNewTenant.controller';
import { getAllTenants } from '../controller/tenant/getAllTenants.controller';

const express = require('express');
const router = express.Router();

// todo: add a auth middleware
router.post('/add', addNewTenant);
router.post('/get', getAllTenants);

export default router;
