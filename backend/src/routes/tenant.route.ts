import { addNewTenant } from '../controller/tenant/addNewTenant';
import { getAllTenants } from '../controller/tenant/getAllTenants';
import { updateProfilePhoto } from '../controller/tenant/updateProfilePhoto';
import multer from 'multer';

const upload = multer();
const express = require('express');
const router = express.Router();

// todo: add a auth middleware
router.post('/add', addNewTenant);
router.post('/get', getAllTenants);
router.post('/updateProfile', upload.single('document'), updateProfilePhoto);

export default router;
